

require('punycode/')



const {fetchNewestDataFromMongoDB , fetchSecondNewestDataFromMongoDB} = require('./main-bot--mongoDownload');






function calculateWeightedAverage(data, timeframes, weights) {
    let weightedSum = 0;
    let totalWeight = 0;
    
    console.log('Applying weights:', weights);

    timeframes.forEach((timeframe, index) => {
        const positionKey = `position_${timeframe}`;
        const weight = parseFloat(weights[index]);

        if (typeof data[positionKey] === 'number' && !isNaN(weight)) {
           // console.log(`Timeframe: ${timeframe}, Position: ${data[positionKey]}, Weight: ${weight}`);
            weightedSum += data[positionKey] * weight;
            totalWeight += weight;
        }
    });

    console.log(`Weighted Sum: ${weightedSum}, Total Weight: ${totalWeight}`);
    return totalWeight > 0 ? weightedSum / totalWeight : null;
}



async function weightedaverage(market, weights, client, type_mybe_provisional, timeframes, daysBack = 0) {
    try {
        console.log('Connected successfully to MongoDB');

        let marketData;
        if (daysBack === 0) {
            [marketData] = await fetchNewestDataFromMongoDB(market, client, type_mybe_provisional);
            // console.log(marketData);

        } else {
            marketData = await fetchSecondNewestDataFromMongoDB(market, client, type_mybe_provisional, daysBack);
        }

        if (!marketData) {
            console.error('No market data found');
            return null;
        }

        const weightedAverage = calculateWeightedAverage(marketData[0], timeframes, weights);
        console.log(`Weighted Average: ${weightedAverage}`);
        return weightedAverage;

    } catch (error) {
        console.error('Error in weightedaverage:', error);
        return null;
    }
}


async function MultipleWeightedAverage(market, weightsSets, client, type_mybe_provisional, timeframes,daytime) {
    try {
        console.log('Connected successfully to MongoDB');
        let weightedAverages = [];

        for (let weights of weightsSets) {
            const weightedAvg = await weightedaverage3(client, market, weights, type_mybe_provisional, timeframes,daytime);
            // console.log(`Weighted Average for set: ${weights} = ${weightedAvg}`);
            if (weightedAvg !== null) {
                weightedAverages.push(weightedAvg);
            }
        }

      //  console.log(`All Weighted Averages: ${weightedAverages}`);
        const overallAverage = weightedAverages.length > 0
            ? weightedAverages.reduce((a, b) => a + b, 0) / weightedAverages.length
            : null;

        console.log(`Overall Weighted Average: ${overallAverage}`);
        return overallAverage;
    } catch (error) {
        console.error('Error in MultipleWeightedAverage:', error);
        return null;
    }
}

async function weightedaverage3(client, market, weights, type_mybe_provisional, timeframes, daysBack = 1) {
    let marketData;
    if (daysBack === 0) {
        marketData = await fetchNewestDataFromMongoDB(market, client, type_mybe_provisional);
        // console.log(marketData);
        marketData = marketData[0]
        // console.log(marketData);


    } else {
        marketData = await fetchSecondNewestDataFromMongoDB(market, client, type_mybe_provisional);
       /// console.log(marketData);
    }


    console.log(`Data used in weightedaverage3 for ${market}:`, marketData);

    if (marketData && marketData.length > 0) {
        const datavalue = await calculateWeightedAverage(marketData[0], timeframes, weights);
        // console.log('datavalue',datavalue);

        return datavalue
    }
    

}

// The fetchNewestDataFromMongoDB function remains the same

// The calculateWeightedAverage function remains the same
module.exports = { weightedaverage, MultipleWeightedAverage} ;