const Category = require("../models/Category")
const Topic = require("../models/Topic")
const Subject = require("../models/Subject")
const Page = require("../models/Page")

exports.get_categories = async (req, res) => {
    const curr_parent = req.body.curr_parent;
    try {
        // children of passed category -harley
        const cats = await Category.findAll({
            where: {
                parent_category:curr_parent,
                is_active: true
            }, 
            raw:true
        })
        // the passed category -harley
        const parent = (curr_parent == null)?null: await Category.findOne({
            where: {
                category_id: curr_parent,
                is_active: true
            },
            raw: true
        })
        console.log("the parent:")
        console.log(parent)
        //the parent of the passed category -harley
        const grandparent = (parent==null)?null:(parent.parent_category==null)?null: await Category.findOne({ // lol (if there's better approach than daisy-chaining ternaries pls change) -harley
            where: {
                category_id: parent.parent_category,
                is_active: true
            },
            raw:true
        })

        return res.status(200).json({msg:'Successfully fetched categories', categories:cats, parent: parent, grandparent: grandparent})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg:e})
    }
}

exports.get_topics = async (req, res) => {
    console.log('querying topics')
    const curr_author = req.body.author_id??null;
    const parent_category = req.body.parent_cat??null;
    console.log("curr author: " + curr_author +"; parent_category: " + parent_category)
    console.log("cat from body: " + req.body.parent_cat)
    try {
        const topics = await Topic.findAll({
            where: (curr_author != null)? {
                author_id:curr_author,
                is_active:true
            }: {
                parent_category: parent_category,
                is_active:true
            }
            ,
            raw:true
        })
        console.log("queried topics: " + topics)
        return res.status(200).json({msg:'Successfully fetched topics', topics:topics})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg:e})
    }
}

exports.get_topic_title_feat = async (req, res) => {
    const curr_topic_id = req.body.curr_topic
    try {
        const topic = await Topic.findOne({
            attributes:['title', 'is_featured'],
            where:{
                topic_id:curr_topic_id
            }
        })
        console.log("return from query: " + topic)
        console.log("title: " + topic.title)
        return res.status(200).json({msg:'Successfully fetched title and feat', topic_title:topic.title, featured:topic.is_featured})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg:e})
    }
}

exports.get_subjects = async (req, res) => {
    console.log('querying subjects')
    const curr_topic = req.body.curr_topic??null;
    const curr_subject = req.body.curr_subject??null;
    console.log('topic: ' + curr_topic);
    console.log('subject: ' + curr_subject);
    try {
        const subjects = await Subject.findAll({
            where: (curr_subject == null && curr_topic != null) ? {
                parent_topic: curr_topic,
                is_active: true
            } : {
                parent_subject: curr_subject,
                is_active: true
            }
        })
        console.log("result: " + subjects)
        return res.status(200).json({msg:'Successfully fetched subjects', subjects: subjects})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg:e})
    }
}

exports.get_pages = async (req, res) => {
    const curr_topic = req.body.curr_topic??null;
    const curr_subject = req.body.curr_subject??null;
    console.log("getting pages, current sub: " + curr_subject)
    try {
        const pages = await Page.findAll({
            where: (curr_subject == null) ? {
                parent_topic: curr_topic,
                parent_subject: null,
                is_active: true
            } : {
                parent_subject: curr_subject,
                is_active: true
            }
        })
        console.log("result: " + pages)
        return res.status(200).json({msg:'Successfully fetched pages', pages: pages})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg:e})
    }
}

exports.get_page_details = async (req, res) => {
    const page_id = req.body.page_id
    console.log('getting the details of page id: ' + page_id)
    try {
        const details = await Page.findOne({
            attributes: ['title', 'content'],
            where: {page_id: page_id},
            raw:true
        })
        console.log('result: ' + details)
        return res.status(200).json({msg:'Successfully fetched details', details: details})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg:e})
    }
}

exports.check_page_title = async (req, res) => {
    const new_title = req.body.new_title;
    const parent_topic = req.body.parent_topic??null
    const parent_subject = req.body.parent_subject??null
    try {
        const res_page = await Page.findOne({
            where: {
                title: new_title,
                parent_topic: parent_topic,
                parent_subject: parent_subject,
                is_active: true
            }
        })
        console.log("looking for " + new_title)
        console.log("found " + res_page)
        const status = res_page?true:false
        return res.status(200).json({msg:'Successfully checked', existing:status})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg:"Unexpected error"})
    }

}