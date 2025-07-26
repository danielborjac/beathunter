import { useEffect, useState, useRef } from 'react';
import InstructionModal from '../components/InstructionModal';
import './NormalGame.css';
import successSfx from '/sfx/correct.mp3';
import errorSfx from '/sfx/wrong.mp3';

const mockSongs = [
  {
    id: 1,
    audio: '/sfx/correct.mp3', // usa uno que exista
    title: "Blinding Lights",
    artist: "The Weeknd",
    options: ["Blinding Lights", "Starboy", "Save Your Tears", "Can't Feel My Face", "After Hours", "In Your Eyes"],
    correctAnswer: "Blinding Lights",
    album: 'After Hours'
  },
  {
    id: 2,
    audio: '/sfx/correct.mp3',
    title: "Shape of You",
    artist: "Ed Sheeran",
    options: ["Shape of You", "Perfect", "Thinking Out Loud", "Photograph", "Bad Habits", "Shivers"],
    correctAnswer: "Shape of You",
    album: 'Divide'
  },
  {
    id: 3,
    audio: '/sfx/correct.mp3',
    title: "Levitating",
    artist: "Dua Lipa",
    options: ["Levitating", "Don't Start Now", "New Rules", "Break My Heart", "Love Again", "Physical"],
    correctAnswer: "Levitating",
    album: 'Future Nostalgia'
  }
];


export default function NormalGame() {
  const [showInstructions, setShowInstructions] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSong, setCurrentSong] = useState(mockSongs[0]);
  const [options, setOptions] = useState([]);
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

  const [progress, setProgress] = useState(100);
  const timerRef = useRef(null);
  const timeoutRef = useRef(null);

  const startProgressBar = () => {
    clearInterval(timerRef.current);
    let percent = 100;
    timerRef.current = setInterval(() => {
      percent -= 1.43;
      setProgress(percent);
      if (percent <= 0) {
        clearInterval(timerRef.current);
        handleTimeout();
      }
    }, 100);
  };

  const handleTimeout = () => {
    const audio = new Audio(errorSfx);
    audio.play();

    timeoutRef.current = setTimeout(() => {
      if (attempt < 3) {
        setTransitionMessage(attempt === 1 ? 'Segundo intento...' : 'Último intento...');
        setTimeout(() => {
          setAttempt(prev => prev + 1);
          setTransitionMessage('');
          setProgress(100);
          startProgressBar();
        }, 2000);
      } else {
        setFeedback(failMessages[Math.floor(Math.random() * failMessages.length)]);
        setShowResult(true);
      }
    }, 1000);
  };

  const handleOptionClick = (option) => {
    if (feedback || showResult || transitionMessage) return;

    clearInterval(timerRef.current);
    clearTimeout(timeoutRef.current);

    const isCorrect = option === currentSong.correctAnswer;
    const audio = new Audio(isCorrect ? successSfx : errorSfx);
    audio.play();

    if (isCorrect) {
      setFeedback(positiveMessages[Math.floor(Math.random() * positiveMessages.length)]);
      setShowResult(true);
    } else {
      setDisabledOptions([...disabledOptions, option]);

      setTimeout(() => {
        if (attempt < 3) {
          setTransitionMessage(attempt === 1 ? 'Segundo intento...' : 'Último intento...');
          setTimeout(() => {
            setAttempt(prev => prev + 1);
            setOptions(prev => prev.filter(opt => opt !== option));
            setTransitionMessage('');
            setProgress(100);
            startProgressBar();
          }, 2000);
        } else {
          setFeedback(failMessages[Math.floor(Math.random() * failMessages.length)]);
          setShowResult(true);
        }
      }, 1000);
    }
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= mockSongs.length) {
      alert('¡Juego finalizado!');
      return;
    }

    setCurrentIndex(nextIndex);
    setCurrentSong(mockSongs[nextIndex]);
    setOptions([]);
    setAttempt(1);
    setDisabledOptions([]);
    setFeedback(null);
    setShowResult(false);
    setProgress(100);
    setCountdown(3);
  };

  useEffect(() => {
    if (showInstructions || countdown <= 0) return;

    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, showInstructions]);

  // Cuando la cuenta llega a 0, inicia juego y música
  useEffect(() => {
    if (countdown === 0 && !showInstructions && !feedback && !showResult && !transitionMessage) {
      setOptions(currentSong.options);
      const audio = new Audio(currentSong.audio);
      audio.play().catch(() => {});
      setProgress(100);
      startProgressBar();
    }
  }, [countdown, showInstructions, feedback, showResult, transitionMessage, currentSong]);

  if (showInstructions) {
    return (
      <InstructionModal
        mode="normal"
        onStart={() => setShowInstructions(false)}
        onClose={() => window.location.href = '/'}
      />
    );
  }

  return (
    <div className="normal-game">
      {countdown > 0 && <h2 className="countdown">{countdown}</h2>}
      {transitionMessage && <h3 className="transition">{transitionMessage}</h3>}

      {countdown === 0 && !transitionMessage && !showResult && (
        <>
          <h2>¿Cuál es la canción?</h2>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{
                width: `${progress}%`,
                backgroundColor: progress > 50 ? '#4caf50' : progress > 20 ? '#ffc107' : '#f44336'
              }}
            ></div>
          </div>

          <div className="options">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleOptionClick(opt)}
                disabled={disabledOptions.includes(opt) || showResult || feedback || transitionMessage}
                className={
                  showResult && opt === currentSong.correctAnswer
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

      {feedback && showResult && (
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