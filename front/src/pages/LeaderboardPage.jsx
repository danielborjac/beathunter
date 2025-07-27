import { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../api/leaderboard';
import './LeaderboardPage.css';

export default function LeaderboardPage() {
  const [mode, setMode] = useState('normal');
  const [timeRange, setTimeRange] = useState('daily');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await fetchLeaderboard(mode, timeRange);
      console.log('Leaderboard recibido:', data);  
     
      const parsed = Array.isArray(data.results) ? data.results : [];

      setLeaderboard(parsed);
    } catch (err) {
      console.error('Error al cargar leaderboard', err);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };
  loadLeaderboard();
}, [mode, timeRange]);

  return (
    <div className="leaderboard-page">
      <h1 className="title">🏆 Leaderboard</h1>

      <div className="filters">
        <select value={mode} onChange={e => setMode(e.target.value)}>
          <option value="normal">Normal</option>
          <option value="daily">Diario</option>
          <option value="category">Por Categoría</option>
        </select>
        <select value={timeRange} onChange={e => setTimeRange(e.target.value)}>
          <option value="daily">Hoy</option>
          <option value="monthly">Este mes</option>
          <option value="all_time">Toda la historia</option>
        </select>
      </div>

      {loading ? (
        <p className="loading">Cargando...</p>
      ) : (
        Array.isArray(leaderboard) && leaderboard.length > 0 ? (
        <ul className="leaderboard-list">
        {leaderboard.map((entry, index) => (
            <li key={index} className="entry">
            <span className="position">#{index + 1}</span>
            <span className="username">{entry.username}</span>
            <span className="score">🎯 {entry.highest_score}</span>
            </li>
        ))}
        </ul>
        ) : (
            <p>No hay datos disponibles para esta categoría.</p>
        )
      )}
    </div>
  );
}
