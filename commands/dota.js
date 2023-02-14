const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dota")
    .setDescription("Pings all dota people"),
  async execute(interaction) {
    //const user2 = interaction.options.getUser("387741979926331402");
    const message = await interaction.reply({
      content:
        "Hello <@1071259658943217745> Time to play, please react if you'd like to be pinged when a stack forms. If you initiated the command, I have reacted for you.",
      fetchReply: true,
    });
    /*const reactionEmoji = message.guild.emojis.cache.find(
      (emoji) => emoji.name === "dotes"
    );*/
    message.react("1075165683400314980");
    const filter = (reaction, user) => {
      return ["1075165683400314980"].includes(reaction.emoji.name);
    };

    const collector = message.createReactionCollector({ filter, time: 10000 });
    stackSize = 2;
    idArray = [];
    collector.on("collect", (reaction, user) => {
      if (user != interaction.user) {
        idArray.push(user.id);
      }
      if (idArray.length === stackSize) {
        collector.stop();
      }
    });

    collector.on("end", (collected) => {
      idArray.shift();
      idArray.push(interaction.user.id);
      if (idArray.length == stackSize) {
        for (let i = 0; i < idArray.length; i++) {
          message.reply(`Time to play <@${idArray[i]}>!`);
        }
      } else {
        message.reply("Not enough for a stack right now. Try again later!");
      }
    });
  },

  /*
    message
      .awaitReactions({ filter, max: 3, time: 5000, errors: ["time"] })
      .then((collected) => {
        console.log(collected.users);
        message.reply(`Thanks <@${user.id}> for the thumbs up!`);
      })
      .catch((collected) => {
        message.reply("No one reacted!");
      });
      */
};
