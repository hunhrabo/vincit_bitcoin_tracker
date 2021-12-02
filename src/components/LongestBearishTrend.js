import {convertTimestampToDatestring} from '../services/dateConverters';

const LongestBearishTrend = ({longestBearishTrendData}) => {
    if (longestBearishTrendData && longestBearishTrendData.longestBearishPeriodLength) {
        return (
            <div className="flex-item">
                <p className="metric-title">Longest bearish (downward) trend:</p>
                <p className="metric-value">{longestBearishTrendData.longestBearishPeriodLength} days</p>
                <p className="metric-extra-info">({convertTimestampToDatestring(longestBearishTrendData.minDate)} - {convertTimestampToDatestring(longestBearishTrendData.maxDate)})</p>
            </div>
        )
    }
    
    return null;
}

export default LongestBearishTrend
