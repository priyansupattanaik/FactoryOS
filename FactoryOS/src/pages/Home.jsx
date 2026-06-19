import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import KPICard from '../components/KPICard';
import { Activity, Target, Zap, CheckCircle, AlertTriangle, Users, ShieldAlert } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Home = () => {
  // Chart configurations and dummy data
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#9ca3af' }
      }
    },
    scales: {
      x: {
        grid: { color: '#374151', drawBorder: false },
        ticks: { color: '#9ca3af' }
      },
      y: {
        grid: { color: '#374151', drawBorder: false },
        ticks: { color: '#9ca3af' }
      }
    }
  };

  const productionData = {
    labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
    datasets: [
      {
        label: 'Actual',
        data: [120, 150, 145, 160, 130, 170, 185],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Target',
        data: [150, 150, 150, 150, 150, 150, 150],
        borderColor: '#10b981',
        borderDash: [5, 5],
        fill: false,
        tension: 0
      }
    ]
  };

  const gradeData = {
    labels: ['Grade A', 'Grade B', 'Grade D', 'Grade E', 'Grade R'],
    datasets: [
      {
        label: 'Modules',
        data: [850, 120, 30, 15, 5],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#6b7280'],
      }
    ]
  };

  const downtimeData = {
    labels: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'],
    datasets: [
      {
        label: 'Downtime (mins)',
        data: [15, 45, 10, 0, 120],
        backgroundColor: '#ef4444',
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Plant Overview</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">Last updated: Just now</div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <KPICard title="Production" value="1,060" target="1,200" unit="pcs" status="warning" icon={Activity} />
        <KPICard title="Target Achieved" value="88" unit="%" status="warning" icon={Target} />
        <KPICard title="OEE" value="76.5" unit="%" target="85%" status="danger" icon={Zap} />
        <KPICard title="Yield" value="98.2" unit="%" target="99%" status="warning" icon={CheckCircle} />
        <KPICard title="Downtime" value="190" unit="mins" target="< 120 mins" status="danger" icon={AlertTriangle} />
        <KPICard title="Manpower" value="142" target="150" status="good" icon={Users} />
        <KPICard title="Safety Incidents" value="0" status="good" icon={ShieldAlert} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="card lg:col-span-2 min-h-[300px] flex flex-col">
          <h3 className="text-lg font-medium mb-4">Production Trend (Today)</h3>
          <div className="flex-1 min-h-[250px]">
            <Line data={productionData} options={chartOptions} />
          </div>
        </div>

        <div className="card min-h-[300px] flex flex-col">
          <h3 className="text-lg font-medium mb-4">Grade Distribution</h3>
          <div className="flex-1 min-h-[250px]">
            <Bar data={gradeData} options={{...chartOptions, indexAxis: 'y'}} />
          </div>
        </div>

        <div className="card lg:col-span-2 min-h-[300px] flex flex-col">
          <h3 className="text-lg font-medium mb-4">Downtime by Line</h3>
          <div className="flex-1 min-h-[250px]">
            <Bar data={downtimeData} options={chartOptions} />
          </div>
        </div>

        {/* Live Status & Alerts */}
        <div className="card flex flex-col space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Live Line Status</h3>
            <div className="space-y-3">
              {[
                { name: 'Line 1', status: 'running', label: 'Running' },
                { name: 'Line 2', status: 'running', label: 'Running' },
                { name: 'Line 3', status: 'idle', label: 'Idle (Material Shortage)' },
                { name: 'Line 4', status: 'running', label: 'Running' },
                { name: 'Line 5', status: 'down', label: 'Down (Stringer Fault)' },
              ].map((line) => (
                <div key={line.name} className="flex items-center justify-between">
                  <span className="font-medium">{line.name}</span>
                  <div className="flex items-center">
                    <span className={`w-2.5 h-2.5 rounded-full mr-2 ${
                      line.status === 'running' ? 'bg-success' : 
                      line.status === 'idle' ? 'bg-warning' : 'bg-danger'
                    }`}></span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{line.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Active Alerts</h3>
            <div className="space-y-2">
              <div className="p-3 bg-danger/10 border border-danger/20 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-danger mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-danger">Line 5 Breakdown</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Stringer machine fault detected. Maintenance team notified.</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-warning/10 border border-warning/20 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-warning mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-warning">Yield Drop Alert</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Line 2 yield dropped below 98% in the last hour.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
