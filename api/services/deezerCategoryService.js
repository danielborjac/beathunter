const axios = require('axios');
const { classifyDifficulty, generateOptions, shuffleArray, sanitizeTitle } = require('../utils/deezerCategoryUtils');

const getDeezerSongsByCategory = async ({ type, playlists, genreId, artistId, limit, options }) => {
  let allTracks = [];
  const optionsPoolSet = new Set();

  try {
    if (type === 'mix') {

      const randomArtistIds = shuffleArray(playlists).slice(0, 3);
      // Recolectar canciones de múltiples playlists
      for (const playlistId of randomArtistIds) {
        //const { data } = await axios.get(`https://api.deezer.com/playlist/${playlistId}`);
        const { data } = await axios.get(`https://api.deezer.com/playlist/${playlistId}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept': 'application/json',
            'x-rapidapi-key': '31f7cbd9a4mshb91eb3ed80cbbc4p1e1229jsned9ff5bda1cc',
            'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
          },
        });

        const tracks = data.tracks.data.filter(track => track.preview);
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
      let songsPool = [...easySongs, ...mediumSongs];

      // Si faltan canciones, completar con cualquier otra que no esté ya incluida
      if (songsPool.length < limit) {
        const usedIds = new Set(songsPool.map(song => song.id));
        const remainingSongs = shuffledTracks.filter(song => !usedIds.has(song.id));
        const extraSongs = shuffleArray(remainingSongs).slice(0, limit - songsPool.length);
        songsPool = [...songsPool, ...extraSongs];
      }

      return songsPool.map(track => ({
        title: sanitizeTitle(track.title),
        song_id: track.id,
        artist: track.artist.name,
        album: track.album.title,        
        difficulty: track.rank > 500000 ? 'easy' : 'medium',
        options: generateOptions(sanitizeTitle(track.title), [...optionsPoolSet], options),
        audio: track.preview,
        album_img: track.album.cover_medium
      }));

    } else if (type === 'genre') {
      const { data } = await axios.get(`https://api.deezer.com/genre/${genreId}/artists`);
      const allArtistIds = data.data.map(artist => artist.id);
      const randomArtistIds = shuffleArray(allArtistIds).slice(0, limit);

      for (const artistId of randomArtistIds) {
        const res = await axios.get(`https://api.deezer.com/artist/${artistId}/top?limit=300`);
        const topTracks = res.data.data.filter(track => track.preview);
        topTracks.forEach(track => optionsPoolSet.add(sanitizeTitle(track.title)));
        
        if (topTracks.length > 0) {
          const randomTrack = shuffleArray(topTracks)[0];
          allTracks.push(randomTrack);
        }
      }

    } else if (type === 'artist') {
      const res = await axios.get(`https://api.deezer.com/artist/${artistId}/top?limit=300`);
      const allArtistTracks = res.data.data.filter(track => track.preview);
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
      options: generateOptions(sanitizeTitle(track.title), [...optionsPoolSet], options),
      audio: track.preview,
      album_img: track.album.cover_medium
    }));

  } catch (error) {
    throw new Error('Error procesando canciones desde Deezer: ' + error.message);
  }
};



module.exports = getDeezerSongsByCategory;