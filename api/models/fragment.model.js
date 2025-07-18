const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Song = require('./song.model');

const Fragment = sequelize.define('Fragment', {
  level: DataTypes.INTEGER,
  audio_url: DataTypes.STRING,
}, {
  tableName: 'fragments',
  timestamps: false
});

Fragment.belongsTo(Song, { foreignKey: 'song_id' });
Song.hasMany(Fragment, { foreignKey: 'song_id' });

module.exports = Fragment;