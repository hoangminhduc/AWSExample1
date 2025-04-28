/**
 * Simple Express server to serve the static files locally
 * This helps avoid CORS issues when testing the API
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve the login page at the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
  console.log(`Open http://localhost:${port}/login.html to access the login page`);
  console.log(`Open http://localhost:${port}/test-instructions.html for testing instructions`);
});
