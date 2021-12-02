import { useState } from "react";
import { getUnixTimestampFromDate } from "./services/dateConverters";
import SearchForm from "./components/SearchForm";
import LongestBearishTrend from "./components/LongestBearishTrend";
import HighestTradingVolume from "./components/HighestTradingVolume";
import HighestProfit from "./components/HighestProfit";
import Chart from "./components/Chart";
import './App.css';
const App = () => {
  const [prices, setPrices] = useState([]);
  const [totalVolumes, setTotalVolumes] = useState([]);

  /* API call functions */
  const fetchMarketData = async (fromDate, toDate) => {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${getUnixTimestampFromDate(
        fromDate
      )}&to=${getUnixTimestampFromDate(toDate)}`
    );

    const data = await res.json();
    return data;
  };

  const getMarketData = async (fromDate, toDate) => {
    let data = await fetchMarketData(fromDate, toDate);

    console.log("data returned: ", data);
    if (data.prices && data.prices.length) {
      setPrices(getDataClosestToMidnight(data.prices));
    }

    if (data.total_volumes && data.total_volumes.length) {
      setTotalVolumes(getDataClosestToMidnight(data.total_volumes));
    }
  };

  /* data transformation functions */
  // simple solution for getting daily data
  // need to filter for the first data point of a given day - does not consider values from the previous day, even if the timestamp is closer to midnight
  const getFirstDataPointOfTheDay = (dataset) => {
    const firstDataPointsOfTheDay = [];
    const dayTracker = {};

    dataset.forEach((data) => {
      const timestamp = data[0];

      // get utc midnight for each timestamp
      const utcDate = new Date(timestamp);
      const utcMidnight = Date.UTC(
        utcDate.getUTCFullYear(),
        utcDate.getUTCMonth(),
        utcDate.getUTCDate()
      );

      if (!dayTracker[utcMidnight]) {
        firstDataPointsOfTheDay.push(data);
        dayTracker[utcMidnight] = true;
      }
    });

    return firstDataPointsOfTheDay;
  };

  // more robust solution
  // daily value is that of closest to the midnight even if it's from the previous day
  const getDataClosestToMidnight = (dataset) => {
    // get available utc midnight timestamps
    const utcTimestamps = [];
    const utcTimestampTracker = {};
    const closestTimestampValueMap = {};

    dataset.forEach((data) => {
      const timestamp = data[0];

      // get utc midnight for each timestamp
      const utcDate = new Date(timestamp);
      const utcMidnight = Date.UTC(
        utcDate.getUTCFullYear(),
        utcDate.getUTCMonth(),
        utcDate.getUTCDate()
      );

      // update if closer to midnight data found
      if (
        !closestTimestampValueMap[utcMidnight] ||
        Math.abs(utcMidnight - timestamp) <
          Math.abs(utcMidnight - closestTimestampValueMap[utcMidnight][0])
      ) {
        closestTimestampValueMap[utcMidnight] = data;
      }

      // midnight timestamps will be the new datapoint timestamps
      if (!utcTimestampTracker[utcMidnight]) {
        utcTimestamps.push(utcMidnight);
        utcTimestampTracker[utcMidnight] = true;
      }
    });

    return utcTimestamps.map((utcTimestamp) => {
      return [utcTimestamp, closestTimestampValueMap[utcTimestamp][1]];
    });
  };

  /* functions to create props for the child components */
  const calculateLongestBearishTrend = (dailyPrices) => {
    if (dailyPrices.length < 2) {
      return null;
    }

    let longestBearishPeriodLength = 0;
    let longestBearishPeriodStartIndex = null;
    let compareNext = (currentIndex, nextIndex, counter) => {
      if (
        !dailyPrices[nextIndex] ||
        dailyPrices[nextIndex][1] >= dailyPrices[currentIndex][1]
      ) {
        return counter;
      }
      return compareNext(nextIndex, nextIndex + 1, counter + 1);
    };

    for (let i = 0; i < dailyPrices.length - 1; i++) {
      const bearishPeriodLength = compareNext(i, i + 1, 0);

      if (
        bearishPeriodLength &&
        bearishPeriodLength >= longestBearishPeriodLength
      ) {
        longestBearishPeriodLength = bearishPeriodLength;
        longestBearishPeriodStartIndex = i;
      }
    }

    const minDate =
      longestBearishPeriodStartIndex !== null
        ? dailyPrices[longestBearishPeriodStartIndex][0]
        : null;
    const maxDate =
      longestBearishPeriodStartIndex !== null
        ? dailyPrices[
            longestBearishPeriodStartIndex + longestBearishPeriodLength
          ][0]
        : null;

    return {
      minDate,
      maxDate,
      longestBearishPeriodLength,
    };
  };

  const calculateHighestTradingVolume = (dailyTotalVolumes) => {
    let highestTradingVolume = null;
    let highestTradingVolumeDate = null;

    dailyTotalVolumes.forEach((totalVolume) => {
      const [dateString, totalValue] = totalVolume;

      if (!highestTradingVolume || totalValue >= highestTradingVolume) {
        highestTradingVolume = totalValue;
        highestTradingVolumeDate = dateString;
      }
    });

    console.log("highestTradingVolume: ", highestTradingVolume);
    console.log("highestTradingVolumeDate: ", highestTradingVolumeDate);

    return {
      highestTradingVolume,
      highestTradingVolumeDate,
    };
  };

  const calculateHighestPriceDiff = (dailyPrices) => {
    let bestToBuyIndex = null;
    let bestToSellIndex = null;
    let highestPriceDiff = 0;

    for (let i = 0; i < dailyPrices.length - 1; i++) {
      let currentPrice = dailyPrices[i][1];
      let currentBestToSellIndex = null;
      let currentPriceDiff = 0;

      for (let j = i + 1; j <= dailyPrices.length - 1; j++) {
        let nextPrice = dailyPrices[j][1];

        if (nextPrice > currentPrice) {
          if (
            
            nextPrice - currentPrice > currentPriceDiff
          ) {
            currentPriceDiff = nextPrice - currentPrice;
            currentBestToSellIndex = j;
          }
        }
        
      }

      if (currentPriceDiff >= highestPriceDiff) {
        highestPriceDiff = currentPriceDiff;
        bestToBuyIndex = i;
        bestToSellIndex = currentBestToSellIndex;
      }
    }

    const bestDayToBuy = bestToBuyIndex !== null ? dailyPrices[bestToBuyIndex][0] : null;
    const bestBuyPrice = bestToBuyIndex !== null ? dailyPrices[bestToBuyIndex][1] : null;
    const bestDayToSell = bestToSellIndex !== null ? dailyPrices[bestToSellIndex][0] : null;
    const bestSellPrice = bestToSellIndex !== null ? dailyPrices[bestToSellIndex][1] : null;
    const profit = highestPriceDiff;

    console.log("bestDayToBuy: ", bestDayToBuy);
    console.log("bestBuyPrice: ", bestBuyPrice);
    console.log("bestDayToSell: ", bestDayToSell);
    console.log("bestSellPrice: ", bestSellPrice);
    console.log("profit: ", profit);

    return {
      bestDayToBuy,
      bestBuyPrice,
      bestDayToSell,
      bestSellPrice,
      profit,
    };
  };

  

  if (prices.length > 0 && totalVolumes.length > 0) {
    /* calculate props */
    const longestBearishTrendData = calculateLongestBearishTrend(prices);
    const highestTradingVolumeData = calculateHighestTradingVolume(totalVolumes);
    const highestPriceDiffData = calculateHighestPriceDiff(prices);

    return (
      <div className="App">
      <h1 className="app-title">Bitcoin tracker</h1>
        <SearchForm getMarketData={getMarketData} />
        <div className="metrics-container flex-container">
        <LongestBearishTrend
            longestBearishTrendData={longestBearishTrendData}
          />
 
        <HighestTradingVolume
            highestTradingVolumeData={highestTradingVolumeData}
          />
        <HighestProfit highestPriceDiffData={highestPriceDiffData} />
        </div>
        <div className="chart-container">
        <Chart
            prices={prices}
            totalVolumes={totalVolumes}
            longestBearishTrendMinTimestamp={longestBearishTrendData.minDate}
            longestBearishTrendMaxTimestamp={longestBearishTrendData.maxDate}
            highestTradingVolumeTimestamp={
              highestTradingVolumeData.highestTradingVolumeDate
            }
            bestTimestampToBuy={highestPriceDiffData.bestDayToBuy}
            bestTimestampToSell={highestPriceDiffData.bestDayToSell}
          />
        </div>
        
        <footer className="footer loaded">Copyright &copy; Tamas Hrabovszki</footer>
      </div>
    );
  }

  return (
    <div className="App">
      <h1 className="app-title">Bitcoin tracker</h1>
      <SearchForm getMarketData={getMarketData} />
      <footer className="footer no-data">Copyright &copy; Tamas Hrabovszki</footer>
    </div>
  );
  
};

export default App;
