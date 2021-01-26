const urlFormats = ["http://", "https://", "www.", ".gg", ".com", ".xyz", ".tk"]
const config = require("../../../resource/config.json")

module.exports = {
    name: "message",
    execute: (message) => {
        if (message.author.bot
            || message.member.hasPermission("ADMINISTRATOR")
            || message.member.roles.cache.get(config.roles.staff)
            || message.channel.id === config.categories.test_bot) return

        if (urlFormats.some(urlFormat => message.content.toLowerCase().includes(urlFormat.toLowerCase()))) {
            message.delete().then(() => {
                message.channel.send(`<:outage:796016993101807646> **|** ${message.author}, você não pode divulgar aqui!`)
            })
        }
    }
}