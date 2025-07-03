import { DataTypes } from "sequelize";
import sequelize from "../config/database";

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
        tyep:DataTypes.TEXT,
        allowNull: false
    },
})

module.exports = User;