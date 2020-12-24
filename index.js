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
client.login(token);