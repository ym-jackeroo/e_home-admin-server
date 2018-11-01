const {Router} = require('express')
const router = Router()
const adminUserModel = require('../model/adminUser')
const auth = require('./auth')
const jwt = require('jsonwebtoken')
const cert = require('../utils/auth')

router.post('/', auth, async (req, res, next) => {    //增加管理员
    try{
        let {
            username,
            nickname,
            avatar,
            password,
            desc,
            job,
            phone, 
            sex
        } = req.body

        const data = await adminUserModel.create({
            username,
            nickname,
            avatar,
            password,
            desc,
            job,
            phone, 
            sex
        })

        res.json({
            code: 200,
            data,
            msg: '新建管理员用户成功'
        })
    }catch(err) {
        next(err)
    }
})

router.get('/', auth, async (req, res, next) => {  //查看所有管理员
    let {page=1, page_size=10} = req.query
    page = parseInt(page)
    page_size = parseInt(page_size)

    try {
        const count = await adminUserModel.count()
        const data = await adminUserModel
            .find()
            .limit(page_size)
            .skip((page-1)*page_size)
            .sort({_id: -1})
            .select('-password')

        res.json({
            code: 200,
            data,
            count,
            msg: 'success'
        })
    } catch(err) {
        next(err)
    }
})

router.get('/:id', auth, async (req, res, next) => {
    try {
        const {id} = req.params
        const data = await adminUserModel
        .findById(id)
        .select('-password')

        res.json({
            code: 200,
            data,
            msg: '查找一位管理员成功'
        })
    } catch(err) {
        next(err)
    }
})

router.post('/update', auth, async (req, res, next) => {    //修改管理员模块
    try {
        console.log(req.body)
        let {
            username,
            nickname,
            avatar,
            desc,
            job,
            phone, 
            sex,
            _id
        } = req.body

        const data = await adminUserModel.findById({_id})
        await data.$set({
                username,
                nickname,
                avatar,
                desc,
                job,
                phone, 
                sex
            })
        await data.save()

        res.json({
            code: 200,
            data,
            msg: '修改管理员成功'
        })

    } catch(err) {
        next(err)
    }
})

router.post('/changePass', auth, async(req, res, next) => {  //修改密码模块
    try {
        let {
            oldPass, 
            newPass,
            _id
        } = req.body
        let password = newPass
        const data = await adminUserModel.findById({_id})
        if(data.password == oldPass) {
            await data.$set({password})
            await data.save()

            res.json({
                code: 200,
                msg: "密码修改成功"
            })
        } else {
            res.json({
                code: 403,
                msg: "旧密码不正确"
            })
        }
        
        
    }catch(err) {
        next(err)
    }
})

router.post('/login', async (req, res, next) => {  //登录模块
    try {
        const {username, password} = req.body

        if(username&&password) {
            const user = await adminUserModel
            .findOne({username})
            if(user) {
                if(password == user.password) {
                    req.session.user = user //将用户的信息存到session中
                    // const token = jwt.sign({userId: user._id}, cert, {expiresIn: 60*60*7})

                    res.json({
                        code: 200,
                        data: user,
                        msg: '登录成功',
                        // token
                    })
                } else {
                    res.json({
                        code: 402,
                        msg: '密码错误'
                    })
                }
            } else {
                res.json({
                    code: 401, 
                    msg: '该用户不存在'
                })
            }
        } else {
            res.json({
                code: 400,
                msg: '缺少必要参数'
            })
        }
    } catch(err) {
        next(err)
    }
})

router.post('/logout', (req, res) => {   //退出登录模块
    
    if(req.session.user) {
        req.session.user = null
        res.json({
            code: 200,
            msg: '退出登录成功'
        })
    }else {
        res.json({
            code: 403,
            msg: '登录状态失效,请重新登录'
        })
    }
})

router.delete('/:id', auth, async(req, res, next) => {   //删除管理员模块
    try {
        let {id} = req.params

        const data = await adminUserModel.deleteOne({_id: id})

        res.json({
            code: 200,
            msg: '删除管理员成功'
        })
    }catch(err) {
        next(err)
    }
})

module.exports = router