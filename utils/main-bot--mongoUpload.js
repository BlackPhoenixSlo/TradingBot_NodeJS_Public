


function getIndexFromMarket(market) {
   
    const parts = market.split(':');
    if (parts.length > 1) {
        return parts[0];
    } else {
        console.error("Market string format is incorrect.");
        return null;
    }


}

async function processData_mongoDbUpload(client,market, dataArrays, timeframes,dbname) {
    let marketName = market.split(':')[1];
    let exchange = getIndexFromMarket(market); // Ensure this function exists and returns the correct value
    // console.log(market);
    // console.log(exchange);
    // // console.log(dataArrays);
    // console.log(timeframes);
    // console.log(marketName);




    let summaryEntry = {
        'id': null,
        'id_time': null,
        'exchange': exchange,
        'market': marketName
    };
    if (!dataArrays || typeof dataArrays !== 'object') {
        console.error("Invalid dataArrays input for market:", market);
        return [];
    }

    // Assuming '1D' is the lowest timeframe you are interested in
    const lowestTimeframeKey = timeframes[0];
    if (!dataArrays.hasOwnProperty(lowestTimeframeKey) || !Array.isArray(dataArrays[lowestTimeframeKey]) || dataArrays[lowestTimeframeKey].length === 0) {
        console.error("No valid data found for market:", market, "in timeframe:", lowestTimeframeKey);
        return [];
    }

    let lowestTimeframeData = dataArrays[lowestTimeframeKey][0];
    let baseTime = lowestTimeframeData.$time;
    // console.log("lowestTimeframeData:", lowestTimeframeData);
    // console.log("baseTime:", baseTime);
    
    if (!baseTime) {
        console.error("No valid base timeframe found for market:", market);
        return [];
    }

    summaryEntry['id'] = baseTime;
    summaryEntry['id_time'] = new Date(baseTime * 1000).toLocaleString();
    summaryEntry[`closeprice`] = lowestTimeframeData.ClosePrice;


    console.log(`Processing market: ${market}, Base Time: ${baseTime}`);

    for (let index = 0; index < timeframes.length; index++) {
        const dataArray = dataArrays[timeframes[index]];

        const timeframe = timeframes[index];
        const databaseName = `database_for_${timeframe}`;
        const databaseName_noProvisional = `no_provisional_${timeframe}`;

        let dataPoint = dataArray[0];
        // console.log(dataPoint);

        let entry = {
            'id': baseTime,
            'id_time': new Date(baseTime * 1000).toLocaleString(),
            'exchange': exchange,
            'market': marketName,
            'timeframe': timeframe,
            'position': dataPoint.position,
            'unix': dataPoint.$time,
            'time': new Date(dataPoint.$time * 1000).toLocaleString(),
            'closeprice': dataPoint.ClosePrice
        };

        // Insert each data point into the respective database for its timeframe
        await insertToDatabase(client,entry,dbname, databaseName);

        if (baseTime == dataPoint.$time) {
            await insertToDatabase(client,entry,dbname, databaseName_noProvisional);
        }

        // Add positions and close price to the summary entry
        summaryEntry[`position_${timeframe}`] = dataPoint.position;
    }

    const summaryDatabaseName = `summary_data_for_${marketName}`;
    await insertToDatabase(client,summaryEntry,dbname, summaryDatabaseName);

    console.log(`Processed data for market ${market}`);
    return summaryEntry;

}


// async function insertToDatabase(data, databaseName) {
//     // Implement the logic to insert data into the specified database.
//     // This is a placeholder function - you need to replace it with actual database insertion logic.
//     // Example:
//     const collection = client.db(dbname).collection(databaseName);
//     await collection.insertOne(data);
// }

async function insertToDatabase(client,data,dbname, databaseName) {
    try {
        const collection = client.db(dbname).collection(databaseName);

        // Create a unique compound index on exchange, market, and time
        await collection.createIndex({ exchange: 1, market: 1, id: 1 }, { unique: true });

        // Upsert data based on exchange, market, and time
        const query = { 
            exchange: data.exchange, 
            market: data.market, 
            id: data.id 
        };
        const update = { $setOnInsert: data };
        const options = { upsert: true };

        const result = await collection.updateOne(query, update, options);

        if (result.upsertedCount > 0) {
            console.log('Data inserted successfully');
        } else {
            console.log('Data already exists');
        }
    } catch (error) {
        console.error('Error in inserting data:', error);
    }
}





module.exports = {processData_mongoDbUpload, insertToDatabase} ;
