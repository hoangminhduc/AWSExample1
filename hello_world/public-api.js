/**
 * Public API Lambda function
 * This function provides a public endpoint that doesn't require authentication
 */

// CORS headers for all responses
const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://master.d1mrbp1gvhbsuo.amplifyapp.com',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400', // 24 hours
    'Vary': 'Origin'
};

exports.handler = async (event, context) => {
    console.log('Public API Event:', JSON.stringify(event, null, 2));

    // Handle OPTIONS request (CORS preflight)
    if (event.httpMethod === 'OPTIONS') {
        console.log('Handling OPTIONS request for CORS preflight');
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'CORS preflight successful' })
        };
    }

    // For all other requests, return a public response
    return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
            message: 'Hello from a public API endpoint!',
            timestamp: new Date().toISOString(),
            path: event.path,
            method: event.httpMethod
        })
    };
};
