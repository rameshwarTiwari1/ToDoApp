const { Sequelize } = require('sequelize');
const path = require('path');

// Determine storage path based on environment
const storagePath =
  process.env.NODE_ENV === 'production'
    ? path.join('/tmp', 'db.sqlite') // Use /tmp in production im using render for backedn deployment
    : path.join(__dirname, '../db/db.sqlite'); // Use local path in development

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
});

module.exports = sequelize;
