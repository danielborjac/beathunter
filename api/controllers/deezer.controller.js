const getDeezerSongsByCategory = require('../services/deezerCategoryService');
const getDailySongs = require('../services/deezerDailyService');

exports.deezerCategoryController = async (req, res) => {
  const { type, playlists, genreId, artistId, limit, options } = req.body;
  try {
    const songs = await getDeezerSongsByCategory({ type, playlists, genreId, artistId, limit, options });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener canciones por categoría', details: error.message });
  }
};

exports.deezerDailyController = async (req, res) => {
  try {
    const { number } = req.query;
    const songs = await getDailySongs(number);
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener canciones del modo diario', details: error.message });
  }
};