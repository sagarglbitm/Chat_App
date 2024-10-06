const mongoose = require("mongoose")

const userChatSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    followers: {
        type: Array,
        default: []
    },
    bookmarks: {
        type: Array,
        default:[]
    },
    following: {
        type: Array,
        default: []
    },
}, { timestamps: true })

const userChat = mongoose.model("userChat", userChatSchema)

module.exports = userChat

