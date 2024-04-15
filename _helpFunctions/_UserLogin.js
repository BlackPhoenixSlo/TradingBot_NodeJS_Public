const TradingView = require('@mathieuc/tradingview');

/**
 * This example tests the user login function
 */

process.argv[2] = "jakabasej1999@gmail.com" //tradingview username
process.argv[3] = "_replace_" //tradingview password
if (!process.argv[2]) throw Error('Please specify your username/email');
if (!process.argv[3]) throw Error('Please specify your password');

TradingView.loginUser(process.argv[2], process.argv[3], false).then((user) => {
  console.log('User:', user);
  console.log('Sessionid:', user.session);
  console.log('Signature:', user.signature);
}).catch((err) => {
  console.error('Login error:', err.message);
});
