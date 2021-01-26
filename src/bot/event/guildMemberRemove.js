const { MessageEmbed } = require("discord.js")
const config = require("../../../resource/config.json")

module.exports = {
    name: "guildMemberRemove",
    execute: (member) => {
        const quitChannelId = config.channels.join
        const quitChannel = member.guild.channels.cache.get(quitChannelId)

        if (quitChannel) {
            quitChannel.send(new MessageEmbed()
                .setDescription(`**${member.user.tag}** infelizmente nos deixou!`)
                .setColor("#ff1212")
            )
        }
    }
}