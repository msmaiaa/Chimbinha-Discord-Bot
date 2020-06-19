module.exports = {
    name: "xp",
    description: "informação do xp",
    execute(info,args){
        let message = info.message;
        let con = info.con;
        let usuario;
        if(args[0] == null){
            usuario = message.author;
        }else{
            console.log(args[0]);
            usuario = message.mentions.users.first() || message.guild.members.fetch(args[0]) || message.author;
        }


        con.query(`SELECT * FROM xp WHERE id = ${usuario.id}`, (err,rows)=>{
            if(err) throw err;

            if(!rows[0]) return message.channel.send("Este usuário não possui xp.");
            let xp = rows[0].xp;
            message.channel.send(xp);
        })

    }
}