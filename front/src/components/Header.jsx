import Modal from './modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../auth/authSlice';
import './Header.css'


export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => dispatch(logout());
  console.log(useSelector(state => state));
  return (
    <header className="main-header">
      <div className="logo">🎵 Beathunter</div>
      <nav>
        {!user ? (
          <>
            <button className="btn" onClick={() => setShowLogin(true)}>Iniciar Sesión</button>
            <button className="btn-outline" onClick={() => setShowRegister(true)}>Registrarse</button>
          </>
        ) : (
          <>
            <span className="username">👤 {user.username}</span>
            <button className="btn" onClick={handleLogout}>Cerrar sesión</button>
          </>
        )}
      </nav>

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