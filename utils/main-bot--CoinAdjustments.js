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
          case "BTCUSDT":
            decimalPlaces = 3;
            break;
            case "ETHUSDT":
                decimalPlaces = 3;
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
  console.log("adjustQuantity",coin, adjustment,trimmed)
  return trimmed;
}

module.exports = { adjustQuantity };


