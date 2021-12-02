import ApexChart from "react-apexcharts";

const Chart = ({
  prices,
  totalVolumes,
  longestBearishTrendMinTimestamp,
  longestBearishTrendMaxTimestamp,
  highestTradingVolumeTimestamp,
  bestTimestampToBuy,
  bestTimestampToSell,
}) => {
  console.log('prices: ', prices);
  console.log('totalVolumes: ', totalVolumes);
  console.log('highestTradingVolumeTimestamp: ', highestTradingVolumeTimestamp);

  let mergedLabels = Array.from(new Set([...prices.map((data) => data[0]), ...totalVolumes.map((data) => data[0])]));
  mergedLabels.sort((a, b) => a - b);

  const calculateAnnotations = () => {
    const xaxis = [];
    const yaxis = [];

    if (longestBearishTrendMinTimestamp && longestBearishTrendMaxTimestamp) {
      xaxis.push({
        x: longestBearishTrendMinTimestamp,
          x2: longestBearishTrendMaxTimestamp,
          fillColor: '#f22222',
          opacity: 0.4,
          label: {
            borderColor: '#f22222',
            style: {
              color: '#fff',
              background: '#f22222',
            },
            offsetY: -10,
            text: 'Longest bearish period',
          }
      })
    }

    if (bestTimestampToBuy && bestTimestampToSell) {
      xaxis.push({
        x: bestTimestampToBuy,
        yAxisIndex: 0,
        seriesIndex: 0,
        strokeDashArray: 0,
          borderColor: '#775DD0',
          label: {
            borderColor: '#775DD0',
            style: {
              color: '#fff',
              background: '#775DD0',
            },
            text: 'Best day to buy',
          }
      });

      xaxis.push({
        x: bestTimestampToSell,
        yAxisIndex: 0,
        seriesIndex: 0,
        strokeDashArray: 0,
        borderColor: '#775DD0',
        label: {
          borderColor: '#775DD0',
          style: {
            color: '#fff',
            background: '#775DD0',
          },
          text: 'Best day to sell',
        }
      })
    }

    if (highestTradingVolumeTimestamp) {
      yaxis.push({
        y: totalVolumes.find(data => data[0] === highestTradingVolumeTimestamp)[1],
        yAxisIndex: 1,
        seriesIndex: 1,
        borderColor: '#00E396',
          label: {
            borderColor: '#00E396',
            style: {
              color: '#fff',
              background: '#00E396',
            },
            text: 'Highest Trading Volume',
          }
      })
    }

    return {
      xaxis,
      yaxis
    }
  }

  const series = [
    {
      name: "Daily Price",
      data: prices.map((data) => data[1]),
    },
    {
      name: 'Daily Total Volume',
      data: totalVolumes.map((data) => data[1]),
    },
  ];
  const options = {
    chart: {
      height: 400,
      type: "line",
      fontSize: '14px',
      fontWeight: 400,
      fontFamily: 'Lato, sans-serif',
      toolbar: {
        show: false
      }
    },
    title: {
      text: "Prices and Total volumes"
    },
    labels: mergedLabels,
    legend: {
      show: true
    },
    stroke: {
      width: 4
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: [
      {
        title: {
          text: "Daily Price",
        },
        labels: {
          //formatter: (value) => value.toLocaleString() + ' EUR'
          formatter: (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', notation: "compact",
          compactDisplay: "short"  }).format(value)
        }
        
      },
      {
        opposite: true,
        title: {
          text: "Daily Total Volume",
        },
        labels: {
          formatter: (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', notation: "compact",
          compactDisplay: "short"  }).format(value)
        }
      },
    ],
    
    tooltip: {
      y: {
        formatter: (value) => value.toLocaleString() + ' EUR'
      }
    },
    responsive: [{
      breakpoint: 800,
      options: {
        stroke: {
          width: 2
        }
      }
    }
    ],
    annotations: calculateAnnotations()
    // annotations: {
    //   yaxis: [
    //     {
    //       y: totalVolumes.find(data => data[0] === highestTradingVolumeTimestamp)[1],
    //       yAxisIndex: 1,
    //       seriesIndex: 1,
    //       borderColor: '#00E396',
    //         label: {
    //           borderColor: '#00E396',
    //           style: {
    //             color: '#fff',
    //             background: '#00E396',
    //           },
    //           text: 'Highest Trading Volume',
    //         }
    //     }
    //   ],
    //   xaxis: [
    //     {
    //       x: bestTimestampToBuy,
    //       yAxisIndex: 0,
    //       seriesIndex: 0,
    //       strokeDashArray: 0,
    //         borderColor: '#775DD0',
    //         label: {
    //           borderColor: '#775DD0',
    //           style: {
    //             color: '#fff',
    //             background: '#775DD0',
    //           },
    //           text: 'Best time to buy',
    //         }
    //     },
    //     {
    //       x: bestTimestampToSell,
    //       yAxisIndex: 0,
    //       seriesIndex: 0,
    //       strokeDashArray: 0,
    //         borderColor: '#775DD0',
    //         label: {
    //           borderColor: '#775DD0',
    //           style: {
    //             color: '#fff',
    //             background: '#775DD0',
    //           },
    //           text: 'Best time to sell',
    //         }
    //     },
    //     {
    //       x: longestBearishTrendMinTimestamp,
    //       x2: longestBearishTrendMaxTimestamp,
    //       fillColor: '#f22222',
    //       opacity: 0.4,
    //       label: {
    //         borderColor: '#f22222',
    //         style: {
    //           fontSize: '10px',
    //           color: '#fff',
    //           background: '#f22222',
    //         },
    //         offsetY: -10,
    //         text: 'Longest bearish period',
    //       }
    //     }
    //   ],
    //   // points: [{
    //   //   x: highestTradingVolumeTimestamp,
    //   //   y: totalVolumes.find(data => data[0] === highestTradingVolumeTimestamp)[1],
    //   //   yAxisIndex: 1,
    //   //   seriesIndex: 1,
    //   //   marker: {
    //   //     size: 8,
    //   //     fillColor: '#fff',
    //   //     strokeColor: 'red',
    //   //     radius: 2,
    //   //     cssClass: 'apexcharts-custom-class'
    //   //   },
    //   //   label: {
    //   //     borderColor: '#FF4560',
    //   //     offsetY: 0,
    //   //     style: {
    //   //       color: '#fff',
    //   //       background: '#FF4560',
    //   //     },
    
    //   //     text: 'Highest Trading Volume',
    //   //   }
    //   // }]
    // }
  };

  return <ApexChart options={options} series={series} height={450} />;
};

export default Chart;
