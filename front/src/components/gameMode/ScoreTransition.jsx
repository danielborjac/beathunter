import './ScoreTransition.css';
import { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

const ScoreTransition = ({ isCorrect, addedScore, totalScore, onFinish }) => {
  const [displayScore, setDisplayScore] = useState(totalScore - addedScore);
  const sound = new Audio('/sfx/score.mp3');
  

  useEffect(() => {
    const increment = Math.ceil(addedScore / 30);
    let current = displayScore;

    const interval = setInterval(() => {
      
      current += increment;
      if (current >= totalScore) {       
        current = totalScore;
        if (isCorrect) sound.play();
        clearInterval(interval);
      }     
      setDisplayScore(current);
      
    }, 20);
    const timer = setTimeout(() => {
      onFinish(); // callback para continuar
    }, 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [addedScore, totalScore, onFinish, displayScore]);

  return (
    <AnimatePresence>
      <motion.div
        key="score-transition"
        className="score-transition-container"
      >
        <motion.h2
          className="score-transition-heading"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {isCorrect ? '¡Bien hecho!' : '¡No te rindas!'}
        </motion.h2>
        
        <motion.p
          className="score-transition-score"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Puntaje: {displayScore}
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
};

export default ScoreTransition;