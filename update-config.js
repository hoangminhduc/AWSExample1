/**
 * This script updates the config.js file with the correct values after deployment
 * Run this script after deploying the application with SAM
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get the stack name from samconfig.toml
let stackName = '';
try {
    const samConfig = fs.readFileSync('samconfig.toml', 'utf8');
    const stackNameMatch = samConfig.match(/stack_name\s*=\s*"([^"]+)"/);
    if (stackNameMatch && stackNameMatch[1]) {
        stackName = stackNameMatch[1];
    }
} catch (error) {
    console.error('Error reading samconfig.toml:', error);
    process.exit(1);
}

if (!stackName) {
    console.error('Could not determine stack name from samconfig.toml');
    process.exit(1);
}

console.log(`Using stack name: ${stackName}`);

// Get the CloudFormation outputs
let outputs;
try {
    const outputsJson = execSync(`aws cloudformation describe-stacks --stack-name ${stackName} --query "Stacks[0].Outputs" --output json`);
    outputs = JSON.parse(outputsJson);
} catch (error) {
    console.error('Error getting CloudFormation outputs:', error);
    process.exit(1);
}

// Extract the values we need
const getOutputValue = (key) => {
    const output = outputs.find(o => o.OutputKey === key);
    return output ? output.OutputValue : '';
};

const userPoolId = getOutputValue('UserPoolId');
const clientId = getOutputValue('UserPoolClientId');
const apiEndpoint = getOutputValue('HelloWorldApi');
const hostedUiUrl = getOutputValue('CognitoHostedUI');

// Get the region from AWS config
let region = '';
try {
    region = execSync('aws configure get region').toString().trim();
} catch (error) {
    console.error('Error getting AWS region:', error);
    process.exit(1);
}

if (!userPoolId || !clientId || !apiEndpoint || !region) {
    console.error('Missing required values from CloudFormation outputs');
    console.log('UserPoolId:', userPoolId);
    console.log('ClientId:', clientId);
    console.log('ApiEndpoint:', apiEndpoint);
    console.log('Region:', region);
    process.exit(1);
}

// Update the config.js file
const configPath = path.join('public', 'js', 'config.js');
try {
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    configContent = configContent.replace('USER_POOL_ID_PLACEHOLDER', userPoolId);
    configContent = configContent.replace('CLIENT_ID_PLACEHOLDER', clientId);
    configContent = configContent.replace('REGION_PLACEHOLDER', region);
    configContent = configContent.replace('API_ENDPOINT_PLACEHOLDER', apiEndpoint);
    configContent = configContent.replace('HOSTED_UI_URL_PLACEHOLDER', hostedUiUrl || '');
    
    fs.writeFileSync(configPath, configContent);
    console.log('Updated config.js with deployment values');
} catch (error) {
    console.error('Error updating config.js:', error);
    process.exit(1);
}

console.log('Configuration updated successfully!');
