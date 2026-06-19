import React from 'react';
import { Line } from 'react-chartjs-2';

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
      ticks: { color: '#9ca3af' },
      grid: { color: '#374151', drawBorder: false },
    },
    y: {
      ticks: { color: '#9ca3af' },
      grid: { color: '#374151', drawBorder: false },
    },
  },
};

const LineChart = ({ chartData }) => <Line data={chartData.data} options={options} />;

export default LineChart;
