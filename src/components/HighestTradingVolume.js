import {convertTimestampToDatestring} from '../services/dateConverters';

const HighestTradingVolume = ({highestTradingVolumeData}) => {
    return (
        <div className="flex-item">
            <div className="flex-container">
            <p className="metric-title">Highest trading volume:</p>
            <p className="metric-value">{highestTradingVolumeData.highestTradingVolume.toLocaleString()} EUR</p>
            <p className="metric-extra-info">({convertTimestampToDatestring(highestTradingVolumeData.highestTradingVolumeDate)})</p>
            </div>
            
        </div>
    )
}

export default HighestTradingVolume
