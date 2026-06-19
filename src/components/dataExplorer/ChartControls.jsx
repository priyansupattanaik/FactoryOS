import React from 'react';
import { aggregationOptions, getAvailableChartTypes, getColumnOptions } from '../../utils/dataExplorer';

const chartTypeOptions = [
  { value: 'bar', label: 'Bar' },
  { value: 'line', label: 'Line' },
  { value: 'pie', label: 'Pie' },
  { value: 'scatter', label: 'Scatter' },
];

const ChartControls = ({ sheet, config, onChange }) => {
  const availableChartTypes = getAvailableChartTypes(sheet);
  const xAxisOptions = getColumnOptions(sheet);
  const numericColumnOptions = getColumnOptions(sheet, (column) => column.inferredType === 'number');
  const requiresNumericYAxis = config.chartType === 'scatter' || config.aggregation !== 'count';

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Field label="Chart type">
        <select
          value={config.chartType}
          onChange={(event) => onChange('chartType', event.target.value)}
          className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-dark-border dark:bg-dark-bg"
        >
          {chartTypeOptions
            .filter((option) => availableChartTypes.includes(option.value))
            .map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>
      </Field>

      <Field label="X-axis">
        <select
          value={config.xColumnIndex}
          onChange={(event) => onChange('xColumnIndex', event.target.value === '' ? '' : Number(event.target.value))}
          className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-dark-border dark:bg-dark-bg"
        >
          <option value="">Select column</option>
          {xAxisOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Y-axis">
        <select
          value={config.yColumnIndex}
          onChange={(event) => onChange('yColumnIndex', event.target.value === '' ? '' : Number(event.target.value))}
          className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-dark-border dark:bg-dark-bg"
          disabled={!requiresNumericYAxis}
        >
          <option value="">
            {config.aggregation === 'count' && config.chartType !== 'scatter' ? 'Not required for row count' : 'Select numeric column'}
          </option>
          {numericColumnOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Aggregation">
        <select
          value={config.aggregation}
          onChange={(event) => onChange('aggregation', event.target.value)}
          disabled={config.chartType === 'scatter'}
          className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60 dark:border-dark-border dark:bg-dark-bg"
        >
          {(config.chartType === 'scatter'
            ? [{ value: 'none', label: 'Not applicable' }]
            : aggregationOptions
          ).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>
    </div>
  );
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">{label}</span>
    {children}
  </label>
);

export default ChartControls;
