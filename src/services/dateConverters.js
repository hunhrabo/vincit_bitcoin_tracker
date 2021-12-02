// to get "YYYY-mm-dd" format from Date object
const convertDatetimeToDateString = (date) => {
    if (!date || !(date instanceof Date)) {
        console.log('invalid date: ', date)
        return null;
    }

    return date.toISOString().slice(0, 10);
}

// to get "YYYY-mm-dd" format from timestamp
const convertTimestampToDatestring = (timestamp) => {
    if (!timestamp || typeof timestamp !== 'number') {
        return null;
    }

    return convertDatetimeToDateString(new Date(timestamp));
}

// needed to set up initial start date of date input
const addMonthsToDate = (date, diff) => {
    if (!date || !(date instanceof Date)) {
        console.log('invalid date: ', date)
        return null;
    }

    if (!diff) {
        console.log('missing parameters');
        return null;
    }

    let newDate = new Date(date);

    newDate.setMonth(newDate.getMonth() + diff);
    return newDate;
}

// needed to make sure current day is included
const getEndOfDay = (date) => {
    if (!date || !(date instanceof Date)) {
        console.log('invalid date: ', date)
        return null;
    }

    let nextDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    return new Date(nextDay.valueOf() - 1);
}

// Unix timestamp is needed by public API
const getUnixTimestampFromDate = (date) => {
    if (!date || !(date instanceof Date)) {
        console.log('invalid date: ', date)
        return null;
    }

    return parseInt((date.getTime() / 1000).toFixed(0));
}


export {
    convertDatetimeToDateString,
    convertTimestampToDatestring,
    addMonthsToDate,
    getEndOfDay,
    getUnixTimestampFromDate
}