require('punycode/')

const fetchAllMarketCapAndCorrelationData = require('./utils/main-bot--GetMArketCap_Corr');
const RetreveTV_Data_MongoDBpush = require('./utils/main-bot--TVretrive'); // Adjust the path as needed
const updateGooglesheets = require('./utils/main-bot--GoogleSheets'); // Adjust the path as needed
const {getValidCredentials} = require('./utils/main-bot__testcredentials'); // Adjust the path as needed
const makeNonprovisionaDailySignal = require('./utils/main-bot--nonProvisional'); // Adjust the path as needed
const  {weightedaverage,MultipleWeightedAverage } = require('./utils/main-bot--CalculateWaightedSignals'); // Adjust the path as needed
const {alerts, MakeAlerts ,MakeAlertsFast} = require("./utils/main-bot--alerts");
const {fetchActiveOrders, DisplayBinanceData} = require("./utils/main-bot--bybit");
const { RestClientV5 }= require('bybit-api');
const TradingView = require('@mathieuc/tradingview');






const cron = require('node-cron');
const { MongoClient } = require('mongodb');

// Replace this URI with your MongoDB connection string.
const uri = "mongodb+srv://007:007@cluster0.nzvrf1n.mongodb.net/";
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



    const dbName="omartpi"
 const dbname = dbName

    const type_mybe_provisional = "summary_data_for_"
    const type_mybe_provisional2 = "no_provisional_summary_"

    const indicator_id = "USER;fccf0c4bc9ac4656adff551299e3e3c0"
    const timeframes = ['4H','12H'];

   const spreadsheetId = "1NJDfQ9ef5ubG5ixZvT843qPlYiZq7SbG9SUe3VZBtp8";



    let key = "WlRVK1b7dFNuy6rHKb";
    let secret = "ICwbCcKvZ2jnL1iyZzkQvA13SQwda7nCVP38"; // yt
    let client_bybit = new RestClientV5({
        key: key,
        secret: secret,
      });
    let leverage = '2.8';

    let NofCoins = 18;
    let lev = 1.2;

    let weights_no_prov = [17,10]; // Example weights
    let weights_prov = [17,10]; // Example weights


    
    let webhookUrl = 'https://discord.com/api/webhooks/1233496651834855586/lQrFV2VjMhpsW06qPyoN_nxvSSvxGPJ7VFpFrXTHZYWNm7yT-ldWN_5zcLDpzGmMdhNX';


    let client_tv = new TradingView.Client({ token: id, signature: certificate });


    let markets = ['CRYPTOCAP:TOTAL'];

    lev = 1.5;
    NofCoins = 30;

   

 
 await TraderBotStotal(client,client_tv, client_bybit, weights_no_prov,weights_prov, indicator_id, id, certificate, dbname, markets, timeframes, webhookUrl,lev,NofCoins,leverage,dbName) 
    MakeAlerts(markets, weights_prov, client, type_mybe_provisional, timeframes,webhookUrl,"ProvisionaTotal",dbname,2);
await sleep(1500 );
    MakeAlerts(markets, weights_no_prov, client, type_mybe_provisional2, timeframes,webhookUrl,"NoProvisionalTotal",dbname,2);    
await sleep(1500 );
    updateGooglesheets( client,markets, timeframes, type_mybe_provisional,"PTotal",spreadsheetId,dbname);
await sleep(1500 );
    updateGooglesheets( client,markets, timeframes, type_mybe_provisional2,"NoPTotal",spreadsheetId,dbname);
DisplayBinanceData(client_bybit,webhookUrl,lev);


     markets = ['BYBIT:BTCUSDT.P','BYBIT:ETHUSDT.P',
        'BYBIT:TIAUSDT.P',   
        'BYBIT:ROSEUSDT.P',  'BYBIT:BANDUSDT.P',
        'BYBIT:ENJUSDT.P',   'BYBIT:1INCHUSDT.P',
        'BYBIT:MINAUSDT.P',
        'BYBIT:RNDRUSDT.P',  
        'BYBIT:ALGOUSDT.P',  
        'BYBIT:BAKEUSDT.P',  'BYBIT:AXSUSDT.P','BYBIT:ENAUSDT.P',
        'BYBIT:ONDOUSDT.P', 'BYBIT:OPUSDT.P',
        'BYBIT:CFXUSDT.P', 'BYBIT:DOGEUSDT.P',
        'BYBIT:LDOUSDT.P',   'BYBIT:UNIUSDT.P','BYBIT:MATICUSDT.P','BYBIT:SOLUSDT.P','BYBIT:BNBUSDT.P','BYBIT:XRPUSDT.P','BYBIT:ADAUSDT.P','BYBIT:AVAXUSDT.P','BYBIT:TRXUSDT.P','BYBIT:DOTUSDT.P','BYBIT:LINKUSDT.P','BYBIT:TONUSDT.P','BYBIT:ICPUSDT.P','BYBIT:LTCUSDT.P','BYBIT:BCHUSDT.P','BYBIT:ATOMUSDT.P','BYBIT:UNIUSDT.P','BYBIT:XLMUSDT.P','BYBIT:NEARUSDT.P','BYBIT:AAVEUSDT.P'
      ]; 
     //weights_no_prov = [0 ,1,	2.00,	7.00,	0,	2.00,	0,	0,	1,	0];  // Example weights
     //weights_prov = [1.00,5.00,5.00,5.00,0,5.00,0,0,1.00,2.00]; // Example weights


    lev = 1.5;
    NofCoins = 30;
    //key = "m3l54FVQWrfKPL6r4H";
    //secret = "9M9WoRniOWppqk2QvManZnMixRSYTiNmH39e"; // midcaps
    client_bybit = new RestClientV5({
        key: key,
        secret: secret,
      });
    client_tv = new TradingView.Client({ token: id, signature: certificate });
   // webhookUrl = 'https://discord.com/api/webhooks/1200603024654086144/46rrRC7_87othon6hQW8H5O16AV2Letk1Mm_qpqL5GzsSoIFmZ2OeHY_OO6R9ovM1qk-'
   //DisplayBinanceData(client_bybit,webhookUrl,lev);
 await TraderBotSalts(client,client_tv, client_bybit, weights_no_prov,weights_prov, indicator_id, id, certificate, dbname, markets, timeframes, webhookUrl,lev,NofCoins,leverage,dbName) 
    MakeAlerts(markets, weights_prov, client, type_mybe_provisional, timeframes,webhookUrl,"ProvisionalAll",dbname,0);
    
