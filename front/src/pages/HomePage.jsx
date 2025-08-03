import './HomePage.css';
import GameModes from '../components/GameModes';
import BackgroundVideo from '../components/BackgroundVideo';
import { useState, useEffect } from 'react';

export default function HomePage() {

  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isContentReady, setIsContentReady] = useState(false);

  useEffect(() => {
    // Simula el contenido renderizado (puedes optimizar según tu lógica real)
    const timeout = setTimeout(() => setIsContentReady(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  const isLoading = !isVideoReady || !isContentReady;


  return (
    <>
      <div className="home-container">

        {isLoading && (
          <div className="loader-overlay">
            <div className="spinner" />
          </div>
        )}
        
        <BackgroundVideo onReady={() => setIsVideoReady(true)} />
        <h1 className="home-title">	Que empiece el desafío musical!</h1>
        <GameModes/>
      </div>
    </>
  );
}