import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import KPICard from '../components/KPICard';
import UploadRequiredNotice from '../components/UploadRequiredNotice';
import { CheckCircle, RefreshCw, XCircle } from 'lucide-react';

const Quality = () => {
  const { hasUploadedWorkbook } = useOutletContext();
  const yieldTrend = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [{
      label: 'Yield %',
      data: [98.5, 98.2, 98.8, 97.5, 98.1, 98.9, 99.1],
      borderColor: '#10b981',
      tension: 0.4,
      fill: false
    }]
  };

  const defectData = {
    labels: ['Microcracks', 'Soldering', 'Scratches', 'Alignment', 'Other'],
    datasets: [{
      data: [45, 25, 15, 10, 5],
      backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#6b7280']
    }]
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quality Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Overall Yield" value="98.5" unit="%" target="> 99%" status="warning" icon={CheckCircle} />
        <KPICard title="FTY (First Time Yield)" value="96.2" unit="%" target="> 95%" status="good" icon={CheckCircle} />
        <KPICard title="Defect Rate" value="1.5" unit="%" target="< 1%" status="danger" icon={XCircle} />
        <KPICard title="Rework Rate" value="2.3" unit="%" target="< 2%" status="warning" icon={RefreshCw} />
      </div>

      {hasUploadedWorkbook ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card min-h-[300px] flex flex-col">
            <h3 className="text-lg font-medium mb-4">7-Day Yield Trend</h3>
            <div className="flex-1 min-h-[250px]">
              <Line data={yieldTrend} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 95, grid: { color: '#374151' } }, x: { grid: { color: '#374151' } } } }} />
            </div>
          </div>

          <div className="card min-h-[300px] flex flex-col">
            <h3 className="text-lg font-medium mb-4">Defect Analysis</h3>
            <div className="flex-1 min-h-[250px] flex justify-center">
              <Doughnut data={defectData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#9ca3af' } } } }} />
            </div>
          </div>
        </div>
      ) : (
        <UploadRequiredNotice />
      )}
    </div>
  );
};

export default Quality;
