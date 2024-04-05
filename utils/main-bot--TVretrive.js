require('dotenv').config();

// all private indicators :
// https://pine-facade.tradingview.com/pine-facade/list?filter=saved//const TradingView = require('./main'); // Adjust the path as needed
const TradingView = require('@mathieuc/tradingview');

require('punycode/')
const {processData_mongoDbUpload} = require('./main-bot--mongoUpload'); // Adjust the path as needed





async function fetchDataWithRetry(client_tv,market, timeframe, indicator_id, id, certificate, maxRetries = 3) {
    let attempts = 0;

    while (attempts < maxRetries) {
        try {
            const data = await fetchData(client_tv,market, timeframe, indicator_id, id, certificate);
            return data; // Successfully fetched data
        } catch (error) {
            console.error(`Attempt ${attempts + 1} failed:`, error);
            attempts++;

            if (error.message.includes('429') && attempts < maxRetries) {
                console.log(`Waiting 10 seconds before retry #${attempts + 1}...`);
                await sleep(10000); // Wait for 10 seconds before retrying
            } else {
                // If the error is not a 429 or we've reached max retries, return or handle differently
                console.error('Failed to fetch data after maximum retries or due to a non-retryable error.');
                return null; // or you might want to throw an error or handle it differently
            }
        }
    }

    // If all retries are exhausted
    console.error('All retries have been exhausted.');
    return null;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}





async function fetchData(client_tv,market, timeframe,indicator_id,id,certificate) {
    //const client = new TradingView.Client({ token: id, signature: certificate });
    const chart = new client_tv.Session.Chart();
    chart.setMarket(market, {
        timeframe: timeframe,
        range: 1,
        //range: Math.round((Date.now() - Date.UTC(2018,1,1) )/ 1000 / 60 / 60 / 24*6) + 1 ,

        to: Math.round(Date.now() / 1000)
    });
    console.log("fetchdata ... timeframe", timeframe)

    return new Promise((resolve, reject) => {
        TradingView.getIndicator(indicator_id).then((indic) => {
            const study = new chart.Study(indic);
            study.onUpdate(() => {
                console.log("data ... timeframe", study.periods[0].position)

                resolve(study.periods);
               // client.end();
            });
        }).catch(reject);
    });
}







async function fetchDataForTimeframes(client_tv,market, timeframes,indicator_id,id,certificate) {
    try {
        // Create promises for each timeframe in the provided array
        const promises = timeframes.map(timeframe => fetchDataWithRetry(client_tv,market, timeframe,indicator_id,id,certificate));

        // Await all promises and return results
        return await Promise.all(promises);
    } catch (error) {
        console.error(`Error fetching data for ${market} with timeframes ${timeframes}:`, error);
        throw error;
    }
}

async function fetchAllData(client_tv,market, timeframes,indicator_id,id,certificate) {
    let allProcessedData = {};

    for (let i = 0; i < timeframes.length; i += 3) {
        let remainingTimeframes = timeframes.slice(i, i + 3);

        // Fetch data for up to three timeframes
        const dataResults = await fetchDataForTimeframes(client_tv,market, remainingTimeframes,indicator_id,id,certificate);

        // Merge results into allProcessedData
        for (let j = 0; j < remainingTimeframes.length; j++) {
            allProcessedData[remainingTimeframes[j]] = dataResults[j];
        }
    }

    return allProcessedData;
}




// Integration with exportAllMarketDataWithMarketCap
async function calculatePositions(client_tv,client,markets,timeframes,indicator_id,id,certificate,dbname) {
    // ... other required imports and function definitions ...
    let out = {}
    try {
    
            for (let market of markets) {
                const allTimeframesData = await fetchAllData(client_tv,market, timeframes,indicator_id,id,certificate);
                // Process data as needed
            
            // Process and upload data to MongoDB
            const output = processData_mongoDbUpload(client,market, allTimeframesData, timeframes,dbname);
            //console.log("processData_mongoDbUpload", output)
            out = output;
        }
    
    } catch (error) {
        console.error('Error in exportAllMarketDataWithMarketCap:', error);
    }
    return out;
}







const maxRetries = 3; // Maximum number of retries
const timeoutInterval = 20000; // Time to wait for the function to complete, in milliseconds (1 minute)

let isCancelled = false; // Flag to indicate whether the operation should be considered cancelled

async function RetreveTV_Data_MongoDBpush(client_tv,client,markets,timeframes,indicator_id,id,certificate,dbname) {
    try {
        console.log('HTTP request received at /runTask');

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            console.log(`Attempt ${attempt}: Running calculatePositions`);
            isCancelled = false; // Reset the flag for each attempt

            const dataPromise = calculatePositions(client_tv,client,markets,timeframes,indicator_id,id,certificate,dbname).then(data => {
                if (isCancelled) return null; // Ignore the result if the operation is cancelled
                return data;
            });

            const isTimeout = await Promise.race([
                new Promise(resolve => setTimeout(() => {
                    isCancelled = true; // Set the flag to cancel the operation
                    resolve(true);
                }, timeoutInterval)),
                dataPromise.then(() => false)
            ]);

            if (!isTimeout) {
                const data = await dataPromise;
                if (data && Object.keys(data).length !== 0) {
                    console.log("HTTP Task Completed. Data:", data);
                    return; // Data retrieved successfully, exit function
                }
            } else {
                console.log(`Attempt ${attempt} timed out. Retrying...`);
            }
        }

        throw new Error('Failed to retrieve data after maximum attempts');
    } catch (error) {
        console.error('Error in HTTP task:', error);
        // Handle the error as needed
    }
};




module.exports = RetreveTV_Data_MongoDBpush;