const router = require("express").Router()

const botTags = require("../utility/tags")
const Bot = require("../../database/model/Bot")

module.exports = {
    path: "/explore",
    execute: () => {

        router.get("/", async (req, res) => {
            const tags = {}

            for (const index in botTags) {
                const tag = botTags[index]
                tags[tag] = await Bot.aggregate([ {$match: { pending: false, "view.tags": {$all: [tag]} }}, {$sample: { size: 10 }} ])
            }

            res.render("explore", {
                userSession: req.user,
                tags
            })
        })

        return router;
    }
}