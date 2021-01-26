const { MessageEmbed } = require("discord.js")

const User = require("../../../database/model/User")
const Bot = require("../../../database/model/Bot")
const config = require("../../../../resource/config.json")

module.exports = {
    name: "search",
    aliases: ["procurar"],
    execute: async (client, message, args) => {
        const search = args.join(" ")

        if (!search) {
            return message.channel.send(`<:uncheck:796016984390107157> **|** ${message.author}, você precisa colocar um id, um nome ou uma descrição para procurar um bot.`)
        }

        const regex = { $regex: search, $options: "i" }
        const bot = await Bot.findOne({ $or: [ {_id: regex}, { username: regex }, { "view.shortDescription": regex } ] }).exec()

        if (!bot)  {
            return message.channel.send(`:thinking: **|** ${message.author}, não encontramos nenhum bot com ` + "``" + search + "``. Lembre-se, você pode procurar por **id, nome ou descrição**.")
        }

        const owner = await User.findById(bot.owners[0]).exec()

        if (!owner) {
            return message.channel.send(`:x: **|** ${message.author}, houve um erro inesperado ao executar este comando. **Contate um membro da equipe para resolver.**`)
        }

        const embed = new MessageEmbed()
        embed.setTitle(`<:mention:796016981852684379> | DarkLand - ${bot.username}#${bot.discriminator}`)
        embed.setThumbnail(`https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}?size=2048`)
        embed.setDescription(`${bot.view.shortDescription}`)
        embed.addField(":crown:  Dono", "``" + owner.username + "#" + owner.discriminator + "`` " + `${owner.admin || owner.vip ? "**(VIP)**" : ""}`, false)
        embed.addField("<:regras:796016983568023552> Livraria", bot.view.library, false)
        embed.addField("<:slash:796016976061268018> Prefix", bot.view.prefix, false)
        if (bot.view.website) {
            embed.addField("<:partner_two:796016992024133702> Website", bot.view.website, false)
        }
        embed.addField("<:discord:796016990278910023> Servidor de suporte", bot.view.supportServer, false)
        embed.addField("<:hypesquad:796016981097578506> Tags", bot.view.tags.join(", "), false)
        embed.addField(`<:streaming_two:796016976903274496> Vote em mim (${bot.view.votes.current} votos)`, `${config.website.domain}/bot/${owner.admin || owner.vip && bot.view.customLink ? bot.view.customLink : bot._id}`, false)
        embed.setFooter("Registro", `https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}?size=2048`)
        embed.setTimestamp(bot.registeredAt)
        embed.setColor("#0a95b6")

        await message.channel.send(message.author, embed)
    }
}