import React from 'react';
import { FileText, Download, Calendar } from 'lucide-react';

const Reports = () => {
  const reportTypes = [
    { title: 'Production Report', desc: 'Detailed line-wise and shift-wise production output.' },
    { title: 'Downtime Analysis', desc: 'Pareto analysis and machine breakdown durations.' },
    { title: 'Quality & Yield', desc: 'Defect categorization and overall yield trends.' },
    { title: 'Maintenance Log', desc: 'PM tracker and breakdown history logs.' },
    { title: 'Manpower Attendance', desc: 'Department-wise attendance and utilization.' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports Center</h1>

      <div className="card max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Date Range</label>
            <div className="relative">
              <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Select date range" className="pl-10 pr-4 py-2 w-full border rounded dark:bg-dark-bg dark:border-dark-border outline-none focus:border-primary" defaultValue="2023-10-01 to 2023-10-31" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Format</label>
            <select className="w-full px-3 py-2 border rounded dark:bg-dark-bg dark:border-dark-border outline-none focus:border-primary">
              <option>PDF Document (.pdf)</option>
              <option>Excel Spreadsheet (.xlsx)</option>
              <option>CSV Data (.csv)</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full flex justify-center items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors">
              Generate All
            </button>
          </div>
        </div>

        <h3 className="text-lg font-medium mb-4 border-b pb-2 dark:border-dark-border">Available Reports</h3>
        <div className="space-y-4">
          {reportTypes.map((rep, i) => (
            <div key={i} className="flex justify-between items-center p-4 border border-gray-100 dark:border-dark-border rounded hover:border-primary transition-colors group">
              <div className="flex items-start">
                <FileText className="w-6 h-6 text-primary mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">{rep.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{rep.desc}</p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-primary bg-gray-50 dark:bg-dark-bg rounded-full opacity-0 group-hover:opacity-100 transition-all">
                <Download className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
