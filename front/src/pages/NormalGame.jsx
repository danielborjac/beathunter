import { useEffect, useState, useRef } from 'react';
import InstructionModal from '../components/InstructionModal';
import './NormalGame.css';
import { fetchRandomSongs } from '../api/songs';
import { saveGameSession } from '../api/gameSession';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAudioURL, playSoundEffect, playFragment } from '../utils/gameHelpers';

export default function NormalGame() {
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
  const [showInstructions, setShowInstructions] = useState(true);
  const [progress, setProgress] = useState(100);
  const [timerRef, setTimerRef] = useState(null);
  const [attemptDurations, setAttemptDurations] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const audioRef = useRef(null);

  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const fetchSongs = async () => {
    try {
      const songsData = await fetchRandomSongs(6);
      setSongs(songsData);
    } catch {
      alert('No se pudieron cargar canciones');
    }
  };

  useEffect(() => {
    if (!showInstructions) fetchSongs();
  }, [showInstructions]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && audioRef.current) {
        audioRef.current.pause();
      }
    };
    const handleBeforeUnload = () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (!songs.length || feedback || showResult || transitionMessage) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (countdown === 0) {
      const url = getAudioURL(songs[currentIndex], attempt);
      audioRef.current = playFragment(url);

      let percentage = 100;
      const start = Date.now();
      setStartTime(start);

      const interval = setInterval(() => {
        percentage -= 1.43;
        setProgress(percentage);
        if (percentage <= 0) {
          clearInterval(interval);
          handleTimeOut();
        }
      }, 100);
      setTimerRef(interval);
    }
  }, [countdown, feedback, showResult, transitionMessage, songs, attempt]);

  const handleTimeOut = () => {
    if (audioRef.current) audioRef.current.pause();
    const duration = Math.round((Date.now() - startTime) / 1000);

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
      setAttemptDurations(prev => [
        ...prev,
        {
          song_id: songs[currentIndex].id,
          guess_type: 'title',
          attempts: 3,
          duration_sec: duration
        }
      ]);
    }
  };

  const handleOptionClick = (opt) => {
    if (feedback || disabledOptions.includes(opt)) return;
    clearInterval(timerRef);
    if (audioRef.current) audioRef.current.pause();

    const duration = Math.round((Date.now() - startTime) / 1000);
    const isCorrect = opt === songs[currentIndex].title;
    playSoundEffect(isCorrect);

    if (isCorrect) {
      setFeedback(positiveMessages[Math.floor(Math.random() * positiveMessages.length)]);
      setShowResult(true);
      setAttemptDurations(prev => [
        ...prev,
        {
          song_id: songs[currentIndex].id,
          guess_type: 'title',
          attempts: attempt,
          duration_sec: duration
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
        setFeedback(failMessages[Math.floor(Math.random() * failMessages.length)]);
        setShowResult(true);
        setAttemptDurations(prev => [
          ...prev,
          {
            song_id: songs[currentIndex].id,
            guess_type: 'title',
            attempts: 3,
            duration_sec: duration
          }
        ]);
      }
    }
  };

  const handleNext = async () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= songs.length) {
      try {
        await saveGameSession({
          mode: 'normal',
          finished_at: new Date().toISOString(),
          attempts: attemptDurations
        }, token);
      } catch (err) {
        console.error('Error al guardar partida:', err);
      }

      setShowSummary(true);
      setTimeout(() => navigate('/'), 4000);
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
        mode="normal"
        onStart={() => setShowInstructions(false)}
        onClose={() => window.location.href = '/'}
      />
    );
  }

  if (showSummary) {
    return (
      <div className="normal-game">
        <div className="summary-screen">
          <h2>🎉 ¡Partida Finalizada!</h2>
          <p>Gracias por jugar. Serás redirigido al menú...</p>
        </div>
      </div>
    );
  }

  const currentSong = songs[currentIndex];

  return (
    <div className="normal-game">
      {countdown > 0 && <h2 className="countdown">{countdown}</h2>}
      {transitionMessage && <h3 className="transition">{transitionMessage}</h3>}

      {countdown === 0 && !transitionMessage && (
        <>
          <h2>¿Cuál es la canción?</h2>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="options">
            {currentSong.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleOptionClick(opt)}
                disabled={feedback || disabledOptions.includes(opt)}
                className={
                  feedback && opt === currentSong.title
                    ? 'correct'
                    : disabledOptions.includes(opt)
                    ? 'incorrect'
                    : ''
                }
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}

      {feedback && (
        <div className="feedback">
          <p>{feedback}</p>
          <div className="song-details">
            <strong>{currentSong.title}</strong> - {currentSong.artist}<br />
            <em>{currentSong.album}</em>
          </div>
          <button onClick={handleNext}>Siguiente canción</button>
        </div>
      )}
    </div>
  );
}