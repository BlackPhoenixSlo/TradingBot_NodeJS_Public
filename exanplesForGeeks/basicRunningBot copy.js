require('punycode/')
const { RestClientV5 }= require('bybit-api');

const uri = "mongodb+srv://_replace_:_replace_@cluster0._replace_.mongodb.net/";
const dbname="yourDatabaseName"

const type_mybe_provisional = "summary_data_for_"
const type_mybe_provisional2 = "no_provisional_summary_"

const id = "_replace_";
const certificate = "_replace_";

const indicator_id = "USER;03d7ea932b9044e6aefc5d264f0e214f"
const timeframes = ['4H','12H','1D', '2D', '3D', '4D', '5D', '6D', 'W', '1M'];
let weights_prov = [1.00,5.00,5.00,5.00,0,5.00,0,0,1.00,2.00]; // Example weights

let markets = [
    'BYBIT:TIAUSDT.P',   
    'BYBIT:ROSEUSDT.P',  'BYBIT:BANDUSDT.P',
    'BYBIT:ENJUSDT.P',   'BYBIT:1INCHUSDT.P',
    'BYBIT:MINAUSDT.P',
    'BYBIT:RNDRUSDT.P',  
  ];   
   // const markets = ['BYBIT:BTCUSDT.P','BYBIT:ETHUSDT.P'];

const sheetTitle  = "YourSheetTitle";  // gogle sheets  Replace with your sheet title
const spreadsheetId = "_replace_";
let key = "_replace_";
let secret = "_replace_"; // lowcaps
let webhookUrl = 'https://discord.com/api/_replace_/_replace_/_replace_-sGr_bcV';

const leverage = '2.8';
let NofCoins = 20;
let lev = 1.2;







let client_bybit = new RestClientV5({
    key: key,
    secret: secret,
  });


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
const TradingView = require('@mathieuc/tradingview');

const {
    fetchAllMarketCapAndCorrelationData,
  RetreveTV_Data_MongoDBpush,
  updateGooglesheets,
  getValidCredentials,
  makeNonprovisionaDailySignal,
  weightedaverage,
  MultipleWeightedAverage,
  alerts,
  MakeAlerts,
  MakeAlertsFast,
  fetchActiveOrders,
  DisplayBinanceData
    // import other utilities as needed
  } = require('@blackphoenixslo/trading-bot-framework');

const cron = require('node-cron');
const { MongoClient } = require('mongodb');

// Replace this URI with your MongoDB connection string.
const client = new MongoClient(uri);

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");
    } catch (error) {
        console.error(`Connection to MongoDB failed: ${error}`);
    }
}

// Connect to MongoDB when the application starts
connectToMongoDB();



async function main3(id,certificate) {
    
    let client_tv = new TradingView.Client({ token: id, signature: certificate });

    const type_mybe_provisional = "summary_data_for_";
    const type_mybe_provisional2 = "no_provisional_summary_";
    await RetreveTV_Data_MongoDBpush(client_tv,client, markets, timeframes, indicator_id, id, certificate, dbname);
    await sleep(1500 );

    for (const market of markets) {

        const weight = await weightedaverage(market, weights_prov, client, type_mybe_provisional, timeframes, 0);
        await sleep(1500 );

        console.log(`Weighted average for ${market} with provisional data:`, weight);
        let coin_bybit = market.split(':')[1].replace('.P', '');
        let allocationKey = coin_bybit.replace('.P', '');
        const allocations = { [allocationKey]: weight / NofCoins };
        await fetchActiveOrders(client_bybit, [market], allocations, webhookUrl, leverage, NofCoins, lev);
        await sleep(1500 );


    }
    await sleep(1500 );

    MakeAlerts(markets, weights_prov, client, type_mybe_provisional, timeframes,webhookUrl,"ProvisionalBottomAlts", 0);
    await sleep(1500 );

    updateGooglesheets( client,markets, timeframes, type_mybe_provisional,"ProvisionalBottomAlts",spreadsheetId);
    await sleep(1500 );

    DisplayBinanceData(client_bybit,webhookUrl,lev);


client_tv.end();
console.log('DONE');
}

async function abs(a){
    if (a>0) { return a}
    return -a
}




  

const { promisify } = require('util');
const setTimeoutPromise = promisify(setTimeout);

async function M() {

    
    // Run main3 with a timeout of 15 minutes (1800000 milliseconds)
    const main3Promise = main3(id, certificate);
    const timeoutPromise = setTimeoutPromise(1800000, 'Timeout');
    try {
        await Promise.race([main3Promise, timeoutPromise]);
    } catch (error) {
        if (error === 'Timeout') {
            console.log('main3 function timed out after 15 minutes.');
        } else {
            console.error('Error in main3:', error);
        }
    }
    console.log('DONE');

}




// Schedule M to run every 4 hours
cron.schedule('1 */4 * * *', () => {
    console.log('Running M every 4 hours');
	connectToMongoDB();
    M();
});

console.log('Running M every 4 hours startig 00:01 UTC');
console.log('Running M every 4 hours startig 00:01 UTC');
console.log('Running M every 4 hours startig 00:01 UTC');
console.log('Running M every 4 hours startig 00:01 UTC');
console.log('Running M every 4 hours startig 00:01 UTC');
console.log('Running M every 4 hours startig 00:01 UTC');
console.log('Running M every 4 hours startig 00:01 UTC');


M();