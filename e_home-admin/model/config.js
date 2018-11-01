const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/e_home', { useNewUrlParser: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
    console.log('连接数据库成功')
})

module.exports = db