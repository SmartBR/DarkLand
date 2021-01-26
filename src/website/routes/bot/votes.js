const router = require("express").Router()

const Bot = require("../../../database/model/Bot")
const TimeUnit = require("../../utility/timeunit")
const config = require("../../../../resource/config.json")

const log = require("../../../logger/votes")
const logAPI = require("../../../logger/votesapi")

module.exports = (client) => {

    router.post("/:botLink", async (req, res) => {
        if (!req.user) return res.json({ errorMessage: "Você não está logado." })
        const botLink = req.params.botLink.toLowerCase()

        const bot = await Bot.findOne({ pending: false, _id: botLink }).exec() || await Bot.findOne({ pending: false, "view.customLink": botLink}).exec()
        if (!bot) return res.json({ errorMessage: "Bot não encontrado em nosso sistema." })

        const voteBot = config.website.voteBot
        const currentVote = req.user.voteBot.currentVote || 0
        const voteLimit = req.user.admin || req.user.vip ? voteBot.limit.vip : voteBot.limit.normal

        const currentTime = req.user.voteBot.time || Date.now()
        const countdownHours = voteBot.time
        let now = Date.now()

        if (currentVote >= voteLimit && currentTime >= now) {
            const differenceTime = currentTime - now

            const hours = Math.floor((differenceTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((differenceTime % (1000 * 60 * 60)) / (1000 * 60));

            const remaingTimeFormat = `${hours}h ${minutes}m`
            return res.json({ errorMessage: `Você atingiu o limite de ${voteLimit} votos a cada ${countdownHours}h. Você precisa esperar ${remaingTimeFormat} para votar novamente.` })
        }

        if (currentVote >= voteLimit && currentTime <= now) {
            req.user.voteBot.currentVote = 0;
        }

        req.user.voteBot.time = now + TimeUnit.HOURS.toMillis(countdownHours)
        req.user.voteBot.currentVote += 1
        bot.view.votes.logs.push(req.user.id)
        bot.view.votes.current = bot.view.votes.logs.length

        bot.save().catch(err => {
            console.error(err);
            res.json({ errorMessage: err.message })
        })
        req.user.save().then(() => res.json({})).then(() => {
            const mention = "``" + req.user.username + "#" + req.user.discriminator + "``"
            const domain = config.website.domain
            const botLink = (req.user.admin || req.user.vip && bot.view.customLink) ? bot.view.customLink : bot._id

            logAPI(client, `${req.user.id} -> ${bot._id}`)
            log(client, `<:bughunter:796016965192777809> **|** ${mention} votou em **${bot.username}#${bot.discriminator}**! ${domain}/bot/${botLink}`)
        }).catch(err => {
            console.error(err);
            res.json({ errorMessage: err.message })
        })
    })

    return router;
}