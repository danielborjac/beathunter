import { useNavigate } from 'react-router-dom';
import './SummaryScreen.css';

export default function SummaryScreen({ finalScore }) {
  const navigate = useNavigate();

  return (
    <div className="normal-game">
      <div className="summary-screen">
        <h2>🎉 ¡Partida Finalizada!</h2>
        <p>Tu puntaje final fue:</p>
        <p className="final-score">
          <span className="pixel-font">{finalScore}</span>
        </p>
        <div className="summary-buttons">
          <button onClick={() => navigate('/')}>Volver al menú</button>
          <button onClick={() => navigate('/leaderboard?mode=normal&range=monthly')}>
            Ver leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}