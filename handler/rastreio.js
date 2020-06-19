const Discord = require("../node_modules/discord.js");
const { RastreioBrasil } = require("../node_modules/correios-brasil");

const channelId = require("../config.json").channelFetchId;

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
          message.channel.send("Insira alguma encomenda!")
          return;
        }
        rastreio = arg;
        msg = rastrear(rastreio)
        msg.then((res)=>{

          message.channel.send(res)
        })
        console.log(args); 
    },
    //exportar pra deixar rodando no setInterval
    editarMsg(client){
      console.log("editando mensagens")
      client.channels.fetch(channelId)
      .then((ch)=>{
        channel = ch;
        const messageManager = channel.messages
        messageManager.fetch({limit: 10}).then((messages)=>{
          var msgs = [];
          messages.forEach((value, index)=>{
              if(value.author.username == "Pepe" && value.embeds[0] != null){
                if(value.embeds[0].fields[0].name === "Status:" ){
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
                   value.edit(res);
                })
            }, index * 7000)
          })
        })
      })
    .catch(console.error);
  }
}