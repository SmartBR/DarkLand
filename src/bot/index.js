const Discord = require("discord.js")
const client = new Discord.Client()

const Bot = require("../database/model/Bot")
client.commands = new Discord.Collection()

const fs = require("fs")
const path = require("path")
const config = require("../../resource/config.json")

const categories = fs.readdirSync(path.join(__dirname, "/command"))
categories.forEach(category => {
    fs.readdirSync(path.join(__dirname, `/command/${category}`)).forEach(file => {
        const command = require(`./command/${category}/${file}`)
        command.category = category
        client.commands.set(command.name, command)
    })
})

fs.readdirSync(path.join(__dirname, "/event")).forEach(file => {
    const event = require(`./event/${file}`)
    client.on(event.name, event.execute)
})

client.on("ready", async () => {
    require("../website/server")(client)
    require("../database/mongodb")

    const activities = [{
            options: {
                type: "WATCHING"
            },
            status: "DarkLand.site"
    }, {
        options: {
            type: "STREAMING",
            url: "http://twitch.tv/SmarttBR"
        },
        status: `${await Bot.collection.countDocuments({ pending: false })} bots | DarkLand.site`
    }]

    client.user.setActivity(activities[0].status, activities[0].options)
    setInterval(() => {
        const activity = activities[Math.floor(Math.random() * activities.length)]
        client.user.setActivity(activity.status, activity.options)
    }, 10 * 1000)

    console.log("Aplicação online!")
})

client.on("message", (message) => {
    if (message.author.bot || !message.content.startsWith(config.prefix)) return

    const args = message.content.slice(config.prefix.length).split(" ")
    const commandName = args.shift()
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

    if (command) {
        command.execute(client, message, args)
    }else message.channel.send(`<:uncheck:796016984390107157> **|** ${message.author}, comando não encontrado.`)

})


client.login(config.token)