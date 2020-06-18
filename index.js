const { Client } = require("discord.js");
const client = new Client();
const config = require("./config.json");


client.login(config.token);