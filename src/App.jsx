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
import NotFound from './pages/NotFound';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [uploadedWorkbook, setUploadedWorkbook] = useState(null);
  const [uploadState, setUploadState] = useState({
    status: 'idle',
    error: '',
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    setUploadState({
      status: 'uploading',
      error: '',
    });

    try {
      const response = await fetch('/api/uploads/parse', {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Upload failed.');
      }

      setUploadedWorkbook(payload);
      setUploadState({
        status: 'success',
        error: '',
      });
    } catch (error) {
      setUploadState({
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed.',
      });
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={(
          <DashboardLayout
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onUpload={handleUpload}
            uploadState={uploadState}
            workbook={uploadedWorkbook}
          />
        )}
      >
        <Route index element={<Home />} />
        <Route path="production" element={<Production />} />
        <Route path="downtime" element={<Downtime />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="quality" element={<Quality />} />
        <Route path="grading" element={<Grading />} />
        <Route path="manpower/entry" element={<ManpowerEntry />} />
        <Route path="manpower" element={<Manpower />} />
        <Route path="backlog" element={<Backlog />} />
        <Route path="packing" element={<Packing />} />
        <Route path="sap" element={<SAPData />} />
        <Route
          path="reports"
          element={<Reports uploadedWorkbook={uploadedWorkbook} uploadState={uploadState} />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
