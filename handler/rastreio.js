const Discord = require("../node_modules/discord.js");
const { RastreioBrasil } = require("../node_modules/correios-brasil");



async function rastrear(arg){
    var resultado;

    correios = new RastreioBrasil();
    rastreios = [arg]
    await correios.rastrearEncomendas(rastreios)
    .then((response)=>{
      resultado = response[0].pop();
      local = resultado.local;
      data = resultado.data;
      status = resultado.status;

      const exampleEmbed = new Discord.MessageEmbed()
      .setTitle(`${arg}`)
      .addField("Status: ", status)
      .addField("Local: ", local)
      .addField("Data e hora: ", data)
      resultado = exampleEmbed; 
    })
    return resultado;
}

module.exports = {
    name: 'rastreio',
    description: 'rastrear a encomenda',
    execute(info,args){
        client = info.client;
        message = info.message;
        arg = args[0]
        if(arg == null){
          message.delete();
          message.reply("Insira alguma encomenda! mensagem sendo deletada em 5 segundos")
          .then(async (msg)=>{
            setTimeout(()=>{
              console.log(msg);
              msg.delete();
            },5000)
          })
          return;
        }
        rastreio = arg;
        msg = rastrear(rastreio)
        msg.then((res)=>{
          message.channel.send(res)
        })
    },
    //exportar pra deixar rodando no setInterval
    editarMsg(client, con){
      console.log("checando os canais");
      let channels;
      con.query(`SELECT * FROM channels`,(err,rows)=>{
        channels = rows;
        channels.forEach((value)=>{
        console.log("checando o canal " + value.id);
        client.channels.fetch(value.id)
          .then((ch)=>{
            channel = ch;
            const messageManager = channel.messages
            messageManager.fetch({limit: 100}).then((messages)=>{
              var msgs = [];
              messages.forEach((value)=>{
                  if(value.author.id == "554173287408861194" && value.embeds[0] != null){
                    if(value.embeds[0].fields[0].name === "Status:"){
                      msgs.push(value)
                    }
                  }
              })
              msgs.forEach((value, index)=>{
                setTimeout(()=>{
                    rastreio = value.embeds[0].title;
                    if(value.embeds[0].fields[0].value == "Status: Objeto entregue ao destinatário"){
                      value.delete();
                    }
                    msg = rastrear(rastreio)
                    msg.then((res)=>{
                      console.log("editando uma mensagem")
                      value.edit(res);
                    })
                }, index * 2000)
              })
            })
          })
        .catch((error)=>{
          if(error.code == 10003){
            con.query(`DELETE FROM channels WHERE id = '${value.id}'`);
            console.log(`Canal ${value.id} não encontrado, deletando da database.`)
          }
        });
        })
      })
  }
}