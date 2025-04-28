// Amazon Cognito Authentication Helper

// Initialize the Amazon Cognito credentials provider
function initCognito() {
    AWS.config.region = apiConfig.region;
    
    const poolData = {
        UserPoolId: apiConfig.userPoolId,
        ClientId: apiConfig.clientId
    };
    
    return new AmazonCognitoIdentity.CognitoUserPool(poolData);
}

// Handle login form submission
document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('login-button');
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (!email || !password) {
                showError('Please enter both email and password.');
                return;
            }
            
            login(email, password);
        });
    }
    
    const signupButton = document.getElementById('signup-button');
    if (signupButton) {
        signupButton.addEventListener('click', function() {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (!email || !password || !confirmPassword) {
                showError('Please fill in all fields.');
                return;
            }
            
            if (password !== confirmPassword) {
                showError('Passwords do not match.');
                return;
            }
            
            signup(email, password);
        });
    }
    
    const verifyButton = document.getElementById('verify-button');
    if (verifyButton) {
        verifyButton.addEventListener('click', function() {
            const code = document.getElementById('verification-code').value;
            
            if (!code) {
                showVerificationError('Please enter the verification code.');
                return;
            }
            
            verifyUser(code);
        });
    }
});

// Login function
function login(username, password) {
    const userPool = initCognito();
    
    const authenticationData = {
        Username: username,
        Password: password
    };
    
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    
    const userData = {
        Username: username,
        Pool: userPool
    };
    
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function(result) {
            // Store tokens
            const idToken = result.getIdToken().getJwtToken();
            const accessToken = result.getAccessToken().getJwtToken();
            const refreshToken = result.getRefreshToken().getToken();
            
            localStorage.setItem('id_token', idToken);
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            
            // Redirect to app page
            window.location.href = 'app.html';
        },
        onFailure: function(err) {
            showError(err.message || 'An error occurred during login.');
        }
    });
}

// Signup function
function signup(username, password) {
    const userPool = initCognito();
    
    const attributeList = [
        new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: 'email',
            Value: username
        })
    ];
    
    userPool.signUp(username, password, attributeList, null, function(err, result) {
        if (err) {
            showError(err.message || 'An error occurred during signup.');
            return;
        }
        
        // Store username for verification
        localStorage.setItem('temp_username', username);
        
        // Show verification form
        document.getElementById('signup-form').style.display = 'none';
        document.getElementById('verification-form').style.display = 'block';
    });
}

// Verify user function
function verifyUser(code) {
    const userPool = initCognito();
    const username = localStorage.getItem('temp_username');
    
    if (!username) {
        showVerificationError('User information not found. Please try signing up again.');
        return;
    }
    
    const userData = {
        Username: username,
        Pool: userPool
    };
    
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
    cognitoUser.confirmRegistration(code, true, function(err, result) {
        if (err) {
            showVerificationError(err.message || 'An error occurred during verification.');
            return;
        }
        
        // Clear temporary storage
        localStorage.removeItem('temp_username');
        
        // Redirect to login page
        alert('Verification successful! You can now log in.');
        window.location.href = 'index.html';
    });
}

// Show error message
function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Show verification error message
function showVerificationError(message) {
    const errorElement = document.getElementById('verification-error');
    if (errorElement) {
        errorElement.textContent = message;
    }
}
