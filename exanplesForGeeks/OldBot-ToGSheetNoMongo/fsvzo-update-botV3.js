
require('dotenv').config();

// all private indicators :
// https://pine-facade.tradingview.com/pine-facade/list?filter=savedconst { google } = require('googleapis');
const TradingView = require('@mathieuc/tradingview');
// const { appendAllDataFromJson_big } = require('./googleSheetsUtils');
// const { getSpreadSheetValues } = require('./googleSheetsService');
const {
  //fetchActiveOrders,
  appendAllDataFromJson_big,
  getSpreadSheetValues,
  calculateCorrelations
    // import other utilities as needed
  } = require('@blackphoenixslo/trading-bot-framework');


const cron = require('node-cron');
require('punycode/')

const spreadsheetId = "_replace_-_replace_";

const id = "_replace_";
   const certificate = "_replace_";
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// const markets = ['BYBIT:MATICUSDT.P','BYBIT:SOLUSDT.P','BYBIT:BNBUSDT.P','BYBIT:XRPUSDT.P','BYBIT:ADAUSDT.P','BYBIT:AVAXUSDT.P','BYBIT:TRXUSDT.P','BYBIT:DOTUSDT.P','BYBIT:LINKUSDT.P','BYBIT:TONUSDT.P','BYBIT:ICPUSDT.P','BYBIT:LTCUSDT.P','BYBIT:BCHUSDT.P','BYBIT:ATOMUSDT.P','BYBIT:UNIUSDT.P','BYBIT:XLMUSDT.P','BYBIT:INJUSDT.P','BYBIT:NEARUSDT.P','BYBIT:ARBUSDT.P','BYBIT:AAVEUSDT.P'];


// const markets = ['BYBIT:MATICUSDT.P','BYBIT:SOLUSDT.P','BYBIT:BNBUSDT.P','BYBIT:XRPUSDT.P','BYBIT:ADAUSDT.P','BYBIT:AVAXUSDT.P','BYBIT:TRXUSDT.P','BYBIT:DOTUSDT.P','BYBIT:LINKUSDT.P','BYBIT:TONUSDT.P','BYBIT:ICPUSDT.P','BYBIT:LTCUSDT.P','BYBIT:BCHUSDT.P','BYBIT:ATOMUSDT.P','BYBIT:UNIUSDT.P','BYBIT:XLMUSDT.P','BYBIT:INJUSDT.P','BYBIT:NEARUSDT.P','BYBIT:ARBUSDT.P','BYBIT:AAVEUSDT.P'];


//  const markets = ['BYBIT:MATICUSDT.P','BYBIT:BNBUSDT.P','BYBIT:XRPUSDT.P','BYBIT:ADAUSDT.P','BYBIT:AVAXUSDT.P'];

// const markets = ['BYBIT:ADAUSDT.P','BYBIT:AVAXUSDT.P'];


// const markets = [ 
//     'cryptocap:TOTAL',   
//     'cryptocap:TOTAL2',  'cryptocap:TOTAL3',
//   ];

const markets = [
    'BYBIT:TIAUSDT.P',   
    'BYBIT:ROSEUSDT.P',  'BYBIT:BANDUSDT.P',
    'BYBIT:ENJUSDT.P',   'BYBIT:1INCHUSDT.P',
    'BYBIT:MINAUSDT.P',
    'BYBIT:RNDRUSDT.P',  
    'BYBIT:ALGOUSDT.P',  
    'BYBIT:BAKEUSDT.P',  'BYBIT:AXSUSDT.P',
    'BYBIT:ONDOUSDT.P', 'BYBIT:OPUSDT.P',
    'BYBIT:CFXUSDT.P', 'BYBIT:DOGEUSDT.P',
    'BYBIT:LDOUSDT.P',   'BYBIT:UNIUSDT.P'
  ];


// const markets = [
//     'BYBIT:tiaUSDT.P',   
// //     'BYBIT:ROSEUSDT.P',  'BYBIT:BANDUSDT.P',
// //     'BYBIT:ENJUSDT.P',   'BYBIT:1INCHUSDT.P',
// //     'BYBIT:MINAUSDT.P',
// //     'BYBIT:RNDRUSDT.P',  
// //     'BYBIT:ALGOUSDT.P',  
// //     'BYBIT:BAKEUSDT.P',  'BYBIT:AXSUSDT.P',
// //     'BYBIT:ONDOUSDT.P', 'BYBIT:OPUSDT.P',
// //     'BYBIT:CFXUSDT.P', 'BYBIT:DOGEUSDT.P',
// //     'BYBIT:LDOUSDT.P',   'BYBIT:UNIUSDT.P'

