import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import UploadRequiredNotice from '../components/UploadRequiredNotice';

const Grading = () => {
  const { hasUploadedWorkbook } = useOutletContext();
  const gradeTrend = {
    labels: ['Shift 1', 'Shift 2', 'Shift 3', 'Shift 1', 'Shift 2'],
    datasets: [
      { label: 'Grade A', data: [850, 840, 860, 880, 875], backgroundColor: '#10b981' },
      { label: 'Grade B', data: [120, 130, 110, 90, 100], backgroundColor: '#3b82f6' },
      { label: 'Grade D', data: [20, 25, 15, 20, 15], backgroundColor: '#f59e0b' },
      { label: 'Grade E', data: [10, 5, 10, 8, 5], backgroundColor: '#ef4444' },
      { label: 'Grade R', data: [0, 0, 5, 2, 5], backgroundColor: '#6b7280' },
    ]
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Grading Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {['Grade A (85%)', 'Grade B (12%)', 'Grade D (2%)', 'Grade E (0.8%)', 'Grade R (0.2%)'].map((grade, i) => {
          const colors = ['bg-success/10 text-success border-success/20', 'bg-primary/10 text-primary border-primary/20', 'bg-warning/10 text-warning border-warning/20', 'bg-danger/10 text-danger border-danger/20', 'bg-gray-500/10 text-gray-500 border-gray-500/20'];
          return (
            <div key={i} className={`card text-center border ${colors[i]}`}>
              <div className="text-lg font-bold">{grade.split(' ')[0]} {grade.split(' ')[1]}</div>
              <div className="text-sm opacity-80 mt-1">{grade.split(' ')[2]}</div>
            </div>
          );
        })}
      </div>

      {hasUploadedWorkbook ? (
        <div className="card min-h-[400px] flex flex-col">
          <h3 className="text-lg font-medium mb-4">Grade Trends over Shifts</h3>
          <div className="flex-1 min-h-[300px]">
            <Bar 
              data={gradeTrend} 
              options={{ 
                maintainAspectRatio: false, 
                scales: { 
                  x: { stacked: true, grid: { color: '#374151' }, ticks: { color: '#9ca3af' } }, 
                  y: { stacked: true, grid: { color: '#374151' }, ticks: { color: '#9ca3af' } } 
                },
                plugins: { legend: { labels: { color: '#9ca3af' } } }
              }} 
            />
          </div>
        </div>
      ) : (
        <UploadRequiredNotice />
      )}
    </div>
  );
};

export default Grading;
