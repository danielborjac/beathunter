const axios = require('axios');

exports.getDeezerGenres = async (req, res) => {
  try {

    const { data } = await axios.get(`https://api.deezer.com/genre/`);

    const genres = data.data.map(genres => ({
      id: genres.id,
      name: genres.name,
      image: genres.picture_big
    }));

    res.json(genres);

  } catch (error) {
    console.error('Error buscar genero:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.getDeezerArtists = async (req, res) => {
  try {

    const { search} = req.query;
    if (!search) {
      return res.status(400).json({ error: 'Falta el parámetro search' });
    }

    const { data } = await axios.get(`https://api.deezer.com/search/artist?q=${encodeURIComponent(search)}&limit=${5}`);

    const artists = data.data.map(artist => ({
      id: artist.id,
      name: artist.name,
      image: artist.picture_big
    }));

    res.json(artists);

  } catch (error) {
    console.error('Error al buscar artista:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.getDeezerPlaylists = async (req, res) => {
  try {

    const { search} = req.query;
    if (!search) {
      return res.status(400).json({ error: 'Falta el parámetro search' });
    }

    const { data } = await axios.get(`https://api.deezer.com/search/playlist?q=${encodeURIComponent(search)}&limit=${10}`);

    const playlists = data.data.map(playlist => ({
      id: playlist.id,
      name: playlist.title,
      image: playlist.picture_big
    }));

    res.json(playlists);

  } catch (error) {
    console.error('Error al buscar playlist:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.getDeezerTracks = async (req, res) => {
  try {

    const { search} = req.query;
    if (!search) {
      return res.status(400).json({ error: 'Falta el parámetro search' });
    }

    const { data } = await axios.get(`https://api.deezer.com/search/track?q=${encodeURIComponent(search)}&limit=${10}`);

    const tracks = data.data.map(track => ({
      id: track.id,
      name: track.title,
      artist: track.artist.name,
    }));

    res.json(tracks);

  } catch (error) {
    console.error('Error al buscar canción:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};



