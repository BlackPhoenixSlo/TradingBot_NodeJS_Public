const { google } = require('googleapis');
const { appendAllDataFromJson_big } = require('./main-bot--googleSheetsUtils');
require('punycode/')



const {fetchNewestDataFromMongoDB} = require('./main-bot--mongoDownload');


//const markets = ['BYBIT:BTCUSDT.P','BYBIT:ETHUSDT.P'];
//const indicator_id = "USER;03d7ea932b9044e6aefc5d264f0e214f"




async function getGoogleSheetsAuthToken() {
    const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
    const auth = new google.auth.GoogleAuth({ scopes: SCOPES });
    const authToken = await auth.getClient();
    return authToken;
}


 











async function updateGooglesheets( client,markets, timeframes, type_mybe_provisional,sheetTitle,spreadsheetId) {
    const auth = await getGoogleSheetsAuthToken(); 
    //const client = new MongoClient(uri);
    let marketDataArrays = [];

    //await client.connect();
    console.log('Connected successfully to MongoDB');


    for (let market of markets) {
        // Fetch data for each market
        const data = await fetchNewestDataFromMongoDB(market, client,type_mybe_provisional);
        marketDataArrays.push(data);
        // console.log(data);

    }

    //await client.close();

    // Combine data with dynamic headers based on timeframes
    // console.log(marketDataArrays);

    const combinedData = combineMarketData(marketDataArrays, timeframes);
    await appendAllDataFromJson_big(auth, spreadsheetId, sheetTitle, combinedData);
}


function combineMarketData(marketDataArrays, timeframes) {
    let combinedData = [];
    let headers = [];

    // Generate headers dynamically based on timeframes and markets
    marketDataArrays.forEach((dataArray, index) => {
        // Safely access the first element of each dataArray, considering the nested structure
        if (dataArray.length > 0 && dataArray[0].length > 0 && dataArray[0][0]) {
            let marketData = dataArray[0][0];
            let marketPrefix = (marketData.market || `Market${index}`).replace('.', '_');
            headers.push(`${marketPrefix}_unix`, `${marketPrefix}_time`, `${marketPrefix}_closeprice`);
            timeframes.forEach(tf => {
                headers.push(`${marketPrefix}_${tf}position`);
            });
        }
    });

    combinedData.push(headers);

    // Iterate through each row index for the longest array in marketDataArrays
    let maxLength = Math.max(...marketDataArrays.map(dataArray => dataArray.length));
    for (let i = 0; i < maxLength; i++) {
        let row = [];
        marketDataArrays.forEach(dataArray => {
            if (dataArray[i] && dataArray[i][0]) {
                let data = dataArray[i][0];
                let id = data.id || 'No ID';
                let timeFormatted = 'Invalid Date';
                if (data.id) {
                    let date = new Date(data.id * 1000);
                    timeFormatted = date.toString() !== 'Invalid Date' ? date.toLocaleString() : 'Invalid Date';
                }
                let closeprice = data.closeprice || 'No Price';
                row.push(id, timeFormatted, closeprice);
                timeframes.forEach(tf => {
                    let positionKey = `position_${tf}`;
                    row.push(data[positionKey] !== undefined ? data[positionKey] : 'No Data');
                });
            } else {
                row.push(...Array(timeframes.length + 3).fill('No Data'));
            }
        });
        combinedData.push(row);
    }

    return combinedData;
}




module.exports = updateGooglesheets;



