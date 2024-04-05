const fs = require('fs');
const path = require('path');
const TradingView = require('@mathieuc/tradingview');
const readline = require('readline');

// Path to the credentials file
const credentialsFilePath = path.join(__dirname, 'credentials.txt');

async function readCredentials() {
    if (fs.existsSync(credentialsFilePath)) {
        const content = fs.readFileSync(credentialsFilePath, 'utf8');
        const lines = content.split('\n');
        return {
            email: lines[0] || '',
            password: lines[1] || '',
            session: lines[2] || '',
            signature: lines[3] || ''
        };
    }
    return null;
}


async function promptForCredentials() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('Enter TradingView email: ', (email) => {
            rl.question('Enter TradingView password: ', (password) => {
                rl.close();
                resolve({ email, password });
            });
        });
    });
}
async function saveCredentials(email, password, session, signature) {
    const content = `${email}\n${password}\n${session}\n${signature}`;
    fs.writeFileSync(credentialsFilePath, content, 'utf8');
}

async function getValidCredentials() {
    let credentials = await readCredentials();

    if (!credentials) {
        console.log("Credentials file not found. Please provide credentials.");
        const newCredentials = await promptForCredentials();
        const loginResult = await TradingView.loginUser(newCredentials.email, newCredentials.password, true);
        credentials = {
            email: newCredentials.email,
            password: newCredentials.password,
            session: loginResult.session,
            signature: loginResult.signature
        };
        await saveCredentials(credentials.email, credentials.password, credentials.session, credentials.signature);
    }

    // Test credentials
    const validCredentials = await checkAndRefreshCredentials(
        credentials.email, 
        credentials.password, 
        credentials.session, 
        credentials.signature
    );

    if (!validCredentials.isValid) {
        // Save new credentials if they were refreshed
        await saveCredentials(
            credentials.email, 
            credentials.password, 
            validCredentials.session, 
            validCredentials.signature
        );
    }

    return validCredentials;
}

async function checkAndRefreshCredentials(email, password, session, signature) {
    try {
        // Attempt to use existing session and signature
        const client = new TradingView.Client({ token: session, signature: signature });
        // Check if client is working or any other method to validate the session and signature

        // Assuming there's a method to validate, and it returns 'isValid'
        const isValid = true; // Replace this with actual validation logic

        if (isValid) {
            return { session, signature, isValid };
        }
    } catch (error) {
        console.error('Existing credentials are not valid:', error);
    }

    // Credentials are not valid, log in to get new credentials
    try {
        const user = await TradingView.loginUser(email, password, false);
        return { session: user.session, signature: user.signature, isValid: true };
    } catch (error) {
        console.error('Error obtaining new credentials:', error);
        return { session: null, signature: null, isValid: false };
    }
}


module.exports = {getValidCredentials};