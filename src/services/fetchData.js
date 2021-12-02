/**
 * Module used to fetch data from coingecko's public API
 */
import {getUnixTimestampFromDate} from './dateConverters';
const baseURL = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur';

/**
 * 
 * @param {Date} from 
 * @param {Date} to 
 * @returns {Array} marketData
 */
const fetchMarketData = async (from, to) => {
    try {
        if (from && to && from instanceof Date && to instanceof Date) {
            const url = `${baseURL}&from=${getUnixTimestampFromDate(from)}&to=${getUnixTimestampFromDate(to)}`;
            console.log('url: ', url);

            let response = await fetch(url);
            return response.json();
        } else  {
            throw new Error('Missing or invalid date range parameters');
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

export default fetchMarketData