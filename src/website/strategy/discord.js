const passport = require("passport")
const DiscordStrategy = require("passport-discord")
const User = require("../../database/model/User")
const config = require("../../../resource/config.json")

module.exports = (client) => {

    passport.use(new DiscordStrategy({
        clientID: config.client.id,
        clientSecret: config.client.secret,
        scope: ["identify", "guilds.join"],
        callbackURL: `${config.website.domain}/oauth2/callback`
    }, async (accessToken, refreshToken, profile, done) => {
        const user = await User.findById(profile.id).exec() || new User({ _id: profile.id })

        user.token = accessToken
        user.username = profile.username
        user.discriminator = profile.discriminator
        user.avatar = profile.avatar

        user.save().then(result => done(null, result))
            .catch(err => done(err, null))
    }))

    passport.serializeUser((profile, done) => {
        done(null, profile._id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id).then(result => done(null, result))
            .catch(err => done(err, null))
    })
}