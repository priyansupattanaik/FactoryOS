import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import KPICard from '../components/KPICard';
import UploadRequiredNotice from '../components/UploadRequiredNotice';
import { Archive, AlertCircle, TrendingUp } from 'lucide-react';

const Backlog = () => {
  const { hasUploadedWorkbook } = useOutletContext();
  const backlogData = {
    labels: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'],
    datasets: [{
      label: 'Pending Quantity (pcs)',
      data: [1200, 450, 2000, 150, 0],
      backgroundColor: '#f59e0b',
    }]
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Backlog Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Total Backlog" value="3,800" unit="pcs" status="danger" icon={Archive} />
        <KPICard title="Critical Orders" value="2" status="danger" icon={AlertCircle} />
        <KPICard title="Clearance Rate" value="850" unit="pcs/day" status="good" icon={TrendingUp} />
      </div>

      {hasUploadedWorkbook ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card lg:col-span-2 min-h-[350px] flex flex-col">
            <h3 className="text-lg font-medium mb-4">Line-wise Backlog Quantity</h3>
            <div className="flex-1 min-h-[250px]">
              <Bar data={backlogData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="card flex flex-col">
            <h3 className="text-lg font-medium mb-4">Pending Orders</h3>
            <div className="space-y-3 overflow-y-auto">
              {[
                { id: 'ORD-7721', qty: 2000, line: 'Line 3', due: 'Today' },
                { id: 'ORD-7725', qty: 1200, line: 'Line 1', due: 'Tomorrow' },
                { id: 'ORD-7730', qty: 450, line: 'Line 2', due: 'In 2 days' },
                { id: 'ORD-7732', qty: 150, line: 'Line 4', due: 'In 3 days' },
              ].map((ord, i) => (
                <div key={i} className="p-3 border border-gray-100 dark:border-dark-border rounded hover:shadow-sm">
                  <div className="flex justify-between font-medium mb-1">
                    <span className="text-primary">{ord.id}</span>
                    <span>{ord.qty} pcs</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Assigned: {ord.line}</span>
                    <span className={ord.due === 'Today' ? 'text-danger' : ''}>Due: {ord.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <UploadRequiredNotice />
      )}
    </div>
  );
};

export default Backlog;
