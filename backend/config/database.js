const { Sequelize } = require('sequelize');
const path = require('path');

// storing dir path and basic config
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../db/db.sqlite'),
});

module.exports = sequelize;



