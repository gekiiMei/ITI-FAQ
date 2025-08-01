const Page = require("../models/Page")
const Topic = require("../models/Topic")
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const sharp = require('sharp')


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

exports.updateThumbnail = async (req, res) => {
    upload(req, res, async (err) => {
        const user_id = req.body.user_id
        const topic_id = req.body.topic_id
        if (err) {
            console.log(err)
            return res.status(500).json({msg:'Unexpected error'})
        }
        console.log('dir')
        console.log(user_id)
        console.log(topic_id)
        console.log(__dirname)
        const uploadPath = path.posix.join(__dirname, '..','uploads', 'thumbnails',user_id, topic_id)
        console.log(uploadPath)
        fs.mkdirSync(uploadPath, {recursive:true})
        const fileName = user_id + '_' + topic_id + '_' + path.extname(req.file.originalname??".jpg")
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
            
            Topic.update({
                thumbnail_path: path.posix.join('/uploads', 'thumbnails', user_id, topic_id, fileName)
            }, {
                where:{ topic_id:topic_id }
            })

            return res.status(200).json({msg:'Successfully uploaded', path:path.posix.join('/uploads', 'thumbnails', user_id, topic_id, fileName)})
        } catch (e) {
            console.log(e)
            return res.status(500).json({msg:'Unexpected error'})
        }
    })
}

exports.updateRatings = async (req, res) => {
    const page_id = req.body.page_id
    const new_rating = req.body.new_rating
    
    try {
        const page = await Page.findByPk(page_id)
        const old_total_rating = page.total_rating
        const old_rating_count = page.rating_count
        
        const new_total_rating = old_total_rating + new_rating
        const new_rating_count = old_rating_count + 1

        page.total_rating = new_total_rating
        page.rating_count = new_rating_count

        await page.save()

        return res.status(200).json({msg:'Rating updated'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg:'Unexpected error'})
    }
}

exports.renameTopic = async (req, res) => {
    const topic_id = req.body.topic_id
    const new_title = req.body.new_title
    console.log('renaming: ')
    console.log('id: ' + topic_id)
    console.log('new_title ' + new_title)
    try {
        chosen_topic = await Topic.findByPk(topic_id)
        if ((await Topic.findAll({where:{title: new_title, parent_category: chosen_topic.parent_category}})).length>0) {
            return res.status(409).json({msg: 'Title exists'})
        }
        chosen_topic.title = new_title
        await chosen_topic.save();
        console.log("rename succ")
        return res.status(200).json({msg: 'Title updated'})
    } catch(e) {
        console.log('rename err')
        console.log(e)
        return res.status(500).json({msg:'Unexpected error'})
    }
}