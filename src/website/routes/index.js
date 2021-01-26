const router = require("express").Router()

const User = require(`../../database/model/User`)
const Bot = require("../../database/model/Bot")
const fetch = require("node-fetch")

module.exports = {
    path: "/",
    execute: (client) => {

        router.get("/", async (req, res) => {
            res.render("index", {
                userSession: req.user,
                bots: {
                    top: await Bot.find({ pending: false }).sort({ "view.votes.current": -1 }).limit(8),
                    recent: await Bot.find({ pending: false }).sort({ registeredAt: -1 }).limit(8),
                    explore: await Bot.aggregate([{$match: { pending: false }}, { $sample: { size: 8 } }])
                }
            })

            if (req.user) {
                fetch("https://discordapp.com/api/users/@me", {
                    type: "get",
                    headers: {
                        "Authorization": `Bearer ${req.user.token}`
                    }
                }).then(result => result.json()).then(async result => {
                    req.user.username = result.username;
                    req.user.discriminator = result.discriminator;
                    req.user.avatar = result.avatar;

                    const bots = await Bot.find({ owners: [req.user.id] }).exec()
                    bots.forEach(bot => {
                        client.users.fetch(bot.id).then(userBot => {
                            bot.username = userBot.username;
                            bot.discriminator = userBot.discriminator;
                            bot.avatar = userBot.avatar;
                        })
                    })

                    User.findById(req.user.id).then(() => {
                        console.log(`${req.user.username}#${req.user.discriminator} updated!`)
                    })
                })
            }
        });

        return router;
    }
}

