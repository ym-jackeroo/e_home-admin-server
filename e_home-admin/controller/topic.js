const express = require('express')
const router = express.Router()
const auth = require('./auth')
const topicModel = require('../model/topic')
const commentModel = require('../model/comment')
const adminUserModel = require('../model/adminUser')
const formatDate = require('./format')

router.post('/', auth, async(req, res, next) => {   //发布主题模块
    try{
        const {content} = req.body
        const userId = req.session.user._id

        const user = await adminUserModel
            .findById(userId)
            .select('nickname avatar')

        const topic = await topicModel.create({
            user,
            content,
            format_time: formatDate(new Date())
        })

        res.json({
            code: 200,
            data: topic,
            msg: '主题发布成功'
        })
    } catch(err) {
        next(err)
    }
})

router.get('/', auth, async(req, res, next) => {   //查看所有主题
    try {
        let {page=1, page_size=10} = req.body
        page = parseInt(page)
        page_size = parseInt(page_size)

        const count = await topicModel.count()
        const data = await topicModel
            .find()
            .skip((page-1)*page_size)
            .limit(page_size)
            .sort({_id: -1})
            .populate({
                path: 'user',
                select: 'nickname avatar'
            })
            .populate({
                path: 'comment'
            })
            
            res.json({
                code: 200,
                data,
                msg: '查看所有主题成功',
                count
            })
    } catch(err) {
        next(err)
    }
})

router.get('/:id', auth, async(req, res, next) => {
    try {
        let {id} = req.params

        const data = await topicModel.findById(id)

        res.json({
            code: 200,
            data, 
            msg: '查看一个主题成功'
        })
    } catch(err) {
        next(err)
    }
})

router.delete('/:id', auth, async(req, res, next) => {
    try {
        let {id} = req.params
        const data = await topicModel.findById(id)
        for(let item of data.comment) {                  //遍历主题中的评论id
            console.log(item)
            const comment = await commentModel.deleteOne({_id: item})   //删除主题时同时删除主题下的评论
        }

        const topic = await topicModel.deleteOne({_id: id})
        res.json({
            code: 200,
            data,
            msg: '主题删除成功'
        })
    } catch(err) {
        next(err)
    }
})

module.exports = router