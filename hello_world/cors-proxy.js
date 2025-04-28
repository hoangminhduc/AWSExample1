/**
 * CORS Proxy Lambda function
 * This function handles OPTIONS requests and adds CORS headers to all responses
 */

// CORS headers for all responses
const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://master.d1mrbp1gvhbsuo.amplifyapp.com',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400' // 24 hours
};

exports.handler = async (event, context) => {
    console.log('CORS Proxy Event:', JSON.stringify(event, null, 2));

    // Handle OPTIONS request (CORS preflight)
    if (event.httpMethod === 'OPTIONS') {
        console.log('Handling OPTIONS request for CORS preflight');
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'CORS preflight successful' })
        };
    }

    // For all other requests, just add CORS headers
    return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'CORS headers added' })
    };
};
