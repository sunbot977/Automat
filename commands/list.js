const Discord = require('discord.js');
const sqlite3 = require('sqlite3')
const path = require('path');
const dbPath = path.resolve(__dirname, './databases/item_list.db');

module.exports.run = async (client, message) => {
    const item = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if(err) {
            let embed = new (Discord.MessageEmbed)()
            embed.setColor("#FF0000")
            embed.setTitle("오류 발생")
            embed.setAuthor(message.author.username, message.author.avatarURL())
            embed.setDescription("```js\n" + err.message + "\n```")
            message.channel.send({ embed: embed })
        } else {
            try {
                item.serialize();
                item.all(`SELECT item_name, item_price FROM item_list`, function(err, rows) {
                    if(err) console.log(err)  
                    let list = new (Discord.MessageEmbed)()
                    let text = ""
                    list.setColor("#FF0000")
                    list.setTitle("현재 제품 목록")
                    rows.forEach(function (row) {
                        text += `${row.item_name} : ${row.item_price}원\n`
                    })
                    list.setDescription(text);
                    global.list = list;
                    message.channel.send({ embed: list })
                    });
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
    name: "목록"
}