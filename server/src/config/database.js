require('dotenv').config();

const { Sequelize } = require('sequelize')
const conn_string = 'postgres://'+process.env.DB_USER+':'+process.env.DB_PASSWORD+'@'+process.env.DB_HOST+':'+process.env.DB_PORT+'/'+ process.env.DB_NAME

const sequelize = new Sequelize(connection_string)

module.exports = sequelize;