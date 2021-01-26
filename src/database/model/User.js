const mongoose = require("mongoose")

const schema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    discriminator: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: false,
        default: false
    },
    vip: {
        type: Boolean,
        required: false,
        default: false
    },
    avatar: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    voteBot: {
        currentVote: {
            type: Number,
            require: false,
            default: 0
        },
        time: {
            type: Number,
            require: true
        }
    }
})

module.exports = mongoose.model("User", schema, "users")