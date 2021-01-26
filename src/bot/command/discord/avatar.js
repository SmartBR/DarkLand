const { MessageAttachment } = require("discord.js")

module.exports = {
    name: "avatar",
    description: "Veja o avatar de um usuário.",
    execute: (client, message, args) => {
        const user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author
        const avatar = user.avatarURL({size: 2048})

        const attachment = new MessageAttachment(avatar)
        message.channel.send(message.author, attachment)
    }
}