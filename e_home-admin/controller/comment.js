const express = require('express')
const router = express.Router()
const auth = require('./auth')
const topicModel = require('../model/topic')
const commentModel = require('../model/comment')
const adminUserModel = require('../model/adminUser')
const formatDate = require('./format')

router.post('/', auth, async(req, res, next) => {  //发布主题评论
    try {
        const {
            content,
            topic_id
        } = req.body

        const userId = req.session.user._id

        const topic = await topicModel.findById(topic_id)
        const user = await adminUserModel
            .findById(userId)
            .select('nickname avatar')
        if(topic) {
            let comment = await commentModel.create({
                content,
                user,
                topic: topic_id,
                format_time: formatDate(new Date())
            })

            await topic.update({$push: {comment: comment._id}})
            

            res.json({
                code: 200,
                data: comment,
                msg: '评论发布成功'
            })
        } else {
            res.json({
                code: 400,
                msg: '没有找到该主题'
            })
        }
    } catch(err) {
        next(err)
    }
})

router.get('/getComment/:topicId', auth, async(req, res, next) => {
    try {
        const topicId = req.params.topicId
        const data = await commentModel
            .find({topic: topicId})
            .populate({
                path: 'user',
                select: "nickname avatar"
            })

            res.json({
                code: 200,
                data,
                msg: '查找主题评论成功'
            })
    } catch(err) {
        next(err)
    }
})

router.delete('/:id', auth, async(req, res, next) => {
    try {
        let {id} = req.params
        const comment = await commentModel.deleteOne({_id: id})
        res.json({
            code: 200,
            msg: '评论删除成功'
        })
    } catch(err) {
        next(err)
    }
})

module.exports = router