const Category = require("../models/Category")
const Subject = require("../models/Subject")

//underscore (_) at the front of the  name == for internal use of the controller -harley

const _archive_category = async (category_id) => {
    const recur_result = await _recursively_archive_cat(category_id);
    if (recur_result == -1) {
        return res.status(500).json({msg:'Unexpected error.'})
    } else {
        return res.status(200).json({msg:'Successfully archived.'})
    }
}

exports.archive_category = async (req, res) => {
    category_id = req.body.category_id;
    const recur_result = await _recursively_archive_cat(category_id);
    //TODO: archive all child topics
    if (recur_result == -1) {
        return res.status(500).json({msg:'Unexpected error.'})
    } else {
        return res.status(200).json({msg:'Successfully archived.'})
    }
}

exports.archive_subject = async (req, res) => {
    subject_id = req.body.subject_id;
    console.log('archive sub endpoint reached')
    const recur_result = await _recursively_archive_sub(subject_id);
    //TODO: archive all child pages
    if (recur_result == -1) {
        return res.status(500).json({msg:'Unexpected error.'})
    } else {
        return res.status(200).json({msg:'Successfully archived.'})
    }
}

async function _recursively_archive_cat(id) {
    //id should never be null that'd delete every single category LOL -Harley
    if (id == null) {
        return -1;
    }
    const target_cat = await Category.findOne({
        where: { category_id: id }
    })
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
    
    Category.update(
        { is_active:false, }, {
            where: {
                parent_category: id,
                is_active: true
            }
        })
    //ADD PAGES UPDATE HERE

    target_cat.update({ is_active: false })
    
    console.log('id: ' + id)
    console.log('children:')
    console.log(children_cats)
}

async function _recursively_archive_sub(id) {
    //id should never be null that'd delete every single subject -Harley
    try {
        console.log('attempting to recursively archive subjects')
        console.log('id: ' + id)
        if (id == null) {
        return -1;
    }
    
    const target_sub = await Subject.findOne({
        where: { subject_id: id }
    })
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
        { is_active:false, }, {
            where: {
                parent_subject: id,
                is_active: true
            }
        })
    //ADD PAGES UPDATE HERE

    target_sub.update({ is_active: false })
    
    
    } catch (e) {
        console.log(e)
    }
}