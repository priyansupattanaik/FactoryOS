import React from 'react';
import { Pie } from 'react-chartjs-2';

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: '#9ca3af' },
    },
  },
};

const PieChart = ({ chartData }) => <Pie data={chartData.data} options={options} />;

export default PieChart;
