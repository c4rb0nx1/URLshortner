const { Sequelize } = require('sequelize')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
});

const User = require('../model/users')(sequelize)
const Url = require('../model/urls')(sequelize)
const Session = require('../model/session')(sequelize)
const db = {
    sequelize,
    Sequelize,
    User,
    Url,
    Session,
  };

module.exports = db