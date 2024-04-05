// import { RestClientV5 } from '../src/index';

//const { main123 } = require('./index-runfromdesktop2-update');

// or
const { RestClientV5 }= require('bybit-api');
 const alerts = require("./alerts-bybit-low");


// const key = "_replace_";
// const secret = "_replace_"; // midcaps
const key = "_replace_";
const secret = "_replace_"; // lowcaps
const leverage = '2.8';
const NofCoins=20
const lev = 1.2
const client = new RestClientV5({
  key: key,
  secret: secret,
});


async function fetchC_replace_entPrices(markets) {
    let prices = {};
    try {
        for (let market of markets) {
            // Extract the coin name from the market string
            let coin = market.split(':')[1].replace('.P', '');

            // Fetch the ticker for each coin
            const response = await client.getTickers({
                category: 'linear',
                symbol: `${coin}` // Assuming the format is always 'COINUSDT'
            });

            // Extract and store the last price
            if (response && response.result && response.result.list && response.result.list.length > 0) {
                let lastPrice = response.result.list[0].lastPrice;
                prices[coin] = parseFloat(lastPrice);
                console.log(`C_replace_ent ${coin} Price:`, lastPrice);
            }
        }
    } catch (error) {
        console.error('Error fetching c_replace_ent prices:', error);
        return {};
    }
    console.log(prices)
    return prices;
}

// Example usage



(async () => {
  try {
    /** Simple examples for private REST API calls with bybit's V5 REST APIs */
    // const response = await client.getPositionInfo({
    //   category: 'option',
    //   symbol: 'DOGEUSDT',
    // });

    // console.log('response:', response);

    // Trade USDT linear perps
    // const buyOrderResult = await client.submitOrder({
    //   category: 'linear',
    //   symbol: 'XRPUSDT',
    //   orderType: 'Limit',
    //   qty: '6',
    //   side: 'Buy',
    //   price:'0.4',
    //   orderIv: '6',
    //   timeInForce: 'GTC',
    //   mmp: false,
    //   reduceOnly: false,
    // });
    // console.log('buyOrderResult:', buyOrderResult);

    // const sellOrderResult = await client.submitOrder({
    //   category: 'linear',
    //   symbol: 'DOGEUSDT',
    //   orderType: 'Market',
    //   qty: '1',
    //   side: 'Sell',
    // });
    // console.log('sellOrderResult:', sellOrderResult);


    // const print = await client.getActiveOrders({"USDT"});
    // console.log('sellOrderResult:', print['result']);

  } catch (e) {
    console.error('request failed: ', e);
  }
})();

// async function fetchActiveOrders() {
//   try {
//       const response = await client.getActiveOrders({ 
//           symbol: "XRPUSDT",
//           category: "linear" // Replace with the appropriate category value
//       });
//       console.log('sellOrderResult:', response.result);
//   } catch (error) {
//       console.error('Error fetching active orders:', error);
//   }
// }

//fetchActiveOrders();

function convertPercentageStringToNumber(percentageString) {
    if (typeof percentageString !== 'string') {
      console.error('Expected a string input:', percentageString);
      return NaN; // Or handle this case as appropriate for your application
    }
    
    // Remove the '%' character and convert to a number
    return parseFloat(percentageString.replace('%', '')) / 100;
  }
  
  // Example usage
  const targetBtcAllocationString = "-10.00%";
  const targetBtcAllocationNumber = convertPercentageStringToNumber(targetBtcAllocationString);
  console.log(targetBtcAllocationNumber); // Outputs: -0.1
  

console.log(targetBtcAllocationNumber); // Outputs: -10.00

function adjustQuantity(coin, adjustment) {
  let decimalPlaces;

  switch (coin) {
      case "BNBUSDT":
          decimalPlaces = 2;
          break;
          case "INJUSDT":
          decimalPlaces = 1;
          case "UNIUSDT":
            decimalPlaces = 1;
            break;
          break;
      case "AAVEUSDT":
          decimalPlaces = 2;
          break;
          case "BCHUSDT":
          decimalPlaces = 2;
          break;
      case "ADAUSDT":
          decimalPlaces = 0;
          break;
      case "ATOMUSDT":
          decimalPlaces = 1;
          break;
          case "AVAXUSDT":
          decimalPlaces = 1;
          break;
          case "ICPUSDT":
          decimalPlaces = 1;
          break;
      case "DOTUSDT":
          decimalPlaces = 1;
          break;
      case "INJUSDT":
          decimalPlaces = 1;
          break;
      case "LINKUSDT":
          decimalPlaces = 1;
          break;
      case "LTCUSDT":
          decimalPlaces = 1;
          break;
          case "MATICUSDT":
          decimalPlaces = 0;
          break;
      case "NEARUSDT":
          decimalPlaces = 1;
          break;
      case "SOLUSDT":
          decimalPlaces = 1;
          break;
      case "TONUSDT":
          decimalPlaces = 1;
          break;
      case "TRXUSDT":
          decimalPlaces = 0;
          break;
      case "UNIUSDT":
          decimalPlaces = 1;
          break;
      case "XLMUSDT":
          decimalPlaces = 0;
          break;
          case "DOGEUSDT":
            decimalPlaces = 0;
            break;
            case "CFXUSDT":
            decimalPlaces = 0;
            break;
            case "ONDOUSDT":
            decimalPlaces = 0;
            break;
            case "ROSEUSDT":
            decimalPlaces = 0;
            break;
      case "XRPUSDT":
          decimalPlaces = 0;
          break;
      default:
          decimalPlaces = 1; // Default case
  }

  const trimmed = Math.abs(adjustment).toFixed(decimalPlaces);
  console.log(coin, adjustment,trimmed)
  return trimmed;
}


