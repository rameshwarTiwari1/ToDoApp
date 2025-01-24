const { Sequelize } = require('sequelize');
const path = require('path');

//storage path based on environment
const storagePath =
  path.join(__dirname, '../db/db.sqlite'); 

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
});

module.exports = sequelize;
