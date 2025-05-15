const { Sequelize } = require('sequelize');
const setupModels = require('../src/models');

require('dotenv').config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  dialect: 'postgres',
});

setupModels(sequelize);
const models = sequelize.models;

module.exports = {
  sequelize,
  Sequelize,
  models
};
