/*const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Song = require('./song.model');
const GameSession = require('./gameSession.model');

const GameAttempt = sequelize.define('GameAttempt', {
  session_id: {
    type: DataTypes.INTEGER,
    references: { model: 'game_sessions', key: 'id' }
  },
  song_id: {
    type: DataTypes.INTEGER,
    references: { model: 'songs', key: 'id' }
  },
  guess_type: DataTypes.ENUM('artist', 'title'),
  attempts: DataTypes.INTEGER,
  score: DataTypes.INTEGER,
  duration_sec: DataTypes.INTEGER
}, {
  tableName: 'game_attempts',
  timestamps: false
});
console.log(GameSession);
GameAttempt.belongsTo(GameSession, { foreignKey: 'session_id' });
GameAttempt.belongsTo(Song, { foreignKey: 'song_id' });

module.exports = GameAttempt;*/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GameAttempt = sequelize.define('GameAttempt', {
  session_id: DataTypes.INTEGER,
  song_id: DataTypes.INTEGER,
  guess_type: DataTypes.ENUM('artist', 'title'),
  attempts: DataTypes.INTEGER,
  score: DataTypes.INTEGER,
  duration_sec: DataTypes.INTEGER
}, {
  tableName: 'game_attempts',
  timestamps: false
});

module.exports = GameAttempt;