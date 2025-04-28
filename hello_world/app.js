/**
 * Lambda function that returns a hello world message
 * This function is protected by Cognito authentication
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

exports.lambdaHandler = async (event, context) => {
    console.log('Event:', JSON.stringify(event, null, 2));

    // Handle OPTIONS request (CORS preflight)
    if (event.httpMethod === 'OPTIONS') {
        console.log('Handling OPTIONS request for CORS preflight');
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': 'https://master.d1mrbp1gvhbsuo.amplifyapp.com',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Max-Age': '86400',
                'Content-Type': 'application/json',
                'Content-Length': '0'
            },
            body: ''
        };
    }

    try {
        // Get the user information from the Cognito authorizer
        const user = event.requestContext.authorizer?.claims;
        const userId = user?.sub || 'unknown';
        const email = user?.email || 'unknown';
        const name = user?.name || 'unknown';

        // Create response with CORS headers
        const response = {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                message: 'Hello from a protected Lambda function!',
                user: {
                    id: userId,
                    email: email,
                    name: name
                },
                requestContext: {
                    path: event.path,
                    method: event.httpMethod,
                    stage: event.requestContext.stage
                },
                timestamp: new Date().toISOString()
            })
        };

        return response;
    } catch (err) {
        console.log('Error:', err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: 'Error processing request',
                error: err.message
            })
        };
    }
};
