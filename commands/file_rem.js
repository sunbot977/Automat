const Discord = require('discord.js');
const error = require('../Discord.js/error.js');
const config = require('../config/bot_info.json');
const sqlite3 = require('sqlite3')
const path = require('path');
const dbPath = path.resolve(__dirname, './databases/item_list.db');

module.exports.run = async (client, message) => {
    if(message.author.id == config.owners) {
        let gold = message.content.split(' ')
        const user_info = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (error_u) => {
            if(error_u) {
                let embed = new (Discord.MessageEmbed)()
                embed.setColor("#FF0000")
                embed.setTitle("오류 발생")
                embed.setAuthor(message.author.username, message.author.avatarURL())
                embed.setDescription("```js\n" + error_u.message + "\n```")
                message.channel.send({ embed: embed })
            } else {
                if(gold[1] == undefined) {
                    return error.wrongcmd(message, "!제품제거 제품이름")
                } else {
                    user_info.serialize();
                    user_info.run(`DELETE FROM item_list WHERE item_name = '${gold[1]}'`)
                    message.react("✅")
                }
            }
        })
    } else {
        return error.noPerms(message, "BOT OWNER")
    }
}

module.exports.help = {
    name: "제품제거"
}