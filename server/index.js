const express = require('express');
const bcrypt = require('bcrypt'); // Add bcrypt for hashing on the server
const MongoDBConnector = require('./mongo');

const app = express();

const PORT = 3001;
const mongoDB = new MongoDBConnector();
app.use(express.json());

app.get('/api/users', async (req, res) => {
  try {
    const result = await mongoDB.queryCollection('users', {});
    return res.status(200).json(result);
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
    if (user.length == 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the hashed password with the one in the database using bcrypt.compare
    const isPasswordValid = await bcrypt.compare(password, user[0].password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Authentication successful
    return res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await mongoDB.queryCollection('users', { email });

    if (existingUser.length != 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash and salt the password before storing it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with the hashed password
    const newUser = {
      email,
      password: hashedPassword, // Store the hashed password
    };

    // Save the new user to the database
    await mongoDB.insertDocument('users', newUser);

    // Registration successful
    return res.status(201).json({ message: 'Registration successful', user: newUser });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
