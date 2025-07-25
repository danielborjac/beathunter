import { useEffect, useState } from 'react';
import InstructionModal from '../components/InstructionModal';
import './NormalGame.css';
import successSfx from '/sfx/correct.mp3';
import errorSfx from '/sfx/wrong.mp3';


const mockSongs = [
  {
    id: 1,
    audio: '/sfx/example.mp3',
    title: "Blinding Lights",
    artist: "The Weeknd",
    options: ["Blinding Lights", "Starboy", "Save Your Tears", "Can't Feel My Face", "After Hours", "In Your Eyes"],
    correctAnswer: "Blinding Lights",
    album: 'Album A'
  },
  {
    id: 2,
    audio: '/sfx/example.mp3',
    title: "Shape of You",
    artist: "Ed Sheeran",
    options: ["Shape of You", "Perfect", "Thinking Out Loud", "Photograph", "Bad Habits", "Shivers"],
    correctAnswer: "Shape of You",
    album: 'Album A'
  },
  {
    id: 3,
    audio: '/sfx/example.mp3',
    title: "Levitating",
    artist: "Dua Lipa",
    options: ["Levitating", "Don't Start Now", "New Rules", "Break My Heart", "Love Again", "Physical"],
    correctAnswer: "Levitating",
    album: 'Album A'
  },
  {
    id: 4,
    audio: '/sfx/example.mp3',
    title: "Montero",
    artist: "Lil Nas X",
    options: ["Montero", "Industry Baby", "Old Town Road", "Panini", "Sun Goes Down", "Holiday"],
    correctAnswer: "Montero",
    album: 'Album A'
  },
  {
    id: 5,
    audio: '/sfx/example.mp3',
    title: "Stay",
    artist: "The Kid LAROI & Justin Bieber",
    options: ["Stay", "Ghost", "Peaches", "Lonely", "Anyone", "Holy"],
    correctAnswer: "Stay",
    album: 'Album A'
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
  const [finishedSongs, setFinishedSongs] = useState([]);

  const [progress, setProgress] = useState(100);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (!showInstructions && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, showInstructions]);

  useEffect(() => {
    if (countdown === 0 && !feedback && !showResult) {
      const audio = new Audio(currentSong.audio);
      audio.play();
      setOptions(currentSong.options);

      // Inicia barra de progreso
      let percentage = 100;
      const interval = setInterval(() => {
        percentage -= 1.43; // (100 / 7 segundos) cada 100ms
        setProgress(percentage);
        if (percentage <= 0) {
          clearInterval(interval);
          setDisabledOptions([...disabledOptions]); // desactiva
          setFeedback(failMessages[Math.floor(Math.random() * failMessages.length)]);
          setShowResult(true);
        }
      }, 100);
      setTimer(interval);
    }
  }, [countdown]);

  const handleOptionClick = (option) => {
    if (feedback || disabledOptions.includes(option)) return;
    clearInterval(timer);
    const audio = new Audio(
      option === currentSong.correctAnswer ? successSfx : errorSfx
    );
    audio.play();

    if (option === currentSong.correctAnswer) {
      setFeedback(positiveMessages[Math.floor(Math.random() * positiveMessages.length)]);
      setShowResult(true);
      return;
    }

    setDisabledOptions([...disabledOptions, option]);

    if (attempt < 3) {
      const message = attempt === 1 ? 'Segundo intento...' : 'Último intento...';
      setFeedback(null);
      setTransitionMessage(message);
      setTimeout(() => {
        setAttempt(attempt + 1);
        setTransitionMessage('');
        setOptions(options.filter(opt => opt !== option));
      }, 2000);
    } else {
      setShowResult(true);
      setFeedback(failMessages[Math.floor(Math.random() * failMessages.length)]);
    }
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= mockSongs.length) {
      alert('¡Juego finalizado!');
      return;
    }

    setFinishedSongs([...finishedSongs, currentSong]);
    setCurrentIndex(nextIndex);
    setCurrentSong(mockSongs[nextIndex]);
    setOptions([]);
    setAttempt(1);
    setDisabledOptions([]);
    setFeedback(null);
    setShowResult(false);
    setCountdown(3);
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
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleOptionClick(opt)}
                disabled={feedback || disabledOptions.includes(opt)}
                className={
                  feedback && opt === currentSong.correctAnswer
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
            <strong>{currentSong.title}</strong> - {currentSong.artist} <br />
            <em>{currentSong.album}</em>
          </div>
          <button onClick={handleNext}>Siguiente canción</button>
        </div>
      )}
    </div>
  );
}
