const GeneralParam = require('../models/generalParam.model');

// Crear un parámetro general
exports.createGeneralParam = async (req, res) => {
  try {
    const { mode, total_songs, total_options, attempt_duration, fragment_1, fragment_2, fragment_3 } = req.body;

    if (!mode || total_songs == null || total_options == null || attempt_duration == null ||fragment_1 == null || fragment_2 == null || fragment_3 == null) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const newParam = await GeneralParam.create({
      mode,
      total_songs,
      total_options,
      attempt_duration,
      fragment_1,
      fragment_2,
      fragment_3
    });

    res.status(201).json(newParam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un parámetro general
exports.updateGeneralParam = async (req, res) => {
  try {
    const { id } = req.params;
    const { mode, total_songs, total_options, attempt_duration, fragment_1, fragment_2, fragment_3 } = req.body;

    const param = await GeneralParam.findByPk(id);
    if (!param) {
      return res.status(404).json({ error: 'Parámetro no encontrado' });
    }

    await param.update({
      mode: mode ?? param.mode,
      total_songs: total_songs ?? param.total_songs,
      total_options: total_options ?? param.total_options,
      attempt_duration: attempt_duration ?? param.attempt_duration,
      fragment_1: fragment_1 ?? param.fragment_1,
      fragment_2: fragment_2 ?? param.fragment_2,
      fragment_3: fragment_3 ?? param.fragment_3
    });

    res.json(param);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos o filtrar por mode
exports.getGeneralParams = async (req, res) => {
  try {
    const { mode } = req.query;

    const whereClause = {};
    if (mode) {
      whereClause.mode = mode;
    }

    const params = await GeneralParam.findAll({ where: whereClause });
    res.json(params);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};