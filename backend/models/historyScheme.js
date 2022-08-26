const mongoose = require('mongoose')
const Schema = mongoose.Schema

const historyScheme = new Schema ({
    user: {
        type: String,
        required: true
    },
    likesMe: {
        type: Array,
        required: true
    },
    iLike: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model('friends_history', historyScheme)