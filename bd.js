const { Sequelize } = require('sequelize');
const config = require('config');

module.exports = new Sequelize(
  config.get('name'),
  config.get('user'),
  config.get('password'),
  {
    dialect: 'postgres',
    host: config.get('host'),
    port: config.get('port'),
  }
);
