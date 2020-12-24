const Discord = require('discord.js');
const sqlite3 = require('sqlite3')
const path = require('path');
const error = require('../Discord.js/error.js');
const config = require('../config/bot_info.json');
const dbPath = path.resolve(__dirname, './databases/user_info.db');

module.exports.run = async (client, message) => {
    let strArr = message.content.substring(0);
    let litArr = "";
    let splArr = strArr.split(" ");
    const user_info = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
	try {
        user_info.serialize()
        user_info.all(`SELECT user_money, user_black FROM user_info WHERE user_id = '${message.author.id}'`, function(error_user, rows) {
			try {
				let dummy = rows[0].user_money
			} catch {
				return message.channel.send(`<@${message.author.id}> 먼저 가입해주세요.`);
			}
            if(err) {
                let embed = new (Discord.MessageEmbed)()
                embed.setColor("#FF0000")
                embed.setTitle("오류 발생")
                embed.setAuthor(message.author.username, message.author.avatarURL())
                embed.setDescription("```js\n" + err.message + "\n```")
                message.channel.send({ embed: embed })
            } else {
                try {
                } catch (err) {
                    return message.channel.send(`<@${message.author.id}> 먼저 가입해주세요.`);
                }
                //try {
                    if(splArr[1] === undefined || splArr[2] === undefined || isNaN(splArr[2]) == false) {
                        return error.wrongcmd(message, "!충전신청 금액 할말(결제수단을 적는 것을 추천합니다. \n문상일 경우 코드를 적는 것을 추천합니다.)")
                    } else {
                        message.react('✅')
                        client.channels.cache.get(config.acc_ch).send(`<@${message.author.id}> 님이 ${splArr[1]} 원 만큼 충전 신청하였습니다.`)
                        client.users.fetch(config.owners).then((player) => {
                            let accept_embed = new (Discord.MessageEmbed)
                            accept_embed.setColor("#8ce7ce")
                            accept_embed.setTitle(`${message.author.tag} 님이 ${splArr[1]}원 만큼 충전을 신청하였습니다.`)
                            for(let i=2; i<splArr.length; i++) {
                                litArr += splArr[i] + " ";
                            }
                            accept_embed.setDescription(`기타 사항 : \n${litArr}\n\nO / X 반응을 추가하여 충전 여부를 선택해주세요.`)
                            let filter = (reaction, user) => (reaction.emoji.name === '⭕' || reaction.emoji.name === '❌') && user.id === config.owners;
                            player.send({ embed: accept_embed }).then((th) => {
								th.react('⭕')
                                th.react('❌')
                                th.awaitReactions(filter, {
                                    max: 1
                                }).then((collected) => {
                                    if (collected.array()[0].emoji.name === '⭕') {
                                        var money = splArr[1].replace(" ", "").trim()
                                        user_info.serialize();
                                        user_info.run(`UPDATE user_info SET user_money = user_money + ${money} WHERE user_id = '${message.author.id}'`)
                                        let success_embed = new (Discord.MessageEmbed)
                                        success_embed.setColor("#9da9ee")
                                        success_embed.setTitle("충전 완료")
                                        success_embed.setDescription(`${message.author.tag} 님에게 ${money}원을 지급하였습니다.`)
                                        success_embed.setTimestamp()
                                        th.edit(success_embed);
                                        client.users.fetch(message.author.id).then((player) => {
                                            user_info.serialize()
                                            user_info.all(`SELECT user_money FROM user_info WHERE user_id = '${message.author.id}'`, function(error_user, rows) {
                                                let suc_embed = new (Discord.MessageEmbed)
                                                suc_embed.setColor("#9da9ee")
                                                suc_embed.setTitle("충전 승인")
                                                suc_embed.setDescription("관리자가 당신의 충전 신청을 승인하였습니다.")
                                                suc_embed.addField(`현재 금액`, `${rows[0].user_money}원`)
                                                player.send({ embed: suc_embed })
                                                client.channels.cache.get(config.acc_su_ch).send(`<@${message.author.id}> 님의 충전이 승인되었습니다. \`충전금액 : ${money}\``)
                                            });
                                        });
                                    } else if (collected.array()[0].emoji.name === '❌') {
                                        let fail_embed = new (Discord.MessageEmbed)
                                        fail_embed.setColor("#FF0000")
                                        fail_embed.setTitle("충전 실패")
                                        fail_embed.setDescription(`${message.author.tag} 님의 충전을 거절하였습니다.`)
                                        fail_embed.setTimestamp()
                                        th.edit(fail_embed);
                                        client.users.fetch(message.author.id).then((player) => {
                                            user_info.serialize()
                                            user_info.all(`SELECT user_money FROM user_info WHERE user_id = '${message.author.id}'`, function(error_user, rows) {
                                                let fa_embed = new (Discord.MessageEmbed)
                                                fa_embed.setColor("#FF0000")
                                                fa_embed.setTitle("충전 거절")
                                                fa_embed.setDescription("관리자가 당신의 충전 신청을 거절하였습니다.")
                                                fa_embed.addField(`현재 금액`, `${rows[0].user_money}원`)
                                                player.send({ embed: fa_embed })
                                            });
                                        });
                                    }
                                });
                            })
                        });
                    }
                /* 
				} catch (db_err) {
                    let embed = new (Discord.MessageEmbed)()
                    embed.setColor("#FF0000")
                    embed.setTitle("오류 발생")
                    embed.setAuthor(message.author.name, message.author.avatarURL())
                    embed.setDescription("```js\n" + db_err.message + "\n```")
                    message.channel.send({ embed: embed })
                }
				*/
            }
        });
		} catch {
			return message.channel.send(`<@${message.author.id}> 먼저 가입해주세요.`);
		}
	});
}

module.exports.help = {
    name: "충전신청"
}