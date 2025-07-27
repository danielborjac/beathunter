import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import playClickSound from '../utils/playClickSound';
import { FaMusic, FaGamepad } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import LoginForm from '../components/LoginForm';
import { useState } from 'react';
import Modal from '../components/modal';

export default function HomePage() {
  const { token } = useSelector(state => state.auth);
  const [showLogin, setShowLogin] = useState(false);

  const navigate = useNavigate();

  const handleNormalClick= (route) => {
    playClickSound();
    if (!token) {
      setShowLogin(true);
    } else {
      navigate(route);
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-title">🎵 ¡Bienvenido a Beathunter!</h1>
      <p className="home-subtitle">¿Cuántas canciones puedes adivinar?</p>
      <div className="mode-buttons">
        <button className="mode-btn" onClick={() => { handleNormalClick('/daily')}}><FaMusic /> Modo Diario</button>
        <button className="mode-btn" onClick={() => { handleNormalClick('/normal')}}>Modo Normal</button>
        <button className="mode-btn" onClick={() => { handleNormalClick('/normal')}}>Modo Categoría</button>
        <button className="mode-btn" onClick={() => { handleNormalClick('/leaderboard')}}>Leaderboard</button>
      </div>

      {showLogin && (
        <Modal show={showLogin} onClose={() => setShowLogin(false)}>
          <LoginForm onSuccess={() => setShowLogin(false)} />
        </Modal>
      )}

    </div>
  );
}