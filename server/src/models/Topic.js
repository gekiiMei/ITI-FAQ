require('dotenv').config();
const sequelize = require("../config/database")
const { DataTypes } = require('sequelize')
const User = require('./User')
const Category = require("./Category")

const Topic = sequelize.define('Topic', {
    topic_id: {
        type:DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type:DataTypes.TEXT,
        allowNull: false
    },
    parent_category: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Category',
            key: 'category_id'
        },
        allowNull: false
    },
    author_id: {
        type:DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'user_id'
        }
    },
    thumbnail_path: {
        type:DataTypes.TEXT,
        allowNull: false,
        defaultValue:'placeholder'
    },
    is_active: {
        type:DataTypes.BOOLEAN,
        allowNull:false
    },

    is_featured:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'Topic',
    schema: process.env.DB_SCHEMA
})

Topic.belongsTo(User, {
    foreignKey: 'author_id',
    as: 'author_user'
})
User.hasMany(Topic, {
    foreignKey: 'author_id',
    as: 'authored_topics'
})
Topic.belongsTo(Category, {
    foreignKey: 'parent_category',
    as: 'category'
})
Category.hasMany(Topic, {
    foreignKey: 'parent_category',
    as: 'child_topics'
})

module.exports = Topic;