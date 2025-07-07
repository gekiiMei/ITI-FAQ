const Category = require("../models/Category")

exports.archive_category = ( async (req, res) => {
    category_id = req.body.category_id;
    const recur_result = await recursively_archive(category_id);
    if (recur_result == -1) {
        return res.status(500).json({msg:'Unexpected error.'})
    } else {
        return res.status(200).json({msg:'Successfully archived.'})
    }
})

async function recursively_archive(id) {
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
        recursively_archive(children_cats[i].id)
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