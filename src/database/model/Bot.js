const mongoose = require("mongoose")

const schema = mongoose.Schema({
    _id: {
        type: String,
    },
    owners: {
        type: Array,
    },
    pending: {
        type: Boolean,
        default: true
    },
    username: {
        type: String,
    },
    discriminator: {
        type: String,
    },
    avatar: {
        type: String,
    },
    registeredAt: {
        type: Number,
    },
    view: {
        prefix: {
            type: String,
        },
        library: {
            type: String,
        },
        website: {
            type: String,
        },
        supportServer: {
            type: String,
        },
        customLink: {
            type: String,
        },
        shortDescription: {
            type: String,
        },
        description: {
            type: String,
        },
        markdown: {
            type: String,
        },
        tags: {
            type: Array,
        },
        votes: {
            current: {
                type: Number,
                default: 0
            },
            logs: {
                type: Array,
                default: []
            }
        },
    }
})

module.exports = mongoose.model("Bot", schema, "bots")