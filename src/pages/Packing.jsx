import React from 'react';
import { useOutletContext } from 'react-router-dom';
import KPICard from '../components/KPICard';
import { Package, PackageCheck, Truck } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import UploadRequiredNotice from '../components/UploadRequiredNotice';

const Packing = () => {
  const { hasUploadedWorkbook } = useOutletContext();
  const packingTrend = {
    labels: ['Shift A', 'Shift B', 'Shift C'],
    datasets: [
      {
        label: 'Packed Quantities',
        data: [420, 380, 0],
        backgroundColor: '#8b5cf6',
      }
    ]
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Packing Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Packed Today" value="800" unit="pcs" target="1,000" status="warning" icon={PackageCheck} />
        <KPICard title="Pending Packing" value="150" unit="pcs" status="warning" icon={Package} />
        <KPICard title="Dispatch Ready" value="750" unit="pcs" status="good" icon={Truck} />
      </div>

      {hasUploadedWorkbook ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card min-h-[300px] flex flex-col">
            <h3 className="text-lg font-medium mb-4">Packing by Shift</h3>
            <div className="flex-1 min-h-[250px]">
              <Bar data={packingTrend} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="card flex flex-col">
            <h3 className="text-lg font-medium mb-4">Recent Pallets</h3>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-dark-border text-gray-500 text-sm">
                    <th className="pb-2">Pallet ID</th>
                    <th className="pb-2">Grade</th>
                    <th className="pb-2">Quantity</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { id: 'PAL-1001', grade: 'A', qty: 30, status: 'Ready' },
                    { id: 'PAL-1002', grade: 'A', qty: 30, status: 'Ready' },
                    { id: 'PAL-1003', grade: 'B', qty: 30, status: 'In Progress' },
                    { id: 'PAL-1004', grade: 'D', qty: 15, status: 'In Progress' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-dark-border">
                      <td className="py-3 font-medium">{row.id}</td>
                      <td className="py-3">{row.grade}</td>
                      <td className="py-3">{row.qty}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs ${row.status === 'Ready' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <UploadRequiredNotice />
      )}
    </div>
  );
};

export default Packing;
