/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

// Helper function to extract user information from the JWT token
function extractUserInfo(event) {
  try {
    // API Gateway with Cognito Authorizer adds claims to the request context
    if (event.requestContext && event.requestContext.authorizer && event.requestContext.authorizer.claims) {
      const claims = event.requestContext.authorizer.claims;
      return {
        username: claims['cognito:username'] || claims.sub,
        email: claims.email || 'Not provided',
        isAuthenticated: true
      };
    }

    // If no claims are found, the user is not authenticated
    return {
      isAuthenticated: false
    };
  } catch (error) {
    console.error('Error extracting user info:', error);
    return {
      isAuthenticated: false,
      error: 'Error processing authentication'
    };
  }
}

export const lambdaHandler = async (event, context) => {
  // Extract user information from the request
  const userInfo = extractUserInfo(event);

  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,OPTIONS'
  };

  // Handle OPTIONS requests (for CORS)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Check if the user is authenticated
  if (!userInfo.isAuthenticated) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({
        message: 'Unauthorized. Authentication required.'
      })
    };
  }

  // Process the authenticated request
  const response = {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      message: 'Hello, authenticated user!',
      userInfo: {
        username: userInfo.username,
        email: userInfo.email
      },
      timestamp: new Date().toISOString()
    })
  };

  return response;
};
