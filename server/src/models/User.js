const sequelize = require("../config/database")
const { DataTypes } = require('sequelize')

const User = sequelize.define('User', {
    user_id: {
        type:DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type:DataTypes.TEXT,
        allowNull: false
    },
    hashed_password: {
        type:DataTypes.TEXT,
        allowNull: false
    },
}, {
    tableName: 'User',
    schema:'iti-faq'
})

module.exports = User;