export default function playClickSound() {
  const audio = new Audio('/sfx/click.mp3');
  audio.volume = 0.3;
  audio.play();
}