require('punycode/')




 

let key = "";// bybit
let secret = ""; // bybit
const id = "";  // trading view  // sessionid
const certificate = ""; // trading view // sessionid_sign
spreadsheetId = ''; // google sheets
const leverage = '2.8';
    let NofCoins = 3;
    let lev = 1;
    const limit_persentage_ofset = 0.1; // 0.1 is suggested // 0.1 is 0.1% // 5 is 5% <--- for testing use 5

    let weights_no_prov = [1.25 ,13.00,	1.25,	2.19,	1.10,	4.06,	1.10,	1.10,	1.00,	1.06];  // Example weights
    let weights_prov =[66.78, 33.75, 39.98, 37.35,0, 46.02,0, 0, 29.86, 20.05]; // Example weights

    const uri = ""; //mongo
    
    let webhookUrl = ''; // discord

    
const indicator_id = "USER;03d7ea932b9044e6aefc5d264f0e214f"
    const timeframes = ['4H','12H','1D', '2D', '3D', '4D', '5D', '6D', 'W', '1M'];

    // let markets = [
    //     'BYBIT:TIAUSDT.P',   
    //     'BYBIT:ROSEUSDT.P',  'BYBIT:BANDUSDT.P',
    //     'BYBIT:ENJUSDT.P',   'BYBIT:1INCHUSDT.P',
    //     'BYBIT:MINAUSDT.P', 
    //     'BYBIT:RNDRUSDT.P',  
    //     'BYBIT:ALGOUSDT.P',  
    //     'BYBIT:BAKEUSDT.P',  'BYBIT:AXSUSDT.P',
    //     'BYBIT:ONDOUSDT.P', 'BYBIT:OPUSDT.P',
    //     'BYBIT:CFXUSDT.P', 'BYBIT:DOGEUSDT.P',
    //     'BYBIT:LDOUSDT.P',   'BYBIT:UNIUSDT.P','BYBIT:BTCUSDT.P','BYBIT:ETHUSDT.P',
    //     'BYBIT:MATICUSDT.P','BYBIT:SOLUSDT.P','BYBIT:BNBUSDT.P','BYBIT:XRPUSDT.P',
    //     'BYBIT:ADAUSDT.P','BYBIT:AVAXUSDT.P','BYBIT:TRXUSDT.P','BYBIT:DOTUSDT.P',
    //     'BYBIT:LINKUSDT.P','BYBIT:TONUSDT.P','BYBIT:ICPUSDT.P','BYBIT:LTCUSDT.P',
    //     'BYBIT:BCHUSDT.P','BYBIT:ATOMUSDT.P','BYBIT:UNIUSDT.P','BYBIT:XLMUSDT.P',
    //     'BYBIT:NEARUSDT.P','BYBIT:AAVEUSDT.P'
    //   ];   
      
    let markets = [
    'BYBIT:MATICUSDT.P'
];



const { RestClientV5 }= require('bybit-api');
const TradingView = require('@mathieuc/tradingview');

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
const fetchAllMarketCapAndCorrelationData = require('./utils/main-bot--GetMArketCap_Corr');
const RetreveTV_Data_MongoDBpush = require('./utils/main-bot--TVretrive'); // Adjust the path as needed
const updateGooglesheets = require('./utils/main-bot--GoogleSheets'); // Adjust the path as needed
const {getValidCredentials} = require('./utils/main-bot__testcredentials'); // Adjust the path as needed
const makeNonprovisionaDailySignal = require('./utils/main-bot--nonProvisional'); // Adjust the path as needed
const  {weightedaverage,MultipleWeightedAverage } = require('./utils/main-bot--CalculateWaightedSignals'); // Adjust the path as needed
const {alerts, MakeAlerts ,MakeAlertsFast} = require("./utils/main-bot--alerts");
const {fetchActiveOrders, DisplayBinanceData} = require("./utils/main-bot--bybit");




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



    const dbname="yourDatabaseName2"

    const type_mybe_provisional = "summary_data_for_"
    const type_mybe_provisional2 = "no_provisional_summary_"

    
            
    // await RetreveTV_Data_MongoDBpush(client_bybit,client,markets,timeframes,indicator_id,id,certificate,dbname); // check if fata exist and not call it
    // await makeNonprovisionaDailySignal(client,markets,timeframes,dbname);



    // await updateGooglesheets( client,markets, timeframes, type_mybe_provisional,sheetTitle,spreadsheetId);


