const request = require("../node_modules/request-promise");
const Discord = require("../node_modules/discord.js");
const correiosurl="https://api.linketrack.com/track/json?user=teste&token=1abcd00b2731640e886fb41a8a9671ad1434c599dbaa0a0de9a5aa619f29a83f&codigo=";
const channelId = require("../config.json").channelFetchId;

async function rastrear(arg){
    var resultado;
    await request(`${correiosurl}${arg}`,(error, response, body)=>{
    if(!error && response.statusCode == 200){

    var parsedData = JSON.parse(body);
    local = parsedData.eventos[0].local
    data = parsedData.eventos[0].data
    hora = parsedData.eventos[0].hora

    var status;
    if(parsedData.eventos[0].subStatus[0] == null){
        status = parsedData.eventos[0].status;
    }else{
        status = parsedData.eventos[0].subStatus;
    }
    const exampleEmbed = new Discord.MessageEmbed()
    .setTitle(`${rastreio}`)
    .addField("Status: ", status)
    .addField("Local: ", local)
    .addField("Data: ", data)
    .addField("Hora: ", hora)
    resultado = exampleEmbed; 
    }
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