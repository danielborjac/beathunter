const axios = require('axios');
const { classifyDifficulty, generateOptions, shuffleArray, sanitizeTitle } = require('../utils/deezerCategoryUtils');

const getDeezerSongsByCategory = async ({ type, playlists, genreId, artistId, limit = 6 }) => {
  let allTracks = [];
  const optionsPoolSet = new Set();

  try {
    if (type === 'mix') {

      const randomArtistIds = shuffleArray(playlists).slice(0, 3);
      console.log(randomArtistIds);
      // Recolectar canciones de múltiples playlists
      for (const playlistId of randomArtistIds) {
        const { data } = await axios.get(`https://api.deezer.com/playlist/${playlistId}`);
        const tracks = data.tracks.data;
        allTracks.push(...tracks);
        tracks.forEach(track => optionsPoolSet.add(sanitizeTitle(track.title)));
      }

      // Eliminar duplicados y aplicar aleatoriedad
      const uniqueTracks = Array.from(new Map(allTracks.map(track => [track.id, track])).values());
      const shuffledTracks = shuffleArray(uniqueTracks);

      // Clasificar por dificultad
      const songsByDifficulty = classifyDifficulty(shuffledTracks);

      const easySongs = shuffleArray(songsByDifficulty.easy).slice(0, Math.floor(limit / 2));
      const mediumSongs = shuffleArray(songsByDifficulty.medium).slice(0, Math.ceil(limit / 2));
      const songsPool = [...easySongs, ...mediumSongs];

      return songsPool.map(track => ({
        title: sanitizeTitle(track.title),
        song_id: track.id,
        artist: track.artist.name,
        album: track.album.title,        
        difficulty: track.rank > 700000 ? 'easy' : 'medium',
        options: generateOptions(sanitizeTitle(track.title), [...optionsPoolSet]),
        audio: track.preview,
        album_img: track.album.cover_medium
      }));

    } else if (type === 'genre') {
      const { data } = await axios.get(`https://api.deezer.com/genre/${genreId}/artists`);
      const allArtistIds = data.data.map(artist => artist.id);
      const randomArtistIds = shuffleArray(allArtistIds).slice(0, limit);

      for (const artistId of randomArtistIds) {
        const res = await axios.get(`https://api.deezer.com/artist/${artistId}/top?limit=300`);
        const topTracks = res.data.data;
        topTracks.forEach(track => optionsPoolSet.add(sanitizeTitle(track.title)));
        
        if (topTracks.length > 0) {
          const randomTrack = shuffleArray(topTracks)[0];
          allTracks.push(randomTrack);
        }
      }

    } else if (type === 'artist') {
      const res = await axios.get(`https://api.deezer.com/artist/${artistId}/top?limit=300`);
      const allArtistTracks = res.data.data;
      allArtistTracks.forEach(track => optionsPoolSet.add(sanitizeTitle(track.title)));
      const selectedTracks = shuffleArray(allArtistTracks).slice(0, limit);
      allTracks.push(...selectedTracks);

    } else {
      throw new Error('Tipo de categoría inválido');
    }


    // Si no es modo década, no hay clasificación por dificultad
    return allTracks.map(track => ({
      title: sanitizeTitle(track.title),
      song_id: track.id,
      artist: track.artist.name,
      album: track.album.title,
      difficulty: null,
      options: generateOptions(sanitizeTitle(track.title), [...optionsPoolSet]),
      audio: track.preview,
      album_img: track.album.cover_medium
    }));

  } catch (error) {
    throw new Error('Error procesando canciones desde Deezer: ' + error.message);
  }
};



module.exports = getDeezerSongsByCategory;