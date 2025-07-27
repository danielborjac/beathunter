const { Song, Fragment } = require('../models');
const { Sequelize } = require('sequelize');

exports.getRandomSongs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const perDifficulty = Math.floor(limit / 3);

    const difficulties = ['easy', 'medium', 'hard'];
    const allSongs = [];

    for (const difficulty of difficulties) {
      const songs = await Song.findAll({
        where: { difficulty },
        include: [{ model: Fragment }],
        order: [Sequelize.literal('RAND()')],
        limit: perDifficulty,
      });
      allSongs.push(...songs);
    }

    const formatted = allSongs.map(song => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      album: song.album || 'Unknown',
      options: [], // se agregará desde frontend
      audio: song.Fragments
        .sort((a, b) => a.level - b.level)
        .map(frag => ({
          level: frag.level,
          url: frag.audio_url
        })),
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching songs' });
  }
};

exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.findAll();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFragmentsBySongId = async (req, res) => {
  try {
    const { id } = req.params;
    const fragments = await Fragment.findAll({ where: { song_id: id } });
    res.json(fragments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};