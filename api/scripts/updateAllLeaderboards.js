const updateCache = require('../utils/updateLeaderboardCache');
const sequelize = require('../config/database');

(async () => {
  try {
    await sequelize.authenticate();
    const modes = ['normal', 'daily', 'category'];
    const ranges = ['daily', 'monthly', 'all_time'];

    for (const mode of modes) {
      for (const time_range of ranges) {
        console.log(`⏳ Updating ${mode} - ${time_range}`);
        await updateCache(mode, time_range, 10);
      }
    }

    console.log('✅ Leaderboards updated.');
    process.exit();
  } catch (err) {
    console.error('Error updating leaderboard cache:', err);
    process.exit(1);
  }
})();