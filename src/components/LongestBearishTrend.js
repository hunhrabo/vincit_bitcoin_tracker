import {convertTimestampToDatestring} from '../services/dateConverters';

const LongestBearishTrend = ({longestBearishTrendData}) => {
    if (longestBearishTrendData && longestBearishTrendData.longestBearishPeriodLength > 0) {
        return (
            <div className="flex-item">
                <div className="flex-container">
                <p className="metric-title">Longest bearish (downward) trend:</p>
                <p className="metric-value">{longestBearishTrendData.longestBearishPeriodLength} days</p>
                <p className="metric-extra-info">({convertTimestampToDatestring(longestBearishTrendData.minTimestamp)} - {convertTimestampToDatestring(longestBearishTrendData.maxTimestamp)})</p>
            
                </div>
                </div>
        )
    }
    
    return (<div className="flex-item">
        <div className="flex-container">
        <h2>There are no bearish (downward) periods between the selected dates.</h2>

        </div>
            </div>)
}

export default LongestBearishTrend
