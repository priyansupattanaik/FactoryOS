import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import KPICard from '../components/KPICard';
import UploadRequiredNotice from '../components/UploadRequiredNotice';
import { Clock, Wrench, Zap, CheckCircle, Package } from 'lucide-react';

const Downtime = () => {
  const { hasUploadedWorkbook } = useOutletContext();
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: '#374151', drawBorder: false }, ticks: { color: '#9ca3af' } },
      y: { grid: { color: '#374151', drawBorder: false }, ticks: { color: '#9ca3af' } }
    }
  };

  const paretoData = {
    labels: ['Stringer Fault', 'Material Shortage', 'Laminator Heat', 'Robot Calibration', 'Glass Loading'],
    datasets: [
      {
        type: 'line',
        label: 'Cumulative %',
        data: [45, 70, 85, 95, 100],
        borderColor: '#f59e0b',
        borderWidth: 2,
        fill: false,
        yAxisID: 'y1',
      },
      {
        type: 'bar',
        label: 'Minutes',
        data: [120, 65, 40, 25, 13],
        backgroundColor: '#ef4444',
        yAxisID: 'y',
      }
    ]
  };

  const paretoOptions = {
    ...chartOptions,
    plugins: { legend: { display: true, labels: { color: '#9ca3af' } } },
    scales: {
      x: { grid: { color: '#374151', drawBorder: false }, ticks: { color: '#9ca3af' } },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: { color: '#374151', drawBorder: false },
        ticks: { color: '#9ca3af' }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { color: '#9ca3af', max: 100 }
      },
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Downtime Dashboard</h1>
        <div className="flex space-x-2">
          <input type="date" className="px-3 py-1.5 rounded bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border outline-none text-sm" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard title="Total Downtime" value="263" unit="mins" status="danger" icon={Clock} />
        <KPICard title="Mechanical" value="145" unit="mins" status="warning" icon={Wrench} />
        <KPICard title="Electrical" value="30" unit="mins" status="good" icon={Zap} />
        <KPICard title="Quality" value="23" unit="mins" status="good" icon={CheckCircle} />
        <KPICard title="Material" value="65" unit="mins" status="warning" icon={Package} />
      </div>

      {hasUploadedWorkbook ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card min-h-[400px] flex flex-col">
            <h3 className="text-lg font-medium mb-4">Downtime Pareto Analysis</h3>
            <div className="flex-1 min-h-[300px]">
              <Bar data={paretoData} options={paretoOptions} />
            </div>
          </div>

          <div className="card flex flex-col">
            <h3 className="text-lg font-medium mb-4">Machine-wise Downtime</h3>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-dark-border text-gray-500 dark:text-gray-400 text-sm">
                    <th className="pb-3 font-medium">Machine</th>
                    <th className="pb-3 font-medium">Line</th>
                    <th className="pb-3 font-medium">Reason</th>
                    <th className="pb-3 font-medium text-right">Duration (m)</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { m: 'Stringer 3', l: 'Line 2', r: 'Cell Tab Fault', d: 120, s: 'Resolved' },
                    { m: 'Layup Robot', l: 'Line 1', r: 'Material Shortage', d: 65, s: 'Active' },
                    { m: 'Laminator 1', l: 'Line 4', r: 'Heating Element', d: 40, s: 'Resolved' },
                    { m: 'Framer', l: 'Line 2', r: 'Sensor Error', d: 25, s: 'Resolved' },
                    { m: 'Bussing Sta', l: 'Line 3', r: 'Operator Break', d: 13, s: 'Resolved' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-dark-border/50 hover:bg-gray-50 dark:hover:bg-dark-border/30">
                      <td className="py-3 font-medium">{row.m}</td>
                      <td className="py-3">{row.l}</td>
                      <td className="py-3 text-gray-500 dark:text-gray-400">{row.r}</td>
                      <td className="py-3 text-right font-medium text-danger">{row.d}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs ${row.s === 'Active' ? 'bg-danger/20 text-danger' : 'bg-success/20 text-success'}`}>
                          {row.s}
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

export default Downtime;
