const router = require("express").Router()
const passport = require("passport")
const fetch = require("node-fetch")

module.exports = {
    path: "/oauth2",
    execute: () => {

        router.get("/login", passport.authenticate("discord"))

        router.get("/logout", (req, res) => {
            if (req.user) {
                req.user.delete()
            }
            res.redirect("/")
        })

        router.get("/callback", passport.authenticate("discord", {
            failureRedirect: "/",
            successRedirect: "/",
        }))

        return router;
    }
}