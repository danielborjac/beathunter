/*const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');
const GameAttempt = require('./gameAttempt.model');

const GameSession = sequelize.define('GameSession', {
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' }
  },
  mode: DataTypes.ENUM('random', 'daily', 'category'),
  started_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  finished_at: DataTypes.DATE
}, {
  tableName: 'game_sessions',
  timestamps: false
});

GameSession.belongsTo(User, { foreignKey: 'user_id' });
GameSession.hasMany(GameAttempt, { foreignKey: 'session_id' });

module.exports = GameSession;*/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GameSession = sequelize.define('GameSession', {
  user_id: DataTypes.INTEGER,
  mode: DataTypes.ENUM('random', 'daily', 'classic'),
  category_id: DataTypes.INTEGER,
  started_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  finished_at: DataTypes.DATE
}, {
  tableName: 'game_sessions',
  timestamps: false
});

module.exports = GameSession;