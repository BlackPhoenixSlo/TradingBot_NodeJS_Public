const correlations = require('./main-bot--correlations');


async function calculateCorrelationsV2(symbols, dayPeriods) {
    let correlation = 0;
    try {
             correlation = await calculateCorrelations(symbols[0], symbols[1], dayPeriods);
        
    } catch (error) {
        console.error('Error calculating correlations:', error);
    }
    return correlation;
}

async function calculateCorrelations(a, b, dayPeriods) {
    try {
        const correlationPromises = dayPeriods.map(period => 
            correlations.getAverageCorrelationBetweenCoins(a, b, [period])
                .then(correlation => {
                    console.log(`Average correlation between ${a} and ${b} over the last ${period} days: ${correlation}`);
                    return correlation;
                })
        );
        const correlationsArray = await Promise.all(correlationPromises);
        const corr_sum = correlationsArray.reduce((sum, corr) => sum + corr, 0) / dayPeriods.length;
        console.log(`Total Average Correlation: ${corr_sum}`);
        return corr_sum;
    } catch (error) {
        console.error('Error calculating correlations:', error);
        return 0; // or handle the error as needed
    }
}
// calculateCorrelations();

module.exports = calculateCorrelationsV2;