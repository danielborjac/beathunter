import React, { useEffect, useState } from 'react';
import { FaUser, FaMusic, FaCalendar } from 'react-icons/fa';
import DashboardCard from '../../components/dashboard/DashboardCard';
import './PageStyles.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    categories: 0,
    dailySongs: 0,
  });

  useEffect(() => {
    // Reemplazar con llamadas reales a tu API
    const fetchStats = async () => {
      try {
        const [userRes, categoryRes, dailyRes] = await Promise.all([
          fetch('/api/profile'), // suponiendo que retorna total de usuarios
          fetch('/api/categories'),
          fetch('/api/daily')
        ]);

        const users = await userRes.json();
        const categories = await categoryRes.json();
        const dailySongs = await dailyRes.json();

        setStats({
          users: users.length,
          categories: categories.length,
          dailySongs: dailySongs.length,
        });
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="page-container">
      <h1>Panel de Administración</h1>
      <div className="dashboard-cards">
        <DashboardCard title="Usuarios" value={stats.users} icon={<FaUser />} />
        <DashboardCard title="Categorías" value={stats.categories} icon={<FaMusic />} />
        <DashboardCard title="Canciones Diarias" value={stats.dailySongs} icon={<FaCalendar />} />
      </div>
    </div>
  );
};

export default Dashboard;