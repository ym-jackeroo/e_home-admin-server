var express = require('express');
var router = express.Router();

router.use('/admin/adminUser', require('../controller/adminUser'))
router.use('/admin/news', require('../controller/news'))
router.use('/admin/category', require('../controller/category'))
router.use('/admin/swiper', require('../controller/swiper'))
router.use('/admin/topic', require('../controller/topic'))
router.use('/admin/comment', require('../controller/comment'))

module.exports = router;
