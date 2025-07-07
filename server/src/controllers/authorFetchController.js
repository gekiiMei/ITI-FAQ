const Category = require("../models/Category")

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