/*const Song = require('./song.model');
const Fragment = require('./fragment.model');
const GameSession = require('./gameSession.model');
const GameAttempt = require('./gameAttempt.model');
const User =  require('./user.model')

module.exports = {
  Song,
  Fragment,
  User,
  GameSession,
  GameAttempt
};*/
const sequelize = require('../config/database');

const User = require('./user.model');
const Song = require('./song.model');
const Fragment = require('./fragment.model');
const GameSession = require('./gameSession.model');
const GameAttempt = require('./gameAttempt.model');
const UserStatistic = require('./userStatistic.model');
const LeaderboardCache = require('./leaderboardCache.model');

// Relaciones principales
User.hasMany(GameSession, { foreignKey: 'user_id' });
GameSession.belongsTo(User, { foreignKey: 'user_id' });

GameSession.hasMany(GameAttempt, { foreignKey: 'session_id' });
GameAttempt.belongsTo(GameSession, { foreignKey: 'session_id' });

Song.hasMany(GameAttempt, { foreignKey: 'song_id' });
GameAttempt.belongsTo(Song, { foreignKey: 'song_id' });

Song.hasMany(Fragment, { foreignKey: 'song_id' });
Fragment.belongsTo(Song, { foreignKey: 'song_id' });

module.exports = {
  sequelize,
  User,
  Song,
  Fragment,
  GameSession,
  GameAttempt,
  UserStatistic,
  LeaderboardCache
};