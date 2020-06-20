const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client();
client.commands = new Discord.Collection();
const botCommands = require("./handler");
const mysql = require("mysql");

Object.keys(botCommands).map(key => {
    client.commands.set(botCommands[key].name, botCommands[key]);
});


client.on('ready', ()=>{
    console.log(`${client.user.username} está online`);
    client.user.setActivity("a pica nelas");
    setInterval(()=>{
        client.commands.get("rastreio").editarMsg(client,con)
    },10000);
})

function generateXp(){
    return Math.floor(Math.random() * (30 - 10 + 1)) + 10;
}

var con = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
})

con.connect(err =>{
    if(err) throw err;
    console.log("conectado na db");
})

client.on('message', async message =>{
    const prefix = config.prefix;
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    
    con.query(`SELECT * FROM xp WHERE id = ${message.author.id}`, (err,rows)=>{
        if(err) throw err;
        let sql;
        if(rows.length < 1){
            sql = `INSERT INTO xp(id,xp) VALUES ('${message.author.id}', ${generateXp()})`
        }else{
            let xp = rows[0].xp;
            sql = `UPDATE xp SET xp = ${xp + generateXp()} WHERE id = ${message.author.id}`
        }

        con.query(sql);
    });

    if(!message.content.startsWith(prefix)) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift()
    if (!client.commands.has(command)) return;
    
    const info = {client: client, message: message, con: con}
    try {
        client.commands.get(command).execute(info, args);
    } catch (error) {
        console.error(error);
        message.reply('erro ao executar o comando');
    }

})

client.login(config.token);