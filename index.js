const Discord = require('discord.js');
const fs = require('fs')
const client = new Discord.Client({disableEveryone: true});
client.commands = new Discord.Collection();
const info = require('./Discord.js/Packing.js')
const { prefix } = require('./config/bot_info.json')
const token = process.env.token

client.on('ready', () => {
	fs.readFile('./Discord.js/LICENSE', function(err, data) {
		if(err) {
			console.log("!! 라이센스 파일이 존재하지 않습니다. 클라이언트를 종료합니다. !!")
			process.exit()
			return
		}
		var array = data.toString().split("\n");
		if(!array[0].includes("GNU GENERAL PUBLIC LICENSE")) { 
			console.log("!! 라이센스 파일이 존재하지 않습니다. 클라이언트를 종료합니다. !!") 
			process.exit()
		} else {
			console.log("\nBOT IS READY\n")
		}
	})
});

fs.readdir("./commands/", (err, files) => {

if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0){
        console.log("커맨드 파일을 찾을 수 없습니다\ncommand 폴더가 존재하는지 확인해주세요.\n");
        return;
}

    jsfile.forEach((f, i) =>{
        let props = require(`./commands/${f}`);
        client.commands.set(props.help.name, props);
    });
});
client.on('message', message =>{
	
    if(message.author.bot) return;
	
	if (!message.content.startsWith(prefix)) return
	let messageArray = message.content.split(" ");
	let cmd = messageArray[0];
	let args = messageArray.slice(1);
	
	let commandfile = client.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(client,message,args);

});
 if (message.content == "!명령어") {
    let helpImg = "https://images-ext-1.discordapp.net/external/RyofVqSAVAi0H9-1yK6M8NGy2grU5TWZkLadG-rwqk0/https/i.imgur.com/EZRAPxR.png"
    let commandList = [
      { name: "!가입", desc: "자판기에 가입합니다." },
	  { name: "!목록", desc: "제품목록을 보여줍니다." },
	  { name: "!구매", desc: "!구매 (제품명)" },
      { name: "!명령어", desc: "도움말(help)" },
      { name: "!충전신청", desc: "!충전신청 (가격) (할말)"},
    ]
    let commandStr = ""
    let embed = new Discord.MessageEmbed().setAuthor("Help of Automat", helpImg).setColor("#C8E6C9").setFooter(`Automat 📠`).setTimestamp()

    commandList.forEach((x) => {
      commandStr += `• \`\`${changeCommandStringLength(`${x.name}`)}\`\` : **${x.desc}**\n`
    })

    embed.addField("Commands: ", commandStr)

    message.channel.send(embed)
  }
client.login(token);