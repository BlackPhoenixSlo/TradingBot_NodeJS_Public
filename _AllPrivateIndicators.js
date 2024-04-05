const TradingView = require('@mathieuc/tradingview');

/**
 * This example creates a chart with all user's private indicators
 */

process.argv[2] = "_replace_" //sessionid
process.argv[3] = "v2:_replace_=" //signature
if (!process.argv[2]) throw Error('Please specify your \'sessionid\' cookie');
if (!process.argv[3]) throw Error('Please specify your \'signature\' cookie');

const client = new TradingView.Client({
  token: process.argv[2],
  signature: process.argv[3],
});

const chart = new client.Session.Chart();
chart.setMarket('BINANCE:BTCEUR', {
  timeframe: 'D',
});

TradingView.getPrivateIndicators(process.argv[2]).then((indicList) => {
  indicList.forEach(async (indic) => {

    try {
      const privateIndic = await indic.get();
      console.log('Loading indicator', indic.name, '...');
      const indicator = new chart.Study(privateIndic);
      indicator.onReady(() => {
        console.log('Indicator', indic.name, 'loaded !');
      console.log('Indicator', indic.id, 'id !');
      console.log('Indicator', indic.version, 'version !');
      console.log('Indicator', indic.type, 'type !');
      console.log('Indicator', indic.source, 'source !');
      });
    }
    catch (error) {
      console.error('Error:', error.message);
    }
   
  
    // indicator.onUpdate(() => {
    //   console.log('Plot values', indicator.periods);
    //   console.log('Strategy report', indicator.strategyReport);
    // });
  });
});
