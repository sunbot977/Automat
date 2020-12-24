const Discord = require('discord.js')

module.exports.run = async (client, message) => {
    message.channel.send(`핑: ${client.ws.ping}ms`)
}

module.exports.help = {
    name: "핑"
}