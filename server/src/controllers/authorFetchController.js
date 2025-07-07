const Category = require("../models/Category")
const Topic = require("../models/Topic")

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