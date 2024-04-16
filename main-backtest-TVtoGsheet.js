require('dotenv').config();

// all private indicators :
// https://pine-facade.tradingview.com/pine-facade/list?filter=saved
// fill this below

const indi_ = 'USER;91bdff47320b4284a375f428f683b21e';
const  sessionid = "_replace_";
const sessionid_sign = "_replace_";
  const timeframes = ['4H','12H','1D', '2D', '3D', '4D', '5D', '6D', 'W', '1M'];
  const markets = ['BTC'];
  const spreadsheetId = "_replace_";
  
  // fill this above

// all private indicators :
// https://pine-facade.tradingview.com/pine-facade/list?filter=saved






const { google } = require('googleapis');
const TradingView = require('@mathieuc/tradingview');
const { appendAllDataFromJson } = require('./utils/main-backtest-googleSheetsUtils');
//const {appendAllDataFromJson } = require('@blackphoenixslo/trading-bot-framework');

async function getAuthToken() {
  const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES
  });
  const authToken = await auth.getClient();
  return authToken;
}

async function fetchData(timeframe, ticket,indi_,client,timeframes) {
  const chart = new client.Session.Chart();
  console.log(Math.round((Date.now() - Date.UTC(2018,1,1) )/ 1000 / 60 / 60 / 24*(200/timeframeMapping[timeframes[0]])))
  chart.setMarket(ticket, {
    timeframe: timeframe,
    range:20000,
    to: Math.round((Date.now()  )/ 1000)
  });

  return new Promise((resolve, reject) => {
   TradingView.getIndicator(indi_).then((indic) => { //new
      const study = new chart.Study(indic);
      study.onUpdate(() => {
        resolve(study.periods);
      });
    }).catch(reject);
  });
}



const timeframeMapping = {
  '5': 1,                // Base timeframe
  '15': 3,               // 3 times the base timeframe
  '30': 6,               // 6 times the base timeframe
  '1H': 12,               // 12 times the base timeframe
  '2H': 24,               // 12 times the base timeframe
  '3H': 36,     
  '4H': 48,               // 48 times the base timeframe
  '6H': 72,               // 72 times the base timeframe
  '8H': 96,     
  '12H': 144,             // 144 times the base timeframe
  '16H': 192,     
  '1D': 288,              // 288 times the base timeframe
  '2D': 576,              // 576 times the base timeframe
  '3D': 864,              // 864 times the base timeframe
  '4D': 1152,             // 1152 times the base timeframe
  '5D': 1440,             // 1440 times the base timeframe
  '6D': 1728,             // 1728 times the base timeframe
  'W': 2016,              // 2016 times the base timeframe
  '1M': 8640              // Adjust this number as per your requirement for a month
};



function processDataForTimeframes(timeframes, MoveDown = 0, ...dataArrays) {
  const structuredData = [];
  const initialPositions = {};

  // Create initial arrays filled with zeros for each timeframe
  timeframes.forEach(tf => {
      initialPositions[tf] = new Array(0).fill(0);
  });

  // Reverse the order of entries in each data array
 //const reversedDataArrays = dataArrays.map(dataArray => dataArray.slice().reverse());

  // Process each timeframe
  dataArrays[0].forEach((entry, index) => {
      let row = {
          'unix': entry.$time,
          'time': new Date(entry.$time * 1000).toLocaleString(),
          'closeprice': entry.ClosePrice,
          'openprice': entry.OpenPrice
      };
      if (MoveDown > 0) {
      timeframes.forEach((timeframe, i) => {
          const allPositions = initialPositions[timeframe].concat(dataArrays[i].map(d => d.position));
          row[`${timeframe}position`] = allPositions[Math.floor(((timeframeMapping[timeframe] / timeframeMapping[timeframes[0]]) + index) / (timeframeMapping[timeframe] / timeframeMapping[timeframes[0]]))] || 0;
      });
    }
    else {  
      timeframes.forEach((timeframe, i) => {
        const allPositions = initialPositions[timeframe].concat(dataArrays[i].map(d => d.position));
        row[`${timeframe}position`] = allPositions[Math.floor(( index) / (timeframeMapping[timeframe] / timeframeMapping[timeframes[0]]))] || 0;
    });
    }

      structuredData.push(row);
  });

  return structuredData;
}



// const markets = ['INJ', 'AAVE','AVAX','TRX','DOT','LINK','TON','ICP','LTC','BCH','ATOM','UNI','XLM','NEAR','ARB'];
// const markets = ['BTC', 'ETH'];
// const markets = ['BTC'];

// 
async function start() {
  // const indi_ = 'USER;03d7ea932b9044e6aefc5d264f0e214f'
  // const sessionid = "_replace_g";
  // const sessionid_sign = "v2:_replace_/_replace_g=";
  // const timeframes = ['1D', '2D', '3D', '4D'];
  // const markets = ['BTC','ETH','BNB'];
  // const spreadsheetId = "_replace_g";

  const client = new TradingView.Client({ token: sessionid, signature: sessionid_sign });


  for (const coin of markets) {
    const sheetTitle = `${coin}USDT`;
    const sheetTitle3 = `${coin}_reverse__USDT`;
    // const sheetTitle4 = `${coin}_reverse__USD5h3jf`;



    const ticket = `BYBIT:${coin}USDT.P`;
    console.log(`Processing: ${ticket}`);

    const auth = await getAuthToken();
    let dataArrays = [];
    // let dataArrays2 = [];

    for (const tf of timeframes) {
      const data = await fetchData(tf, ticket, indi_,client,timeframes); // corrected
      dataArrays.push(data);
      // const data2 = data.slice().reverse();
      // dataArrays2.push(data2);
      
    }

    const MoveDown = 1;

    const processedData = processDataForTimeframes(timeframes,0, ...dataArrays);
    const processedDataMoveDown = processDataForTimeframes(timeframes,MoveDown, ...dataArrays);

    await appendAllDataFromJson(auth, spreadsheetId, sheetTitle, processedData);

    await appendAllDataFromJson(auth, spreadsheetId, sheetTitle3, processedData.slice().reverse());
    await appendAllDataFromJson(auth, spreadsheetId, sheetTitle + "_Slide1", processedDataMoveDown);

    await appendAllDataFromJson(auth, spreadsheetId, sheetTitle3 + "_Slide1", processedDataMoveDown.slice().reverse());


    console.log('Data exported successfully to Google Sheets.');
    console.log('https://docs.google.com/spreadsheets/d/' + spreadsheetId + '/edit#gid=0');
  }
}

start();