const router = require("express").Router()
const Bot = require("../../database/model/Bot")

module.exports = {
    path: "/admin",
    execute: (client) => {

        router.use(require("./admin/verify")(client))

        router.get("/", async (req, res) => {
            if (!req.user || !req.user.admin) return res.redirect("/oauth2/login")

            res.render("admin", {
                userSession: req.user,
                botPendings: await Bot.find({ pending: true })
            })
        })

        return router;
    }
}