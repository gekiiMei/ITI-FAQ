const Page = require("../models/Page")

exports.updatePage = async (req, res) => {
    const page_id = req.body.page_id
    const new_content = req.body.new_content
    try {
        Page.update(
            {content: new_content}, {
                where: {
                    page_id:page_id
                }
            }
        )
        return res.status(200).json({msg:'Successfully saved'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg:'Unexpected error'})
    }
}