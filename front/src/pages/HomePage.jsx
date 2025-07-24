import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1>Bienvenido a Beathunter 🎧</h1>
      <p>Un juego para adivinar canciones por fragmentos.</p>
      <div>
        <Link to="/login">Iniciar sesión</Link> | <Link to="/register">Registrarse</Link>
      </div>
    </div>
  );
};

export default HomePage;