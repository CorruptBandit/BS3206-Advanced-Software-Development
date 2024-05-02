const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const MongoDBConnector = require('./mongo');
require('dotenv').config();

const app = express();

const PORT = 3001;
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'insecure';
const mongoDB = new MongoDBConnector();
const revokedTokens = new Set(); // Set to store revoked tokens
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

app.get('/api/getUserName', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Check if the token has been revoked
    const { authorization } = req.headers;
    if (authorization) {
      const token = authorization.split(' ')[1];
      if (revokedTokens.has(token)) {
        return res.status(401).json({ error: 'Token has been revoked' });
      }
    }

    const user = await mongoDB.queryCollection('users', { email });

    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userName = user[0].name;

    return res.status(200).json({ userName });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await mongoDB.queryCollection('users', { email });
    if (user.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token with email as payload
    const token = jwt.sign({ email: user[0].email }, SECRET_KEY, { expiresIn: '1h' });

    // Set cookie with HttpOnly
    // Usually you would set 'secure' but we do not have HTTPS
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000 // Cookie expires in 1 hour, same as token
    });

  return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/signout', (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Sign-out successful' });
});

app.post('/api/validateToken', async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Optional: Check if the token has been revoked
    if (revokedTokens.has(token)) {
      return res.status(401).json({ error: 'Token has been revoked' });
    }

    // Retrieve user information based on the decoded token
    const user = await mongoDB.queryCollection('users', { email: decoded.email });
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the valid user's details
    return res.status(200).json({
      message: 'Token is valid',
      email: user[0].email,
      name: user[0].name
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await mongoDB.queryCollection('users', { email });

    if (existingUser.length !== 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash and salt the password before storing it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with the hashed password
    const newUser = {
      name,
      email,
      password: hashedPassword, // Store the hashed password
    };

    // Save the new user to the database
    await mongoDB.insertDocument('users', newUser);

    // Generate JWT token with email as payload
    const user = await mongoDB.queryCollection('users', { email });
    const token = jwt.sign({ email: user[0].email }, SECRET_KEY, { expiresIn: '1h' });

    return res.status(200).json({ message: 'Registration successful', token });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
