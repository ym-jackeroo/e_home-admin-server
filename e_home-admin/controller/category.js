const express = require('express')
const router = express.Router()
const categoryModel = require('../model/category')
const auth = require('./auth')

router.get('/', auth, async (req, res, next) => {   //查看新闻分类模块
    try {
        const data = await categoryModel.find()

        res.json({
            code: 200,
            data,
            msg: 'success'
        })
    } catch(err) {
        next(err)
    }
})

router.post('/', auth, async(req, res, next) => {
    try{
        let {title} = req.body

        const data = await categoryModel.create({
            title
        })
        res.json({
            code: 200,
            msg: '分类创建成功'
        })
    } catch(err) {
        next(err)
    }
})

router.delete('/:id', auth, async(req, res, next) => {
    try {
        let {id} = req.params
        await categoryModel.deleteOne({_id: id})
        res.json({
            code: 200,
            msg: '分类删除成功'
        })
    } catch(err) {
        next(err)
    }
})

module.exports = router