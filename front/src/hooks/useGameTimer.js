import { useRef } from 'react';

export default function useGameTimer() {
  const timerRef = useRef(null);

  const start = (onTick, onFinish, interval = 100, totalDuration = 7000) => {
    let elapsed = 0;
    timerRef.current = setInterval(() => {
      elapsed += interval;
      onTick(elapsed);
      if (elapsed >= totalDuration) {
        clear();
        onFinish();
      }
    }, interval);
  };

  const clear = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  return { start, clear, timerRef };
}