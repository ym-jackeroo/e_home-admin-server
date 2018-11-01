const express = require('express')
const router = express.Router()
const auth = require('./auth')
const swiperModel = require('../model/swiper')

router.post('/', auth,  async (req, res, next) => {   //上传轮播图模块
    try{
        let {
            img,
            title,
            news,
            sort,
            status
        } = req.body

        const swiperData = await swiperModel.create({
            img,
            title,
            news,
            sort,
            status
        })

        res.json({
            code: 200,
            data: swiperData,
            msg: '上传轮播图成功'
        })

    } catch(err) {
        next(err)
    }
})

router.get('/', auth, async(req, res, next) => {  //查看所有轮播图模块
    let {page, page_size} = req.query
    page = parseInt(page)
    page_size = parseInt(page_size)

    try {
        const count = await swiperModel.count()
        const data = await swiperModel
            .find()
            .skip((page-1)*page_size)
            .limit(page_size)
            .sort({sort: -1})
            .populate({
                path: 'news'
            })

        res.json({
            code: 200,
            data,
            count,
            msg: '查看所有轮播图成功'
        })

    } catch(err) {
        next(err)
    }
})

router.get('/:id', auth, async(req, res, next) => {  //查看轮播图模块
    let {id} = req.params

    try {
        const data = await swiperModel
            .findById(id)
            .populate({
                path: 'news'
            })

        res.json({
            code: 200,
            data,
            msg: '查看一个轮播图成功'
        })
    } catch(err) {
        next(err)
    }
})

router.post('/update', auth, async(req, res, next) => {  //修改轮播图模块
    try {
        let { 
            img,
            title,  
            news,
            sort,
            status,
            _id
        } = req.body
        const data = await swiperModel.findById(_id)

        data.$set({
            img,
            title,
            news,
            sort,
            status
        })
        data.save()
    
        res.json({
            code: 200,
            data,
            msg: '轮播图信息修改成功'
        })
    } catch(err) {
        next(err)
    }
})

router.delete('/:id', auth, async(req, res, next) => {   //删除轮播图模块
    try {
        let {id} = req.params

        const data = await swiperModel.deleteOne({_id: id})

        res.json({
            code: 200,
            msg: '删除成功'
        })
    }catch(err) {
        next(err)
    }
})

module.exports = router