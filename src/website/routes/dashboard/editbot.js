const router = require("express").Router()
const Bot = require("../../../database/model/Bot")

const log = require("../../../logger/botlist")
const libraries = require("../../utility/libraries")
const tags = require("../../utility/tags")
const config = require("../../../../resource/config.json")

module.exports = (client) => {

    router.get("/edit/:botLink", async (req, res) => {
        if (!req.user) return res.redirect("/oauth2/redirect")

        const botLink = req.params.botLink.toLowerCase()
        const bot = await Bot.findOne({ pending: false, _id: botLink }).exec() || await Bot.findOne({ pending: false, "view.customLink": botLink }).exec()

        if (!bot || !bot.owners.includes(req.user.id)) return res.redirect("/")

        res.render("dashboard/editbot", {
            userSession: req.user,
            vip: req.user.admin || req.user.vip,
            owner: req.user,
            bot, libraries, tags
        })
    })

    router.post("/edit/:botLink", async (req, res) => {
        if (!req.user || !req.body) return res.json({ errorMessage: "Houve um erro ao validar os dados." })

        const botLink = req.params.botLink.toLowerCase()
        const bot = await Bot.findOne({$or: [ {_id: botLink}, {"view.customLink": botLink} ]}).exec()

        if (!bot) return res.json({ errorMessage: "Não encontramos este bot registrado em nosso sistema." })
        if (!bot.owners.includes(req.user.id)) return res.json({ errorMessage: "Você não é dono deste bot." })

        const { prefix, customLink, library, supportServer, website, shortDescription, description, tags } = req.body

        if (customLink && bot.view.customLink !== customLink
            && await Bot.findOne({"view.customLink": customLink}).exec()) return res.json({ errorMessage: "Este link personalizado já está em uso." })

        bot.view.prefix = prefix;
        bot.view.customLink = customLink ? customLink.toLowerCase() : "";
        bot.view.library = library;
        bot.view.supportServer = supportServer;
        bot.view.website = website;
        bot.view.shortDescription = shortDescription;
        bot.view.description = description;
        bot.view.tags = tags;

        bot.save().then(() => res.json({})).then(() => {
            const domain = config.website.domain
            const mention = client.users.cache.get(req.user.id) || "``" + req.user.username + "#" + req.user.discriminator + "``"

            log(client, `<:fixed:796016981412282420> **|** ${mention}, seu bot **${bot.username}#${bot.discriminator}** foi editado com sucesso! ${domain}/bot/${botLink}`)
        }).catch(err => {
            console.error(err)
            res.json({ errorMessage: err.message })
        })
    })

    router.delete("/edit/:botId", async (req, res) => {
        if (!req.user || !req.body) return res.json({ errorMessage: "Houve um erro ao validar os dados." })

        const bot = await Bot.findOneAndDelete({_id: req.params.botId}).exec()
        if (!bot.owners.includes(req.user.id)) return res.json({ errorMessage: "Você não é dono deste bot." })

        const mention = client.users.cache.get(req.user.id) || "``" + req.user.username + "#" + req.user.discriminator + "``"

        res.json({})
        log(client, `<:outage:796016993101807646> **|** ${mention}, seu bot **${bot.username}#${bot.discriminator}** foi deletado com sucesso!`)
    })

    return router;
}