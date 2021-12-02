import {convertTimestampToDatestring} from '../services/dateConverters';

const HighestProfit = ({highestProfitData}) => {

    if (highestProfitData.profit > 0) {
        return (
            <div className="flex-item">
                <div className="flex-container">
                <p className="metric-title">Best day to buy:</p>
                <p className="metric-value">{convertTimestampToDatestring(highestProfitData.bestTimestampToBuy)}</p>
                <p className="metric-extra-info">({highestProfitData.bestBuyPrice.toLocaleString()} EUR)</p>
                <p className="metric-title">Best day to sell:</p>
                <p className="metric-value">{convertTimestampToDatestring(highestProfitData.bestTimestampToSell)}</p>
                <p className="metric-extra-info">({highestProfitData.bestSellPrice.toLocaleString()} EUR)</p>
                <p className="metric-title">Profit:</p>
                <p className="metric-extra-info">{highestProfitData.profit.toLocaleString()} EUR</p>
                </div>
                
            </div>
        )
    }

    return (
        <div className="flex-item">
            <div className="flex-container">
            <h2>The price has been decreasing/stagnating in the selected period.</h2>

            </div>
        </div>
    )
    
}

export default HighestProfit
