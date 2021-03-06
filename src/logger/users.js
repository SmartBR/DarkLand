const config = require("../../resource/config.json")

module.exports = (client, message) => {
    const logChannelId = config.channels.users_log
    const logChannel = client.channels.cache.get(logChannelId)

    if (logChannel) logChannel.send(message)
}