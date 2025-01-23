const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

// Task model 
const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('ToDo', 'InProgress', 'Completed'), // Correct ENUM usage
    defaultValue: 'ToDo',
  },
  dueDate: {
    type: DataTypes.DATE, 
    allowNull: false,
  },
});

Task.belongsTo(User, { onDelete: 'CASCADE' });
User.hasMany(Task);

module.exports = Task;
