import './HomePage.css';
import GameModes from '../components/GameModes';
import BackgroundVideo from '../components/BackgroundVideo';
import { useState, useEffect } from 'react';
import FullScreenLoader from '../components/FullScreenLoader';
import trophyIcon from '/assets/icons/trophy.svg';
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isContentReady, setIsContentReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsContentReady(true), 500);
    return () => clearTimeout(timeout);
  }, []);


  const isLoading = !isVideoReady || !isContentReady;


  return (
    <>
      <div className="home-container">

        {isLoading && (
          <FullScreenLoader />
        )}
        
        <BackgroundVideo onReady={() => setIsVideoReady(true)} />
        <div className="imagen-circular-contenedor" onClick={() => navigate('/leaderboard')}><img className="leaderboard" src={trophyIcon}/></div>
        <h1 className="home-title">	Que empiece el desafío musical!</h1>
        <GameModes/>
      </div>
    </>
  );
}