import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';

import Dashboard from '../pages/dashboard/DashboardHome';
import UsersPage from '../pages/dashboard/UsersPage';
import CategoriesPage from '../pages/dashboard/CategoriesPage';
import DailySongsPage from '../pages/dashboard/DailySongsPage';
import GeneralParams from '../pages/dashboard/GeneralParams';

const DashboardRoutes = () => {
  return (
    <div style={{ display: 'flex' }}>

      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/daily-songs" element={<DailySongsPage />} />
        <Route path="/params" element={<GeneralParams />} />
      </Routes>
    </div>
  );
};

export default DashboardRoutes;