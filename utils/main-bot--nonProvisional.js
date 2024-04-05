

require('punycode/')



const {insertToDatabase} = require('./main-bot--mongoUpload');












async function makeNonprovisionaDailySignal(client,markets,timeframes,dbName) {
    //const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        //await client.connect();
        // console.log("Connected correctly to the server");
        const db = client.db(dbName);

        


        for (const market of markets) {
            await updateNoProvisionalSummary(client,db, market, timeframes,dbName);
        }
    } catch (err) {
        console.log(err.stack);
    }

    // if (client) {
    //     await client.close();
    // }
}

async function updateNoProvisionalSummary(client,db, market, timeframes,dbname) {
    const coin = market.split(":")[1]


    const summaryTableName = `no_provisional_summary_${coin}`;

    // Check if summary table exists, if not create it
    if (!(await db.listCollections({ name: summaryTableName }).hasNext())) {
        await db.createCollection(summaryTableName);
    }

    const lowestTimeframe = timeframes[0];

    // Fetch the latest data for the lowest timeframe
    const provisionalDataLowest = await db.collection(`provisional_${lowestTimeframe}`).findOne({ market: coin }, { sort: { $natural: -1 } });
    const nonProvisionalDataLowest = await db.collection(`no_provisional_${lowestTimeframe}`).findOne({ market: coin }, { sort: { $natural: -1 } });

    const latestDataLowest = nonProvisionalDataLowest || provisionalDataLowest;
    if (!latestDataLowest) {
        console.log(`No data found for market ${market} in lowest timeframe ${lowestTimeframe}`);
        return;
    }

    let summaryData = {
        'id': latestDataLowest.unix,
        'id_time' : new Date(latestDataLowest.unix * 1000).toLocaleString(),
        'market': coin,
        'exchange': latestDataLowest.exchange,
        'closeprice': latestDataLowest.closeprice

    };

    for (const timeframe of timeframes) {
        let nonProvisionalData = await db.collection(`no_provisional_${timeframe}`).findOne({ market: coin }, { sort: { $natural: -1 } });

        // If non-provisional data does not exist, pull from database_for_{timeframe} and create it
        if (!nonProvisionalData) {
            const latestDatabaseData = await db.collection(`database_for_${timeframe}`).findOne({ market: coin }, { sort: { $natural: -1 } });
            // console.log(latestDatabaseData);
            nonProvisionalData = latestDatabaseData;
            console.log("used provisional as non provisional doesnt exist yet");

            
        }
        

        // Check if nonProvisionalData is available after the above step
        // console.log(nonProvisionalData);

        if (nonProvisionalData) {
            summaryData[`position_${timeframe}`] = nonProvisionalData.position;
        }
    }

    // Update the summary table with the latest data
    insertToDatabase(client,summaryData,dbname, summaryTableName)
    

    // console.log(`Updated summary data for market: ${market}`);
}














// The fetchNewestDataFromMongoDB function remains the same

// The calculateWeightedAverage function remains the same
module.exports = makeNonprovisionaDailySignal ;