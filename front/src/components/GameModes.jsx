import { useNavigate } from 'react-router-dom';
import './GameModes.css';
import normalIcon from '/assets/icons/random.svg';
import randomIcon from '/assets/icons/daily.svg';
import classicIcon from '/assets/icons/classic.svg';
import LoginForm from '../components/LoginForm';
import Modal from '../components/modal';
import { useSelector } from 'react-redux';
import { useState, useEffect  } from 'react';
import playClickSound from '../utils/playClickSound';
import { fetchCategories } from '../api/categories'; 


export default function GameModes() {
    //const data = { type: 'mix', mode:'normal', playlists: [867825522, 9788497342, 12028030391, 5569230782, 13600608121, 11941806081, 6275031904, 10136091322, 6987556164, 3803398766, 5104249748], limit: 2 };

    const navigate = useNavigate();

    const { token } = useSelector(state => state.auth);
    const [showLogin, setShowLogin] = useState(false);

    const [categories, setCategories] = useState({ random: [] });

    useEffect(() => {
        const loadCategories = async () => {
        try {
            const data = await fetchCategories("random");
            console.log(data);
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
        title: 'Modo Cásico',
        description: 'Múltiples opciones para desafiar tu oído musical.',
        icon: classicIcon,
        route: '/categories',
        size: 'large',
    }
    ];

    return (
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
    );
}