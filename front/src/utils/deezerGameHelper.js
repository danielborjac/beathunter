export const prepareDeezerSongs = (rawSongs) => {
  return rawSongs.map((song) => {
    return {
      title: song.title,
      song_id: song.song_id,
      artist: song.artist,
      album: song.album,
      album_img: song.album_img,
      difficulty: song.difficulty,
      options: song.options,
      audio: song.audio
    };
  });
};

/*const generateAudioAttempts = (previewUrl) => {
  return [
    { level: 1, url: previewUrl },
    { level: 2, url: previewUrl },
    { level: 3, url: previewUrl }
  ];
};*/