const chartPalette = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#f97316',
  '#22c55e',
];

export const aggregationOptions = [
  { value: 'count', label: 'Count rows' },
  { value: 'sum', label: 'Sum' },
  { value: 'average', label: 'Average' },
  { value: 'min', label: 'Minimum' },
  { value: 'max', label: 'Maximum' },
];

export function getColumnByIndex(sheet, columnIndex) {
  return sheet?.columns.find((column) => column.index === Number(columnIndex)) ?? null;
}

export function getColumnOptions(sheet, predicate = () => true) {
  if (!sheet) {
    return [];
  }

  return sheet.columns.filter(predicate).map((column) => ({
    value: column.index,
    label: `${column.header} (${column.inferredType})`,
  }));
}

export function getAvailableChartTypes(sheet) {
  if (!sheet) {
    return [];
  }

  const hasNumeric = sheet.columns.some((column) => column.inferredType === 'number');
  const hasCategory = sheet.columns.some((column) => ['categorical', 'date', 'boolean'].includes(column.inferredType));
  const numericColumns = sheet.columns.filter((column) => column.inferredType === 'number');
  const types = [];

  if (hasCategory) {
    types.push('bar', 'line', 'pie');
  }

  if (numericColumns.length >= 2) {
    types.push('scatter');
  }

  if (!types.length && hasNumeric) {
    types.push('scatter');
  }

  return Array.from(new Set(types));
}

export function inferDefaultChartConfig(sheet) {
  if (!sheet || !sheet.columns.length) {
    return {
      chartType: 'bar',
      xColumnIndex: '',
      yColumnIndex: '',
      aggregation: 'count',
    };
  }

  const numericColumns = sheet.columns.filter((column) => column.inferredType === 'number');
  const categoryColumns = sheet.columns.filter((column) => ['categorical', 'date', 'boolean'].includes(column.inferredType));

  if (numericColumns.length >= 2) {
    return {
      chartType: 'scatter',
      xColumnIndex: numericColumns[0].index,
      yColumnIndex: numericColumns[1].index,
      aggregation: 'none',
    };
  }

  if (categoryColumns.length && numericColumns.length) {
    return {
      chartType: categoryColumns[0].inferredType === 'date' ? 'line' : 'bar',
      xColumnIndex: categoryColumns[0].index,
      yColumnIndex: numericColumns[0].index,
      aggregation: 'sum',
    };
  }

  if (categoryColumns.length) {
    return {
      chartType: 'pie',
      xColumnIndex: categoryColumns[0].index,
      yColumnIndex: '',
      aggregation: 'count',
    };
  }

  return {
    chartType: 'scatter',
    xColumnIndex: numericColumns[0]?.index ?? '',
    yColumnIndex: numericColumns[1]?.index ?? '',
    aggregation: 'none',
  };
}

export function buildVisualizationModel(sheet, config) {
  if (!sheet) {
    return {
      isValid: false,
      error: 'No parsed sheet is available.',
      chartData: null,
      metrics: [],
      details: [],
    };
  }

  const xColumn = getColumnByIndex(sheet, config.xColumnIndex);
  const yColumn = getColumnByIndex(sheet, config.yColumnIndex);
  const chartType = config.chartType;

  if (!xColumn) {
    return invalidModel('Select an X-axis column to generate a chart.');
  }

  if (chartType === 'scatter') {
    if (!yColumn) {
      return invalidModel('Select a Y-axis column to generate a scatter chart.');
    }

    if (xColumn.inferredType !== 'number' || yColumn.inferredType !== 'number') {
      return invalidModel('Scatter charts require both X and Y axes to be numeric columns.');
    }

    return buildScatterModel(sheet, xColumn, yColumn);
  }

  if (config.aggregation !== 'count' && !yColumn) {
    return invalidModel('Select a numeric Y-axis column for the chosen aggregation.');
  }

  if (config.aggregation !== 'count' && yColumn?.inferredType !== 'number') {
    return invalidModel('Sum, average, minimum, and maximum aggregations require a numeric Y-axis column.');
  }

  return buildGroupedModel(sheet, xColumn, yColumn, chartType, config.aggregation);
}

function buildScatterModel(sheet, xColumn, yColumn) {
  const points = [];
  let skippedRows = 0;

  for (const row of sheet.rows) {
    const x = coerceValue(row[xColumn.index], xColumn.inferredType);
    const y = coerceValue(row[yColumn.index], yColumn.inferredType);

    if (!isFiniteNumber(x) || !isFiniteNumber(y)) {
      skippedRows += 1;
      continue;
    }

    points.push({ x, y });
  }

  if (!points.length) {
    return invalidModel('No rows contain numeric values for both selected scatter axes.');
  }

  return {
    isValid: true,
    error: '',
    details: [],
    metrics: [
      { label: 'Rows parsed', value: formatInteger(sheet.rowCount) },
      { label: 'Points plotted', value: formatInteger(points.length) },
      { label: 'Rows skipped', value: formatInteger(skippedRows) },
    ],
    chartData: {
      chartType: 'scatter',
      data: {
        datasets: [
          {
            label: `${xColumn.header} vs ${yColumn.header}`,
            data: points,
            backgroundColor: chartPalette[0],
          },
        ],
      },
      meta: {
        xAxisLabel: xColumn.header,
        yAxisLabel: yColumn.header,
        pointsCount: points.length,
      },
    },
  };
}

