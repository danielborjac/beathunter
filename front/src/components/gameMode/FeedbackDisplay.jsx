import './FeedbackDisplay.css';


export default function FeedbackDisplay({ feedback, title, artist, album, album_img, audio, isLast, onNext, totalSongs, results = [] }) {

  const renderProgressDots = () => {
    const icons = {
      success: '👑',  // o ✅
      fail: '❌',
      pending: (i) => i + 1,
    };

    return (
      <div className="progress-dots">
        {Array.from({ length: totalSongs }).map((_, i) => {
          const result = results[i] || 'pending';
          const icon = result === 'pending' ? icons.pending(i) : icons[result];
          return (
            <div
              key={i}
              className={`dot ${result}`}
            >
              {icon}
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="feedback">
      {renderProgressDots()}
      <p>{feedback}</p>



      <div className="song-card">
        <div className="album-section">
          <img
            src={album_img}
            alt={`Cover of ${album}`}
            className="album-cover"
          />
        </div>
        <div className="song-info">
          <h3 className="song-title">{title}</h3>
          <p className="song-artist">{artist}</p>
          <p className="song-album">{album}</p>
          <audio controls src={audio} className="audio-player" />
        </div>
      </div>

      <button className="next-btn" onClick={onNext}>
        {isLast ? 'Finalizar partida' : 'Siguiente canción'}
      </button>
    </div>
  );
}