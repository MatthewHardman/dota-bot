const { SlashCommandBuilder, Client } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dota")
    .setDescription("Pings all dota people")
    .addIntegerOption((option) =>
      option
        .setName("stacksize")
        .setDescription("The minimum number of people you need to play")
        .setRequired(true)
        .setMinValue(1)
    )
    .addIntegerOption((option) =>
      option
        .setName("timeout")
        .setDescription("How long you're willing to wait - in minutes")
        .setRequired(true)
        .setMaxValue(30)
        .setMinValue(5)
    ),
  async execute(interaction) {
    let stackSize = interaction.options.getInteger("stacksize");
    let timeOutInMin = interaction.options.getInteger("timeout");
    let timeOutInMS = timeOutInMin * 60000;
    const role = interaction.guild.roles.cache.filter(
      (role) => role.id === "1071259658943217745"
    );
    console.log(role);
    const message = await interaction.reply({
      content: ` Hello ${role.id}, ${interaction.user.username} would like to play with a stack size of ${stackSize} and is willing to wait ${timeOutInMin} minutes! Please react if you'd like to be pinged when a stack forms. If you initiated the command, I have reacted for you.`,
      fetchReply: true,
    });
    /*const reactionEmoji = message.guild.emojis.cache.find(
      (emoji) => emoji.name === "dotes"
    );*/
    message.react("👍");
    const filter = (reaction, user) => {
      return ["👍"].includes(reaction.emoji.name);
    };
    const collector = message.createReactionCollector({
      filter,
      time: timeOutInMS,
      dispose: true,
    });
    let idArray = [];
    collector.on("collect", (reaction, user) => {
      if (user != interaction.user && !idArray.includes(user.id)) {
        idArray.push(user.id);
      }
      if (idArray.length == stackSize) {
        collector.stop();
      }
    });

    collector.on("remove", (reaction, user) => {
      if (user != interaction.user) {
        index = idArray.indexOf(user.id);
        idArray.splice(index, 1);
      }
    });

    collector.on("end", (collected) => {
      idArray.shift();
      idArray.push(interaction.user.id);
      if (idArray.length == stackSize) {
        let replyMessage = `It's time to play!`;
        for (let i = 0; i < idArray.length; i++) {
          replyMessage = replyMessage.concat(` `, `<@${idArray[i]}>`);
        }
        message.reply(replyMessage);
      } else {
        message.reply("Not enough for a stack right now. Try again later!");
      }
    });
  },
};
