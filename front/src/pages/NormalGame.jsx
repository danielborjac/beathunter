import FullScreenLoader from '../components/FullScreenLoader';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import InstructionModal from '../components/InstructionModal';
import Countdown from '../components/gameMode/Countdown';
import TransitionMessage from '../components/gameMode/TransitionMessage';
import ProgressBar from '../components/gameMode/ProgressBar';
import OptionsList from '../components/gameMode/OptionsList';
import FeedbackDisplay from '../components/gameMode/FeedbackDisplay';
import SummaryScreen from '../components/gameMode/SummaryScreen';
import ScoreTransition from '../components/gameMode/ScoreTransition';

//import useAudioFragment from '../hooks/useAudioFragment';
import useDeezerAudioFragment from '../hooks/useDeezerAudioFragment';
import useGameTimer from '../hooks/useGameTimer';

import './NormalGame.css';
//import { fetchRandomSongs } from '../api/songs';
import { fetchDeezerRandomSongs, fetchDeezerDailySongs } from '../api/deezer';
import { saveGameSession } from '../api/gameSession';
import { useSelector } from 'react-redux';
import { playSoundEffect } from '../utils/gameHelpers';
import { prepareDeezerSongs } from "../utils/deezerGameHelper";
import { useRef } from 'react';

export default function NormalGame() {

  const location = useLocation();
  const { state } = location;
  const [loading, setLoading] = useState(true);

  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempt, setAttempt] = useState(1);
  const [disabledOptions, setDisabledOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [transitionMessage, setTransitionMessage] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [positiveMessages] = useState([
    '¡Bien hecho!', '¡Eres un crack!', '¡Genial!', '¡Increíble!', '¡Lo lograste!', '¡Perfecto!'
  ]);
  const [failMessages] = useState([
    '¡Casi lo logras!', '¡Estuviste cerca!', '¡Buena jugada!', '¡Inténtalo otra vez!', '¡No te rindas!'
  ]);
  const [countdown, setCountdown] = useState(3);
  const [showInstructions, setShowInstructions] = useState(false);
  const [progress, setProgress] = useState(100);
  const [attemptDurations, setAttemptDurations] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showScoreTransition, setShowScoreTransition] = useState(false);
  const [lastScore, setLastScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [results, setResults] = useState([]);

  const { token } = useSelector((state) => state.auth);
  //const { play, pause } = useAudioFragment();
  const { play, pause } = useDeezerAudioFragment();

  const { start: startTimer, clear: clearTimer } = useGameTimer();

  const fetchSongs = async () => {
    setLoading(true); // Muestra el loader
    try {
      let rawSongs;
      if(state.mode == "daily") rawSongs = await fetchDeezerDailySongs();
      else rawSongs = await fetchDeezerRandomSongs(state);

      const preparedSongs = prepareDeezerSongs(rawSongs);
      setSongs(preparedSongs);
    } catch (error) {
      console.error(error);
      alert('Error al cargar canciones');
      window.Location.href="/"
    } finally {
      setLoading(false); // Oculta el loader
    }
  };

  const videoRef = useRef(null);
  

  useEffect(() => {
    const hidden = JSON.parse(localStorage.getItem('hideInstructions') || '{}');
    if(state == null) window.location.href="/"
    if (hidden.random && state.mode == "random") fetchSongs(); 
    else if (hidden.classic && state.mode == "classic") fetchSongs(); 
    else if (hidden.daily && state.mode == "daily") fetchSongs();  
    else setShowInstructions(true);
  }, []);

  const handleStartInstructions = () => {
    setShowInstructions(false);
    fetchSongs();
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) pause();
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => window.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [pause]);

  useEffect(() => {
    if (showInstructions || !songs.length || feedback || showResult || transitionMessage || showScoreTransition) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (countdown === 0) {
      const start = Date.now();
      setStartTime(start);

      // reproducimos el audio
      if (songs[currentIndex]?.audio) {
        console.log(songs);
        play(songs[currentIndex].audio, attempt - 1).then(() => {
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(err => {
              console.warn("Video no pudo reproducirse:", err);
            });
          }
        })
        .catch((err) => {
          console.error("Error al reproducir el audio:", err);
          alert("Ha ocurrido un error inesperado, volverás a la página principal");
          window.location.href = '/'
        });
      }

      startTimer(
        (elapsed) => {
          const percentage = Math.max(0, 100 - (elapsed / 7000) * 100);
          setProgress(percentage);
        },
        () => handleTimeOut(start),
        100,
        7000
      );
    }

  }, [countdown, feedback, showResult, transitionMessage, showScoreTransition, songs, attempt, showInstructions]);

  const handleTimeOut = (start) => {
    pause();
    
    const duration = Math.round((Date.now() - start) / 1000);

    if (attempt < 3) {
      setTransitionMessage(attempt === 1 ? 'Segundo intento...' : 'Último intento...');
      setTimeout(() => {
        setAttempt(attempt + 1);
        setTransitionMessage('');
        setProgress(100);
        setCountdown(0);
      }, 2000);
    } else {
      playSoundEffect(false);
      setFeedback(failMessages[Math.floor(Math.random() * failMessages.length)]);
      setShowResult(true);
      setWasCorrect(false);
      setLastScore(0);
      setAttemptDurations(prev => [
        ...prev,
        {
          song_id: songs[currentIndex].song_id,
          guess_type: 'title',
          attempts: 3,
          duration_sec: duration,
          correct: false
        }
      ]);
    }
  };

  const handleOptionClick = (opt) => {
    if (feedback || disabledOptions.includes(opt)) return;
    clearTimer();
    pause();

    const duration = Math.round((Date.now() - startTime) / 1000);
    const isCorrect = opt === songs[currentIndex].title;
    playSoundEffect(isCorrect);

    if (isCorrect) {

      const baseScores = [0, 100, 70, 40];
      const baseScore = baseScores[attempt] || 0;
      const penaltyPerSecond = 1;
      const timePenalty = duration * penaltyPerSecond;
      const score = Math.max(0, Math.floor(baseScore - timePenalty));
      setLastScore(score);
      setTotalScore(prev => prev + score);
      setFeedback(positiveMessages[Math.floor(Math.random() * positiveMessages.length)]);
      setShowResult(true);
      setWasCorrect(true);
      setResults(prev => [...prev, "success"]);
      setAttemptDurations(prev => [
        ...prev,
        {
          song_id: songs[currentIndex].song_id,
          guess_type: 'title',
          attempts: attempt,
          duration_sec: duration,
          correct: true
        }
      ]);
    } else {
      setDisabledOptions([...disabledOptions, opt]);
      if (attempt < 3) {
        setTimeout(() => {
          setTransitionMessage(attempt === 1 ? 'Segundo intento...' : 'Último intento...');
          setTimeout(() => {
            setAttempt(attempt + 1);
            setTransitionMessage('');
            setProgress(100);
            setCountdown(0);
          }, 2000);
        }, 1000);
      } else {
        setLastScore(0);
        setFeedback(failMessages[Math.floor(Math.random() * failMessages.length)]);
        setShowResult(true);
        setWasCorrect(false);
        setResults(prev => [...prev, "fail"]);
        setAttemptDurations(prev => [
          ...prev,
          {
            song_id: songs[currentIndex].song_id,
            guess_type: 'title',
            attempts: 3,
            duration_sec: duration
          }
        ]);
      }
    }
  };

  const handleNext = async () => {
    setShowScoreTransition(true);
  };

  const handleScoreTransitionFinish = async () => {
    setShowScoreTransition(false);

    const nextIndex = currentIndex + 1;
    if (nextIndex >= songs.length) {
      try {
        await saveGameSession({
          mode: state.mode,
          finished_at: new Date().toISOString(),
          attempts: attemptDurations
        }, token);
      } catch (err) {
        console.error('Error al guardar partida:', err);
      }

      setShowSummary(true);
      return;
    }

    setCurrentIndex(nextIndex);
    setAttempt(1);
    setDisabledOptions([]);
    setFeedback(null);
    setShowResult(false);
    setCountdown(3);
    setProgress(100);
  };

  if (showInstructions) {
    return (
      <InstructionModal
        mode={state.mode}
        onStart={handleStartInstructions}
        onClose={() => window.location.href = '/'}
      />
    );
  }

  if (showSummary) return <SummaryScreen finalScore={totalScore}/>;
  if (showScoreTransition) {
    return (
      <ScoreTransition
        isCorrect={wasCorrect}
        addedScore={lastScore}
        totalScore={totalScore}
        onFinish={handleScoreTransitionFinish}
      />
    );
  }

  const currentSong = songs[currentIndex];


  if (loading) return <FullScreenLoader />;

  return (
    <div className="normal-game">

      <div>
        <video ref={videoRef} loop muted id="bg-video">
          <source src="assets/video.mp4" type="video/mp4" />
        </video>
      </div>

      {countdown > 0 && <Countdown value={countdown} />}
      {transitionMessage && <TransitionMessage message={transitionMessage} />}

      {countdown === 0 && !transitionMessage && (
        <>
          <h2>¿Cuál es la canción?</h2>
          <ProgressBar percentage={progress} />
          <OptionsList
            options={currentSong.options}
            correct={currentSong.title}
            disabled={disabledOptions}
            feedback={feedback}
            onSelect={handleOptionClick}
          />
        </>
      )}

      {feedback && (
        <FeedbackDisplay
          feedback={feedback}
          title={currentSong.title}
          artist={currentSong.artist}
          album={currentSong.album}
          album_img={currentSong.album_img}
          audio={currentSong.audio}
          isLast={currentIndex === songs.length - 1}
          onNext={handleNext}
          currentIndex={currentIndex}
          totalSongs={songs.length}
          results={results}
        />
      )}
    </div>
  );
}
