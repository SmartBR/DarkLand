const router = require("express").Router()

const Bot = require("../../../database/model/Bot")

module.exports = (client) => {

    router.get("/", async (req, res) => {
        if (!req.query.search) return

        const search = req.query.search
        const regex = { $regex: search, $options: "i" }

        res.render("search", {
            userSession: req.user, search,
            searchBots: await Bot.find({$or: [ { username: regex}, { "view.shortDescription": regex } ]}).sort({ registeredAt: -1 }).exec()
        })
    })

    return router;
}