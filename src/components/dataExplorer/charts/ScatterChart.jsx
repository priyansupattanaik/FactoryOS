import React from 'react';
import { Scatter } from 'react-chartjs-2';

const ScatterChart = ({ chartData }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#9ca3af' },
      },
    },
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: chartData.meta.xAxisLabel,
          color: '#9ca3af',
        },
        ticks: { color: '#9ca3af' },
        grid: { color: '#374151', drawBorder: false },
      },
      y: {
        title: {
          display: true,
          text: chartData.meta.yAxisLabel,
          color: '#9ca3af',
        },
        ticks: { color: '#9ca3af' },
        grid: { color: '#374151', drawBorder: false },
      },
    },
  };

  return <Scatter data={chartData.data} options={options} />;
};

export default ScatterChart;
