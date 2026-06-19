import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';

const Maintenance = () => {
  const healthData = {
    labels: ['Excellent', 'Good', 'Fair', 'Needs Attention', 'Critical'],
    datasets: [
      {
        data: [45, 30, 15, 7, 3],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'],
        borderWidth: 0,
      }
    ]
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Maintenance Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center py-6">
          <h3 className="text-gray-500 dark:text-gray-400 mb-2">Running Machines</h3>
          <span className="text-4xl font-bold text-success">42</span>
        </div>
        <div className="card text-center py-6">
          <h3 className="text-gray-500 dark:text-gray-400 mb-2">Idle Machines</h3>
          <span className="text-4xl font-bold text-warning">5</span>
        </div>
        <div className="card text-center py-6">
          <h3 className="text-gray-500 dark:text-gray-400 mb-2">Breakdown</h3>
          <span className="text-4xl font-bold text-danger">3</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card flex flex-col min-h-[300px]">
          <h3 className="text-lg font-medium mb-4">Overall Machine Health</h3>
          <div className="flex-1 min-h-[250px] flex justify-center">
            <Doughnut data={healthData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#9ca3af' } } } }} />
          </div>
        </div>

        <div className="card flex flex-col">
          <h3 className="text-lg font-medium mb-4">PM Tracker (Preventive Maintenance)</h3>
          <div className="space-y-4">
            {[
              { m: 'Stringer 1', d: 'Today', s: 'Pending' },
              { m: 'Laminator 2', d: 'Tomorrow', s: 'Scheduled' },
              { m: 'Framer 1', d: 'Overdue (1 day)', s: 'Overdue' },
              { m: 'EL Tester', d: 'Next Week', s: 'Scheduled' }
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark-border/30 rounded">
                <div>
                  <div className="font-medium">{item.m}</div>
                  <div className="text-sm text-gray-500">{item.d}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.s === 'Overdue' ? 'bg-danger/20 text-danger' :
                  item.s === 'Pending' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'
                }`}>{item.s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
