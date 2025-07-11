const Page = require("../models/Page")
const Topic = require("../models/Topic")
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const sharp = require('sharp')
const { finalization } = require("process")
const { where } = require("sequelize")



exports.updatePage = async (req, res) => {
    const page_id = req.body.page_id
    const new_content = req.body.new_content
    const new_title = req.body.new_title
    try {
        Page.update(
            {
                content: new_content,
                title: new_title
            }, 
            {
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

exports.toggleTopicFeat = async (req, res) => {
    const topic_id = req.body.curr_topic;
    const feat = req.body.feat;
    try {
        Topic.update({
            is_featured:feat
        }, {where: {
            topic_id:topic_id
        }})
        return res.status(200).json({msg:'Successfully toggled'})
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
        if (err) {
            console.log(err)
            return res.status(500).json({msg:'Unexpected error'})
        }
        console.log('dir')
        console.log(__dirname)
        const uploadPath = path.posix.join(__dirname, '..','uploads',user_id, page_id)
        console.log(uploadPath)
        fs.mkdirSync(uploadPath, {recursive:true})
        const fileName = user_id + '_' + page_id + '_' + new Date().getTime().toString() + path.extname(req.file.originalname??".jpg")
        const finalPath = path.posix.join(uploadPath, fileName)
        try {
            const image = await sharp(req.file.buffer)
            const meta = await image.metadata()

            const tooBig = meta.width > 1080 || meta.height > 1080 //change max measures here -Harley

            if (tooBig) {
                await image.resize({
                    width: 1080,
                    height: 1080,
                    fit: 'inside'
                }).toFile(finalPath)
            } else{
                await image.toFile(finalPath)
            }
            console.log("succ. path: "+ finalPath)
            return res.status(200).json({msg:'Successfully uploaded', path:path.posix.join('/uploads',user_id, page_id, fileName)})
        } catch (e) {
            console.log(e)
            return res.status(500).json({msg:'Unexpected error'})
        }
    })
}