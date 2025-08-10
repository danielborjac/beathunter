const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');

const UserStatistic = sequelize.define('UserStatistic', {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  mode: {
    type: DataTypes.ENUM('random', 'daily', 'classic')
  },
  total_score: DataTypes.INTEGER,
  games_played: DataTypes.INTEGER,
  highest_score: DataTypes.INTEGER,
  last_played: DataTypes.DATE
}, {
  tableName: 'user_statistics',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

UserStatistic.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(UserStatistic, { foreignKey: 'user_id' });

module.exports = UserStatistic;