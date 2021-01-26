const router = require("express").Router()

const User = require("../../database/model/User")
const Bot = require("../../database/model/Bot")
const markdown = require("markdown-it")()

module.exports = {
    path: "/bot",
    execute: (client) => {

        router.use(require("./bot/votes")(client))
        router.use(require("./bot/search")(client))

        router.get("/:botLink", async (req, res) => {
            const botLink = req.params.botLink.toLowerCase()

            const bot = await Bot.findOne({ $or: [ { "view.customLink": botLink }, {_id: botLink}  ] }).exec()
            if (!bot || bot.pending) return res.redirect("/")

            const owner = await User.findById(bot.owners[0]).exec()

            res.render("bots/botpage", {
                userSession: req.user,
                markdownHtml: markdown.render(bot.view.description),
                owner, bot
            })
        })

        return router;
    }
}