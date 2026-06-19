import React from 'react';
import { formatMetric } from '../../utils/dataExplorer';

const previewRowCount = 8;

const ParsedDataPreview = ({ sheet }) => {
  if (!sheet) {
    return null;
  }

  const previewRows = sheet.rows.slice(0, previewRowCount);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-dark-border">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
          <thead className="bg-gray-50 dark:bg-dark-bg">
            <tr>
              {sheet.columns.map((column) => (
                <th
                  key={column.index}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                >
                  <div>{column.header}</div>
                  <div className="mt-1 normal-case text-[11px] font-normal text-gray-400 dark:text-gray-500">
                    {column.inferredType} · {column.uniqueCount} unique
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white dark:divide-dark-border dark:bg-dark-surface">
            {previewRows.map((row, rowIndex) => (
              <tr key={`${sheet.name}-${rowIndex}`}>
                {row.map((value, columnIndex) => (
                  <td
                    key={`${columnIndex}-${rowIndex}`}
                    className="whitespace-nowrap px-4 py-3 text-sm text-gray-700 dark:text-gray-200"
                  >
                    {renderValue(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-500 dark:border-dark-border dark:bg-dark-bg dark:text-gray-400">
        Showing {previewRows.length} of {sheet.rowCount} parsed rows.
      </div>
    </div>
  );
};

function renderValue(value) {
  if (value === null || value === undefined || value === '') {
    return <span className="italic text-gray-400 dark:text-gray-500">(Blank)</span>;
  }

  if (typeof value === 'number') {
    return formatMetric(value);
  }

  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  }

  return String(value);
}

export default ParsedDataPreview;
