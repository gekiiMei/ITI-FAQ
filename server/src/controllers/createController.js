const Category = require('../models/Category')
const Subject = require('../models/Subject')
const Page = require("../models/Page")
const Topic = require("../models/Topic")

exports.create_category = async (req, res) => {
    category_name = req.body.category_name;
    category_parent = req.body.category_parent;

    const [new_category, created] = await Category.findOrCreate({
        where:{
            name:category_name,
            parent_category:category_parent,
            is_active: true
        },
        defaults:{
            name:category_name,
            parent_category:category_parent,
            is_active: true
        }
    })
    
    if (!created) {
        console.log('category exists')
        return res.status(409).json({msg:'Category ' + category_name + ' already exists!'})
    } else {
        return res.status(200).json({msg:'Category created!'})
    }
}

exports.create_topic = async (req,res) => {
    const topic_name = req.body.topic_name
    const parent_category = req.body.parent_category
    const author_id = req.body.author_id
        const [new_topic, created] = await Topic.findOrCreate({
        where: {
            title: topic_name,
            parent_category: parent_category,
            author_id: author_id,
            is_active: true
        },
        defaults: {
            title: topic_name,
            parent_category: parent_category,
            author_id: author_id,
            is_active: true,
            avg_rating: 0,
            rating_count: 0
        }
    })

    if (!created) {
        return res.status(409).json({msg:'Topic ' + topic_name + ' already exists!'})
    } else {
        return res.status(200).json({msg:'Topic created!', topic_id:new_topic.topic_id})
    }   
}

exports.create_subject = async (req,res) => {
    const subject_name = req.body.subject_name
    const parent_topic = req.body.parent_topic??null
    const parent_subject = req.body.parent_subject??null
    const [new_subject, created] = await Subject.findOrCreate({
        where: {
            name: subject_name,
            parent_topic: parent_topic,
            parent_subject: parent_subject,
            is_active: true
        },
        defaults: {
            name: subject_name,
            parent_topic: parent_topic,
            parent_subject: parent_subject,
            is_active: true
        }
    })

    if (!created) {
        return res.status(409).json({msg:'Subject ' + subject_name + ' already exists!'})
    } else {
        return res.status(200).json({msg:'Subject created!', subject_id:new_subject.subject_id})
    }  
}

exports.create_page = async (req, res) => {
    const page_title = req.body.page_title
    const parent_topic = req.body.parent_topic??null
    const parent_subject = req.body.parent_subject??null
    const [new_page, created] = await Page.findOrCreate({
        where: {
            title: page_title,
            parent_topic: parent_topic,
            parent_subject: parent_subject,
            is_active: true
        },
        defaults: {
            title: page_title,
            parent_topic: parent_topic,
            parent_subject: parent_subject,
            content: [],
            is_active: true
        }
    })

    if (!created) {
        return res.status(409).json({msg:'Subject ' + page_title + ' already exists!'})
    } else {
        return res.status(200).json({msg:'Subject created!', subject_id:new_page.subject_id})
    }

}