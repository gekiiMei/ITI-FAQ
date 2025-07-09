const Page = require("../models/Page")
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const sharp = require('sharp')
const { finalization } = require("process")



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

const storage = multer.memoryStorage()
const upload = multer({ storage }).single('file')

exports.saveImage = async (req, res) => {
    upload(req, res, async (err) => {
        const user_id = req.body.user_id
        const page_id = req.body.page_id
        const block_hash = req.body.block_hash
        if (err) {
            console.log(err)
            return res.status(500).json({msg:'Unexpected error'})
        }
        console.log('dir')
        console.log(__dirname)
        const uploadPath = path.join(__dirname, '../../uploads',user_id, page_id)
        console.log(uploadPath)
        fs.mkdirSync(uploadPath, {recursive:true})
        const finalPath = path.join(uploadPath, block_hash+'.png')
        try {
            await sharp(req.file.buffer)
            .png()
            .toFile(finalPath)
            console.log("succ")
            return res.status(200).json({msg:'Successfully uploaded'})
        } catch (e) {
            console.log(e)
            return res.status(500).json({msg:'Unexpected error'})
        }
    })
}