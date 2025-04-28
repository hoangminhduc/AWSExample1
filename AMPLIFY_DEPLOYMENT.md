# Deploying to AWS Amplify

This guide will walk you through the process of deploying your Cognito Authentication Demo to AWS Amplify.

## Prerequisites

- An AWS account
- A GitHub account
- Your code committed to a GitHub repository

## Step 1: Push Your Code to GitHub

1. Create a new repository on GitHub:
   - Go to [GitHub.com](https://github.com) and sign in
   - Click the "+" icon in the top-right corner and select "New repository"
   - You've already created the repository "AWSExample1"
   - Choose public or private visibility
   - Do not initialize with README, .gitignore, or license
   - Click "Create repository"

2. Push your local repository to GitHub:
   ```bash
   # You've already pushed to your GitHub repository
   # The repository URL is: https://github.com/hoangminhduc/AWSExample1.git
   ```

## Step 2: Deploy to AWS Amplify

1. Sign in to the [AWS Management Console](https://aws.amazon.com/console/)

2. Navigate to the AWS Amplify service:
   - Type "Amplify" in the search bar
   - Select "AWS Amplify" from the results

3. Create a new Amplify app:
   - Click "New app" in the top-right corner
   - Select "Host web app"

4. Connect to your GitHub repository:
   - Choose "GitHub" as your repository provider
   - Click "Continue"
   - Authorize AWS Amplify to access your GitHub account if prompted
   - Select your repository from the list
   - Select the branch you want to deploy (usually "master" or "main")
   - Click "Next"

5. Configure build settings:
   - Amplify should automatically detect your amplify.yml file
   - If not, you can use the default settings for a static site
   - Click "Next"

6. Review and deploy:
   - Review your settings
   - Click "Save and deploy"

7. Wait for deployment:
   - Amplify will build and deploy your application
   - This process typically takes 1-2 minutes

8. Access your deployed app:
   - Once deployment is complete, you'll see a URL like:
     ```
     https://master.uniqueid.amplifyapp.com
     ```
   - Click on this URL to access your deployed application

## Step 3: Update CORS Settings for Your API

After deploying to Amplify, you need to update your API's CORS settings to allow requests from your Amplify domain:

1. Get your Amplify domain:
   - It will be in the format: `https://master.uniqueid.amplifyapp.com`

2. Update the API Gateway CORS settings:
   - Open the `lambda-template.yaml` file
   - Find the CORS configuration section
   - Replace the wildcard `'*'` with your Amplify domain:
     ```yaml
     Cors:
       AllowMethods: "'GET,POST,OPTIONS'"
       AllowHeaders: "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'"
       AllowOrigin: "'https://master.uniqueid.amplifyapp.com'"
     ```

3. Update the Lambda function CORS headers:
   - Open the `hello_world/app.js` file
   - Find the corsHeaders object
   - Replace the wildcard `'*'` with your Amplify domain:
     ```javascript
     const corsHeaders = {
       'Content-Type': 'application/json',
       'Access-Control-Allow-Origin': 'https://master.uniqueid.amplifyapp.com',
       'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
       'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
     };
     ```

4. Redeploy your API:
   ```bash
   sam deploy -t lambda-template.yaml --config-file lambda-samconfig.toml
   ```

## Step 4: Update API Endpoint in Your Frontend

If your API endpoint changes, you'll need to update it in your frontend code:

1. Open the `login.html` file
2. Find the `apiEndpoint` variable
3. Update it with your API Gateway endpoint:
   ```javascript
   const apiEndpoint = 'https://uuugs6p1je.execute-api.ca-central-1.amazonaws.com/Prod/hello/';
   ```

4. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Update API endpoint"
   git push
   ```

5. Amplify will automatically redeploy your application with the updated endpoint

## Troubleshooting

### CORS Issues

If you encounter CORS errors after deployment:

1. Check that you've updated the CORS settings in both:
   - The API Gateway configuration (lambda-template.yaml)
   - The Lambda function (hello_world/app.js)

2. Ensure you're using the exact Amplify domain in your CORS settings:
   - Include the protocol (https://)
   - Include any subdomains (master.)
   - Do not include trailing slashes

3. Redeploy your API after making changes

### Authentication Issues

If you encounter authentication issues:

1. Ensure your Cognito User Pool and Client IDs are correctly set in your frontend code
2. Check that the SRP authentication flow is enabled for your Cognito User Pool Client
3. Verify that your API Gateway is correctly configured to use your Cognito User Pool as an authorizer

## Additional Resources

- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [API Gateway CORS Documentation](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html)
- [Amazon Cognito Documentation](https://docs.aws.amazon.com/cognito/)
