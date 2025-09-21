import { useNavigate } from 'react-router-dom';
import './GameModes.css';
import normalIcon from '/assets/icons/random.svg';
import randomIcon from '/assets/icons/daily.svg';
import classicIcon from '/assets/icons/classic.svg';
import LoginForm from '../components/LoginForm';
import Modal from '../components/Modal';
import { useSelector } from 'react-redux';
import { useState, useEffect  } from 'react';
import playClickSound from '../utils/playClickSound';
import { fetchCategories } from '../api/categories'; 
import { getGameSessionDailyAttempt } from '../api/gameSession';


export default function GameModes() {
    const navigate = useNavigate();

    const { token } = useSelector(state => state.auth);
    const [showLogin, setShowLogin] = useState(false);

    const [categories, setCategories] = useState({ random: [] });

    const [isUserDailyPlayed, setIsUserDailyPlayed] = useState(false);


    const fetchDailyPlayed = async () => {
        try {
        if (!token) {
            setIsUserDailyPlayed(false);
            return;
        }
        const dailyAttempt = await getGameSessionDailyAttempt(token);
        setIsUserDailyPlayed(dailyAttempt.hasDailyAttempt === true);
        } catch (err) {
        console.error("Error al revisar partida:", err);
        setIsUserDailyPlayed(false);
        }
    };

    useEffect(() => {
        if (!token) {
        setIsUserDailyPlayed(false);
        return;
        }

        fetchDailyPlayed(); // primera comprobación inmediata

       
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    // Log cuando cambie el valor
    useEffect(() => {
    }, [isUserDailyPlayed]);


    useEffect(() => {
        const loadCategories = async () => {
        try {
            const data = await fetchCategories("random");
            setCategories(data);
        } catch(error){
            console.error(error);
        } 
        };
        loadCategories();
    }, []);


    const handleNormalClick= (route, id) => {
        playClickSound();
        if (!token && id!=2) {
        setShowLogin(true);
        } else {
            if(id==0){
                navigate(route, { state: {mode:'daily', limit: 3 }});
            }
            else if(id==1){
                const data = { type: 'mix', mode:'random', playlists: categories.random[0].playlist_ids, limit: 6 };
                navigate(route, { state: data });
            }
            else{
                navigate(route);
            }
        }
    };

    const gameModes = [
    {
        id: 0,
        title: 'Modo Diario',
        description: 'Adivina 3 canciónes del día y compite contra todos los jugadores.',
        icon: randomIcon,
        route: '/game',
        size: 'normal',
        state: isUserDailyPlayed,
    },
    {
        id:1,
        title: 'Modo Aleatorio',
        description: '6 canciones aleatorias para demostrar tu conocimiento musical.',
        icon: normalIcon,
        route: '/game',
        size: 'normal',
    },
    {
        id:2,
        title: 'Modo Clásico',
        description: 'Múltiples opciones para desafiar tu oído musical.',
        icon: classicIcon,
        route: '/categories',
        size: 'large',
    }
    ];


    return (
  <section className="game-modes-container">
    {gameModes.map((mode, idx) => {
      const isDisabled = mode.id === 0 && isUserDailyPlayed;

        return (
            <div
                key={idx}
                className={`mode-card ${mode.size} ${isDisabled ? "disabled" : ""}`}
                onClick={() => {
                    if (!isDisabled) handleNormalClick(mode.route, mode.id);
                }}
            >
            <img
                src={mode.icon}
                alt={mode.title}
                className={`mode-icon ${isDisabled ? "icon-disabled" : ""}`}
            />
            <h3>{mode.title}</h3>
            {!isDisabled && <p>{mode.description}</p>}
            {isDisabled && <span className="locked-label">Debes esperar hasta mañana para jugar otra partida</span>}
            </div>
        );
        })}

        {showLogin && (
        <Modal show={showLogin} onClose={() => setShowLogin(false)}>
            <LoginForm onSuccess={() => setShowLogin(false)} />
        </Modal>
        )}
    </section>
    );

    /*return (
    <section className="game-modes-container">
        {gameModes.map((mode, idx) => (
        <div
            key={idx}
            className={`mode-card ${mode.size}`}
            onClick={() => handleNormalClick(mode.route, mode.id)}
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
    );*/
}