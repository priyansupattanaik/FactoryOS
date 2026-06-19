import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Users, UserCheck, UserMinus, Plus } from 'lucide-react';
import KPICard from '../components/KPICard';

const Manpower = () => {
  const navigate = useNavigate();

  const attendanceData = {
    labels: ['Production', 'Quality', 'Maintenance', 'Store', 'Logistics'],
    datasets: [
      { label: 'Present', data: [120, 25, 15, 10, 8], backgroundColor: '#10b981' },
      { label: 'Absent', data: [5, 2, 1, 0, 1], backgroundColor: '#ef4444' }
    ]
  };

  const lineUtilization = {
    labels: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'],
    datasets: [{
      data: [100, 95, 80, 100, 90],
      backgroundColor: ['#3b82f6', '#3b82f6', '#f59e0b', '#3b82f6', '#10b981']
    }]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manpower Dashboard</h1>
        <button 
          onClick={() => navigate('/manpower/entry')}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Manpower Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Total Present" value="178" target="187 (Req)" status="warning" icon={UserCheck} />
        <KPICard title="Total Absent" value="9" status="danger" icon={UserMinus} />
        <KPICard title="Overall Utilization" value="95.1" unit="%" status="good" icon={Users} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((line) => (
          <div 
            key={line} 
            className="card cursor-pointer hover:border-primary transition-colors"
            onClick={() => navigate('/manpower/entry')}
          >
            <h4 className="font-medium mb-3">Line {line}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Required:</span>
                <span className="font-medium">25</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Present:</span>
                <span className="font-medium text-success">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Utilization:</span>
                <span className="font-medium">96%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card flex flex-col min-h-[300px]">
          <h3 className="text-lg font-medium mb-4">Department-wise Attendance</h3>
          <div className="flex-1 min-h-[250px]">
            <Bar 
              data={attendanceData} 
              options={{ maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }} 
            />
          </div>
        </div>

        <div className="card flex flex-col min-h-[300px]">
          <h3 className="text-lg font-medium mb-4">Line Utilization %</h3>
          <div className="flex-1 min-h-[250px] flex justify-center">
            <Doughnut data={lineUtilization} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manpower;
