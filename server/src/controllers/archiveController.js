const Category = require("../models/Category")
const Subject = require("../models/Subject")
const Page = require("../models/Page")
const Topic = require("../models/Topic")

//underscore (_) at the front of the  name == for internal use of the controller -harley

exports.archive_category = async (req, res) => {
    category_id = req.body.category_id;
    const recur_result = await _recursively_archive_cat(category_id);
    if (recur_result == -1) {
        return res.status(500).json({msg:'Unexpected error.'})
    } else {
        return res.status(200).json({msg:'Successfully archived.'})
    }
}

exports.archive_topic = async (req, res) => {
    topic_id = req.body.topic_id;
    try {
        const children_subs = await Subject.findAll({
            where: {
                parent_topic: topic_id
            }
        })
        for (let i=0; i<children_subs.length; ++i) {
            await _archive_subject(children_subs[i].subject_id)
        }
        Page.update(
            { is_active:false }, {
                where: {
                    parent_topic: topic_id,
                    is_active: true
                }
            })
        Topic.update(
            { is_active:false }, {
                where: {
                    topic_id: topic_id,
                }
            })
        return res.status(200).json({msg:'Successfully archived.'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg:'Unexpected error.'})
    }
}

const _archive_topic = async (topic_id) => {
    try {
        const children_subs = await Subject.findAll({
            where: {
                parent_topic: topic_id
            }
        })
        for (let i=0; i<children_subs.length; ++i) {
            await _archive_subject(children_subs[i].subject_id)
        }
        Page.update(
            { is_active:false }, {
                where: {
                    parent_topic: topic_id,
                    is_active: true
                }
            })
        Topic.update(
            { is_active:false }, {
                where: {
                    topic_id: topic_id,
                }
            })
    } catch (e) {
        console.log(e)
    }
}

exports.archive_subject = async (req, res) => {
    subject_id = req.body.subject_id;
    console.log('archive sub endpoint reached')
    const recur_result = await _recursively_archive_sub(subject_id);
    // Page.update(
    //     { is_active:false }, {
    //         where: {
    //             parent_subject: subject_id,
    //             is_active: true
    //         }
    //     })
    if (recur_result == -1) {
        return res.status(500).json({msg:'Unexpected error.'})
    } else {
        return res.status(200).json({msg:'Successfully archived.'})
    }
}

const _archive_subject = async (subject_id) => {
    await _recursively_archive_sub(subject_id);
    Page.update(
        { is_active:false }, {
            where: {
                parent_subject: subject_id,
                is_active: true
            }
        })
}

exports.archive_page = async (req, res) => {
    page_id = req.body.page_id;
    try {
        Page.update(
            {is_active: false}, {
                where: {
                    page_id: page_id
                }
            }
        )
        return res.status(200).json({msg:'Successfully archived.'})
    } catch (e) {
        return res.status(500).json({msg:'Unexpected error.'})
    }
    
}

async function _recursively_archive_cat(id) {
    //id should never be null that'd delete every single category LOL -Harley
    if (id == null) {
        return -1;
    }
    const target_cat = await Category.findByPk(id)
    const children_cats = await Category.findAll({
        where: {
            parent_category: id,
            is_active: true
        }
    })
    //i wanted to use a foreach or a map but neiter wait for promises, -Harley
    for (let i=0; i<children_cats.length; ++i) {
        await _recursively_archive_cat(children_cats[i].category_id)
    }
    const children_topics = await Topic.findAll({
        where: {parent_category: category_id}
    })
    for (let i=0; i<children_topics.length; ++i) {
        await _archive_topic(children_topics[i].topic_id)
    }
    
    Category.update(
        { is_active:false, }, {
            where: {
                parent_category: id,
                is_active: true
            }
        })
    target_cat.update({ is_active: false })
    
    console.log('id: ' + id)
    console.log('children:')
    console.log(children_cats)
}

async function _recursively_archive_sub(id) {
    //id should never be null that'd delete every single subject -Harley
    console.log('attempting to recursively archive subjects')
    console.log('id: ' + id)
    if (id == null) {
        return -1;
    }
    
    const target_sub = await Subject.findByPk(id)
    const children_subs = await Subject.findAll({
        where: {
            parent_subject: id,
            is_active: true
        }
    })
    //i wanted to use a foreach or a map but neiter wait for promises, -Harley
    
    console.log('children:')
    console.log(children_subs)
    for (let i=0; i<children_subs.length; ++i) {
       await  _recursively_archive_sub(children_subs[i].subject_id)
    }
    
    Subject.update(
        { is_active:false }, {
            where: {
                parent_subject: id,
                is_active: true
            }
        })
    Page.update(
        { is_active:false }, {
            where: {
                parent_subject: id,
                is_active: true
            }
        })

    target_sub.update({ is_active: false })
    

}