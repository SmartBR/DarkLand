const config = require("../../../resource/config.json")

module.exports = {
    name: "message",
    execute: (message) => {
        if (message.author.bot || message.content.split(" ").length > 1) return

        if (message.mentions.users.get(message.client.user.id)) {
            message.channel.send(`<:partner_two:796016992024133702> **|** ${message.author}, meu prefix é **${config.prefix}**. Meu querido website: ${config.website.domain}`)
        }
    }
}