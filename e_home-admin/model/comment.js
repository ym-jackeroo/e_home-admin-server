const mongoose = require('mongoose')

const comment = new mongoose.Schema({
    content: String,
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'admin_user'
    },
    topic: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'topic'
    },
    format_time: String
    
}, {versionKey: false, timestamps: {createdAt: 'create_time', updatedAt: 'update_time'}})

module.exports = mongoose.model('comment', comment)
