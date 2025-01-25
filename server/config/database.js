const { Sequelize } = require('sequelize');
const path = require('path');

// Set the storage path based on the environment (development vs. production)
const storagePath =
  process.env.NODE_ENV === 'production'
    ? path.join('/tmp', 'db.sqlite')  // For production (Render)
    : path.join(__dirname, '../db/db.sqlite');  // For local development

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
});

module.exports = sequelize;
