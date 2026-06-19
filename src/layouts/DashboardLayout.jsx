import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  AlertTriangle, 
  Wrench, 
  CheckCircle, 
  Layers, 
  Users, 
  Archive, 
  Package, 
  Database, 
  FileText,
  Moon,
  Sun
} from 'lucide-react';
import FileUploadControl from '../components/FileUploadControl';

const navItems = [
  { path: '/', label: 'Home', icon: LayoutDashboard },
  { path: '/production', label: 'Production', icon: Activity },
  { path: '/downtime', label: 'Downtime', icon: AlertTriangle },
  { path: '/maintenance', label: 'Maintenance', icon: Wrench },
  { path: '/quality', label: 'Quality', icon: CheckCircle },
  { path: '/grading', label: 'Grading', icon: Layers },
  { path: '/manpower', label: 'Manpower', icon: Users },
  { path: '/backlog', label: 'Backlog', icon: Archive },
  { path: '/packing', label: 'Packing', icon: Package },
  { path: '/sap', label: 'SAP Data', icon: Database },
  { path: '/reports', label: 'Reports', icon: FileText },
];

const DashboardLayout = ({ darkMode, setDarkMode, onUpload, uploadState, workbook }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-dark-bg text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-dark-border flex flex-col transition-colors duration-200">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-dark-border">
          <h1 className="text-xl font-bold tracking-wider text-primary">FACTORY<span className="text-gray-800 dark:text-white">OS</span></h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-border hover:text-gray-900 dark:hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border flex items-center justify-between px-6 transition-colors duration-200">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Shift A | 08:00 - 16:00</span>
          </div>
          <div className="flex items-center space-x-4">
            <FileUploadControl onUpload={onUpload} uploadState={uploadState} workbook={workbook} />
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-border text-gray-600 dark:text-gray-400 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet context={{ hasUploadedWorkbook: Boolean(workbook) }} />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