//   ];


const alerts = require("./alerts-low");
const { fetchActiveOrders } = require('./rest-v5-private-lowcaps');

//const weights = [66.78, 33.75, 39.98, 37.35, 32.12, 46.02,  26.43, 15.78 , 29.86, 0]; // Corresponding to 4H, 12H, 1D, 2D, 3D, 4D, 5D, 6D, W, M
//const weights3 = [0, 33.75, 39.98, 37.35, 32.12, 46.02, 26.43, 15.78, 29.86, 20.05]; // Corresponding to 4H, 12H, 1D, 2D, 3D, 4D, 5D, 6D, W, M
//const weights2 = [66.78, 33.75, 39.98, 37.35, 0, 46.02, 0, 0, 29.86, 0]; // Corresponding to 4H, 12H, 1D, 2D, 3D, 4D, 5D, 6D, W, M
//const weights = [1.00,	5.00,	5.00,	5.00,	0.00,	5.00,	0.00,	0.00,	1.00,	2.00]; // Corresponding to 4H, 12H, 1D, 2D, 3D, 4D, 5D, 6D, W, M
//const weights3 = [1.40,	13.49,	3.25,	2.84,	0.59,	3.81,	0.79,	0.79,	1.20,	1.41]; // Corresponding to 4H, 12H, 1D, 2D, 3D, 4D, 5D, 6D, W, M
//const weights2 = [1.00,	14.00,	1.00,	1.00,	1.00,	4.00,	1.00,	1.00,	1.00,	1.00]; // Corresponding to 4H, 12H, 1D, 2D, 3D, 4D, 5D, 6D, W, M
const weights = [66.78, 33.75, 39.98, 37.35, 32.12, 46.02, 0,0,29.86,  20.05]; // Corresponding to 4H, 12H, 1D, 2D, 3D, 4D, 5D, 6D, W, M
const weights3 = [165.00,53.00,	80.00,81.00,77.00,131.00,71.00,0,61.00,7.00]; // Corresponding to 4H, 12H, 1D, 2D, 3D, 4D, 5D, 6D, W, M
const weights2 = [1.00,5.00,5.00,5.00,0,5.00,0,0,1.00,2.00];  

function abs(x){
    if( x < 0 ) {
        return -x;
    
    }
    return x
}

async function getAuthToken() {
    const auth = new google.auth.GoogleAuth({ scopes: SCOPES });
    const authToken = await auth.getClient();
    return authToken;
}

async function fetchData(market, timeframe) {
    console.log('pullam date: ', market)

    const client = new TradingView.Client({ token: id, signature: certificate });
    const chart = new client.Session.Chart();
    chart.setMarket(market, {
        timeframe: timeframe,
        range: 1,
        to: Math.round(Date.now() / 1000)
    });
    console.log("fetchdata ... timeframe", timeframe)

    return new Promise((resolve, reject) => {
        TradingView.getIndicator('USER;03d7ea932b9044e6aefc5d264f0e214f').then((indic) => {
            const study = new chart.Study(indic);
            study.onUpdate(() => {
                console.log("data ... timeframe", study.periods[0].Plot_5)

                resolve(study.periods);
                client.end();
            });
        }).catch(reject);
    });
}

function processDataForTimeframes(market,data4H ,data12H,data1D, data2D, data3D, data4D, data5D, data6D, dataW, dataM) {
    let alignedData = {};
    let marketName = market.split(':')[1]; // Extracts the part after 'BINANCE:'

    let latestData = data4H[0]; // Assuming the latest data is the first element in the array
    let monthlyPosition = dataM.length > 0 ? dataM[0].position : null; // Assuming the first entry in dataM is the latest

    alignedData[marketName + '_unix'] = latestData.$time;
    alignedData[marketName + '_time'] = new Date(latestData.$time * 1000).toLocaleString();
    alignedData[marketName + '_4Hposition'] = latestData.position;
    alignedData[marketName + '_12Hposition'] =  findClosestData(latestData, data12H).position;
    alignedData[marketName + '_1Dposition'] =  findClosestData(latestData, data1D).position;

    alignedData[marketName + '_2Dposition'] = findClosestData(latestData, data2D).position;
    alignedData[marketName + '_3Dposition'] = findClosestData(latestData, data3D).position;
    alignedData[marketName + '_4Dposition'] = findClosestData(latestData, data4D).position;
    alignedData[marketName + '_5Dposition'] = findClosestData(latestData, data5D).position;
    alignedData[marketName + '_6Dposition'] = findClosestData(latestData, data6D).position;
    alignedData[marketName + '_Wposition'] = findClosestData(latestData, dataW).position;
    alignedData[marketName + '_Mposition'] = monthlyPosition;
    alignedData[marketName + '_closeprice'] = latestData.ClosePrice;

    return alignedData;
}

