import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Calendar, Download, FileText, Table2 } from 'lucide-react';
import ChartControls from '../components/dataExplorer/ChartControls';
import ChartRenderer from '../components/dataExplorer/ChartRenderer';
import MetricGrid from '../components/dataExplorer/MetricGrid';
import ParsedDataPreview from '../components/dataExplorer/ParsedDataPreview';
import { buildVisualizationModel, inferDefaultChartConfig } from '../utils/dataExplorer';

const Reports = ({ uploadedWorkbook, uploadState }) => {
  const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);
  const [chartConfig, setChartConfig] = useState({
    chartType: 'bar',
    xColumnIndex: '',
    yColumnIndex: '',
    aggregation: 'count',
  });

  const reportTypes = [
    { title: 'Production Report', desc: 'Detailed line-wise and shift-wise production output.' },
    { title: 'Downtime Analysis', desc: 'Pareto analysis and machine breakdown durations.' },
    { title: 'Quality & Yield', desc: 'Defect categorization and overall yield trends.' },
    { title: 'Maintenance Log', desc: 'PM tracker and breakdown history logs.' },
    { title: 'Manpower Attendance', desc: 'Department-wise attendance and utilization.' },
  ];

  const selectedSheet = uploadedWorkbook?.sheets?.[selectedSheetIndex] ?? null;

  useEffect(() => {
    setSelectedSheetIndex(0);
  }, [uploadedWorkbook]);

  useEffect(() => {
    if (selectedSheet) {
      setChartConfig(inferDefaultChartConfig(selectedSheet));
    }
  }, [selectedSheet]);

  const visualizationModel = useMemo(
    () => buildVisualizationModel(selectedSheet, chartConfig),
    [selectedSheet, chartConfig]
  );

  const handleConfigChange = (key, value) => {
    setChartConfig((current) => {
      if (key === 'chartType' && value === 'scatter') {
        return {
          ...current,
          chartType: value,
          aggregation: 'none',
        };
      }

      if (key === 'chartType' && current.aggregation === 'none') {
        return {
          ...current,
          chartType: value,
          aggregation: 'count',
        };
      }

      return {
        ...current,
        [key]: value,
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports Center</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload an Excel or CSV file from the header to generate charts directly from parsed source data.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-gray-500">Date Range</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Select date range"
                className="w-full rounded border border-gray-200 py-2 pl-10 pr-4 outline-none focus:border-primary dark:border-dark-border dark:bg-dark-bg"
                defaultValue="2023-10-01 to 2023-10-31"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-500">Format</label>
            <select className="w-full rounded border border-gray-200 px-3 py-2 outline-none focus:border-primary dark:border-dark-border dark:bg-dark-bg">
              <option>PDF Document (.pdf)</option>
              <option>Excel Spreadsheet (.xlsx)</option>
              <option>CSV Data (.csv)</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full rounded bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90">
              Generate All
            </button>
          </div>
        </div>
      </div>

      <div className="card space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Uploaded Data Visualizer</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Parsed data remains separate from chart configuration. Charts update only from the uploaded dataset.
            </p>
          </div>

          {uploadedWorkbook?.sheets?.length ? (
            <div className="min-w-[260px]">
              <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">Sheet</label>
              <select
                value={selectedSheetIndex}
                onChange={(event) => setSelectedSheetIndex(Number(event.target.value))}
                className="w-full rounded border border-gray-200 px-3 py-2 outline-none focus:border-primary dark:border-dark-border dark:bg-dark-bg"
              >
                {uploadedWorkbook.sheets.map((sheet, index) => (
                  <option key={sheet.name} value={index}>
                    {sheet.name} ({sheet.rowCount} rows)
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>

        {!uploadedWorkbook ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-dark-border">
            <Table2 className="mx-auto h-10 w-10 text-primary" />
            <h3 className="mt-4 text-lg font-semibold">No uploaded dataset</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Use the Upload Excel control in the header first, then come back here to verify the visualizations. Supported formats: .xlsx, .xls, .csv.
            </p>
          </div>
        ) : (
          <>
            {uploadState.status === 'error' && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <span>{uploadState.error}</span>
              </div>
            )}

            <ChartControls sheet={selectedSheet} config={chartConfig} onChange={handleConfigChange} />

            <MetricGrid metrics={visualizationModel.metrics} />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="rounded-lg border border-gray-200 p-4 xl:col-span-2 dark:border-dark-border">
                <h3 className="mb-4 text-lg font-medium">Chart Output</h3>
                <ChartRenderer model={visualizationModel} />
              </div>

              <div className="rounded-lg border border-gray-200 p-4 dark:border-dark-border">
                <h3 className="mb-4 text-lg font-medium">Parsed Sheet Summary</h3>
                {selectedSheet ? (
                  <dl className="space-y-3 text-sm">
                    <SummaryRow label="Rows" value={selectedSheet.rowCount} />
                    <SummaryRow label="Columns" value={selectedSheet.columnCount} />
                    <SummaryRow label="Missing cells" value={selectedSheet.emptyCellCount} />
                    <SummaryRow label="Sheet name" value={selectedSheet.name} />
                  </dl>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400">No sheet selected.</div>
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium">Parsed Data Preview</h3>
              <ParsedDataPreview sheet={selectedSheet} />
            </div>
          </>
        )}
      </div>

      <div className="card max-w-4xl">
        <h3 className="mb-4 border-b pb-2 text-lg font-medium dark:border-dark-border">Available Reports</h3>
        <div className="space-y-4">
          {reportTypes.map((rep) => (
            <div key={rep.title} className="group flex items-center justify-between rounded border border-gray-100 p-4 transition-colors hover:border-primary dark:border-dark-border">
              <div className="flex items-start">
                <FileText className="mr-4 h-6 w-6 flex-shrink-0 text-primary" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">{rep.title}</h4>
                  <p className="mt-1 text-sm text-gray-500">{rep.desc}</p>
                </div>
              </div>
              <button className="rounded-full bg-gray-50 p-2 text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:text-primary dark:bg-dark-bg">
                <Download className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-gray-100 pb-2 dark:border-dark-border">
    <dt className="text-gray-500 dark:text-gray-400">{label}</dt>
    <dd className="font-medium text-gray-900 dark:text-gray-100">{value}</dd>
  </div>
);

export default Reports;
