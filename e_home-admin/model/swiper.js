const mongoose = require('mongoose')

const swiper = new mongoose.Schema({
    img: String,
    title: String,
    news: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'news'
    },
    sort: String,
    status: Number
}, {versionKey: false, timestamps: {createdAt: 'create_time', updatedAt: 'update_time'}})

module.exports = mongoose.model('swiper', swiper)
