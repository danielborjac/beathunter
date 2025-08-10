const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeaderboardCache = sequelize.define('LeaderboardCache', {
  mode: {
    type: DataTypes.ENUM('random', 'daily', 'classic')
  },
  time_range: {
    type: DataTypes.ENUM('daily', 'monthly', 'all_time')
  },
  data: {
    type: DataTypes.JSON
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'leaderboard_cache',
  timestamps: false
});

module.exports = LeaderboardCache;