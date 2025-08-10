import { useRef } from 'react';

export default function useAudioFragment() {
  const audioRef = useRef(null);

  const play = (url, attempt = 0) => {
    // Pausar cualquier audio anterior
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(url);
    audioRef.current = audio;

    const startTime = attempt * 7;

    audio.currentTime = startTime;

    const promise = audio.play();
    if(attempt == 0){
      const timeoutId = setTimeout(() => {
        audio.pause();
      }, 2500);
      audio.onended = () => clearTimeout(timeoutId);
    }
    else if(attempt == 1){
      const timeoutId = setTimeout(() => {
        audio.pause();
      }, 4000);
      audio.onended = () => clearTimeout(timeoutId);
    }
    else{
      const timeoutId = setTimeout(() => {
        audio.pause();
      }, 7000);
      audio.onended = () => clearTimeout(timeoutId);
    }
    

    // Devolver la promesa para poder capturar errores desde fuera
    return promise;
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return { audioRef, play, pause };
}