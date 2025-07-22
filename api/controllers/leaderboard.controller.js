const { UserStatistic, User } = require('../models');
const { Op } = require('sequelize');
const { LeaderboardCache } = require('../models');

// ?mode=normal&limit=10
exports.getLeaderboard = async (req, res) => {
  try {
    const mode = req.query.mode || 'normal';
    const limit = parseInt(req.query.limit) || 10;
    const time_range = req.query.time_range || req.query.range || 'all'; // all, daily, monthly

    let where = { mode };

    if (time_range  === 'daily') {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      where.last_played = { [Op.gte]: start };
    } else if (time_range  === 'monthly') {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      where.last_played = { [Op.gte]: start };
    }

    const top = await UserStatistic.findAll({
      where,
      include: [{ model: User, attributes: ['username'] }],
      order: [['highest_score', 'DESC']],
      limit
    });

    res.json(top);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCachedLeaderboard = async (req, res) => {
  try {
    const mode = req.query.mode || 'normal';
    const time_range = req.query.time_range || req.query.range || 'all_time';

    const cache = await LeaderboardCache.findOne({
      where: { mode, time_range }
    });

    if (!cache) {
      return res.status(404).json({ message: 'Leaderboard cache not available yet' });
    }

    res.json({
      updated_at: cache.updated_at,
      results: cache.data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};