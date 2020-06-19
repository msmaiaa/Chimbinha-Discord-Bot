const request = require("../node_modules/request-promise");
const config = require("../config.json");
const Discord = require("../node_modules/discord.js");
async function medirTempo(info, args){
    message = info.message;
    var search = {
        cidade: args[0],
        country: args[1]
      }

      request(`http://api.openweathermap.org/data/2.5/weather?q=${search.cidade},${search.country}&APPID=${config.weatherapi}`, (error, response, body) => {
      if(response.statusCode == 200){
          //converte para JSON
          var parsedData = JSON.parse(body);
          var nome = search.cidade;
          var temperatura = parsedData.main.temp + "ºC";
          var tempMax = parsedData.main.temp_max + "ºC";
          var tempMin = parsedData.main.temp_min + "ºC";
          console.log(nome)
          const exampleEmbed = new Discord.MessageEmbed()
          .setTitle(`Tempo em: ${nome}`) 
          .addField('Temperatura Atual: ', temperatura)
          .addField('Temperatura Máxima: ', tempMax)
          .addField('Temperatura Mínima: ', tempMin)
          message.channel.send(exampleEmbed);

      }
      else if(error){
        console.error(erro);
      }
    })
}

module.exports = {
    name: "tempo",
    description: "Api que retorna a temperatura em algum lugar",
    execute(info,args){
        medirTempo(info,args)
    }
}