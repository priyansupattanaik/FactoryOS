import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import KPICard from '../components/KPICard';
import UploadRequiredNotice from '../components/UploadRequiredNotice';
import { Activity, Target, Zap, TrendingUp } from 'lucide-react';

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: '#9ca3af' },
    },
  },
  scales: {
    x: {
      grid: { color: '#374151', drawBorder: false },
      ticks: { color: '#9ca3af' },
    },
    y: {
      grid: { color: '#374151', drawBorder: false },
      ticks: { color: '#9ca3af' },
    },
  },
};

const Production = () => {
  const { hasUploadedWorkbook } = useOutletContext();
  const hourlyData = {
    labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
    datasets: [
      {
        label: 'Actual',
        data: [120, 150, 145, 160, 130, 170, 185, 200],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Target',
        data: [150, 150, 150, 150, 150, 150, 150, 150],
        borderColor: '#10b981',
        borderDash: [5, 5],
        fill: false,
        tension: 0,
      },
    ],
  };

  const lineWiseData = {
    labels: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'],
    datasets: [
      {
        label: 'Output (pcs)',
        data: [220, 210, 180, 230, 0],
        backgroundColor: ['#3b82f6', '#3b82f6', '#f59e0b', '#10b981', '#ef4444'],
      },
    ],
  };

  const lines = [
    { name: 'Line 1', output: 220, target: 240, status: 'Running', efficiency: 92 },
    { name: 'Line 2', output: 210, target: 240, status: 'Running', efficiency: 88 },
    { name: 'Line 3', output: 180, target: 240, status: 'Idle', efficiency: 75 },
    { name: 'Line 4', output: 230, target: 240, status: 'Running', efficiency: 96 },
    { name: 'Line 5', output: 0, target: 240, status: 'Down', efficiency: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Production Dashboard</h1>
        <div className="flex space-x-2">
          <select className="px-3 py-1.5 rounded bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border outline-none text-sm">
            <option>Shift A</option>
            <option>Shift B</option>
            <option>Shift C</option>
          </select>
          <input
            type="date"
            className="px-3 py-1.5 rounded bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border outline-none text-sm"
            defaultValue={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Output" value="840" target="1,200" unit="pcs" status="warning" icon={Activity} />
        <KPICard title="Target Achievement" value="70" unit="%" target="> 90%" status="danger" icon={Target} />
        <KPICard title="OEE" value="76.5" unit="%" target="85%" status="warning" icon={Zap} />
        <KPICard title="Hourly Rate" value="105" unit="pcs/hr" status="good" icon={TrendingUp} />
      </div>

      {hasUploadedWorkbook ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card min-h-[350px] flex flex-col">
            <h3 className="text-lg font-medium mb-4">Hourly Production Trend</h3>
            <div className="flex-1 min-h-[280px]">
              <Line data={hourlyData} options={chartOptions} />
            </div>
          </div>

          <div className="card min-h-[350px] flex flex-col">
            <h3 className="text-lg font-medium mb-4">Line-wise Output</h3>
            <div className="flex-1 min-h-[280px]">
              <Bar data={lineWiseData} options={chartOptions} />
            </div>
          </div>
        </div>
      ) : (
        <UploadRequiredNotice />
      )}

      <div className="card">
        <h3 className="text-lg font-medium mb-4">Line Status Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-dark-border text-gray-500 dark:text-gray-400 text-sm">
                <th className="pb-3 font-medium">Line</th>
                <th className="pb-3 font-medium text-right">Output (pcs)</th>
                <th className="pb-3 font-medium text-right">Target (pcs)</th>
                <th className="pb-3 font-medium text-right">Efficiency</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {lines.map((line) => (
                <tr
                  key={line.name}
                  className="border-b border-gray-100 dark:border-dark-border/50 hover:bg-gray-50 dark:hover:bg-dark-border/30"
                >
                  <td className="py-3 font-medium">{line.name}</td>
                  <td className="py-3 text-right">{line.output}</td>
                  <td className="py-3 text-right text-gray-500">{line.target}</td>
                  <td className="py-3 text-right font-medium">{line.efficiency}%</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        line.status === 'Running'
                          ? 'bg-success/20 text-success'
                          : line.status === 'Idle'
                            ? 'bg-warning/20 text-warning'
                            : 'bg-danger/20 text-danger'
                      }`}
                    >
                      {line.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Production;
