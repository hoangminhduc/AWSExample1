# Hello World App with Amazon Cognito Authentication

This project extends the basic Hello World AWS Lambda and API Gateway application by adding user authentication with Amazon Cognito and a simple web interface.

## Features

- User authentication with Amazon Cognito
- Login and signup pages
- Protected API endpoint
- Simple web interface to test the authenticated API

## Architecture

The application uses the following AWS services:

- **AWS Lambda** - Serverless compute for the API backend
- **Amazon API Gateway** - REST API with Cognito authorizer
- **Amazon Cognito** - User authentication and management
- **Amazon S3** - Hosting for the web interface

## Deployment Instructions

### Prerequisites

Before deploying, make sure you have:

1. AWS CLI installed and configured with appropriate credentials
2. AWS SAM CLI installed
3. Node.js installed (for running the configuration script)

### Deployment Steps

1. **Build the application**

   ```bash
   sam build
   ```

2. **Deploy the application**

   ```bash
   sam deploy --guided
   ```

   During the guided deployment, you'll be asked for:
   - Stack name (e.g., "hello-world-cognito")
   - AWS Region
   - Confirmation of changes before deployment
   - Allowing IAM role creation
   - Allowing unauthenticated API access (answer "N" since we're adding authentication)

3. **Update the web application configuration**

   After deployment, run the configuration script to update the web application with the correct values:

   ```bash
   node update-config.js
   ```

4. **Upload the web files to S3**

   Upload the contents of the `public` directory to the S3 bucket created during deployment:

   ```bash
   aws s3 sync public/ s3://YOUR_BUCKET_NAME/
   ```

   Replace `YOUR_BUCKET_NAME` with the actual bucket name from the CloudFormation outputs.

5. **Access the application**

   Open the website URL provided in the CloudFormation outputs (WebsiteURL).

## Testing the Application

1. **Create a user account**
   - Go to the website URL
   - Click "Sign Up" and create an account
   - Verify your email with the code sent to your inbox

2. **Log in**
   - Use your email and password to log in
   - You'll be redirected to the app page

3. **Test the API**
   - On the app page, click the "Test API" button
   - You should see a successful response from the protected API

## Cleanup

To delete all resources created by this application:

```bash
sam delete
```

## Troubleshooting

- **CORS issues**: If you encounter CORS errors, make sure the S3 bucket CORS configuration is correct and the API Gateway has the appropriate CORS headers.
- **Authentication errors**: Check the Cognito User Pool configuration and make sure the client ID and user pool ID are correctly set in the web application.
- **Deployment failures**: Check the CloudFormation events in the AWS Console for detailed error messages.

## Security Considerations

- This example uses a public S3 bucket for simplicity. For production, consider using CloudFront with S3 for better security.
- The API uses '*' for CORS origins. For production, restrict this to specific domains.
- Consider adding MFA to the Cognito User Pool for additional security.
