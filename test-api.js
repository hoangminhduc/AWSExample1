// This script can be used to test the API from Node.js
const https = require('https');

// Replace with your actual token after logging in through the web interface
const idToken = 'YOUR_ID_TOKEN_HERE';

// API Gateway endpoint
const apiEndpoint = 'https://uuugs6p1je.execute-api.ca-central-1.amazonaws.com/Prod/hello/';

// Parse the URL
const url = new URL(apiEndpoint);

// Options for the HTTPS request
const options = {
  hostname: url.hostname,
  path: url.pathname,
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + idToken
  }
};

// Make the request
const req = https.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response:');
    try {
      const jsonData = JSON.parse(data);
      console.log(JSON.stringify(jsonData, null, 2));
    } catch (e) {
      console.log(data);
    }
  });
});

req.on('error', (error) => {
  console.error(`Error: ${error.message}`);
});

req.end();
