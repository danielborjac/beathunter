import { useEffect, useState } from 'react';
import InstructionModal from '../components/InstructionModal';
import Countdown from '../components/gameMode/Countdown';
import TransitionMessage from '../components/gameMode/TransitionMessage';
import ProgressBar from '../components/gameMode/ProgressBar';
import OptionsList from '../components/gameMode/OptionsList';
import FeedbackDisplay from '../components/gameMode/FeedbackDisplay';
import SummaryScreen from '../components/gameMode/SummaryScreen';
import ScoreTransition from '../components/gameMode/ScoreTransition';

import useAudioFragment from '../hooks/useAudioFragment';
import useGameTimer from '../hooks/useGameTimer';

import './NormalGame.css';
import { fetchRandomSongs } from '../api/songs';
import { saveGameSession } from '../api/gameSession';
import { useSelector } from 'react-redux';
import { getAudioURL, playSoundEffect } from '../utils/gameHelpers';

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
  const [showInstructions, setShowInstructions] = useState(false);
  const [progress, setProgress] = useState(100);
  const [attemptDurations, setAttemptDurations] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showScoreTransition, setShowScoreTransition] = useState(false);
  const [lastScore, setLastScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [wasCorrect, setWasCorrect] = useState(false);

  const { token } = useSelector((state) => state.auth);
  const { play, pause } = useAudioFragment();
  const { start: startTimer, clear: clearTimer } = useGameTimer();

  const fetchSongs = async () => {
    try {
      const songsData = await fetchRandomSongs(6);
      setSongs(songsData);
    } catch {
      alert('No se pudieron cargar canciones');
    }
  };

  useEffect(() => {
    const hidden = JSON.parse(localStorage.getItem('hideInstructions') || '{}');
    if (!hidden.normal) {
      setShowInstructions(true);
    } else {
      fetchSongs();
    }
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
      const url = getAudioURL(songs[currentIndex], attempt);
      play(url);
      const start = Date.now();
      setStartTime(start);

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
          song_id: songs[currentIndex].id,
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
      setAttemptDurations(prev => [
        ...prev,
        {
          song_id: songs[currentIndex].id,
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
    setShowScoreTransition(true);
  };

  const handleScoreTransitionFinish = async () => {
    setShowScoreTransition(false);

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

  return (
    <div className="normal-game">
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
          isLast={currentIndex === songs.length - 1}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
