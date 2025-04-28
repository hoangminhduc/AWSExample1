# Amazon Cognito Authentication Demo

This project demonstrates how to implement user authentication using Amazon Cognito in a web application. It includes a simple frontend for user registration, login, and calling a protected API.

## Features

- User registration with email verification
- User login with secure authentication
- Protected API access using JWT tokens
- CORS-enabled API for cross-origin requests
- Local development server for testing

## Cognito Authentication Resources

The following resources have been deployed:

1. **Cognito User Pool**: `ca-central-1_9qTJICjCa`
2. **Cognito User Pool Client**: `4782dhvc02sostk2p7ag8oj98l`
3. **API Gateway Endpoint**: `https://uuugs6p1je.execute-api.ca-central-1.amazonaws.com/Prod/hello/`

## Project Structure

- `simple-cognito.yaml`: CloudFormation template for Cognito resources
- `lambda-template.yaml`: CloudFormation template for Lambda and API Gateway
- `hello_world/app.js`: Lambda function code
- `login.html`: Frontend for user authentication
- `test-token.js`: Node.js script for testing the API
- `server.js`: Local development server
- `test-instructions.html`: Instructions for testing the API

## Testing the Authentication Flow

### Using the Local Development Server (Recommended)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the local server:
   ```bash
   npm start
   ```

3. Open http://localhost:3000 in your browser
4. Register a new user with your email address
5. Check your email for a verification code
6. Enter the verification code in the "Verify" tab
7. Log in with your email and password
8. Once logged in, click "Call Hello World API" to test the protected API

### Using the Web Interface Directly

1. Open `login.html` in a web browser
2. Register a new user with your email address
3. Check your email for a verification code
4. Enter the verification code in the "Verify" tab
5. Log in with your email and password
6. Once logged in, click "Call Hello World API" to test the protected API
   - Note: You may encounter CORS issues when testing this way

### Using the Node.js Script

1. Complete the web interface authentication flow to get an ID token
2. Copy the ID token from the result area
3. Run the script with your token:
   ```bash
   node test-token.js "YOUR_ID_TOKEN_HERE"
   ```

## Understanding CORS Issues

When testing locally by opening the HTML file directly in your browser, you might encounter CORS (Cross-Origin Resource Sharing) issues. This happens because:

1. The browser enforces the same-origin policy for security
2. When you open a file using the `file://` protocol, it's considered a different origin than the `https://` API endpoint

To avoid CORS issues:

1. Use the local development server (`npm start`)
2. Use the Node.js test script (`test-token.js`)
3. Use a tool like Postman to test the API directly

## Troubleshooting

### "USER_SRP_AUTH is not enabled for the client"

If you encounter this error, make sure the Cognito User Pool Client has the `ALLOW_USER_SRP_AUTH` authentication flow enabled.

### "Failed to fetch" or CORS errors

This is likely due to CORS restrictions. Try:
1. Using the local development server
2. Using the Node.js test script
3. Using Postman for API testing

### Other Common Issues

1. Make sure you've verified your email address after registration
2. Check that you're using the correct ID token format in the Authorization header
3. Ensure the token hasn't expired (tokens typically expire after 1 hour)
4. If you get a 401 Unauthorized error, try logging in again to get a fresh token

The application uses several AWS resources. These resources are defined in the `template.yaml` file in this project. You can update the template to add AWS resources through the same deployment process that updates your application code. This application will deploy a Lambda function, as well as an API Gateway REST API that will be automatically created based on the Lambda function's Event mapping.

If you prefer to use an integrated development environment (IDE) to build and test your application, you can use the AWS Toolkit.
The AWS Toolkit is an open source plug-in for popular IDEs that uses the AWS SAM CLI to build and deploy serverless applications on AWS. The AWS Toolkit also adds a simplified step-through debugging experience for Lambda function code. See the following links to get started.