function findClosestData(day, timeframeData) {
  // Assuming timeframeData is sorted by time, find the closest entry to 'day'
  let closest = timeframeData[0];
  let minDiff = Math.abs(day.$time - closest.$time);

  for (let entry of timeframeData) {
    let diff = Math.abs(day.$time - entry.$time);
    if (diff < minDiff) {
      minDiff = diff;
      closest = entry;
    }
  }

  return closest;
}








// Example usage
async function calculatePositionsV2(data) {

    
    console.log("Exported Data:", data);
    console.log("BTCUSDT_1Dposition:", data['BTCUSDT.P_1Dposition']);



    let sums = {};

markets.forEach((market) => {
    let coin = market.split(':')[1]; // Assuming market format is "EXCHANGE:COIN"

    let a = calculateWeightedSum(data, coin);
    let b = calculateWeightedSum2(data, coin);
let c = calculateWeightedSum3(data, coin);
    console.log(a , ' ' ,b );

    sums[coin] = 0
	if ( a !== 0 ) {
        a= a/abs(a) 
    }
if ( b !== 0 ) {
        b= b/abs(b) 
    }
if ( c !== 0 ) {
        c= c/abs(c) 
    }

sums[coin]= (a+2*b+c)/4

    console.log(sums[coin]);

});

console.log(sums);





return sums



}

// Integration with exportAllMarketDataWithMarketCap
async function exportAllMarketDataWithMarketCap(title1) {
    // ... other required imports and function definitions ...

    try {
        const auth = await getAuthToken();
        let allProcessedData = {};

        
  
        for (let market of markets) {
            const data4H = await fetchData(market, '4H');

            const data12H = await fetchData(market, '12H');

          const data1D = await fetchData(market, '1D');
          const data2D = await fetchData(market, '2D');
          const data3D = await fetchData(market, '3D');
          const data4D = await fetchData(market, '4D');
          const data5D = await fetchData(market, '5D');
          const data6D = await fetchData(market, '6D');
          const dataW = await fetchData(market, 'W');
          const dataM = await fetchData(market, '1M');
            // ... existing code to fetch and process data ...
  
            const processedData = processDataForTimeframes(market,data4H,data12H, data1D, data2D, data3D, data4D, data5D, data6D, dataW, dataM);
            Object.assign(allProcessedData, processedData);
        }
  
        const positionsData = await calculatePositionsV2(allProcessedData)
        console.log(positionsData)
        Object.assign(allProcessedData, positionsData);
        console.log(allProcessedData)


        
        // Prepare data for Google Sheets
        const headers = Object.keys(allProcessedData);
        const values = Object.values(allProcessedData);

        const sheetData = [headers].concat([values]);

        await appendAllDataFromJson_big(auth, spreadsheetId, title1, sheetData);

        console.log('Data from all markets along with BTC and ETH market cap exported successfully to Google Sheets.');




        return allProcessedData;
    } catch (error) {
        console.error('Error in exportAllMarketDataWithMarketCap:', error);
    }
}


function calculateWeightedSum(data, coin) {
    const timePeriods = ['4H', '12H', '1D', '2D', '3D', '4D', '5D', '6D', 'W', 'M'];
    let weightedSum = 0;
    let weightsSum = 0;



    timePeriods.forEach((period, index) => {
        let key = `${coin}_${period}position`;
        if (data[key] !== undefined) {
            weightedSum += data[key] * weights[index];
            weightsSum +=  weights[index]
        }
    });

    return weightedSum / weightsSum;
}

function calculateWeightedSum2(data, coin) {
    const timePeriods = ['4H', '12H', '1D', '2D', '3D', '4D', '5D', '6D', 'W', 'M'];
    let weightedSum = 0;
    let weightsSum = 0;



    timePeriods.forEach((period, index) => {
        let key = `${coin}_${period}position`;
        if (data[key] !== undefined) {
            weightedSum += data[key] * weights2[index];
            weightsSum +=  weights2[index]
        }
    });

    return weightedSum / weightsSum;
}

