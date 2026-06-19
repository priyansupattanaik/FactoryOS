import React from 'react';
import BarChart from './charts/BarChart';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';
import ScatterChart from './charts/ScatterChart';

const ChartRenderer = ({ model }) => {
  if (!model.isValid) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-500 dark:border-dark-border dark:text-gray-400">
        {model.error}
      </div>
    );
  }

  const chartType = model.chartData.chartType;

  return (
    <div className="h-[380px]">
      {chartType === 'bar' && <BarChart chartData={model.chartData} />}
      {chartType === 'line' && <LineChart chartData={model.chartData} />}
      {chartType === 'pie' && <PieChart chartData={model.chartData} />}
      {chartType === 'scatter' && <ScatterChart chartData={model.chartData} />}
    </div>
  );
};

export default ChartRenderer;
