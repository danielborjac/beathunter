import Modal from './Modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { rehydrateAuth, logout } from '../auth/authSlice';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import {getTokenFromStorage, isTokenExpired, getUserFromToken} from '../utils/authUtils';
import './Header.css'



export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const handleLogout = () => dispatch(logout());
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false); 
      return
    }
    if (user.role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) return;
    const token = getTokenFromStorage();
    if (!token) {
      setLoadingAuth(false);
      return;
    }

    if (isTokenExpired(token)) {
      dispatch(logout());
      setLoadingAuth(false);
    } else {
      const userFromToken = getUserFromToken(token);
      dispatch(rehydrateAuth({ token, user: userFromToken }));
      setLoadingAuth(false);
    }
  }, [dispatch, user]);

  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

  return (
    <header className="main-header">
      <div className="logo">
        <img src="assets/logo.png" alt="Logo" onClick={() => navigate('/')} />
      </div>
      <nav className="nav-desktop">
        {loadingAuth ? (
          <p className="auth-loading">Cargando...</p>
        ) : !user ? (
          <>
            <button className="btn" onClick={() => setShowLogin(true)}>Iniciar Sesión</button>
            <button className="btn-outline" onClick={() => setShowRegister(true)}>Registrarse</button>
          </>
        ) : (
          <>
            <span className="username">👤 {user.username}</span>
            {isAdmin && ( <button className="btn-outline" onClick={() => navigate('/dashboard')}>Dashboard</button> )}
            <button className="btn" onClick={handleLogout}>Cerrar sesión</button>
          </>
        )}
      </nav>

      {!user ? (
        <div className="hamburger" onClick={toggleMobileMenu}>
          ☰
        </div>
      ) : (
        <div className="mobile-name" onClick={toggleMobileMenu}>
          <strong>👤 {user.username}</strong>
        </div>
      )}

      {showMobileMenu && (
        !user ? (
          <div className="mobile-menu">
            <ul>
              <li onClick={() => { setShowLogin(true); setShowMobileMenu(false); }}>Iniciar Sesión</li>
              <li onClick={() => { setShowRegister(true); setShowMobileMenu(false); }}>Registrarse</li>
            </ul>
          </div>
        ): (
          <div className="mobile-menu">
            <ul>
              <li onClick={() => navigate('/leaderboard')}>Leaderboard</li>
              {isAdmin && ( <li onClick={() => navigate('/dashboard')}>Dashboard</li> )}
              <li onClick={() => { handleLogout(); setShowMobileMenu(false); }}>Cerrar sesión</li>
            </ul>
          </div>
        )
      )}

      {/* Modales */}
      <Modal show={showLogin} onClose={() => setShowLogin(false)}>
        <LoginForm onSuccess={() => setShowLogin(false)} />
      </Modal>

      <Modal show={showRegister} onClose={() => setShowRegister(false)}>
        <RegisterForm onSuccess={() => setShowRegister(false)} />
      </Modal>
    </header>
  );
}