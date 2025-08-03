import { useNavigate } from 'react-router-dom';
import './GameModes.css';
import normalIcon from '/assets/icons/normal.svg';
import dailyIcon from '/assets/icons/daily.svg';
import categoryIcon from '/assets/icons/category.svg';
import LoginForm from '../components/LoginForm';
import Modal from '../components/modal';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import playClickSound from '../utils/playClickSound';


export default function GameModes() {
    const navigate = useNavigate();

    const { token } = useSelector(state => state.auth);
    const [showLogin, setShowLogin] = useState(false);


    const handleNormalClick= (route) => {
        playClickSound();
        if (!token) {
        setShowLogin(true);
        } else {
        navigate(route);
        }
    };

    const gameModes = [
    {
        title: 'Modo Diario',
        description: 'Adivina la canción del día y compite contra todos los jugadores.',
        icon: dailyIcon,
        route: '/daily',
        size: 'normal',
    },
    {
        title: 'Modo Clásico',
        description: '6 canciones aleatorias para demostrar tu conocimiento musical.',
        icon: normalIcon,
        route: '/normal',
        size: 'normal',
    },
    {
        title: 'Modo Género',
        description: 'Elige tu género favorito y desafía tu oído musical.',
        icon: categoryIcon,
        route: '/category',
        size: 'large',
    }
    ];

    return (
    <section className="game-modes-container">
        {gameModes.map((mode, idx) => (
        <div
            key={idx}
            className={`mode-card ${mode.size}`}
            onClick={() => handleNormalClick(mode.route)}
        >
            <img src={mode.icon} alt={mode.title} className="mode-icon" />
            <h3>{mode.title}</h3>
            <p>{mode.description}</p>
        </div>
        ))}
        {showLogin && (
        <Modal show={showLogin} onClose={() => setShowLogin(false)}>
            <LoginForm onSuccess={() => setShowLogin(false)} />
        </Modal>
        )}
    </section>
    );
}