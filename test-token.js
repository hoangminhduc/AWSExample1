// This script can be used to test the API with a token from the login page
const https = require('https');

// Paste your token from the login page here
const idToken = process.argv[2] || 'YOUR_ID_TOKEN_HERE';

// API Gateway endpoint
const apiEndpoint = 'https://uuugs6p1je.execute-api.ca-central-1.amazonaws.com/Prod/hello/';

// Parse the URL
const url = new URL(apiEndpoint);

console.log(`Testing API: ${apiEndpoint}`);
console.log(`Using token: ${idToken.substring(0, 20)}...`);

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
  console.log(`Status Code: ${res.statusCode} ${res.statusMessage}`);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\nResponse Body:');
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

// Instructions for use:
console.log('\nTo use this script:');
console.log('1. Login using the login.html page');
console.log('2. Copy the token shown in the result area');
console.log('3. Run this script with the token as an argument:');
console.log('   node test-token.js YOUR_TOKEN_HERE');
