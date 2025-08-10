const Category = require('../models/Category.model');
const { Op } = require('sequelize');

exports.getCategories = async (req, res) => {
  try {
    const { mode} = req.query;
    let categories;
    if(mode) categories = await Category.findAll({where: { mode }});
    else categories = await Category.findAll();

    const grouped = {
      genres: [],
      mixes: [],
      artists: [],
      random: [],
    };

    categories.forEach(cat => {
      if (cat.mode === 'genre') grouped.genres.push(cat);
      else if (cat.mode === 'mix') grouped.mixes.push(cat);
      else if (cat.mode === 'artist') grouped.artists.push(cat);
      else if (cat.mode === 'random') grouped.random.push(cat);
    });


    res.json(grouped);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.saveCategories = async (req, res) => {
  try {
    const { name, genre_id, artist_id } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'El campo name no puede estar vacío' });
    }

    if (genre_id) {
      const genreExists = await Category.findOne({ where: { genre_id } });
      if (genreExists) {
        return res.status(400).json({ error: `Ya existe una categoría con genre_id: ${genre_id}` });
      }
    }

    if (artist_id) {
      const artistExists = await Category.findOne({ where: { artist_id } });
      if (artistExists) {
        return res.status(400).json({ error: `Ya existe una categoría con artist_id: ${artist_id}` });
      }
    }

    const category = await Category.create(req.body);
    res.status(201).json({ message: 'Categoría guardada', category });

  } catch (error) {
    console.error('Error al guardar categorías:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.deleteCategories = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    await category.destroy();
    res.json({ message: 'Categoría eliminada correctamente' });

  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};


exports.updateCategories = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, genre_id, artist_id } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'El campo name no puede estar vacío' });
    }

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    if (genre_id) {
      const genreExists = await Category.findOne({ 
        where: { 
          genre_id, 
          id: { [Op.ne]: id }
        } 
      });
      if (genreExists) {
        return res.status(400).json({ error: `Ya existe una categoría con genre_id: ${genre_id}` });
      }
    }

    if (artist_id) {
      const artistExists = await Category.findOne({ 
        where: { 
          artist_id,
          id: { [Op.ne]: id }
        } 
      });
      if (artistExists) {
        return res.status(400).json({ error: `Ya existe una categoría con artist_id: ${artist_id}` });
      }
    }

    await category.update(req.body);
    res.json({ message: 'Categoría actualizada correctamente', category });

  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};
