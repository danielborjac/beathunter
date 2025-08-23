import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaMusic, FaCalendar, FaBars, FaTimes, FaBook } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Inicio', icon: <FaHome /> },
    { path: '/dashboard/users', label: 'Usuarios', icon: <FaUser /> },
    { path: '/dashboard/params', label: 'Parámetros generales', icon: <FaBook /> },
    { path: '/dashboard/categories', label: 'Modo clásico', icon: <FaMusic /> },
    { path: '/dashboard/daily-songs', label: 'Modo diario', icon: <FaCalendar /> },
  ];

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <h2 className="sidebar-title">Admin Panel</h2>
        <ul>
          {navItems.map(item => (
            <li
              key={item.path}
              className={location.pathname === item.path ? 'active' : ''}
              onClick={() => setIsOpen(false)}
            >
              <Link to={item.path}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;