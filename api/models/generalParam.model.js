const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GeneralParam = sequelize.define('GeneralParam', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  total_songs: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_options: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  attempt_duration: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  fragment_1: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  fragment_2: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  fragment_3: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  }
}, {
  tableName: 'general_params',
  timestamps: false
});

module.exports = GeneralParam;