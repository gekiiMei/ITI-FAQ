const Category = require("../models/Category")
const Topic = require("../models/Topic")
const Subject = require("../models/Subject")
const Page = require("../models/Page")

exports.get_categories = async (req, res) => {
    const curr_parent = req.body.curr_parent;
    try {
        const cats = await Category.findAll({
            where: {
                parent_category:curr_parent,
                is_active: true
            }, 
            raw:true
        })

        return res.status(200).json({msg:'Successfully fetched categories', categories:cats})
    } catch (e) {
        return res.status(500).json({msg:e})
    }
}

exports.get_topics = async (req, res) => {
    console.log('querying topics')
    const curr_author = req.body.author_id;
    try {
        const topics = await Topic.findAll({
            where: {
                author_id:curr_author,
                is_active:true
            },
            raw:true
        })

        return res.status(200).json({msg:'Successfully fetched topics', topics:topics})
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