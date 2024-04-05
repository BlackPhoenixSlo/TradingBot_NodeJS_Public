const priceSeries = {};

// Extracts and returns close price from a series of candlesticks
priceSeries.getClosePrices = (candlesticks) => {
    return candlesticks.map((candlestick) => {
        return Number(candlestick[4]);
    });
}

// Detrends a series of prices
priceSeries.detrend = (prices) => {
    const detrendedData = []
    var previousPrice = null;

    prices.forEach(price => {
        if (previousPrice !== null) {
            detrendedData.push(1 + ((price - previousPrice) / previousPrice));
        }

        previousPrice = price
    });

    return detrendedData;
}

module.exports = priceSeries;