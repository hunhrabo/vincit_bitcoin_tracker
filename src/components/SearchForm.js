import React, {useState} from 'react';
import {convertDatetimeToDateString, addMonthsToDate, getEndOfDay} from '../services/dateConverters';

const SearchForm = ({getMarketData}) => {
    const [fromDate, setFromDate] = useState(convertDatetimeToDateString(addMonthsToDate(new Date(), -6)));
    const [toDate, setToDate] = useState(convertDatetimeToDateString(new Date()));

    const handleSubmit = (e) => {
        e.preventDefault();

        getMarketData(new Date(fromDate), getEndOfDay(new Date(toDate)));
    }

    return (
            <form className="search-form flex-container" onSubmit={handleSubmit}>
                <label>
                    From:
                    <input className="date-input" type="date" name="from" max={toDate} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </label>
                <label>
                    To:
                    <input className="date-input" type="date" name="to" min={fromDate} max={convertDatetimeToDateString(new Date())} value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </label>
                {/* <input type="submit" value="Search" /> */}
                <button className="btn" type="submit">Search</button>
                   
            </form>
    )
}

export default SearchForm
