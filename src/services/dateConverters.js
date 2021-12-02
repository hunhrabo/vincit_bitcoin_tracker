const convertDatetimeToDateString = (date) => {
    if (!date || !(date instanceof Date)) {
        console.log('invalid date: ', date)
        return null;
    }

    // let year = date.getUTCFullYear();
    // let month = date.getUTCMonth() + 1;
    // let day = date.getUTCDate();

    // // convert month and day to 2-digit value;
    // month = month < 10 ? `0${month}` : month;
    // day = day < 10 ? `0${day}` : day;

    //return date.toLocaleDateString();
    //return `${year}-${month}-${day}`

    return date.toISOString().slice(0, 10);
}

const convertTimestampToDatestring = (timestamp) => {
    if (!timestamp || typeof timestamp !== 'number') {
        return null;
    }

    return convertDatetimeToDateString(new Date(timestamp));
}

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

const getEndOfDay = (date) => {
    if (!date || !(date instanceof Date)) {
        console.log('invalid date: ', date)
        return null;
    }

    let nextDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    return new Date(nextDay.valueOf() - 1);
}

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