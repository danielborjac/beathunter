import { useEffect, useRef, useState } from 'react';
import './BackgroundVideo.css';

export default function BackgroundVideo({ onReady }) {
  const [videoIds, setVideoIds] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [fadeState, setFadeState] = useState('fade-in');
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/videos`);
        const data = await res.json();
        setVideoIds(data);
      } catch (err) {
        console.error('Error al obtener videos:', err);
      }
    };
    fetchVideos();
  }, []);

  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        createPlayer();
        return;
      }

      window.onYouTubeIframeAPIReady = () => {
        createPlayer();
      };

      if (!document.getElementById('youtube-iframe-script')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      }
    };

    if (videoIds.length > 0) {
      loadYouTubeAPI();
    }
  }, [videoIds]);

  const createPlayer = () => {
    if (!containerRef.current || videoIds.length === 0) return;

    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId: videoIds[currentVideoIndex],
      playerVars: {
        autoplay: 1,
        controls: 0,
        showinfo: 0,
        modestbranding: 1,
        loop: 1,
        mute: 1,
        rel: 0,
        fs: 0,
        playsinline: 1,
      },
      events: {
        onReady: (event) => {
          event.target.mute();
          setIsPlayerReady(true);
          onReady?.();
        },
      },
    });
  };

  useEffect(() => {
    if (!isPlayerReady || videoIds.length === 0) return;

    const interval = setInterval(() => {
      setFadeState('fade-out');
      setTimeout(() => {
        const nextIndex = (currentVideoIndex + 1) % videoIds.length;
        setCurrentVideoIndex(nextIndex);
        console.log(playerRef);
        playerRef.current?.loadVideoById(videoIds[nextIndex]);
        setFadeState('fade-in');
      }, 1000);
    }, 7000);

    return () => clearInterval(interval);
  }, [isPlayerReady, currentVideoIndex, videoIds]);

  return (
    <div className="video-container">
      <div
        className={`youtube-iframe ${fadeState}`}
        ref={containerRef}
      />
      <div className="video-overlay" />
    </div>
  );
}