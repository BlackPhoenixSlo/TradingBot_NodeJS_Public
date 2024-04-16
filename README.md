watch my youtube 

https://www.youtube.com/channel/UCJH8wJ8Ab_O-HTb0wrrtAKQ/

after instaling node js 
https://nodejs.org/en/download

run in terminal
npm install

Insert all of the API keys.

node main-... press tab , to run a bot

You need to get

Trading view coockies. 

const id = "";  // trading view
const certificate = ""; // trading view

Bybiy api keys 

let key = "";
let secret = ""; // bybit

Mongo login uri

const uri = ""; //mongo

Discord webhook uri

let webhookUrl = '';

You need to set and download google cloud json file
test-sheets-407121-

and set path to it in .env

GOOGLE_APPLICATION_CREDENTIALS=./utils/test-sheets-407121-json
#GOOGLE_APPLICATION_CREDENTIALS=./test-sheets-407121-json
GCLOUD_PROJECT=hours-bding

If you are going to use, cryptomarketcap uti, check main-calculatetecorrelation.py in _helpFunctions
const apiKey = '_replace_';

This is all now you set your indicator and timeframes and waighting for them. This are defaults, those I use. 

const indicator_id = "USER;03d7ea932b9044e6aefc5d264f0e214f"

const timeframes = ['4H','12H','1D', '2D', '3D', '4D', '5D', '6D', 'W', '1M'];

 let weights_no_prov = [1.25 ,13.00,	1.25,	2.19,	1.10,	4.06,	1.10,	1.10,	1.00,	1.06];  // Example weights
    let weights_prov =[66.78, 33.75, 39.98, 37.35,0, 46.02,0, 0, 29.86, 20.05]; // Example weights




### Trend following framework to build a bot

This bot allows you to follow trend via TradingView indicators and MArketCap and combine pair signals with Crypto correlation. It saves signals in MondoDb and Google drive for front testing and send signals to Bybit. More exchanges will be added.


## main-backtest-TVtoGsheet.js

This exports indicator signals for a desired day from Trading view to Google sheets.

## main-bot-easyUse3.js

If you don't know how to code use this one, just insert your api keys and run it. Thank me in few months.

## my-main-bot.js

From A-Z bot that I am using right now minus the secret keys.


## _helpFunctions

This folder contains 
[_AllPrivateIndicators](_helpFunctions/_AllPrivateIndicators.js)  GET'S ALL PRIVATE INDICATORS
or you can simply drop https://pine-facade.tradingview.com/pine-facade/list?filter=saved in the browser

[_hsvsha_papet_fronttest](_helpFunctions/_hsvsha_papet_fronttest.js.txt) 
When you are papertesting indicator without trading use this, this is my curent way to backtest hsvza vs vsvzo

[calculatecorrelation](_helpFunctions/_main-calculatecorrelation.js) 
if you are going to use crypto correnaltion between Pairs and Market Cap this is the great way to do it.

[_UserLogin](_helpFunctions/_UserLogin.js)
If you want cookie to your trading view 

## exanplesForGeeks
this folder contains the old versions of the bot I have ben using.

## utils
This folder cointains all of the helper functions the bot need to work. 
You can isted of having this here inport it as a npm package. 

and instead of 

//   const fetchAllMarketCapAndCorrelationData = require('./utils/main-bot--GetMArketCap_Corr');
//   const RetreveTV_Data_MongoDBpush = require('./utils/main-bot--TVretrive'); // Adjust the path as needed
//   const updateGooglesheets = require('./utils/main-bot--GoogleSheets'); // Adjust the path as needed
//   const {getValidCredentials} = require('./utils/main-bot__testcredentials'); // Adjust the path as needed
//   const makeNonprovisionaDailySignal = require('./utils/main-bot--nonProvisional'); // Adjust the path as needed
//   const  {weightedaverage,MultipleWeightedAverage } = require('./utils/main-bot--CalculateWaightedSignals'); // Adjust the path as needed
//   const {alerts, MakeAlerts ,MakeAlertsFast} = require("./utils/main-bot--alerts");
//   const {fetchActiveOrders, DisplayBinanceData} = require("./utils/main-bot--bybit");
//   const { RestClientV5 }= require('bybit-api');
//   const TradingView = require('@mathieuc/tradingview');

you can use 

// const {
//     fetchAllMarketCapAndCorrelationData,
//   RetreveTV_Data_MongoDBpush,
//   updateGooglesheets,
//   getValidCredentials,
//   makeNonprovisionaDailySignal,
//   weightedaverage,
//   MultipleWeightedAverage,
//   alerts,
//   MakeAlerts,
//   MakeAlertsFast,
//   fetchActiveOrders,
//   DisplayBinanceData
//     // import other utilities as needed
//   } = require('@blackphoenixslo/trading-bot-framework');


If you have any questions reach out to me on Telegram @britneyBitch42069 or find me on Discord

https://discord.gg/2wUZkjBP