//     const apiKey = '_replace_';
//         const url_coinbase = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';
// const cryptoSymbols = ['BTC', 'ETH', 'XRP', 'SOL', 'BNB','INJ']; // Ensure this is an array
//         const periods = [5,15, 30, 60, 90, 120,200];

    // const marketCapAndCorrelationData = await fetchAllMarketCapAndCorrelationData(client, dbname, apiKey, url_coinbase, cryptoSymbols, periods);
    //     console.log('Market Cap and Correlation Data:', marketCapAndCorrelationData);
    
    


    console.log("done");

    // // Define multiple sets of weights
    // const weightsSets = [
    //     [1, 1,1,1,1,1,1,1,1,1],
    //     [5, 0,1,1,0,1,5,1,1,1] // Example set 1
    //     // ... add more sets of weights as needed ...
    // ];

    

    
   

    // MakeAlertsFast(markets, weightsSets, client, type_mybe_provisional, timeframes,webhookUrl);





    let client_bybit = new RestClientV5({
        key: key,
        secret: secret,
      });
       


//   const allocations = {
//       'MATICUSDT': 0.5, // 50% allocation
//       'ENJUSDT': 0.5  // 50% allocation
//   };
  

    
    //DisplayBinanceData(client_bybit,webhookUrl,lev);

    let client_tv = new TradingView.Client({ token: id, signature: certificate });



   
    // key = "_replace_";
    // secret = "_replace_"; // btc eth
    client_bybit = new RestClientV5({
        key: key,
        secret: secret,
      });
   //DisplayBinanceData(client_bybit,webhookUrl,lev);
 await TraderBotS(client,client_tv, client_bybit, weights_no_prov,weights_prov, indicator_id, id, certificate, dbname, markets, timeframes, webhookUrl,lev,NofCoins,leverage) 
    MakeAlerts(markets, weights_prov, client, type_mybe_provisional, timeframes,webhookUrl,"ProvisionalGiants",2);
await sleep(1500 );
    MakeAlerts(markets, weights_no_prov, client, type_mybe_provisional2, timeframes,webhookUrl,"NoProvisionalGiants",2);    
await sleep(1500 );
    updateGooglesheets( client,markets, timeframes, type_mybe_provisional,"ProvisionalGiants",spreadsheetId);
await sleep(1500 );
    updateGooglesheets( client,markets, timeframes, type_mybe_provisional2,"NoProvisionalGiants",spreadsheetId);
DisplayBinanceData(client_bybit,webhookUrl,lev);
   

    client_tv.end();
console.log('DONE');
}

async function abs(a){
    if (a>0) { return a}
    return -a
}




function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function TraderBotS(client,client_tv, client_bybit,  weights_no_prov,weights_prov, indicator_id, id, certificate, dbname, markets, timeframes, webhookUrl, lev, NofCoins, leverage) {
    const type_mybe_provisional = "summary_data_for_";
    const type_mybe_provisional2 = "no_provisional_summary_";


    const processMarket = async (market) => {
        try {
            console.log(`Starting operations for market: ${market}`);
            await RetreveTV_Data_MongoDBpush(client_tv,client, [market], timeframes, indicator_id, id, certificate, dbname);
            await makeNonprovisionaDailySignal(client, [market], timeframes, dbname);
            
            await sleep(2500 );

            const weight = await weightedaverage(market, weights_prov, client, type_mybe_provisional, timeframes, 0);
            const weight2 = await weightedaverage(market, weights_no_prov, client, type_mybe_provisional2, timeframes, 0);
            console.log(`weight  ${weight}`);
            console.log(`weight2  ${weight2}`);

            await sleep(1500 );
            let signal = weight;
            
            if (weight != 0) {
                signal = weight / Math.abs(weight) 
                console.log(`signal1  ${signal}`);

            }

            if (weight2 != 0) {
                signal += weight2 / Math.abs(weight2) ;
                console.log(`signal2  ${weight2 / Math.abs(weight2)}`);


            }

            signal /= 2;

            let coin_bybit = market.split(':')[1].replace('.P', '');
            let allocationKey = coin_bybit.replace('.P', '');
            const allocations = { [allocationKey]: signal / NofCoins };

 console.log(`allocations  ${signal}`);
            await fetchActiveOrders(client_bybit, [market], allocations, webhookUrl, leverage, NofCoins, lev, limit_persentage_ofset);
		await sleep(2500 );
            // Uncomment these if alerts are needed
            // MakeAlerts([market], weights, client, type_mybe_provisional, timeframes, webhookUrl);
            // MakeAlerts([market], weights, client, type_mybe_provisional2, timeframes, webhookUrl);

            console.log(`Operations completed for market: ${market}`);
        } catch (error) {
            console.error(`Error in processing market: ${market}:`, error);
        }
    }

    for (const market of markets) {
        processMarket(market);
        // Wait for 10 seconds before starting the next market
        await delay(10000);
    }

    console.log('All markets initiated.');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

// async function M(){


//     // const credentials = await getValidCredentials()

//     // const id =  credentials.session
//     // const certificate = credentials.signature
//     const id = "fyb8tc8yps6ju7uarv8vippr62gsi7l5";
//     const certificate = "v2:WFPAGDvBqzuPp0YrFtMXiovmN5fJAvfgMytaPpLeIKI=";
    
//     //if (false){
//     await main3(id,certificate)
 	

//     //}
// }

// M();


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