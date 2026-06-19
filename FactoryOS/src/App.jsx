import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Production from './pages/Production';
import Downtime from './pages/Downtime';
import Maintenance from './pages/Maintenance';
import Quality from './pages/Quality';
import Grading from './pages/Grading';
import Manpower from './pages/Manpower';
import ManpowerEntry from './pages/ManpowerEntry';
import Backlog from './pages/Backlog';
import Packing from './pages/Packing';
import SAPData from './pages/SAPData';
import Reports from './pages/Reports';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Routes>
      <Route path="/" element={<DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode} />}>
        <Route index element={<Home />} />
        <Route path="production" element={<Production />} />
        <Route path="downtime" element={<Downtime />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="quality" element={<Quality />} />
        <Route path="grading" element={<Grading />} />
        <Route path="manpower" element={<Manpower />} />
        <Route path="manpower/entry" element={<ManpowerEntry />} />
        <Route path="backlog" element={<Backlog />} />
        <Route path="packing" element={<Packing />} />
        <Route path="sap" element={<SAPData />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}

export default App;
