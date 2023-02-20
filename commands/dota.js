const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dota")
    .setDescription("Pings all dota people")
    .addIntegerOption((option) =>
      option
        .setName("stackSize")
        .setDescription("The minimum number of people you need to play")
        .setRequired(true)
        .setMinValue(1)
    )
    .addIntegerOption((option) =>
      option
        .setName("timeOut")
        .setDescription("How long you're willing to wait - in minutes")
    )
    .setRequired(true)
    .setMaxValue(30)
    .setMinValue(5),
  async execute(interaction) {
    let stackSize = interaction.options.getInteger("stackSize");
    let timeOut = interaction.options.getInteger("timeOut") * 60000;
    const message = await interaction.reply({
      content: ` Hello dota friends, ${interaction.user.username} would like to play with a stack size of ${stackSize} and is willing to wait ${timeOut} minutes! Please react if you'd like to be pinged when a stack forms. If you initiated the command, I have reacted for you.`,
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
      time: timeOut,
    });
    let idArray = [];
    collector.on("collect", (reaction, user) => {
      if (user != interaction.user) {
        idArray.push(user.id);
      }
      if (idArray.length == stackSize) {
        collector.stop();
      }
    });

    collector.on("end", (collected) => {
      idArray.shift();
      idArray.push(interaction.user.id);
      if (idArray.length == stackSize) {
        let replyMessage = `It's time to play!`;
        for (let i = 0; i < idArray.length; i++) {
          replyMessage = replyMessage.concat(` `, `<@${idArray[i]}>`);
          console.log(replyMessage);
        }
        message.reply(replyMessage);
      } else {
        message.reply("Not enough for a stack right now. Try again later!");
      }
    });
  },
};
