export default function FeedbackDisplay({ feedback, title, artist, album, isLast, onNext }) {
  return (
    <div className="feedback">
      <p>{feedback}</p>
      <div className="song-details">
        <strong>{title}</strong> - {artist}<br />
        <em>{album}</em>
      </div>
      <button className="next-btn" onClick={onNext}>
        {isLast ? 'Finalizar partida' : 'Siguiente canción'}
      </button>
    </div>
  );
}