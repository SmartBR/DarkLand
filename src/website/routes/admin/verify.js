const router = require("express").Router()
const markdown = require("markdown-it")()

const Bot = require("../../../database/model/Bot")
const User = require("../../../database/model/User")

const reprovereasons = require("../../utility/reprovereasons")
const log = require("../../../logger/botlist")
const config = require("../../../../resource/config.json")

module.exports = (client) => {

    router.get("/verify/:botId", async (req, res) => {
        if (!req.user || !req.user.admin) return res.redirect("/oauth2/login")

        const bot = await Bot.findOne({ pending: true, _id: req.params.botId}).exec()
        if (!bot) return res.redirect("/")

        const owner = await User.findById(bot.owners[0]).exec()
        if (!owner) return res.redirect("/")

        res.render("admin/verify", {
            userSession: req.user,
            domain: config.website.domain,
            markdownHtml: markdown.render(bot.view.description),
            owner, bot, reprovereasons
        })
    })

    router.post("/verify/:botId/approve", async (req, res) => {
        if (!req.user || !req.user.admin) return res.sendStatus(401)

        const botId = req.params.botId

        const bot = await Bot.findOneAndUpdate({_id: botId}, {pending: false}).exec()
        const owner = await User.findById(bot.owners[0]).exec()

        const botInvite = bot.view.customLink || botId
        const domain = config.website.domain

        const mention =  client.users.cache.get(owner.id) || "``" + owner.username + "#" + owner.discriminator + "``"
        log(client, `<:news:796016966871285770> **|** ${mention}, seu bot **${bot.username}#${bot.discriminator}** foi aprovado e já está disponível em: ${domain}/bot/${botInvite}`)
    })

    router.post("/verify/:botId/reprove", async (req, res) => {
        if (!req.user || !req.user.admin || !req.body) return res.sendStatus(401)

        const bot = await Bot.findOneAndDelete({_id: req.params.botId}).exec()
        const owner = await User.findById(bot.owners[0]).exec()
        const mention =  client.users.cache.get(owner.id) || "``" + owner.username + "#" + owner.discriminator + "``"

        log(client, `<:uncheck:796016984390107157> **|** ${mention}, seu bot **${bot.username}#${bot.discriminator}** foi reprovado! Motivo:` + "```" + req.body.reason + "```")
    })

    return router;
}