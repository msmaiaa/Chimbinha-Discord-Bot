const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client();
client.commands = new Discord.Collection();
const botCommands = require("./handler");
const editarMsg = require("./handler/rastreio");

Object.keys(botCommands).map(key => {
    client.commands.set(botCommands[key].name, botCommands[key]);
});

client.on('ready', ()=>{
    console.log(`${client.user.username} está online`);
    client.user.setActivity("a pica nelas");
    setInterval(()=>{
        client.commands.get("rastreio").editarMsg(client)
    },30000);
})

client.on('message', async message =>{
    const prefix = config.prefix;

    if(!message.content.startsWith(prefix)) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift()
    if (!client.commands.has(command)) return;
    
    const info = {client: client, message: message}
    try {
        client.commands.get(command).execute(info, args);
    } catch (error) {
        console.error(error);
        message.reply('erro ao executar o comando');
    }

})

client.login(config.token);