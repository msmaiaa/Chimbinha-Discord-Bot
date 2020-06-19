module.exports = {
    name:"watch",
    description:"colocar o canal na database",
    execute(info,args){
        message = info.message;
        con = info.con;
        channel = message.channel.id;
        con.query("SELECT * FROM channels WHERE id = " + channel,(err,rows)=>{
            if(err) throw err;
            if(rows[0] == null){
                con.query(`INSERT INTO channels(id) VALUES ('${channel}')`);
            }else{
                message.delete();
                message.reply("Este canal já está sendo observado para rastreio de encomendas!")
                .then(async (msg)=>{
                  setTimeout(()=>{
                    console.log(msg);
                    msg.delete();
                  },5000)
                })
            }
        })
    }
}