const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Song = sequelize.define('Song', {
  title: DataTypes.STRING,
  artist: DataTypes.STRING,
  difficulty: DataTypes.ENUM('easy', 'medium', 'hard'),
  category: DataTypes.STRING,
  year: DataTypes.INTEGER,
  popularity: DataTypes.INTEGER,
}, {
  tableName: 'songs',
  timestamps: false
});

module.exports = Song;