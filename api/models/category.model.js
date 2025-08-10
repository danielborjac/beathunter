const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mode: {
    type: DataTypes.ENUM('genre', 'mix', 'artist', 'random'),
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  playlist_ids: {
    type: DataTypes.JSON,
    allowNull: true
  },
  genre_id: {
    type: DataTypes.STRING, 
    allowNull: true
  },
  artist_id: {
    type: DataTypes.STRING, 
    allowNull: true
  }
}, {
  tableName: 'categories',
  timestamps: true, // si tienes createdAt y updatedAt
});

module.exports = Category;