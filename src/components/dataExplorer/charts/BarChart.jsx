import React from 'react';
import { Bar } from 'react-chartjs-2';

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

const BarChart = ({ chartData }) => <Bar data={chartData.data} options={options} />;

export default BarChart;
