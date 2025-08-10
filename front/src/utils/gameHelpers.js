import successSfx from '/sfx/correct.mp3';
import errorSfx from '/sfx/wrong.mp3';

export const getAudioURL = (song, attempt) => {
  const audioObj = song.audio.find((a) => a.level === attempt);
  return audioObj?.url;
};

export const playSoundEffect = (isCorrect) => {
  const sfx = new Audio(isCorrect ? successSfx : errorSfx);
  sfx.play();
  return sfx;
};

export const playFragment = (url) => {
  const audio = new Audio(url);
  audio.play();
  return audio;
};