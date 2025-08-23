import React from "react";
import "./DashboardCard.css";

export default function DashboardCard({ icon, title, value, color }) {
  return (
    <div className="dashboard-card" style={{ borderTop: `4px solid ${color}` }}>
      <div className="dashboard-card-icon" style={{ color }}>
        {icon}
      </div>
      <div className="dashboard-card-info">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </div>
  );
}