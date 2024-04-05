require('punycode/')
const calculateCorrelationsV2 = require('./main-bot--ethbtccorr');

//const dbname="yourDatabaseName"



const axios = require('axios');

async function getMarketCap(apiKey, url_coinbase, symbolsArray) {
    const url = url_coinbase;
    try {
        const symbols = symbolsArray.join(',');
        const response = await axios.get(url, {
            headers: {
                'X-CMC_PRO_API_KEY': apiKey
            },
            params: {
                symbol: symbols
            }
        });

        let marketCapData = {};
        for (const symbol of symbolsArray) {
            marketCapData[symbol] = response.data.data[symbol].quote.USD.market_cap;
        }

        return marketCapData;
    } catch (error) {
        console.error('Error fetching data:', error);
        // Return null for each symbol if there is an error
        return symbolsArray.reduce((acc, symbol) => ({ ...acc, [symbol]: null }), {});
    }
}


async function fetchAllMarketCapAndCorrelationData(client, dbname, apiKey, url_coinbase, cryptoSymbols, periods) {
    try {
        if (!Array.isArray(cryptoSymbols) || !Array.isArray(periods)) {
            throw new Error("cryptoSymbols and periods must be arrays");
        }

        let allProcessedData = {};
        const marketCapData = await getMarketCap(apiKey, url_coinbase, cryptoSymbols);
        allProcessedData['time'] = new Date().toLocaleString();

        // Store market cap data for each symbol
        for (const symbol of cryptoSymbols) {
            allProcessedData[`${symbol}_MarketCap`] = marketCapData[symbol];
        }

        // Calculate and store correlations for each pair of symbols and each period
        let correlationPromises = [];
        for (let i = 0; i < cryptoSymbols.length; i++) {
            for (let j = 0; j < cryptoSymbols.length; j++) {
                if (i != j) {
                    const pair = `${cryptoSymbols[i]}_${cryptoSymbols[j]}`;
                    correlationPromises.push(
                        calculateCorrelationsV2([cryptoSymbols[i], cryptoSymbols[j]], periods)
                            .then(correlation => {
                                allProcessedData[`${pair}_${periods}d_Correlation`] = correlation;
                            })
                    );
                }
            }
        }
        await Promise.all(correlationPromises);

        // Prepare data for MongoDB
        const database = client.db(dbname);
        const collection = database.collection("MarketCap&corr");
        await collection.insertOne(allProcessedData);

        console.log('Data from all markets exported successfully to MongoDB.');

        return allProcessedData;
    } catch (error) {
        console.error('Error fetching and storing market cap and correlation data:', error);
        throw error;
    }
}





module.exports = fetchAllMarketCapAndCorrelationData;