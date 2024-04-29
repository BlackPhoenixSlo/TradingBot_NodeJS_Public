// import { RestClientV5 } from '../src/index';

//const { main123 } = require('./index-runfromdesktop2-update');

// or

const { adjustQuantity }= require('./main-bot--CoinAdjustments');

 const {alerts, MakeAlertsBinance} = require("./main-bot--alerts");










async function fetchCurrentPrices(client,markets) {
    let prices = {};
    console.log(markets);

    try {
        for (let market of markets) {
            // Extract the coin name from the market string
            console.log(market);

            let coin = market.split(':')[1].replace('.P', '');
            console.log(coin);


            // Fetch the ticker for each coin
            const response = await client.getTickers({
                category: 'linear',
                symbol: `${coin}` // Assuming the format is always 'COINUSDT'
            });

            // Extract and store the last price
            if (response && response.result && response.result.list && response.result.list.length > 0) {
                let lastPrice = response.result.list[0].lastPrice;
                prices[coin] = parseFloat(lastPrice);
                console.log(`Current ${coin} Price:`, lastPrice);
            }
        }
    } catch (error) {
        console.error('Error fetching current prices:', error);
        return {};
    }
    //console.log(prices)
    return prices;
}








async function fetchActiveOrders(client,markets, allocation,webhookUrl,leverage = '2.8',NofCoins=20,lev=1.2) {
    let changes = {}
    try {
        console.log('start fetchmarket orders:', allocation);

        const response = await client.getWalletBalance({ accountType: "UNIFIED" });
        console.log('Wallet Balance Response:', response.result);

        const totalEquity = parseFloat(response.result.list[0].totalEquity) * lev;
        console.log('Total Equity:', totalEquity);

        let displayTPIValues = [{ displayName: 'Bybit total Equity', score: totalEquity / lev }];

        const coinPrices = await fetchCurrentPrices(client,markets);
        console.log("Coin prices fetched:", coinPrices);

        for (let market of markets) {
            console.log('Processing market:', market);

            let coin = market.split(':')[1];
            let coin_bybit = market.split(':')[1].replace('.P', '');
            let allocationKey = coin_bybit.replace('.P', ''); // Removes the '.P' if present
        
           // console.log('coin:', coin);
           // console.log('coin_bybit:', coin_bybit);

            const responseCoin = await client.getPositionInfo({
                category: 'linear',
                symbol: coin_bybit,
            });

           // console.log(`Response for ${coin}:`, responseCoin.result);
            if (responseCoin && responseCoin.result && responseCoin.result.list && responseCoin.result.list.length > 0) {
                const coinDetails = responseCoin.result.list[0];
                console.log(`${coin} details:`, coinDetails);

                let coinEquity = parseFloat(coinDetails["size"]) || 0;
                let coinUsdValue = parseFloat(coinDetails["positionValue"]) || 0;
                let coinSide = coinDetails.side || 'Buy';
                let coinPrice = parseFloat(coinPrices[coin_bybit]) || 0;

                console.log(`${coin} Equity:`, coinEquity);
                console.log(`${coin} USD Value:`, coinUsdValue);
                console.log(`${coin} Side:`, coinSide);
                console.log(`${coin} Price:`, coinPrice);

                if (coinSide === 'Sell') {
                    coinUsdValue *= -1;
                    coinEquity *= -1;
                }

                let coinPercentageOfTotalEquity = (coinUsdValue / totalEquity) * 100;
                console.log(`${coin} Percentage of Total Equity:`, coinPercentageOfTotalEquity);

            const targetCoinAllocation = allocation[allocationKey];
                const targetCoinUsdValue = totalEquity * targetCoinAllocation;

                console.log(`${coin} Target Allocation:`, targetCoinAllocation);
                console.log(`${coin} Target USD Value:`, targetCoinUsdValue);

                const coinToAdjust = (targetCoinUsdValue - coinUsdValue) / coinPrice;
                console.log(`${coin} To Adjust:`, coinToAdjust);

                console.log(`${coin} Adjustment in USD:`, Math.abs(targetCoinUsdValue - coinUsdValue));
                console.log(`Minimum To Adjust in USD:`, totalEquity / NofCoins / 3.1415926);


          if (Math.abs(targetCoinUsdValue - coinUsdValue) >  totalEquity /NofCoins/3.1415926) {
            let orderType, qty, price;
            changes[coin]=targetCoinAllocation;

            

            if (targetCoinAllocation === undefined) {
                console.error(`No allocation defined for ${allocationKey}`);
                continue; // Skip further processing for this coin
              }

              if (changes[coin] !== undefined) {
                  let scoreValue = parseFloat(targetCoinAllocation.toFixed(2));
                  displayTPIValues.push({
                      displayName: `${coin} % allocation`,
                      score: scoreValue 
                  });
              }
          
          
            if (coinToAdjust === -Infinity) {
              // Sell on market
              orderType = 'Market';
              qty = '1'; // Assuming you want to sell 1 unit
              price = undefined; // Price is not needed for market orders
            } else if (coinToAdjust === Infinity) {
              // Buy on market
              orderType = 'Market';
              qty = '1'; // Assuming you want to buy 1 unit
              price = undefined; // Price is not needed for market orders
            } else {
              // Regular limit order
              orderType = 'Limit';
              qty = adjustQuantity(coin_bybit,coinToAdjust)
            const prise_int = coinToAdjust > 0 ? coinPrice*0.9999 : coinPrice * 1.0001;
              price = prise_int .toString()
            }

            console.log(`${coin} price to buy / sell at `,  price) ;
            const coinOrderResult = await client.submitOrder({
              category: 'linear',
              symbol: coin_bybit,
              orderType: orderType,
              leverage: leverage,
              qty: qty,
              side: coinToAdjust > 0 ? 'Buy' : 'Sell',
              price: price,
              // Other necessary parameters...
            });
            console.log(`${coin} Order Result:`, coinOrderResult);
          }
          
        }
      }
  


      //console.log("Display TPI Values:", displayTPIValues);
      // MakeAlertsBinance(displayTPIValues, webhookUrl);
      

    } catch (error) {
      console.error('Error:', error);
    }
  }
  

  async function DisplayBinanceData(client,webhookUrl,lev= 1.2) {
    try {

        const response = await client.getWalletBalance({ accountType: "UNIFIED" });
        console.log('Wallet Balance Response:', response.result);

        const totalEquity = parseFloat(response.result.list[0].totalEquity) * lev;
        console.log('Total Equity:', totalEquity);

        let displayTPIValues = [{ displayName: 'Bybit total Equity', score: totalEquity / lev }];


      console.log("Display TPI Values:", displayTPIValues);
      MakeAlertsBinance(displayTPIValues, webhookUrl);
      

    } catch (error) {
      console.error('Error:', error);
    }
  }


  module.exports = { fetchActiveOrders ,DisplayBinanceData };




  // Example usage


//   DisplayBinanceData(webhookUrl);


// const markets = ['BYBIT:MATICUSDT.P', 'BYBIT:ENJUSDT.P']; // Add more markets as needed
// const allocations = {
//     'MATICUSDT': 0.5, // 50% allocation
//     'ENJUSDT': 0.5  // 50% allocation
// };

// fetchActiveOrders(markets, allocations).then(() => {
//     console.log('Active orders processed.');
// }).catch(error => {
//     console.error('Error processing active orders:', error);
// });

