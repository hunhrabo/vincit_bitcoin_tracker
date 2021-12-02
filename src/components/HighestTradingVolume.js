import {convertTimestampToDatestring} from '../services/dateConverters';

const HighestTradingVolume = ({highestTradingVolumeData}) => {
    return (
        <div className="flex-item">
            <p className="metric-title">Highest trading volume:</p>
            <p className="metric-value">{highestTradingVolumeData.highestTradingVolume.toLocaleString()} EUR</p>
            <p className="metric-value">({convertTimestampToDatestring(highestTradingVolumeData.highestTradingVolumeDate)})</p>
        </div>
    )
}

export default HighestTradingVolume
