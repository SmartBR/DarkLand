const router = require("express").Router()
const Bot = require("../../database/model/Bot")

module.exports = {
    path: "/dashboard",
    execute: (client) => {

        router.use(require("./dashboard/editbot")(client))
        router.use(require("./dashboard/addbot")(client))

        router.get("/", async (req, res) => {
            if (!req.user) return res.redirect("/oauth2/login")

            res.render("dashboard", {
                userSession: req.user,
                bots: await Bot.find({owners: [req.user.id]}).exec()
            })
        })

        return router;
    }
}