const Discord = require('discord.js');
const config = require('../config/bot_info.json');
const error = require('../Discord.js/error.js');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, './databases/user_info.db');

module.exports.run = async (client, message) => {
    let gold = message.content.split(' ')
    if(message.author.id == config.owners) {
        const user_money = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
            if(err) {
                let embed = new (Discord.MessageEmbed)()
                embed.setColor("#FF0000")
                embed.setTitle("오류 발생")
                embed.setAuthor(message.author.username, message.author.avatarURL())
                embed.setDescription("```js\n" + err.message + "\n```")
                message.channel.send({ embed: embed })
            } else {
                if(gold[1] == undefined || gold[2] == undefined || gold[2].indexOf(" ") != -1 || gold[2] == null || gold[2] == "") {
                    return error.wrongcmd(message, "!충전 유저멘션/유저아이디 금액")
                } else {
                    try {
                        var money = gold[2].replace(" ", "").trim()
                        user_money.serialize();
                        try {
                            user_money.all(`SELECT * FROM user_info WHERE user_id = '${gold[1].replace(/[^0-9]/g, "").trim()}'`, function(res, rows) {
                                try {
                                    let dummy = rows[0].user_money;
                                    user_money.run(`UPDATE user_info SET user_money = user_money + ${money} WHERE user_id = '${gold[1].replace(/[^0-9]/g, "").trim()}'`)
                                    try {
                                        message.channel.send(`<@${message.author.id}> <@${gold[1].replace(/[^0-9]/g, "").trim()}>님 에게 ${money}원을 충전하였습니다.`)
                                        client.users.fetch(gold[1].replace(/[^0-9]/g, "").trim()).then((player) => {
                                            try {
                                                player.send("관리자에 의하여 `" + money + "`원이 추가되었습니다.")
                                            } catch (db_err) {
                                                message.channel.send("대상에게 DM을 전송하던 도중 오류가 발생하였습니다. 수동으로 충전이 완료되었음을 알리시는 것을  추천합니다.")
                                            }
                                        })
                                    } catch (error) {
                                        let embed = new (Discord.MessageEmbed)()
                                        embed.setColor("#FF0000")
                                        embed.setTitle("오류 발생")
                                        embed.setAuthor(message.author.username, message.author.avatarURL())
                                        embed.setDescription("해당 유저는 존재하지 않거나, 가입되어 있지 않습니다.")
                                        message.channel.send({ embed: embed })
                                    }
                                } catch (error3) {
                                    let embed = new (Discord.MessageEmbed)()
                                    embed.setColor("#FF0000")
                                    embed.setTitle("오류 발생")
                                    embed.setAuthor(message.author.username, message.author.avatarURL())
                                    embed.setDescription("해당 유저는 존재하지 않거나, 가입되어 있지 않습니다.")
                                    message.channel.send({ embed: embed })
                                }        
                            })  
                        } catch (error_tmp) {
							let embed = new (Discord.MessageEmbed)()
							embed.setColor("#FF0000")
							embed.setTitle("오류 발생")
							embed.setAuthor(message.author.username, message.author.avatarURL())
							embed.setDescription("```js\n" + error_tmp.message + "\n```")
							message.channel.send({ embed: embed })
                        }
                    } catch (db_error) {
                        let embed = new (Discord.MessageEmbed)()
                        embed.setColor("#FF0000")
                        embed.setTitle("오류 발생")
                        embed.setAuthor(message.author.username, message.author.avatarURL())
                        embed.setDescription("```js\n" + db_error.message + "\n```")
                        message.channel.send({ embed: embed })
                    }
                }
            }
        });
    } else {
        return error.noPerms(message, "BOT OWNER")
    }
}

module.exports.help = {
    name: "충전"
}