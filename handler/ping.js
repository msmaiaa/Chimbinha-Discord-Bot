module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(info,args){
        client = info.client;
        message = info.message;
        console.log(message);
        message.channel.send('pong');
    }
}