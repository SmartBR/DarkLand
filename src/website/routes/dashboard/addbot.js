const router = require("express").Router()
const Bot = require("../../../database/model/Bot")

const log = require("../../../logger/botlist")
const libraries = require("../../utility/libraries")
const tags = require("../../utility/tags")
const config = require("../../../../resource/config.json")

module.exports = (client) => {

    router.get("/add", (req, res) => {
        if (!req.user) return res.redirect("/oauth2/login")

        res.render("dashboard/addbot", {
            userSession: req.user,
            domain: config.website.domain,
            vip: req.user.admin || req.user.vip,
            libraries, tags
        })
    })

    router.post("/add", async (req, res) => {
        if (!req.user || !req.body) return res.json({ errorMessage: "Houve um erro ao validar os dados." })

        const { id, prefix, customLink, library, supportServer, website, shortDescription, description, tags } = req.body

        if (isNaN(id) || id.length < 18) return res.json({ errorMessage: "Coloque um ID válido." })
        if (await Bot.findById(id).exec()) return res.json({ errorMessage: "Este bot já está registrado em nosso sistema." })
        if (customLink && await Bot.findOne({ "view.customLink": customLink }).exec()) return res.json({ errorMessage: "Este link personalizado já está em uso." })

        client.users.fetch(id).then(userDiscordBot => {
            if (!userDiscordBot) return res.json({ errorMessage: "Bot não encontrado." })
            if (!userDiscordBot.bot) return res.json({ errorMessage: "Este ID não corresponde a um bot." })

            const { username, discriminator, avatar } = userDiscordBot

            new Bot({
                _id: id, username, discriminator, avatar,
                owners: [req.user.id],
                registeredAt: Date.now(),
                view: {
                    prefix, library, supportServer, website, shortDescription, description, tags,
                    customLink: customLink ? customLink.toLowerCase() : ""
                }

            }).save().then(() => res.json({})).then(() => {
                const mention = client.users.cache.get(req.user.id) || "``" + req.user.username + "#" + req.user.discriminator + "``"

                log(client, `<:slash:796016976061268018> **|** ${mention} enviou o bot **${username}#${discriminator}** para avaliação.`)
            }).catch(err => {
                console.error(err)
                res.json({ errorMessage: err.message })
            })
        })
    })

    return router;
}