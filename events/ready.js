const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    client.user.setAvatar("./DotaBot.png");
    client.user.setActivity("Dota");
    console.log("Ready!");
  },
};
