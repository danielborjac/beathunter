const { Song, Fragment } = require('../models');

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