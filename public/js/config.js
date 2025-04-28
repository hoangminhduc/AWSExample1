// Configuration for the application
const apiConfig = {
    // These values will be updated during deployment
    userPoolId: 'USER_POOL_ID_PLACEHOLDER',
    clientId: 'CLIENT_ID_PLACEHOLDER',
    region: 'REGION_PLACEHOLDER',
    apiEndpoint: 'API_ENDPOINT_PLACEHOLDER',
    hostedUiUrl: 'HOSTED_UI_URL_PLACEHOLDER'
};

// Update the hosted UI link
document.addEventListener('DOMContentLoaded', function() {
    const hostedUiLink = document.getElementById('hosted-ui-link');
    if (hostedUiLink) {
        hostedUiLink.href = apiConfig.hostedUiUrl;
    }
});
