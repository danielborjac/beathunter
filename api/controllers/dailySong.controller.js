const { Op } = require('sequelize');
const DailySongs = require('../models/dailySong.model');

exports.saveDeezerDailyController = async (req, res) => {
  try {
    const { songs_id, date_release } = req.body;
    if (!songs_id || !date_release) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    const exists = await DailySongs.findOne({ where: { date_release } });
    if (exists) {
      return res.status(400).json({ error: `Ya existe un registro con date_release: ${date_release}` });
    }
    const songs = await DailySongs.create(req.body);
    res.status(201).json({ message: 'Canciones del modo diario guardadas', songs });

  } catch (error) {
    console.error('Error al guardar canciones del modo diario:', error);
    res.status(500).json({ error: 'Error al guardar canciones del modo diario', details: error.message });
  }
};


exports.getDeezerDailyController = async (req, res) => {
  try {
    const now = new Date();
    const options = { year: 'numeric',month: '2-digit', day: '2-digit',};
    const today = now.toLocaleDateString('es-EC', options).split('/').reverse().join('-'); 
    console.log(today);
    const songs = await DailySongs.findAll({
      where: {
        date_release: {
          [Op.gte]: today
        }
      }
    });
    res.json(songs);

  } catch (error) {
    console.error('Error al obtener canciones del modo diario:', error);
    res.status(500).json({ 
      error: 'Error al obtener canciones del modo diario', 
      details: error.message 
    });
  }
};


exports.updateDeezerDailyController = async (req, res) => {
  try {
    const { id } = req.params;
    const { songs_id, date_release } = req.body;
    if (!songs_id || !date_release) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    const record = await DailySongs.findByPk(id);
    if (!record) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    const exists = await DailySongs.findOne({
      where: {
        date_release,
        id: { [Op.ne]: id }
      }
    });
    if (exists) {
      return res.status(400).json({ error: `Ya existe un registro con date_release: ${date_release}` });
    }
    await record.update(req.body);
    res.json({ message: 'Registro actualizado correctamente', record });
  } catch (error) {
    console.error('Error al actualizar canciones del modo diario:', error);
    res.status(500).json({ error: 'Error al actualizar canciones del modo diario', details: error.message });
  }
};


exports.deleteDeezerDailyController = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await DailySongs.findByPk(id);
    if (!record) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    await record.destroy();
    res.json({ message: 'Registro eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar canciones del modo diario:', error);
    res.status(500).json({ error: 'Error al eliminar canciones del modo diario', details: error.message });
  }
};