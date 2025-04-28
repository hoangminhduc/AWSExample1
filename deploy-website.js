/**
 * This script uploads the web files to the S3 bucket
 * Run this script after deploying the application with SAM and updating the config
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

// Get the S3 bucket name from CloudFormation outputs
let bucketName = '';
try {
    const outputsJson = execSync(`aws cloudformation describe-stacks --stack-name ${stackName} --query "Stacks[0].Outputs[?OutputKey=='WebsiteURL'].OutputValue" --output text`);
    const websiteUrl = outputsJson.toString().trim();
    
    // Extract bucket name from the website URL
    // Format: http://bucket-name.s3-website-region.amazonaws.com
    const bucketMatch = websiteUrl.match(/http:\/\/([^.]+)/);
    if (bucketMatch && bucketMatch[1]) {
        bucketName = bucketMatch[1];
    }
} catch (error) {
    console.error('Error getting S3 bucket name:', error);
    process.exit(1);
}

if (!bucketName) {
    console.error('Could not determine S3 bucket name from CloudFormation outputs');
    process.exit(1);
}

console.log(`Using S3 bucket: ${bucketName}`);

// Upload the files to S3
try {
    console.log('Uploading files to S3...');
    execSync(`aws s3 sync public/ s3://${bucketName}/ --acl public-read`);
    console.log('Files uploaded successfully!');
} catch (error) {
    console.error('Error uploading files to S3:', error);
    process.exit(1);
}

// Get the website URL
try {
    const websiteUrl = execSync(`aws cloudformation describe-stacks --stack-name ${stackName} --query "Stacks[0].Outputs[?OutputKey=='WebsiteURL'].OutputValue" --output text`).toString().trim();
    console.log(`\nWebsite URL: ${websiteUrl}`);
    console.log('\nDeployment complete! You can now access your application at the URL above.');
} catch (error) {
    console.error('Error getting website URL:', error);
}
