const { MessageEmbed } = require("discord.js")
const config = require("../../../resource/config.json")

module.exports = {
    name: "guildMemberAdd",
    execute: (member) => {
        const joinChannelId = config.channels.join
        const joinChannel = member.guild.channels.cache.get(joinChannelId)
        const emoji = (member.user.bot) ? "<:partner:796016991201919057>" : "<:invite:796016972549849108>"

        if (joinChannel) {
            joinChannel.send(member.user, new MessageEmbed()
                .setDescription(`${emoji} **|** ${member.user} entrou no servidor!`)
                .addField("<:news:796016966871285770> Nos conheça:", `<:streaming_two:796016976903274496> Site: ${config.website.domain}\n`, false)
            )
        }
    }
}