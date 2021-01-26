const router = require("express").Router()
const config = require("../../../resource/config.json")

module.exports = {
    path: "/support",
    execute: (client) => {

        router.get("/", async (req, res) => {
            res.redirect(config.support_server)
        })

        return router;
    }
}