import { useRef } from 'react';
import { playFragment } from '../utils/gameHelpers';

export default function useAudioFragment() {
  const audioRef = useRef(null);

  const play = (url) => {
    audioRef.current = playFragment(url);
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return { audioRef, play, pause };
}