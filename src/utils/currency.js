import axios from 'axios';

let cachedRate = null;
let lastFetched = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes 

const fetchConversionRate = async () => {
    const now = new Date().getTime();
    if (!cachedRate || now - lastFetched > CACHE_DURATION) {
        const url = `https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.CURRENCY_API_KEY}&currencies=INR`;
        const response = await axios(url);
        cachedRate = response.data.data.INR; // 1 USD = to like 10 INR ruppee
        lastFetched = now;
    }
    return cachedRate;
};

const convertPrice = async (inrPrice, targetCurrency = 'INR') => {
    if (targetCurrency === 'USD') {
        const rate = await fetchConversionRate();
        return (inrPrice / rate).toFixed(2); // convert INR -> USD
    }
    return inrPrice?.toFixed(2); // return as INR
};

export default {
    convertPrice,
};
