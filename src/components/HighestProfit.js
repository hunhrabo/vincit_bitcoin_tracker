import {convertTimestampToDatestring} from '../services/dateConverters';

const HighestProfit = ({highestProfitData}) => {

    if (highestProfitData.profit > 0) {
        return (
            <div className="flex-item">
                <div className="flex-container">
                <p className="metric-title">Best day to buy:</p>
                <p className="metric-value">{convertTimestampToDatestring(highestProfitData.bestDayToBuy)}</p>
                <p className="metric-extra-info">({highestProfitData.bestBuyPrice.toLocaleString()} EUR)</p>
                <p className="metric-title">Best day to sell:</p>
                <p className="metric-value">{convertTimestampToDatestring(highestProfitData.bestDayToSell)}</p>
                <p className="metric-extra-info">({highestProfitData.bestSellPrice.toLocaleString()} EUR)</p>
                <p className="metric-title">Profit:</p>
                <p className="metric-extra-info">{highestProfitData.profit.toLocaleString()} EUR</p>
                </div>
                
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
