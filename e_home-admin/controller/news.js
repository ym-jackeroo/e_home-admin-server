const express = require('express')
const router = express.Router()
const auth = require('./auth')
const newsModel = require('../model/news')

router.post('/', auth, async(req, res, next) => {  //新建新闻模块
    try {
        let {
            title,
            content,
            contentText,
            img,
            author,
            type,
            look_num
        } = req.body

        const news = await newsModel.create({
            title,
            content,
            contentText,
            img,
            author,
            type,
            look_num
        })

        res.json({
            code: 200,
            msg: '新闻新建成功'
        })
    }catch(err) {
        next(err)
    }
})

router.get('/', auth, async(req, res, next) => {  //查看所有新闻模块
    let {page=1, page_size=10} = req.query
    page = parseInt(page)
    page_size = parseInt(page_size)

    try {
        const count = await newsModel.count()
        const dataList = await newsModel
        .find()
        .skip((page-1)*page_size)
        .limit(page_size)
        .sort({_id: -1})
        .populate({
            path: 'author',
            select: '-password'
        })
        .populate({
            path: 'type'
        })

        res.json({
            code: 200,
            data: dataList,
            count,
            msg: '查看所有新闻成功'
        })
    }catch(err) {
        next(err)
    }
})
 
router.get('/:id', auth, async(req, res, next) => {   //查找新闻模块
    try {
        const {id} = req.params
        const data = await newsModel
            .findById(id)
            .populate({
                path: 'author',
                select: '-password'
            })
            .populate({
                path: 'type'
            })

        res.json({
            code: 200,
            data,
            msg: '查找一个新闻成功'
        })
    }catch(err) {
        next(err)
    }
})

router.post('/update', auth, async (req, res, next) => {  //修改新闻模块
    try {
        let {
            title,
            content,
            contentText,
            img,
            author,
            type,
            _id
        } = req.body

        const newsUpdate = await newsModel.findById({_id})
        
        newsUpdate.$set({
            title,
            content,
            contentText,
            img,
            author,
            type
        })
        newsUpdate.save()
        console.log(newsUpdate)

        res.json({
            code: 200,
            msg: '新闻修改成功'
        })
    }catch(err) {
        next(err)
    }
})

router.delete('/:id', auth, async(req, res, next) => {   //删除新闻模块
    try {
        let {id} = req.params

        const data = await newsModel.deleteOne({_id: id})
        res.json({
            code: 200,
            msg: '新闻删除成功'
        })
    } catch(err) {
        next(err)
    }

})

module.exports = router