import React, { useEffect, useState } from "react";
import "./DashboardHome.css";
import DashboardCard from "../../components/dashboard/DashboardCard";
import { countUsers } from "../../api/dashboard/users";
import { countCategories } from "../../api/dashboard/categories";
import { FaUsers, FaGuitar, FaCompactDisc, FaMusic } from "react-icons/fa";

export default function DashboardHome() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const userData = await countUsers(token);
        setTotalUsers(userData.totalUsers);

        const categoryData = await countCategories();
        setCategories(categoryData);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="dashboard-home">Cargando...</div>;

  return (
    <div className="dashboard-home">
      <h2>Panel de control</h2>
      <div className="dashboard-cards">
        <DashboardCard
          icon={<FaUsers />}
          title="Usuarios"
          value={totalUsers}
          color="#4cafef"
        />
        <DashboardCard
          icon={<FaCompactDisc />}
          title="Géneros"
          value={categories.genre || 0}
          color="#ff9800"
        />
        <DashboardCard
          icon={<FaMusic />}
          title="Mixes personalizados"
          value={categories.mix || 0}
          color="#8bc34a"
        />
        <DashboardCard
          icon={<FaGuitar />}
          title="Artistas"
          value={categories.artist || 0}
          color="#e91e63"
        />
      </div>
    </div>
  );
}