async function fetchActiveOrders(markets, allocation) {
  let changes = {}
    try {
      console.log('start fetchmarket orders:', allocation);


      // const cancleorders = await client.batchCancelOrders({ accountType: "UNIFIED" ,category: "linear" });
      // console.log('Response:', cancleorders.result);


      const response = await client.getWalletBalance({ accountType: "UNIFIED" });
      console.log('Response:', response.result);
  
      const totalEquity = parseFloat(response.result.list[0].totalEquity) * lev;
      let newJson = {
        "total_equity": totalEquity
      };
      let displayTPIValues = [{ displayName: 'Bybit total Equity', score: totalEquity / lev }];
  

      const coinPrices = await fetchC_replace_entPrices(markets)

      console.log("coin prices",coinPrices)

      for (let market of markets) {
        console.log('market:', market);

        let coin = market.split(':')[1]
        let coin_bybit = market.split(':')[1].replace('.P', '');

        console.log('coin:', coin);
        console.log('coin_bybit:', coin_bybit);


        const responseCoin = await client.getPositionInfo({
          category: 'linear',
          symbol: coin_bybit,
        });
  
        if (responseCoin && responseCoin.result && responseCoin.result.list && responseCoin.result.list.length > 0) {
          const coinDetails = responseCoin.result.list[0];
          console.log('Response details:', coinDetails);
  
          let coinEquity = parseFloat(coinDetails["size"]) || 0;
          let coinUsdValue = parseFloat(coinDetails["positionValue"]) || 0;
          let coinSide = coinDetails.side || 'Buy';
          let coinPrice = parseFloat(coinPrices[coin_bybit]) || 0;
		console.log('coin:', coin);
console.log('coinEquity :', coinEquity );
console.log('coinUsdValue :',coinUsdValue  );
console.log('coinSide :', coinSide );
console.log('coinPrice :',coinPrice  );

          
  
          if (coinSide === 'Sell') {
            coinUsdValue *= -1;
            coinEquity *= -1;
          }
  
          let coinPercentageOfTotalEquity = 0;
          if (totalEquity > 0) {
            coinPercentageOfTotalEquity = (coinUsdValue / totalEquity) * 100;
          }
  console.log('coinPercentageOfTotalEquity  :',coinPercentageOfTotalEquity   );
          newJson[`${coin}_equity`] = coinEquity;
          newJson[`${coin}_$equity`] = coinUsdValue;
          newJson[`${coin}_%of_totalEquity`] = coinPercentageOfTotalEquity;
  
          
          const targetCoinAllocation = allocation[coin]; // assuming main123 can handle different coins
          const targetCoinUsdValue = totalEquity * targetCoinAllocation;
          console.log('soinprice', coinPrice)
          const coinToAdjust = (targetCoinUsdValue - coinUsdValue) / coinPrice;
  
          console.log(`target${coin}UsdValue`, targetCoinUsdValue);
          console.log(`${coin}ToAdjust`, coinToAdjust);
console.log(`${coin} ToAdjust in $`,Math.abs(targetCoinUsdValue - coinUsdValue) );
console.log(`minToAdjust in $`,  totalEquity /NofCoins/2);
  
          if (Math.abs(targetCoinUsdValue - coinUsdValue) >  totalEquity /NofCoins/2) {
            let orderType, qty, price;
            changes[coin]=targetCoinAllocation;

            
      
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
  
      alerts.discordTPIAlert({ displayTPIValues })
        .then(() => console.log('Alert sent successfully.'))
        .catch(error => console.error('Error sending alert:', error));
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  // Example usage
  //fetchActiveOrders();
  
//fetchActiveOrders1()
module.exports = { fetchActiveOrders };


