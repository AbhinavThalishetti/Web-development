import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar, Scatter } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const StockMarketData = () => {
  const [stockData, setStockData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('1day'); // Default duration
  const [selectedGraph, setSelectedGraph] = useState('line'); // Default graph type
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL'); // Default stock symbol

  // Acquiring stock market data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://twelve-data1.p.rapidapi.com/time_series',
          {
            headers: {
              'x-rapidapi-host': 'twelve-data1.p.rapidapi.com',
              'x-rapidapi-key': 'Your-Rapid-API-Key',
            },
            params: {
              symbol: selectedSymbol,
              interval: selectedPeriod,
              start_date: startDate,
              end_date: endDate,
            },
          }
        );

        setStockData(response.data);
      } catch (error) {
        console.error('Error fetching stock market data:', error);
      }
    };

    fetchData();
  }, [selectedSymbol, selectedPeriod, startDate, endDate]);

  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
  };

  const handleGraphChange = (e) => {
    setSelectedGraph(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleSymbolChange = (e) => {
    setSelectedSymbol(e.target.value);
  };

  if (!stockData) {
    return <div>Loading...</div>;
  }

  // Process stock data and prepare chart data for line graph
  const lineChartData = {
    labels: stockData.values.map((value) => value.datetime),
    datasets: [
      {
        label: 'Stock Price',
        data: stockData.values.map((value) => value.close),
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  // Process stock data and prepare chart data for bar graph
  const barChartData = {
    labels: stockData.values.map((value) => value.datetime),
    datasets: [
      {
        label: 'Volume',
        data: stockData.values.map((value) => value.volume),
        backgroundColor: 'rgba(75,192,192,0.5)',
        borderWidth: 1,
      },
    ],
  };

  // Process stock data and prepare chart data for scatter graph
  const scatterChartData = {
    datasets: [
      {
        label: 'High vs. Low',
        data: stockData.values.map((value) => ({ x: value.low, y: value.high })),
        backgroundColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  // Process stock data and prepare chart data for area graph
  const areaChartData = {
    labels: stockData.values.map((value) => value.datetime),
    datasets: [
      {
        label: 'Stock Price',
        data: stockData.values.map((value) => value.close),
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.5)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  // Chart options enabled: crosshair and responsiveness
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        intersect: false,
        mode: 'index',
      },
      crosshair: {
        line: {
          color: 'rgba(0, 0, 0, 1)',
          width: 1,
          dashPattern: [5, 5],
        },
      },
    },
  };

  // Different types of graphs instantiated
let selectedChart;
if (selectedGraph === 'line') {
  selectedChart = <div style={{ height: '75vh' }}><Line data={lineChartData} options={chartOptions} /></div>;
} else if (selectedGraph === 'bar') {
  selectedChart = <div style={{ height: '75vh' }}><Bar data={barChartData} options={chartOptions} /></div>;
} else if (selectedGraph === 'scatter') {
  selectedChart = <div style={{ height: '75vh' }}><Scatter data={scatterChartData} options={chartOptions} /></div>;
} else if (selectedGraph === 'area') {
  selectedChart = <div style={{ height: '75vh' }}><Line data={areaChartData} options={chartOptions} /></div>;
}

// Injecting the StockMarketData react component along with other options into the index page
  return (
    <div style={{ padding: '30px' }}>
      <h1>Stock Market Data</h1>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <label htmlFor="symbol-select">Select Stock Symbol:</label>
          <select id="symbol-select" value={selectedSymbol} onChange={handleSymbolChange}>
            <option value="AAPL">AAPL</option>
            <option value="AMZN">AMZN</option>
            <option value="ETH/BTC">ETH/BTC</option>
            <option value="EUR/USD">EUR/USD</option>
          </select>
        </div>
        <div>
          <label htmlFor="period-select">Select Period:</label>
          <select id="period-select" value={selectedPeriod} onChange={handlePeriodChange}>
            <option value="1day">1 Day</option>
            <option value="1week">1 Week</option>
            <option value="1month">1 Month</option>
          </select>
        </div>
        <div>
          <label htmlFor="graph-select">Select Graph Type:</label>
          <select id="graph-select" value={selectedGraph} onChange={handleGraphChange}>
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="scatter">Scatter Plot</option>
            <option value="area">Area Chart</option>
          </select>
        </div>
        <span style={{ display: 'flex' }}>
        <div>
          <label htmlFor="start-date">Start Date:</label>
          <input type="date" id="start-date" value={startDate} onChange={handleStartDateChange} />
        </div>
        <div style={{ paddingLeft: '10px' }}>
          <label htmlFor="end-date">End Date:</label>
          <input type="date" id="end-date" value={endDate} onChange={handleEndDateChange} />
        </div>
        </span>
      </div>
      {selectedChart}
    </div>
  );
};

export default StockMarketData;
