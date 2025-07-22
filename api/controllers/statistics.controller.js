const { GameSession, GameAttempt, UserStatistic } = require('../models');

exports.getUserStatistics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Resumen dinámico (game_attempts + game_sessions)
    const totalSessions = await GameSession.count({ where: { user_id: userId } });

    const allAttempts = await GameAttempt.findAll({
      include: {
        model: GameSession,
        where: { user_id: userId },
        attributes: []
      }
    });

    const totalAttempts = allAttempts.length;
    const totalScore = allAttempts.reduce((acc, att) => acc + (att.score || 0), 0);
    const averageScore = totalAttempts > 0 ? (totalScore / totalAttempts).toFixed(2) : 0;

    const correct1st = allAttempts.filter(a => a.attempts === 1).length;
    const correct2nd = allAttempts.filter(a => a.attempts === 2).length;
    const correct3rd = allAttempts.filter(a => a.attempts === 3).length;

    // Datos persistentes de user_statistics
    const statistics = await UserStatistic.findAll({
      where: { user_id: userId },
      order: [['mode', 'ASC']]
    });

    res.json({
      resumen_dinamico: {
        totalSessions,
        totalAttempts,
        averageScore: Number(averageScore),
        correct1st,
        correct2nd,
        correct3rd
      },
      resumen_persistente: statistics
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};