import { useState } from "react";
import { getUnixTimestampFromDate } from "./services/dateConverters";
import SearchForm from "./components/SearchForm";
import LongestBearishTrend from "./components/LongestBearishTrend";
import HighestTradingVolume from "./components/HighestTradingVolume";
import HighestProfit from "./components/HighestProfit";
import Chart from "./components/Chart";
import './App.css';
import Footer from "./components/Footer";
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

    // update state
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
    // we need at least 2 remote values to compare
    if (dailyPrices.length < 2) {
      return null;
    }

    let longestBearishPeriodLength = 0;
    let longestBearishPeriodStartIndex = null;

    // recursive function to compare values in the array
    let compareNext = (currentIndex, nextIndex, counter) => {
      // reached last element or downward period ended, return length of downward period
      if (
        !dailyPrices[nextIndex] ||
        dailyPrices[nextIndex][1] >= dailyPrices[currentIndex][1]
      ) {
        return counter;
      }
      return compareNext(nextIndex, nextIndex + 1, counter + 1);
    };

    for (let i = 0; i < dailyPrices.length - 1; i++) {
      // step over to the end of checked period
      if (longestBearishPeriodStartIndex !== null && i < longestBearishPeriodStartIndex + longestBearishPeriodLength) {
        continue;
      }

      const bearishPeriodLength = compareNext(i, i + 1, 0);

      if (
        bearishPeriodLength &&
        bearishPeriodLength >= longestBearishPeriodLength
      ) {
        longestBearishPeriodLength = bearishPeriodLength;
        longestBearishPeriodStartIndex = i;
      }
    }

    const minTimestamp =
      longestBearishPeriodStartIndex !== null
        ? dailyPrices[longestBearishPeriodStartIndex][0]
        : null;
    const maxTimestamp =
      longestBearishPeriodStartIndex !== null
        ? dailyPrices[
            longestBearishPeriodStartIndex + longestBearishPeriodLength
          ][0]
        : null;

    return {
      minTimestamp,
      maxTimestamp,
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

    return {
      highestTradingVolume,
      highestTradingVolumeDate,
    };
  };

  const calculateHighestProfit = (dailyPrices) => {
    let bestToBuyIndex = null;
    let bestToSellIndex = null;
    let highestProfit = 0;

    // get highest future price for each datapoint recursively
    let compareNext = (currentIndex, nextIndex, maxPrice) => {
      // reached last element, return index of highest price
      if (
        !dailyPrices[nextIndex]
      ) {
        return currentIndex;
      }

      // set new initial datapoint
      let newCurrentIndex = dailyPrices[nextIndex][1] >= maxPrice ? nextIndex : currentIndex;
      return compareNext(newCurrentIndex, nextIndex + 1, dailyPrices[newCurrentIndex][1]);
    };

    for (let i = 0; i < dailyPrices.length - 1; i++) {
      let currentPrice = dailyPrices[i][1];

      // current price is higher than already checked ones, so the profit cannot be higher, so skip
      if (bestToSellIndex !== null && i < bestToSellIndex && currentPrice > dailyPrices[bestToBuyIndex][1]) {
        continue;
      }

      let currentBestToSellIndex = compareNext(i, i + 1, currentPrice);

      if (i !== currentBestToSellIndex) {
        const currentProfit = dailyPrices[currentBestToSellIndex][1] - currentPrice;

        // in case of identical periods, get the latest one
        if (currentProfit > 0 && currentProfit >= highestProfit) {
          highestProfit = currentProfit;
          bestToBuyIndex = i;
          bestToSellIndex = currentBestToSellIndex;
        }
      }
    }

    const bestTimestampToBuy = bestToBuyIndex !== null ? dailyPrices[bestToBuyIndex][0] : null;
    const bestBuyPrice = bestToBuyIndex !== null ? dailyPrices[bestToBuyIndex][1] : null;
    const bestTimestampToSell = bestToSellIndex !== null ? dailyPrices[bestToSellIndex][0] : null;
    const bestSellPrice = bestToSellIndex !== null ? dailyPrices[bestToSellIndex][1] : null;
    const profit = highestProfit;

    return {
      bestTimestampToBuy,
      bestBuyPrice,
      bestTimestampToSell,
      bestSellPrice,
      profit,
    };
  };

  if (prices.length > 0 && totalVolumes.length > 0) {
    /* calculate props */
    const longestBearishTrendData = calculateLongestBearishTrend(prices);
    const highestTradingVolumeData = calculateHighestTradingVolume(totalVolumes);
    const highestProfitData = calculateHighestProfit(prices);

    return (
      <div className="App">
      <h1 className="app-title">Bitcoin Tracker</h1>
        <SearchForm getMarketData={getMarketData} />
        <div className="metrics-container flex-container">
        <LongestBearishTrend
            longestBearishTrendData={longestBearishTrendData}
          />
 
        <HighestTradingVolume
            highestTradingVolumeData={highestTradingVolumeData}
          />
        <HighestProfit highestProfitData={highestProfitData} />
        </div>
        <div className="chart-container">
        <Chart
            prices={prices}
            totalVolumes={totalVolumes}
            longestBearishTrendMinTimestamp={longestBearishTrendData.minTimestamp}
            longestBearishTrendMaxTimestamp={longestBearishTrendData.maxTimestamp}
            highestTradingVolumeTimestamp={
              highestTradingVolumeData.highestTradingVolumeDate
            }
            bestTimestampToBuy={highestProfitData.bestTimestampToBuy}
            bestTimestampToSell={highestProfitData.bestTimestampToSell}
          />
        </div>
        
        <Footer noData={false} />
      </div>
    );
  }

  return (
    <div className="App">
      <h1 className="app-title">Bitcoin Tracker</h1>
      <SearchForm getMarketData={getMarketData} />
      <Footer noData={true} />
    </div>
  );
  
};

export default App;
