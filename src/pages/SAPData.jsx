import React, { useState } from 'react';
import { Search, Download, Filter } from 'lucide-react';

const SAPData = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const sapOrders = [
    { order: '10005432', mat: 'MOD-540W-Mono', tgt: 5000, prod: 4500, bal: 500, status: 'Active' },
    { order: '10005433', mat: 'MOD-540W-Mono', tgt: 2000, prod: 2000, bal: 0, status: 'Completed' },
    { order: '10005434', mat: 'MOD-550W-Bifi', tgt: 1500, prod: 100, bal: 1400, status: 'Active' },
    { order: '10005435', mat: 'MOD-400W-Poly', tgt: 800, prod: 0, bal: 800, status: 'Created' },
    { order: '10005436', mat: 'MOD-540W-Mono', tgt: 3000, prod: 1500, bal: 1500, status: 'Active' },
  ];

  const filteredOrders = sapOrders.filter(o => o.order.includes(searchTerm) || o.mat.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">SAP Integration Dashboard</h1>

      <div className="card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search Order or Material..." 
              className="pl-10 pr-4 py-2 border rounded-lg dark:bg-dark-bg dark:border-dark-border w-full md:w-80 outline-none focus:border-primary"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-gray-100 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded hover:bg-gray-200 transition-colors">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </button>
            <button className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors">
              <Download className="w-4 h-4 mr-2" /> Export to Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-300">
                <th className="py-3 px-4 font-medium">Order Number</th>
                <th className="py-3 px-4 font-medium">Material Code</th>
                <th className="py-3 px-4 font-medium text-right">Target Qty</th>
                <th className="py-3 px-4 font-medium text-right">Produced Qty</th>
                <th className="py-3 px-4 font-medium text-right">Balance Qty</th>
                <th className="py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border/30">
                  <td className="py-3 px-4 font-medium text-primary cursor-pointer hover:underline">{row.order}</td>
                  <td className="py-3 px-4">{row.mat}</td>
                  <td className="py-3 px-4 text-right">{row.tgt}</td>
                  <td className="py-3 px-4 text-right">{row.prod}</td>
                  <td className="py-3 px-4 text-right font-medium">{row.bal}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      row.status === 'Completed' ? 'bg-success/20 text-success' : 
                      row.status === 'Active' ? 'bg-primary/20 text-primary' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="py-8 text-center text-gray-500">No orders found matching your search.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SAPData;
