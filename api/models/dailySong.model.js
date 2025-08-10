const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DailySongs = sequelize.define('DailySongs', {
  songs_id: DataTypes.JSON,
  date_release: DataTypes.STRING
}, {
  tableName: 'daily_songs',
  timestamps: false
});

module.exports = DailySongs;