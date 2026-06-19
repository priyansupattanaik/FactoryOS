import React, { useState } from 'react';
import { Save, Download, Printer } from 'lucide-react';

const ManpowerEntry = () => {
  const [data, setData] = useState([
    { dept: 'Production (Line 1)', shift: 'A', req: 25, present: 24 },
    { dept: 'Production (Line 2)', shift: 'A', req: 25, present: 25 },
    { dept: 'Production (Line 3)', shift: 'A', req: 25, present: 22 },
    { dept: 'Quality', shift: 'A', req: 10, present: 10 },
    { dept: 'Maintenance', shift: 'A', req: 8, present: 7 },
  ]);

  const handleChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = Number(value);
    setData(newData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manpower Entry</h1>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-gray-100 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded hover:bg-gray-200 dark:hover:bg-dark-border transition-colors">
            <Printer className="w-4 h-4 mr-2" /> Print
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-100 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded hover:bg-gray-200 dark:hover:bg-dark-border transition-colors">
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
          <button className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors">
            <Save className="w-4 h-4 mr-2" /> Save
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex space-x-4 mb-6">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Date</label>
            <input type="date" className="px-3 py-2 border rounded dark:bg-dark-bg dark:border-dark-border" defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Shift</label>
            <select className="px-3 py-2 border rounded dark:bg-dark-bg dark:border-dark-border min-w-[120px]">
              <option>Shift A</option>
              <option>Shift B</option>
              <option>Shift C</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border">
                <th className="py-3 px-4 font-medium">Department</th>
                <th className="py-3 px-4 font-medium text-center">Required (Req)</th>
                <th className="py-3 px-4 font-medium text-center">Present</th>
                <th className="py-3 px-4 font-medium text-center">Shortage</th>
                <th className="py-3 px-4 font-medium text-center">Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => {
                const shortage = row.req - row.present;
                const pct = row.req > 0 ? ((row.present / row.req) * 100).toFixed(1) : 0;
                
                return (
                  <tr key={i} className="border-b border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border/30">
                    <td className="py-3 px-4 font-medium">{row.dept}</td>
                    <td className="py-3 px-4 text-center">
                      <input 
                        type="number" 
                        value={row.req}
                        onChange={(e) => handleChange(i, 'req', e.target.value)}
                        className="w-20 px-2 py-1 text-center border rounded dark:bg-dark-bg dark:border-dark-border" 
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input 
                        type="number" 
                        value={row.present}
                        onChange={(e) => handleChange(i, 'present', e.target.value)}
                        className="w-20 px-2 py-1 text-center border rounded dark:bg-dark-bg dark:border-dark-border" 
                      />
                    </td>
                    <td className={`py-3 px-4 text-center font-bold ${shortage > 0 ? 'text-danger' : 'text-success'}`}>
                      {shortage}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${pct < 90 ? 'bg-danger/20 text-danger' : 'bg-success/20 text-success'}`}>
                        {pct}%
                      </span>
                    </td>
                  </tr>
                );
              })}
              {/* Totals Row */}
              <tr className="bg-gray-50 dark:bg-dark-bg font-bold">
                <td className="py-4 px-4 text-right">TOTAL</td>
                <td className="py-4 px-4 text-center">{data.reduce((acc, row) => acc + row.req, 0)}</td>
                <td className="py-4 px-4 text-center">{data.reduce((acc, row) => acc + row.present, 0)}</td>
                <td className="py-4 px-4 text-center text-danger">
                  {data.reduce((acc, row) => acc + (row.req - row.present), 0)}
                </td>
                <td className="py-4 px-4 text-center">
                  {((data.reduce((acc, row) => acc + row.present, 0) / data.reduce((acc, row) => acc + row.req, 0)) * 100).toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManpowerEntry;
