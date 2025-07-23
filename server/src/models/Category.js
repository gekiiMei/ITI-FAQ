require('dotenv').config();
const sequelize = require("../config/database")
const { DataTypes } = require('sequelize')

const Category = sequelize.define('Category', {
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    parent_category: {
        type:DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Category',
            key: 'category_id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    }
}, {
    tableName: 'Category',
    schema:process.env.DB_SCHEMA
})

Category.hasMany(Category, {
    foreignKey: 'parent_category',
    as: 'subcategories'
})

Category.belongsTo(Category, {
    foreignKey: 'parent_category',
    as: 'parent'
})

module.exports = Category