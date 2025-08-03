const { sequelize } = require('../models');

async function updateLeaderboardCache(mode, time_range, limit = 10) {
  const now = new Date();
  let whereDate = '';

  if (time_range === 'daily') {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    const startStr = start.toISOString().slice(0, 19).replace('T', ' ');
    const endStr = end.toISOString().slice(0, 19).replace('T', ' ');

    whereDate = `AND gs.started_at >= '${startStr}' AND gs.started_at <= '${endStr}'`;
  }
  else if (time_range === 'monthly') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 19).replace('T', ' ');
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString().slice(0, 19).replace('T', ' ');
    whereDate = `AND gs.started_at >= '${start}' AND gs.started_at < '${end}'`;
  }

  const query = `
    SELECT
      gs.user_id,
      u.username,
      gs.id AS session_id,
      SUM(ga.score) AS score
    FROM game_sessions gs
    JOIN users u ON u.id = gs.user_id
    JOIN game_attempts ga ON ga.session_id = gs.id
    WHERE gs.mode = :mode ${whereDate}
    GROUP BY gs.id, gs.user_id, u.username
    ORDER BY score DESC
    LIMIT :limit;
  `;

  const results = await sequelize.query(query, {
    replacements: { mode, limit: 15 },
    type: sequelize.QueryTypes.SELECT
  });

  const cacheData = results.map(row => ({
    user_id: row.user_id,
    username: row.username,
    score: Number(row.score)
  }));

  const { LeaderboardCache } = require('../models');
  await LeaderboardCache.upsert({
    mode,
    time_range,
    data: cacheData,
    updated_at: new Date()
  });
}

module.exports = updateLeaderboardCache;