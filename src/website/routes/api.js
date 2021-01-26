const router = require("express").Router()

const Bot = require("../../database/model/Bot")

module.exports = {
    path: "/api",
    execute: (client) => {

        router.get("/bot/:botId", async (req, res) => {
            const bot = await Bot.findById(req.params.botId).exec()

            return res.json(bot ? {
                username: bot.username,
                discriminator: bot.discriminator,
                owners: bot.owners,
                view: {
                    prefix: bot.view.prefix,
                    customLink: bot.view.customLink,
                    library: bot.view.library,
                    supportServer: bot.view.supportServer,
                    website: bot.view.website,
                    shortDescription: bot.view.shortDescription,
                    description: bot.view.description,
                    tags: bot.view.tags,
                    votes: bot.view.votes.logs
                }
            } : {
                errorMessage: "bot not found"
            })
        })

        return router;
    }
}