function calculateWeightedSum3(data, coin) {
    const timePeriods = ['4H', '12H', '1D', '2D', '3D', '4D', '5D', '6D', 'W', 'M'];
    let weightedSum = 0;
    let weightsSum = 0;



    timePeriods.forEach((period, index) => {
        let key = `${coin}_${period}position`;
        if (data[key] !== undefined) {
            weightedSum += data[key] * weights3[index];
            weightsSum +=  weights3[index]
        }
    });

    return weightedSum / weightsSum;
}


// Example usage
async function calculatePositions(title1) {

    const data = await exportAllMarketDataWithMarketCap(title1)
    
    console.log("Exported Data:", data);
    console.log("BTCUSDT_1Dposition:", data['BTCUSDT.P_1Dposition']);



    let sums = {};
    let allocation = {};

    const lengthOfMarkets = markets.length;

markets.forEach((market) => {
    let coin = market.split(':')[1]; // Assuming market format is "EXCHANGE:COIN"
    let a = calculateWeightedSum(data, coin);
    let b = calculateWeightedSum2(data, coin);
let c = calculateWeightedSum3(data, coin);
    console.log(a , ' ' ,b );

    sums[coin] = 0
	if ( a !== 0 ) {
        a= a/abs(a) 
    }
if ( b !== 0 ) {
        b= b/abs(b) 
    }
if ( c !== 0 ) {
        c= c/abs(c) 
    }

sums[coin]= (a+2*b+c)/4

    console.log(sums[coin]);

    allocation[coin] = sums[coin]/lengthOfMarkets;

   

});

console.log(sums);
console.log(allocation);




fetchActiveOrders(markets,allocation)


return sums



}

// async function scheduledTask() {
//     try {


//         console.log('Task started at x UTC');
//         const data = await exportAllMarketDataWithMarketCap();
//         console.log("Scheduled Task Completed. Data:", data);
//         // Additional logic if needed

//         console.log('Task end at x UTC');

//     } catch (error) {
//         console.error('Error in scheduled task:', error);
//     }
// }

// cron.schedule('* * * * *', scheduledTask, {
//     scheduled: true,
//     timezone: "UTC"
// });
// console.log('Task taken in a count at x UTC');





async function main1234(){

    try {
        console.log('HTTP request received at /runTask');
        const data = await calculatePositions('ALTSBOTTOM10');
        console.log("HTTP Task Completed. Data:", data);


        console.log("https://docs.google.com/spreadsheets/d/1SZwDpZO7rvLrijKq9dtgdOP4tffr-KzhQB1JsPXBj8I/edit#gid=0");

        console.log("https://docs.google.com/spreadsheets/d/1SZwDpZO7rvLrijKq9dtgdOP4tffr-KzhQB1JsPXBj8I/edit#gid=0");
        console.log("https://docs.google.com/spreadsheets/d/1SZwDpZO7rvLrijKq9dtgdOP4tffr-KzhQB1JsPXBj8I/edit#gid=0");
        console.log("https://docs.google.com/spreadsheets/d/1SZwDpZO7rvLrijKq9dtgdOP4tffr-KzhQB1JsPXBj8I/edit#gid=0");


        // Send response back to client
        // res.json(data);


        try {
            

            if (data && Object.keys(data).length > 0) {
                const numberOfCoins = markets.length;
                const testData = {
                    displayTPIValues: []
                };
            
                for (let market of markets) {
                    let coin = market.split(':')[1]; // Assuming market format is "EXCHANGE:COIN"
            
                    if (data[coin] !== undefined) {
                        let rawScore = data[coin] >= 0 ? 1 / numberOfCoins : -1 / numberOfCoins;
                        let scoreValue = parseFloat(rawScore.toFixed(2));
                        testData.displayTPIValues.push({
                            displayName: `${coin} % allocation`,
                            score: scoreValue 
                        });
                    }
                }
            
                // Call the alert function with test data
                // alerts.discordTPIAlert(testData)
                //     .then(() => console.log('Alert sent successfully.'))
                //     .catch(error => console.error('Error sending alert:', error));
            }
          } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching data');
          }
        //main.js

    
        
      
  
   
}catch (error) {
    console.error(error);
    
  };}

 

  module.exports = { main1234 };