const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userScheme = new Schema ({
    pictures: {
        type: Array,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    filter: {
        type: Object,
        required: true
    }
})

module.exports = mongoose.model('friends_users', userScheme)