import React from 'react';

const MetricGrid = ({ metrics }) => {
  if (!metrics.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-dark-border dark:bg-dark-bg">
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{metric.label}</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">{metric.value}</div>
        </div>
      ))}
    </div>
  );
};

export default MetricGrid;
