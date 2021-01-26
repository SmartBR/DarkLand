const express = require("express")
const app = express()

const mongoose = require("mongoose")
const Session = require("express-session")
const Store = require("connect-mongo")(Session)

const passport = require("passport")
const bodyParser = require("body-parser")
const helmet = require("helmet")

const fs = require("fs")
const path = require("path")
const config = require("../../resource/config.json")

module.exports = (client) => {
    require("./strategy/discord")(client)

    app.set("views", path.join(__dirname, "/views"))
    app.set("view engine", "pug")

    app.use(helmet.hidePoweredBy())
    app.use(helmet.expectCt())
    app.use(helmet.referrerPolicy({ policy: "no-referrer" }))
    app.use(helmet.noSniff())
    app.use(helmet.dnsPrefetchControl({ allow: false }))
    app.use(helmet.ieNoOpen())
    app.use(helmet.frameguard({ action: "sameorigin" }))
    app.use(helmet.permittedCrossDomainPolicies({ permittedPolicies: "none" }))
    app.use(helmet.xssFilter())

    app.use(new Session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
        store: new Store({mongooseConnection: mongoose.connection}),
        cookie: { expires: 604800000 }
    }))

    app.set("port", config.website.port)
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(express.static(path.join(__dirname, "/static")))


    fs.readdirSync(path.join(__dirname, "/routes")).forEach(routerFile => {
        const router = require(`./routes/${routerFile}`)
        app.use(router.path, router.execute(client))
    })

    app.listen(80, () => console.log("Website online!"))
}