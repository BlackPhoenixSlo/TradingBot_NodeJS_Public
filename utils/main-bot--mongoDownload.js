

async function fetchNewestDataFromMongoDB(market, client,type_mybe_provisional) {
    const [exchange, marketName] = market.split(':');
    console.log(exchange);
    console.log(marketName);

    const collection = client.db('yourDatabaseName').collection(`${type_mybe_provisional}${marketName}`);
    const query = { exchange: exchange }; // Filter by exchange
    const sort = { id: -1 }; // Sort by 'id' in descending order to get the newest data
    const data = await collection.find(query).sort(sort).limit(1).toArray();
    return [data];
}

async function fetchSecondNewestDataFromMongoDB(market, client, type_mybe_provisional) {
    const [exchange, marketName] = market.split(':');
    console.log(exchange);
    console.log(marketName);

    const collection = client.db('yourDatabaseName').collection(`${type_mybe_provisional}${marketName}`);
    const query = { exchange: exchange }; // Filter by exchange
    const sort = { id: -1 }; // Sort by 'id' in descending order to get the newest data
    const data = await collection.find(query).sort(sort).limit(2).toArray();

    // Check if there are at least 2 documents
    if (data.length < 2) {
        console.error('Not enough data to fetch the second newest document.');
        return null;
    }

    return [data[1]]; // Return the second document
}

async function fetchDataFromMongoDB(market, client,type_mybe_provisional) {
    const [exchange, marketName] = market.split(':');
    console.log(exchange)
    console.log(marketName)

    const collection = client.db('yourDatabaseName').collection(`${type_mybe_provisional}${marketName}`);
    const query = { exchange: exchange }; // Filter by exchange
    const sort = { id: 1 }; // Sort by 'id' in descending order to get the newest data
    const data = await collection.find(query).sort(sort).toArray();
    return data;
}

module.exports = {fetchNewestDataFromMongoDB, fetchDataFromMongoDB, fetchSecondNewestDataFromMongoDB} ;