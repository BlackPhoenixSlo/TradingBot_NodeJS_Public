require('punycode/')
const { RestClientV5 }= require('bybit-api');
const TradingView = require('@mathieuc/tradingview');
// const fetchAllMarketCapAndCorrelationData = require('./utils/main-bot--GetMArketCap_Corr');
const { fetchAllMarketCapAndCorrelationData} = require('@blackphoenixslo/trading-bot-framework');


const id = "_replace_";
const certificate = "_replace_";
const uri = "mongodb+srv://_replace_:_replace_@cluster0._replace_.mongodb.net/";

async function correlationNmarkketCap(id,certificate) {
    const dbname="yourDatabaseName"
    const sheetTitle  = "YourSheetTitle";  // gogle sheets  Replace with your sheet title
    const spreadsheetId = "_replace_";
    const apiKey = '_replace_';
    const url_coinbase = 'https://pro-api.coinmarketcap.com/v1/cryptoc_replace_ency/quotes/latest';
    const cryptoSymbols = ['BTC', 'ETH', 'XRP', 'SOL', 'BNB','INJ']; // Ensure this is an array
    const periods = [5,15, 30, 60, 90, 120,200];

    const marketCapAndCorrelationData = await fetchAllMarketCapAndCorrelationData(client, dbname, apiKey, url_coinbase, cryptoSymbols, periods);
         console.log('Market Cap and Correlation Data:', marketCapAndCorrelationData);
    
    console.log("done");
console.log('DONE');
}


const cron = require('node-cron');
const { MongoClient } = require('mongodb');
const client = new MongoClient(uri);


// Replace this URI with your MongoDB connection string.

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");
    } catch (error) {
        console.error(`Connection to MongoDB failed: ${error}`);
    }
}

connectToMongoDB();
correlationNmarkketCap(id, certificate);














