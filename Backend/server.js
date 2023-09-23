// Import the Express.js module
const express = require('express');

// Create an instance of an Express application
const app = express();

// Define a route for the root URL ("/")
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Set the port for the server to listen on
const port = process.env.PORT || 3206;

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