await sleep(1500 );
    MakeAlerts(markets, weights_no_prov, client, type_mybe_provisional2, timeframes,webhookUrl,"NotProvisionalAll",dbname,0);    
await sleep(1500 );
    await updateGooglesheets( client,markets, timeframes, type_mybe_provisional,"PALLOmarTPI",spreadsheetId,dbname);
await sleep(1500 );
    await updateGooglesheets( client,markets, timeframes, type_mybe_provisional2,"NoPALLOmarTPI",spreadsheetId,dbname);
DisplayBinanceData(client_bybit,webhookUrl,lev);
  console.log('DONE');


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

async function TraderBotStotal(client,client_tv, client_bybit,  weights_no_prov,weights_prov, indicator_id, id, certificate, dbname, markets, timeframes, webhookUrl, lev, NofCoins, leverage,dbName) {
    const type_mybe_provisional = "summary_data_for_";
    const type_mybe_provisional2 = "no_provisional_summary_";


    const processMarket = async (market) => {
        try {
            console.log(`Starting operations for market: ${market}`);
            const a = await RetreveTV_Data_MongoDBpush(client_tv,client, [market], timeframes, indicator_id, id, certificate, dbname);
             //console.log("a",a)
await makeNonprovisionaDailySignal(client, [market], timeframes, dbname);
            
            await sleep(2500 );

            const weight = await weightedaverage(market, weights_prov, client, type_mybe_provisional, timeframes,dbname, 0);
            const weight2 = await weightedaverage(market, weights_no_prov, client, type_mybe_provisional2, timeframes,dbname, 0);

             let signal = 0;
            if (weight !== 0) {
                signal = weight / Math.abs(weight) 
            }
            if (weight2 !== 0) {
                signal += weight2 / Math.abs(weight2) ;
            }

            signal /=2;
            let coin_bybit = market.split(':')[1].replace('.P', '');
            let allocationKey = coin_bybit.replace('.P', '');
            const allocations = { [allocationKey]: signal / NofCoins };

            //await fetchActiveOrders(client_bybit, [market], allocations, webhookUrl, leverage, NofCoins, lev);
		//await sleep(2500 );
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
        await delay(4000);
    }

    console.log('All markets initiated.');
}

async function TraderBotSalts(client,client_tv, client_bybit,  weights_no_prov,weights_prov, indicator_id, id, certificate, dbname, markets, timeframes, webhookUrl, lev, NofCoins, leverage, marketCapAndCorrelationData,dbName) {
    const type_mybe_provisional = "summary_data_for_";
    const type_mybe_provisional2 = "no_provisional_summary_";
    //markets = ['BYBIT:BTCUSDT.P', 'BYBIT:ETHUSDT.P'];


    const total = await weightedaverage('CRYPTOCAP:TOTAL', weights_prov, client, type_mybe_provisional, timeframes,dbname, 0);
            const total2 =await weightedaverage('CRYPTOCAP:TOTAL', weights_prov, client, type_mybe_provisional2, timeframes,dbname, 0);


    console.log('total:', total);    
    console.log('total2:', total2);


    const processMarket = async (market) => {
        try {
            console.log(`Starting operations for market: ${market}`);
            await RetreveTV_Data_MongoDBpush(client_tv,client, [market], timeframes, indicator_id, id, certificate, dbname);
            await makeNonprovisionaDailySignal(client, [market], timeframes, dbname);
            
            await sleep(500 );

		

            const weight = await weightedaverage(market, weights_prov, client, type_mybe_provisional, timeframes,dbname, 0);
            const weight2 = await weightedaverage(market, weights_no_prov, client, type_mybe_provisional2, timeframes,dbname, 0);
		let signal = total + total2+ weight +weight2;
            


            signal /=4;
	console.log(signal );
            let coin_bybit = market.split(':')[1].replace('.P', '');
            let allocationKey = coin_bybit.replace('.P', '');
            const allocations = { [allocationKey]: signal / NofCoins };

            await fetchActiveOrders(client_bybit, [market], allocations, webhookUrl, leverage, NofCoins, lev);
		await sleep(500 );
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
        await delay(1000);
    }

    console.log('All markets initiated.');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

const { promisify } = require('util');
const setTimeoutPromise = promisify(setTimeout);

async function M() {
    const id = "fyb8tc8yps6ju7uarv8vippr62gsi7l5";
   const certificate = "v2:WFPAGDvBqzuPp0YrFtMXiovmN5fJAvfgMytaPpLeIKI=";
    
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
cron.schedule('2 */4 * * *', () => {
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
