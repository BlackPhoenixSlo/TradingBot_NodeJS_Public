const cryptoDataAPI = require("./main-bot--cryptoDataAPI");
const priceSeries = require("./main-bot--priceSeries");
const time = require("./main-bot--time");

const correlations = {};

// Returns the correlation coefficient between 2 number arrays
// Source: https://gist.github.com/matt-west/6500993?permalink_comment_id=3718526#gistcomment-3718526
correlations.pearsonCorrelationCoefficient = (x, y) => {
    const promedio = l => l.reduce((s, a) => s + a, 0) / l.length
    const calc = (v, prom) => Math.sqrt(v.reduce((s, a) => (s + a * a), 0) - n * prom * prom)
    let n = x.length
    let nn = 0
    for (let i = 0; i < n; i++, nn++) {
        if ((!x[i] && x[i] !== 0) || (!y[i] && y[i] !== 0)) {
        nn--
        continue
        }
        x[nn] = x[i]
        y[nn] = y[i]
    }
    if (n !== nn) {
        x = x.splice(0, nn)
        y = y.splice(0, nn)
        n = nn
    }
    const prom_x = promedio(x), prom_y = promedio(y)
    return (x
        .map((e, i) => ({ x: e, y: y[i] }))
        .reduce((v, a) => v + a.x * a.y, 0) - n * prom_x * prom_y
    ) / (calc(x, prom_x) * calc(y, prom_y))
}

correlations.getAverageCorrelationBetweenCoins = async (coin1, coin2, dayPeriods) => {
    let getHourlyCandlesticks = false;
    let getDailyCandlesticks = false;

    dayPeriods.forEach((period) => {
        if (period > 30) {
            getDailyCandlesticks = true;
        } else {
            getHourlyCandlesticks = true;
        }
    })

    //console.log("Get daily candlesticks", getDailyCandlesticks);
    //console.log("Get hourly candlesticks", getHourlyCandlesticks);

    let hourlyCandlesticks1 = null;
    let hourlyCandlesticks2 = null;

    if (getHourlyCandlesticks) {
        //console.log(getDailyCandlesticks == false ? Math.max(...dayPeriods) : 30);
        const startTime = time.getTimeDaysAgo(getDailyCandlesticks == false ? Math.max(...dayPeriods) : 30);

        hourlyCandlesticks1 = await cryptoDataAPI.getCandlesticks({
            symbol: `${coin1}USDT`,
            interval: "1h",
            startTime: startTime,
            limit: 1000
        });
        hourlyCandlesticks2 = await cryptoDataAPI.getCandlesticks({
            symbol: `${coin2}USDT`,
            interval: "1h",
            startTime: startTime,
            limit: 1000
        });
    }

    let dailyCandlesticks1 = null;
    let dailyCandlesticks2 = null;

    if (getDailyCandlesticks) {
        const startTime = time.getTimeDaysAgo(Math.max(...dayPeriods));

        dailyCandlesticks1 = await cryptoDataAPI.getCandlesticks({
            symbol: `${coin1}USDT`,
            interval: "1d",
            startTime: startTime,
            limit: 1000
        });
        dailyCandlesticks2 = await cryptoDataAPI.getCandlesticks({
            symbol: `${coin2}USDT`,
            interval: "1d",
            startTime: startTime,
            limit: 1000
        });
    }

    var correlationSum = 0;

    dayPeriods.forEach((period) => {
        var periodCandlesticks1 = null;
        var periodCandlesticks2 = null;

        if (period > 30) {
            //console.log("Using daily candlesticks for", period)
            periodCandlesticks1 = dailyCandlesticks1;
            periodCandlesticks2 = dailyCandlesticks2;
        } else {
            //console.log("Using hourly candlesticks for", period)
            periodCandlesticks1 = hourlyCandlesticks1;
            periodCandlesticks2 = hourlyCandlesticks2;
        }

        if (period != Math.max(...dayPeriods)) {
            const timestamp = time.getTimeDaysAgo(period);
            var indexOfCandlestick = 0;

            for (var i = 0; i < periodCandlesticks1.length; i++) {
                if (periodCandlesticks1[i][0] >= (timestamp - (7200 * 1000))) {
                    indexOfCandlestick = i;
                    break;
                };
            };

            periodCandlesticks1 = periodCandlesticks1.slice(indexOfCandlestick);
            periodCandlesticks2 = periodCandlesticks2.splice(indexOfCandlestick);
        };

        //console.log(`Number of candlesticks for ${period} days: ${periodCandlesticks1.length}`);

        const coin1Prices = priceSeries.getClosePrices(periodCandlesticks1);
        const coin2Prices = priceSeries.getClosePrices(periodCandlesticks2);
        const detrendedCoin1Prices = priceSeries.detrend(coin1Prices);
        const detrendedCoin2Prices = priceSeries.detrend(coin2Prices);

        correlationSum += correlations.pearsonCorrelationCoefficient(detrendedCoin1Prices, detrendedCoin2Prices);
    });

    return correlationSum / dayPeriods.length;
}

module.exports = correlations;