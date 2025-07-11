const sequelize = require("../config/database")
const { DataTypes } = require('sequelize')
const Topic = require("./Topic")
const Subject = require("./Subject")

const Page = sequelize.define('Page', {
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    page_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    content: {
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
    tableName: 'Page',
    schema:'iti-faq'
})

Page.belongsTo(Topic, {
    foreignKey: 'parent_topic',
    as: 'parentTopic'
})
Topic.hasMany(Page, {
    foreignKey: 'parent_topic',
    as: 'child_pages'
})
Page.belongsTo(Subject, {
    foreignKey: 'parent_subject',
    as: 'parentSubject'
})
Subject.hasMany(Page, {
    foreignKey: 'parent_subject',
    as: 'child_pages'
})

module.exports = Page