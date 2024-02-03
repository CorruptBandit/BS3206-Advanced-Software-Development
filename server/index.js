const express = require('express')
const MongoDBConnector = require('./mongo')
const { Console } = require('console')

const app = express()

const PORT = 3001
const mongoDB = new MongoDBConnector()
app.use(express.json()); // This line is important to parse JSON bodies

app.get('/api/users', async (req, res) => {
  try {
    const result = await mongoDB.queryCollection('users', {})
    return res.status(200).json(result)
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Add this endpoint to your Express app
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await mongoDB.queryCollection('users', { email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Here you should compare the password with the one in the database.
    // Assuming the password is not encrypted for simplicity. Implement proper encryption in a real scenario.
    if (user[0].password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Authentication successful
    return res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Registration endpoint
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

    // Create a new user (you should hash the password before storing it in a real scenario)
    const newUser = {
      email,
      password, // Remember to hash the password before storing it in production
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


app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
