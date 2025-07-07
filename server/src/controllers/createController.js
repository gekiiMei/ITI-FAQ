const Category = require("../models/Category")

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