function buildGroupedModel(sheet, xColumn, yColumn, chartType, aggregation) {
  const groups = new Map();
  let skippedYRows = 0;

  for (const row of sheet.rows) {
    const rawX = row[xColumn.index];
    const groupLabel = formatDimensionValue(rawX);
    const groupKey = stableGroupKey(rawX);
    const rawY = yColumn ? coerceValue(row[yColumn.index], yColumn.inferredType) : null;

    if (!groups.has(groupKey)) {
      groups.set(groupKey, {
        label: groupLabel,
        count: 0,
        sum: 0,
        min: null,
        max: null,
        numericCount: 0,
      });
    }

    const group = groups.get(groupKey);
    group.count += 1;

    if (!yColumn || aggregation === 'count') {
      continue;
    }

    if (!isFiniteNumber(rawY)) {
      skippedYRows += 1;
      continue;
    }

    group.sum += rawY;
    group.numericCount += 1;
    group.min = group.min === null ? rawY : Math.min(group.min, rawY);
    group.max = group.max === null ? rawY : Math.max(group.max, rawY);
  }

  const labels = [];
  const values = [];
  const details = [];

  for (const [, group] of groups) {
    const value = computeAggregateValue(group, aggregation);
    if (value === null) {
      continue;
    }

    labels.push(group.label);
    values.push(value);
    details.push({
      dimension: group.label,
      value,
      rowCount: group.count,
      numericCount: group.numericCount,
    });
  }

  if (!labels.length) {
    return invalidModel('No chartable values remain after applying the selected aggregation.');
  }

  const datasetLabel = buildDatasetLabel(yColumn, aggregation);
  const colors = labels.map((_, index) => chartPalette[index % chartPalette.length]);
  const metrics = [
    { label: 'Rows parsed', value: formatInteger(sheet.rowCount) },
    { label: 'Groups plotted', value: formatInteger(labels.length) },
    {
      label: aggregation === 'count' ? 'Total counted rows' : `${capitalize(aggregation)} total`,
      value: aggregation === 'count'
        ? formatInteger(values.reduce((total, value) => total + value, 0))
        : formatMetric(values.reduce((total, value) => total + value, 0)),
    },
  ];

  if (yColumn) {
    metrics.push({ label: 'Rows skipped', value: formatInteger(skippedYRows) });
  } else {
    metrics.push({ label: 'Missing cells', value: formatInteger(sheet.emptyCellCount) });
  }

  return {
    isValid: true,
    error: '',
    details,
    metrics,
    chartData: {
      chartType,
      data: {
        labels,
        datasets: [
          {
            label: datasetLabel,
            data: values,
            borderColor: chartPalette[0],
            backgroundColor: chartType === 'line' ? 'rgba(59, 130, 246, 0.15)' : colors,
            fill: chartType === 'line',
            tension: chartType === 'line' ? 0.35 : 0,
          },
        ],
      },
      meta: {
        xAxisLabel: xColumn.header,
        yAxisLabel: datasetLabel,
      },
    },
  };
}

function computeAggregateValue(group, aggregation) {
  if (aggregation === 'count') {
    return group.count;
  }

  if (group.numericCount === 0) {
    return null;
  }

  if (aggregation === 'sum') {
    return group.sum;
  }

  if (aggregation === 'average') {
    return group.sum / group.numericCount;
  }

  if (aggregation === 'min') {
    return group.min;
  }

  if (aggregation === 'max') {
    return group.max;
  }

  return null;
}

function buildDatasetLabel(yColumn, aggregation) {
  if (aggregation === 'count') {
    return 'Row count';
  }

  return `${capitalize(aggregation)} of ${yColumn?.header ?? 'value'}`;
}

function invalidModel(error) {
  return {
    isValid: false,
    error,
    chartData: null,
    metrics: [],
    details: [],
  };
}

function stableGroupKey(value) {
  if (value === null || value === undefined || value === '') {
    return '__blank__';
  }

  return `${typeof value}:${String(value)}`;
}

function formatDimensionValue(value) {
  if (value === null || value === undefined || value === '') {
    return '(Blank)';
  }

  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  }

  return String(value);
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function coerceValue(value, inferredType) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (inferredType === 'number') {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : null;
    }

    const parsed = Number(String(value).trim());
    return Number.isFinite(parsed) ? parsed : null;
  }

  if (inferredType === 'boolean') {
    if (typeof value === 'boolean') {
      return value;
    }

    const normalized = String(value).trim().toLowerCase();
    if (normalized === 'true') {
      return true;
    }

    if (normalized === 'false') {
      return false;
    }
  }

  return value;
}

export function formatMetric(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return String(value ?? '');
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: Math.abs(value) >= 100 ? 2 : 4,
  }).format(value);
}

export function formatInteger(value) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);
}

function capitalize(value) {
  return value ? `${value[0].toUpperCase()}${value.slice(1)}` : value;
}
