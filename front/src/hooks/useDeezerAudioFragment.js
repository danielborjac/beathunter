import { useRef } from 'react';

export default function useDeezerAudioFragment() {
  const audioRef = useRef(null);

  const play = (url, attempt = 0, params) => {
    return new Promise((resolve, reject) => {
      // Pausar y limpiar audio anterior
      if (audioRef.current) {
        audioRef.current.pause();
        if(audioRef.current._timeoutId) {
          clearTimeout(audioRef.current._timeoutId);
          audioRef.current._timeoutId = null;
        }
      }


      const audio = new Audio(url);
      audioRef.current = audio;

      const startTime = attempt * 10;
      let timeoutId;

      // Evento cuando el audio ya está cargado para reproducir sin cortes
      const onReady = () => {
        audio.currentTime = startTime;
        audio.play()
          .then(() => {
            let duration = params.fragment_1 * 1000;
            if (attempt === 1) duration = params.fragment_2 * 1000;
            if (attempt >= 2) duration = params.fragment_3 * 1000;
            timeoutId = setTimeout(() => {
              audio.pause();
              resolve();
            }, duration);
          })
          .catch(reject);
      };

      const onError = () => {
        clearTimeout(timeoutId);
        reject(new Error("Error al cargar o reproducir el audio"));
      };

      audio.addEventListener('canplaythrough', onReady, { once: true });
      audio.addEventListener('error', onError, { once: true });

      audio.load();
    });
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return { audioRef, play, pause };
}