const Discord = require("discord.js");

module.exports.noPerms = (message, perm) => {
    let embed = new (Discord.MessageEmbed)()
        embed.setAuthor(message.author.username, message.author.avatarURL())
        embed.setTitle("권한 부족")
        embed.setColor("#b70000")
        embed.addField(`명령어를 수행하기 위해선 아래 권한이 필요합니다.`, perm);
    message.channel.send(embed)
}

module.exports.wrongcmd = (message, command) => {
    let embed = new (Discord.MessageEmbed)()
        embed.setAuthor(message.author.username, message.author.avatarURL())
        embed.setTitle("잘못된 명령어 입니다.")
        embed.setColor("#b70000")
        embed.setDescription("올바른 명령어 : `" + command + "`");
    message.channel.send(embed)
}