require('dotenv').config();

// all private indicators :
// https://pine-facade.tradingview.com/pine-facade/list?filter=saved
const { google } = require('googleapis');
const TradingView = require('@mathieuc/tradingview');
// const { appendAllDataFromJson } = require('./utils/main-backtest-googleSheetsUtils');
const {
appendAllDataFromJson
  // import other utilities as needed
} = require('@blackphoenixslo/trading-bot-framework');

const indi_ = 'USER;29e974a38c8b4db08793ae7df3d7dda7'
const id = "_replace_";
const certificate = "v2:_replace_/_replace_=";
const spreadsheetId = "_replace_";

// fix above and run this below
// node main-backtest-bot--fetchTVdata-toGsheet-4h


//https://pine-facade.tradingview.com/pine-facade/list?filter=saved'







async function getAuthToken() {
  const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES
  });
  const authToken = await auth.getClient();
  return authToken;
}

async function fetchData(timeframe, ticket,indi_,client) {
  const chart = new client.Session.Chart();
  console.log(Math.round((Date.now() - Date.UTC(2018,1,1) )/ 1000 / 60 / 60 / 24*6))
  chart.setMarket(ticket, {
    timeframe: timeframe,
    range: Math.round((Date.now() - Date.UTC(2018,1,1) )/ 1000 / 60 / 60 / 24*6) + 1 ,
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

function processDataForTimeframesReverse(data4h,data12h,data1D, data2D, data3D, data4D, data5D, data6D, dataW, dataM) {
  const structuredData = [];
const a = 8;
data4h.forEach((data4h, index) => {
    

    const position12h = index % 3 === 0 ? data12h[Math.floor(index / 3)].position : structuredData[index - 1]['12hposition'];
    const position1D = index % 6 === 0 ? data1D[Math.floor(index / 6)].position : structuredData[index - 1]['1Dposition'];

    const position2D = index % 12 === 0 ? data2D[Math.floor(index / 12)].position : structuredData[index - 1]['2Dposition'];
    const position3D = index % 18 === 0 ? data3D[Math.floor(index / 18)].position : structuredData[index - 1]['3Dposition'];
    const position4D = index % 24 === 0 ? data4D[Math.floor(index / 24)].position : structuredData[index - 1]['4Dposition'];
    const position5D = index % 30 === 0 ? data5D[Math.floor(index / 30)].position : structuredData[index - 1]['5Dposition'];
    const position6D = index % 36 === 0 ? data6D[Math.floor(index / 36)].position : structuredData[index - 1]['6Dposition'];
    const positionW = index % 42 === 0 ? dataW[Math.floor(index / 42)].position : structuredData[index - 1]['Wposition'];
    const positionM = index % 181 === 0 ? dataM[Math.floor(index / 181)].position : structuredData[index - 1]['Mposition'];


    structuredData.push({
      'unix' : data4h.$time,
      'time': new Date(data4h.$time * 1000).toLocaleString(),
      
      '4hposition': data4h.position,

      '12hposition': position12h,

      '1Dposition': position1D,

      '2Dposition': position2D,
      '3Dposition': position3D,
      '4Dposition': position4D,
      '5Dposition': position5D,
      '6Dposition': position6D,
      'Wposition': positionW,
      'Mposition': positionM,

      'closeprice': data4h.ClosePrice,
      'openprice': data4h.OpenPrice

    });
  });

  return structuredData.reverse();
}

function processDataForTimeframes(data4h,data12h,data1D, data2D, data3D, data4D, data5D, data6D, dataW, dataM) {
  const structuredData = [];
const a = 8;
data4h.forEach((data4h, index) => {
    

    const position12h = index % 3 === 0 ? data12h[Math.floor(index / 3)].position : structuredData[index - 1]['12hposition'];
    const position1D = index % 6 === 0 ? data1D[Math.floor(index / 6)].position : structuredData[index - 1]['1Dposition'];

    const position2D = index % 12 === 0 ? data2D[Math.floor(index / 12)].position : structuredData[index - 1]['2Dposition'];
    const position3D = index % 18 === 0 ? data3D[Math.floor(index / 18)].position : structuredData[index - 1]['3Dposition'];
    const position4D = index % 24 === 0 ? data4D[Math.floor(index / 24)].position : structuredData[index - 1]['4Dposition'];
    const position5D = index % 30 === 0 ? data5D[Math.floor(index / 30)].position : structuredData[index - 1]['5Dposition'];
    const position6D = index % 36 === 0 ? data6D[Math.floor(index / 36)].position : structuredData[index - 1]['6Dposition'];
    const positionW = index % 42 === 0 ? dataW[Math.floor(index / 42)].position : structuredData[index - 1]['Wposition'];
    const positionM = index % 181 === 0 ? dataM[Math.floor(index / 181)].position : structuredData[index - 1]['Mposition'];


    structuredData.push({
      'unix' : data4h.$time,
      'time': new Date(data4h.$time * 1000).toLocaleString(),
      
      '4hposition': data4h.position,

      '12hposition': position12h,

      '1Dposition': position1D,

      '2Dposition': position2D,
      '3Dposition': position3D,
      '4Dposition': position4D,
      '5Dposition': position5D,
      '6Dposition': position6D,
      'Wposition': positionW,
      'Mposition': positionM,

      'closeprice': data4h.ClosePrice,
      'openprice': data4h.OpenPrice

    });
  });

  return structuredData;
}

async function exportIndicatorData(sheetTitle, ticket,indi_,id,certificate,spreadsheetId) {
  try {
    const auth = await getAuthToken(); 
    const client = new TradingView.Client({ token: id, signature: certificate });

    const data4h = await fetchData('4H',ticket,indi_,client);
    const data12h = await fetchData('12H',ticket,indi_,client);
    const data1D = await fetchData('1D',ticket,indi_,client);
    const data2D = await fetchData('2D',ticket,indi_,client);
    const data3D = await fetchData('3D',ticket,indi_,client); // Fetch data for 3D
    const data4D = await fetchData('4D',ticket,indi_,client);
    const data5D = await fetchData('5D',ticket,indi_,client); // Fetch data for 5D
    const data6D = await fetchData('6D',ticket,indi_,client); // Fetch data for 6D
    const dataW = await fetchData('W',ticket,indi_,client);
    const dataM = await fetchData('M',ticket,indi_,client);

    client.end();



    const processedData = processDataForTimeframes(data4h,data12h,data1D, data2D, data3D, data4D, data5D, data6D, dataW,dataM);
    console.log(processedData);

    await appendAllDataFromJson(auth, spreadsheetId, sheetTitle, processedData);

    console.log('Data exported successfully to Google Sheets.');

  } catch (error) {
    console.error('Error in exportIndicatorData:', error);
  }
}

async function exportIndicatorDataReverse(sheetTitle, ticket,indi_,id,certificate,spreadsheetId) {
  try {
    const auth = await getAuthToken(); 
    const client = new TradingView.Client({ token: id, signature: certificate });

    const data4h = await fetchData('4H',ticket,indi_,client);
    const data12h = await fetchData('12H',ticket,indi_,client);
    const data1D = await fetchData('1D',ticket,indi_,client);
    const data2D = await fetchData('2D',ticket,indi_,client);
    const data3D = await fetchData('3D',ticket,indi_,client); // Fetch data for 3D
    const data4D = await fetchData('4D',ticket,indi_,client);
    const data5D = await fetchData('5D',ticket,indi_,client); // Fetch data for 5D
    const data6D = await fetchData('6D',ticket,indi_,client); // Fetch data for 6D
    const dataW = await fetchData('W',ticket,indi_,client);
    const dataM = await fetchData('M',ticket,indi_,client);

    client.end();



    const processedData = processDataForTimeframesReverse(data4h,data12h,data1D, data2D, data3D, data4D, data5D, data6D, dataW,dataM);
    console.log(processedData);

    await appendAllDataFromJson(auth, spreadsheetId, sheetTitle, processedData);

    console.log('Data exported successfully to Google Sheets.');

  } catch (error) {
    console.error('Error in exportIndicatorData:', error);
  }
}
// const markets = ['INJ', 'AAVE','AVAX','TRX','DOT','LINK','TON','ICP','LTC','BCH','ATOM','UNI','XLM','NEAR','ARB'];
// const markets = ['BTC', 'ETH'];
const markets = ['BTC'];

// 
async function start() {

//   const indi_ = 'USER;29e974a38c8b4db08793ae7df3d7dda7'
//   const id = "_replace_";
//   const certificate = "v2:_replace_/_replace_=";
// const spreadsheetId = "_replace_";

  for (const coin of markets) {
    const coinbybit = coin;
    const sheetTitle = coinbybit + 'USDT';
    const ticket = 'BYBIT:' + coinbybit + 'USDT.P';
    // const ticket = 'CAPITALCOM:' + coinbybit + '';
    console.log(ticket.split(':')[1]);
    await exportIndicatorData(sheetTitle , ticket,indi_,id,certificate,spreadsheetId);
    const sheetTitleR = sheetTitle  + 'reverse';


    await exportIndicatorDataReverse(sheetTitleR , ticket,indi_,id,certificate,spreadsheetId);

    
  }

}
start()
