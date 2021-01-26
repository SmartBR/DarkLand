const router = require("express").Router()

module.exports = {
    path: "/doc",
    execute: (client) => {

        router.get("/api", (req, res) => {
            res.render("documentation/api", {
                userSession: req.user
            })
        })

        return router;
    }
}