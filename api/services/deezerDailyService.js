const axios = require('axios');
const { sanitizeTitle, shuffleArray } = require('../utils/deezerCategoryUtils');
const DailySongs = require('../models/dailySong.model');


const getDailySongs = async (number) => {
  const now = new Date();
  const options = { year: 'numeric',month: '2-digit', day: '2-digit',};
  const today = now.toLocaleDateString('es-EC', options).split('/').reverse().join('-'); 

  try {
    const dailyRecord = await DailySongs.findOne({ where: { date_release: today } });

    if (!dailyRecord || !dailyRecord.songs_id) {
      throw new Error('No hay canciones disponibles para hoy');
    }

    const songIds = dailyRecord.songs_id; 
    const songs = [];

    for (const songId of songIds) {
      //const { data: track } = await axios.get(`https://api.deezer.com/track/${songId}`);
      const { data: track } = await axios.get(`https://api.deezer.com/track/${songId}`
      , {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept': 'application/json',
            'x-rapidapi-key': '31f7cbd9a4mshb91eb3ed80cbbc4p1e1229jsned9ff5bda1cc',
            'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
          },
        });
      

      // Obtener opciones externas (sin usar el mismo pool)
      const options = await getExternalTitleOptions(track, number);

      songs.push({
        title: sanitizeTitle(track.title),
        song_id:track.artist.id,
        artist: track.artist.name,
        album: track.album.title,
        options: options,
        audio: track.preview,
        album_img: track.album.cover_medium
      });
    }

    return songs;

  } catch (error) {
    throw new Error('Error obteniendo canciones diarias: ' + error.message);
  }
};

async function getExternalTitleOptions(originalTrack, number) {
  try {
    const artistId = originalTrack?.artist?.id;
    const originalTitle = originalTrack?.title;

    if (!artistId || !originalTitle) {
      throw new Error("Faltan datos del artista o título original.");
    }

    //const { data } = await axios.get(`https://api.deezer.com/artist/${artistId}/top?limit=20`);
    const { data } = await axios.get(`https://api.deezer.com/artist/${artistId}/top?limit=20`
    , {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept': 'application/json',
            'x-rapidapi-key': '31f7cbd9a4mshb91eb3ed80cbbc4p1e1229jsned9ff5bda1cc',
            'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
          },
        });
    const topTracks = data?.data || [];

    // Filtrar para eliminar la canción original y evitar duplicados por título
    const filtered = topTracks.filter(
      (track) => sanitizeTitle(track.title).toLowerCase() !== sanitizeTitle(originalTitle).toLowerCase()
    );

    // Mezclar aleatoriamente
    const shuffled = filtered.sort(() => Math.random() - 0.5);

    // Tomar hasta 5 títulos distintos
    const options = shuffled.slice(0, number - 1).map((track) => sanitizeTitle(track.title));

    // Añadir la correcta y mezclar todo
    const allOptions = [...options, sanitizeTitle(originalTitle)].sort(() => Math.random() - 0.5);

    return allOptions;
  } catch (error) {
    console.error("Error generando opciones:", error.message);
    return []; // En caso de error, devuelve lista vacía o maneja como desees
  }
}

module.exports = getDailySongs;