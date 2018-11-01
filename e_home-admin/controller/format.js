module.exports = formatDate = function(unix) {
    function fixedZore(num) {
        return num >= 10? ('' + num) : ('0' + num)
    }
    let date = new Date(unix)
    let year = date.getFullYear()
    let month = fixedZore(date.getMonth()+1)
    let day = fixedZore(date.getDate())
    let hours = fixedZore(date.getHours())
    let minutes = fixedZore(date.getMinutes())
    let seconds = fixedZore(date.getSeconds())

    let timeStr = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    return timeStr
}