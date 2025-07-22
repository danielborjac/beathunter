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
      t.user_id,
      u.username,
      MAX(t.session_score) AS highest_score
    FROM (
      SELECT
        gs.user_id,
        ga.session_id,
        SUM(ga.score) AS session_score
      FROM game_sessions gs
      JOIN game_attempts ga ON gs.id = ga.session_id
      WHERE gs.mode = :mode ${whereDate}
      GROUP BY ga.session_id, gs.user_id
    ) AS t
    JOIN users u ON t.user_id = u.id
    GROUP BY t.user_id, u.username
    ORDER BY highest_score DESC
    LIMIT :limit;
  `;

  const results = await sequelize.query(query, {
    replacements: { mode, limit },
    type: sequelize.QueryTypes.SELECT
  });

  const cacheData = results.map(row => ({
    user_id: row.user_id,
    username: row.username,
    highest_score: Number(row.highest_score)
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