const Discord = require('discord.js');
const error = require('../Discord.js/error.js');
const sqlite3 = require('sqlite3')
const path = require('path');
const dbPath = path.resolve(__dirname, './databases/item_list.db');
const dbPath_2 = path.resolve(__dirname, './databases/user_info.db');

module.exports.run = async (client, message) => {
    const user_info = new sqlite3.Database(dbPath_2, sqlite3.OPEN_READWRITE, (error_u) => {
        const item = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (error_i) => {
            if(error_u) {
                let embed = new (Discord.MessageEmbed)()
                embed.setColor("#FF0000")
                embed.setTitle("오류 발생")
                embed.setAuthor(message.author.username, message.author.avatarURL())
                embed.setDescription("```js\n" + error_u.message + "\n```")
                message.channel.send({ embed: embed })
            }
            if(error_i) {
                let embed = new (Discord.MessageEmbed)()
                embed.setColor("#FF0000")
                embed.setTitle("오류 발생")
                embed.setAuthor(message.author.username, message.author.avatarURL())
                embed.setDescription("```js\n" + error_i.message + "\n```")
                message.channel.send({ embed: embed })
            }
			user_info.serialize()
			user_info.all(`SELECT user_money, user_black FROM user_info WHERE user_id = '${message.author.id}'`, function(error_user, rows) {
			try {
				if(message.content.substring(4) == "") {
					let embed = new (Discord.MessageEmbed)()
					embed.setColor("#8eebdc")
					embed.setAuthor(message.author.username, message.author.avatarURL())
					embed.addField("`소지 금액`", rows[0].user_money + "원", true)
					embed.addField("`블랙 여부`", rows[0].user_black, true)
                    embed.setFooter(message.author.username + "님의 정보입니다.\n")
                    embed.setTimestamp()
					message.channel.send({ embed: embed })
				}	
			} catch (err) {
				return message.channel.send(`<@${message.author.id}> 먼저 가입해주세요.`)};
			})
        })
    });
}

module.exports.help = {
    name: "정보"
}