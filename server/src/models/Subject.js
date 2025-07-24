require('dotenv').config();
const sequelize = require("../config/database")
const { DataTypes } = require('sequelize')
const Topic = require("./Topic")

const Subject = sequelize.define('Subject', {
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    subject_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    parent_topic: {
        type:DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Topic',
            key: 'topic_id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    },
    parent_subject: {
        type:DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Subject',
            key: 'subject_id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    }
}, {
    tableName: 'Subject',
    schema:process.env.DB_SCHEMA
})

Subject.belongsTo(Topic, {
    foreignKey: 'parent_topic',
    as: 'parentTopic'
})
Topic.hasMany(Subject, {
    foreignKey: 'parent_topic',
    as: 'child_subjects'
})
Subject.belongsTo(Subject, {
    foreignKey: 'parent_subject',
    as: 'parentSubject'
})
Subject.hasMany(Subject, {
    foreignKey: 'parent_subject',
    as: 'child_subjects'
})

module.exports = Subject