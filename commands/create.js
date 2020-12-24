const Discord = require('discord.js');
const sqlite3 = require('sqlite3')
const path = require('path');
const config = require('../config/bot_info.json');
const dbPath = path.resolve(__dirname, './databases/user_info.db');

module.exports.run = async (client, message) => {
    const user_info = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if(err) {
            let embed = new (Discord.MessageEmbed)()
            embed.setColor("#FF0000")
            embed.setTitle("오류 발생")
            embed.setAuthor(message.author.username, message.author.avatarURL())
            embed.setDescription("```js\n" + err.message + "\n```")
            message.channel.send({ embed: embed })
        } else {
            try {
                user_info.serialize();
                user_info.all(`SELECT user_money, user_black FROM user_info WHERE user_id = '${message.author.id}'`, function(error_user, rows) {
                try {
                    console.log(rows[0].user_id)
                    return message.channel.send(`<@${message.author.id}> 이미 가입되어 있습니다.`)
                } catch (error) {
                        user_info.serialize();
                        user_info.run(`INSERT or IGNORE INTO user_info(user_id) VALUES('${message.author.id}')`, function(err, rows) {
                            if(err) console.log(err)

                            let embed = new (Discord.MessageEmbed)
                                embed.setTitle(`${message.author.tag} 님이 자판기 시스템에 가입하였습니다.`)
                                embed.setColor("#9da9ee")
                                client.channels.cache.get(config.reg_ch).send(embed)  
                                
                                let embed2 = new (Discord.MessageEmbed)
                                embed2.setTitle(`${message.author.tag} 등록이 완료되었습니다.`)
                                embed2.setColor("#9da9ee")
                                client.channels.cache.get(config.reg_ch).send(embed2)
                            client.users.fetch(config.owners).then((player) => {
                                try {
                                    player.send(`${message.author.username} 유저가 자판기 시스템에 가입하였습니다.`)
                                } catch (send_error) {
                                    return
                                }
                            })
                        });
                }
            })
            } catch (db_err) {
                let embed = new (Discord.MessageEmbed)()
                embed.setColor("#FF0000")
                embed.setTitle("오류 발생")
                embed.setAuthor(message.author.username, message.author.avatarURL())
                embed.setDescription("```js\n" + db_err.message + "\n```")
                message.channel.send({ embed: embed })
            }
        }
    });
}

module.exports.help = {
    name: "가입"
}