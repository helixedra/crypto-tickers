import { useState, useEffect } from "react";
import axios from "axios";
import Tiker from "./Tiker";

// Приклад масиву тікерів
const tickers = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "MINAUSDT", "WIFUSDT"];

// Функція для отримання ціни за тікером
// async function getPrice(ticker) {
//   try {
//     const response = await axios.get(
//       `https://api.binance.com/api/v3/ticker/price?symbol=${ticker}`
//     );
//     return response.data.price;
//   } catch (error) {
//     console.error(`Error fetching price for ${ticker}:`, error);
//     return null;
//   }
// }
// async function getTickerOpenPrice(symbol) {
//   try {
//     const response = await axios.get("https://api.binance.com/api/v3/klines", {
//       params: {
//         symbol: symbol,
//         interval: "1d",
//         limit: 1, // Тільки остання денна свічка
//       },
//     });

//     const kline = response.data[0];
//     const openPrice = kline[1]; // Ціна відкриття (2-й елемент масиву)

//     // console.log(`Ціна відкриття ${symbol} на початок дня: ${openPrice}`);
//     return openPrice;
//   } catch (error) {
//     console.error("Помилка отримання даних:", error);
//   }
// }

async function getPriceBySymbol(symbol) {
  try {
    // Отримати ціну відкриття (1d свічка)
    const klineResponse = await axios.get(
      "https://api.binance.com/api/v3/klines",
      {
        params: {
          symbol: symbol,
          interval: "1d",
          limit: 1,
        },
      }
    );
    const openPrice = parseFloat(klineResponse.data[0][1]); // Ціна відкриття

    // Отримати поточну ціну
    const tickerResponse = await axios.get(
      "https://api.binance.com/api/v3/ticker/price",
      {
        params: { symbol: symbol },
      }
    );
    const currentPrice = parseFloat(tickerResponse.data.price); // Поточна ціна

    // Розрахувати зміну в процентах
    const percentageChange = ((currentPrice - openPrice) / openPrice) * 100;

    // console.log(`Зміна ціни ${symbol}: ${percentageChange.toFixed(2)}%`);

    return {
      name: symbol,
      openPrice: openPrice.toFixed(2),
      currentPrice: currentPrice.toFixed(2),
      percentageChange: percentageChange.toFixed(2),
    };
  } catch (error) {
    console.error("Помилка отримання даних:", error);
  }
}

function App() {
  const [tickerData, setTickerData] = useState([]);

  // Використання useEffect для періодичного оновлення цін
  useEffect(() => {
    const fetchPrices = async () => {
      const results = await Promise.all(
        tickers.map(async (ticker) => {
          const price = await getPriceBySymbol(ticker);
          return price;
          // return price !== null
          //   ? { name: ticker, price, dayChangePercentage }
          //   : null;
        })
      );
      // Фільтруємо, щоб уникнути null значень
      setTickerData(results.filter((item) => item !== null));
    };

    // Запускаємо функцію кожні 5 секунд
    fetchPrices(); // Перший виклик одразу
    // console.log(fetchPrices());

    const interval = setInterval(fetchPrices, 5000);

    // Очищення інтервалу при демонтажі компонента
    return () => clearInterval(interval);
  }, []);

  const allTikers = tickerData.map((ticker) => (
    <Tiker {...ticker} key={ticker.name} />
  ));

  return <div className="tickers_container">{allTikers}</div>;
}

export default App;
