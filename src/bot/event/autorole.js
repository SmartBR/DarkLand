const config = require("../../../resource/config.json")

module.exports = {
    name: "guildMemberAdd",
    execute: (member) => {
        if (member.user.bot) return

        const autoRoleId = config.roles.member
        const autoRole = member.guild.roles.cache.get(autoRoleId)

        if (autoRole) member.roles.add(autoRole)
    }
}