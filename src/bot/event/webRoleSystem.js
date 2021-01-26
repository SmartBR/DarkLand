const config = require("../../../resource/config.json")
const User = require("../../database/model/User")
const log = require("../../logger/users")

module.exports = {
    name: "guildMemberUpdate",
    execute: async (oldMember, newMember) => {
        const evaluatorRoleId = config.roles.evaluator
        const evaluatorRole = newMember.guild.roles.cache.get(evaluatorRoleId)

        const vipRoleId = config.roles.vip
        const vipRole = newMember.guild.roles.cache.get(vipRoleId)

        const mention = "``" + oldMember.user.tag + "``"

        if (vipRole && !oldMember.roles.cache.has(vipRoleId) && newMember.roles.cache.has(vipRoleId)) {
            await User.findOneAndUpdate({_id: oldMember.id}, {vip: true})
            log(oldMember.client, `<:staff:796017005210894336> **|** ${mention} agora é ${vipRole}! :tada:`)
        }else if (vipRole && oldMember.roles.cache.has(vipRoleId) && !newMember.roles.cache.has(vipRoleId)) {
            await User.findOneAndUpdate({_id: oldMember.id}, {vip: false})
            log(oldMember.client, `<:youtube_gaming:796016984524324905> **|** ${mention} infelizmente perdeu seu ${vipRole}!`)
        }

        if (evaluatorRole && !oldMember.roles.cache.has(evaluatorRoleId) && newMember.roles.cache.has(evaluatorRoleId)) {
            await User.findOneAndUpdate({_id: oldMember.id}, {admin: true})
            log(oldMember.client, `<:staff:796017005210894336> **|** ${mention} agora é ${evaluatorRole}! :partying_face:`)
        }else if (evaluatorRole && oldMember.roles.cache.has(evaluatorRoleId) && !newMember.roles.cache.has(evaluatorRoleId)) {
            await User.findOneAndUpdate({_id: oldMember.id}, {admin: false})
            log(oldMember.client, `<:youtube_gaming:796016984524324905> **|** ${mention} infelizmente foi removido como ${evaluatorRole}!`)
        }
    }
}