* [CLion](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [GoLand](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [IntelliJ](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [WebStorm](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [Rider](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [PhpStorm](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [PyCharm](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [RubyMine](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [DataGrip](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [VS Code](https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/welcome.html)
* [Visual Studio](https://docs.aws.amazon.com/toolkit-for-visual-studio/latest/user-guide/welcome.html)

## Deploy the sample application

The AWS Serverless Application Model Command Line Interface (AWS SAM CLI) is a framework for building and testing Lambda applications. It uses Docker to run your functions in an Amazon Linux environment that matches Lambda. It can also emulate your application's build environment and API.

To use the AWS SAM CLI, you need the following tools.

### Requirements

* AWS SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Docker - [Install Docker Desktop](https://hub.docker.com/search/?type=edition&offering=community)

To build and deploy your application for the first time, run the following in your shell:

```bash
cd apigw-rest-api-lambda-node
sam build --use-container
sam deploy --guided
```

The first command will build the source of your application. The second command will package and deploy your application to AWS, with a series of prompts:

* **Stack Name**: The name of the stack to deploy to CloudFormation. This should be unique to your account and region, and a good starting point would be something matching your project name.
* **AWS Region**: The AWS region you want to deploy your app to.
* **Confirm changes before deploy**: If set to yes, any change sets will be shown to you before execution for manual review. If set to no, the AWS SAM CLI will automatically deploy application changes.
* **HelloWorldFunction has no authentication. Is this okay? [y/N]:**: Select `y` for the purposes of this sample application. However, we have already implemented Amazon Cognito authentication for the API Gateway in this project. The API is protected and requires a valid Cognito token to access it. For more information on API Gateway authentication options, see [API Gateway control access](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-to-api.html) and [API Gateway security best practices](https://docs.aws.amazon.com/apigateway/latest/developerguide/security-best-practices.html).
* **Allow AWS SAM CLI IAM role creation**: Many AWS SAM templates, including this example, create AWS IAM roles required for the AWS Lambda function(s) included to access AWS services. By default, these are scoped down to minimum required permissions. To deploy an AWS CloudFormation stack which creates or modifies IAM roles, the `CAPABILITY_IAM` value for `capabilities` must be provided. If permission isn't provided through this prompt, to deploy this example you must explicitly pass `--capabilities CAPABILITY_IAM` to the `sam deploy` command.
* **Save arguments to samconfig.toml**: If set to yes, your choices will be saved to a configuration file inside the project.
*
For future deploys, you can run `sam deploy` without parameters to deploy changes to your application.

You can find your API Gateway endpoint URL in the output values displayed after deployment.

## Use AWS SAM CLI to test locally

The AWS SAM CLI installs dependencies defined in `hello_world/package.json`, creates a deployment package, and saves it in the `.aws-sam/build` folder.

You can test a single function by invoking it directly with a test event. An event is a JSON document that represents the input that the function receives from the event source. Test events are included in the `events` folder in this project.

Run functions locally and invoke them with the `sam local invoke` command.

```bash
sam local invoke HelloWorldFunction --event events/event.json
```

AWS SAM CLI can also emulate your application's API. Use the `sam local start-api` to run the API locally on port 3000.

```bash
sam local start-api
curl http://localhost:3000/
```

AWS SAM CLI reads the application template to determine the API's routes and the functions they invoke. The `Events` property on each function's definition includes the route and method for each path.

```yaml
      Events:
        HelloWorld:
          Type: Api
          Properties:
            Path: /hello
            Method: get
            Auth:
              Authorizer: CognitoAuthorizer
```

## Use AWS SAM CLI to test remotely
After you have deployed your application, you can remotely invoke your Lambda function to test it in the cloud.

Invoke functions remotely with the `sam remote invoke` command.

```bash
sam remote invoke HelloWorldFunction --event-file events/event.json
```

You can also go to the API Gateway endpoint URL that was output after the deployment of your application, but since we've added Cognito authentication, you'll need to include a valid ID token in the Authorization header of your request. Use the login.html page to obtain a token first.

## Fetch, tail, and filter Lambda function logs
To simplify troubleshooting, AWS SAM CLI has a command called `sam logs`. `sam logs` lets you fetch logs generated by your deployed Lambda function from the command line. In addition to printing the logs on the terminal, this command has several nifty features to help you quickly find the bug.

`NOTE`: This command works for all AWS Lambda functions; not just the ones you deploy using AWS SAM.

```bash
sam logs -n HelloWorldFunction --stack-name "YOUR_STACK_NAME_HERE" --tail
```

You can find more information and examples about filtering Lambda function logs in the [AWS SAM CLI Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-logging.html).

## Cleanup

To delete the sample application that you created, use the AWS CLI. You'll need to delete both stacks:

```bash
# Delete the Lambda function stack
sam delete --stack-name HelloWorldLambda

# Delete the Cognito stack
sam delete --stack-name HelloWorldCognitoPool
```

## Resources

See the [AWS SAM developer guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) for an introduction to AWS SAM specification, the AWS SAM CLI, and serverless application concepts.
