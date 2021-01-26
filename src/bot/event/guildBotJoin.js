const Bot = require("../../database/model/Bot")
const config = require("../../../resource/config.json")

module.exports = {
    name: "guildMemberAdd",
    execute: async (member) => {
        if (!member.user.bot) return

        const bot = await Bot.findById(member.id).exec()
        if (!bot) return

        const botRoleId = config.roles.bot
        const botRole = member.guild.roles.cache.get(botRoleId)
        const botLibraryRole = member.guild.roles.cache.find(role => role.name === bot.view.library)

        if (botRole) member.roles.add(botRole)
        if (botLibraryRole) member.roles.add(botLibraryRole)
    }
}