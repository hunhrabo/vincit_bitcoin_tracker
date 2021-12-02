import {convertTimestampToDatestring} from '../services/dateConverters';

const HighestProfit = ({highestPriceDiffData}) => {

    if (highestPriceDiffData.profit > 0) {
        return (
            <div className="flex-item">
                <p className="metric-title">Best day to buy:</p>
                <p className="metric-value">{convertTimestampToDatestring(highestPriceDiffData.bestDayToBuy)} (for {highestPriceDiffData.bestBuyPrice.toLocaleString()} EUR)</p>
                <p className="metric-title">Best day to sell:</p>
                <p className="metric-value">{convertTimestampToDatestring(highestPriceDiffData.bestDayToSell)} (for {highestPriceDiffData.bestSellPrice.toLocaleString()} EUR)</p>
                <p className="metric-title">Profit:</p>
                <p className="metric-extra-info">{highestPriceDiffData.profit.toLocaleString()} EUR</p>
            </div>
        )
    }

    return (
        <div className="flex-item">
            <h2>The price has been decreasing in the selected period.</h2>
        </div>
    )
    
}

export default HighestProfit
