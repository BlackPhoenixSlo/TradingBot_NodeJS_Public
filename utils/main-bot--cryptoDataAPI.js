const axios = require("axios");
const time = require("./main-bot--time");

const CRYPTOWATCH_PUBLIC_KEY = "ludb5n5x2/7FmxvJblSOOreozOFjNi+6MP+ev7Z0";
const cryptoDataAPI = {};

// Returns the current market cap for the specified coins
cryptoDataAPI.getMarketCap = async (coins) => {
    var marketCap = {};

    const result = await axios({
        method: "get",
        url: "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest",
        headers: {
            "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY
        },
        params: {
            symbol: coins.toString()
        }
    });
    const data = result.data.data;

    for (const coin in data) {
        marketCap[coin] = data[coin][0].quote.USD.market_cap;
    }

    return marketCap;
}

cryptoDataAPI.getCandlesticks = async (params) => {
    const result = await axios({
        method: "get",
        url: `https://data-api.binance.vision/api/v3/klines`,
        params: {
            symbol: params.symbol,
            interval: params.interval,
            startTime: params.startTime,
            endTime: params.endTime,
            limit: params.limit
        }
    }).catch(async (error) => {
        console.log(error);

        const status = error.response.status;

        if (status == 429 || status == 418) {
            const secondsToWait = error.response.headers["Retry-After"];

            if (status == 429) {
                console.log(`Reached API rate limits. Will have to wait ${secondsToWait} seconds in order to avoid ban`);
            } else {
                console.log(`Banned from API. Will have to wait ${secondsToWait} seconds before getting unbanned`);
            }

            await time.delay((secondsToWait + 1) * 1000);
        }
    });
    
    return result.data;
}

module.exports = cryptoDataAPI;