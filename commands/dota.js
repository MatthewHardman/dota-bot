const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dota")
    .setDescription("Pings all dota people"),
  async execute(interaction) {
    const user2 = interaction.options.getUser("387741979926331402");
    const user = interaction.user;
    console.log(user2);
    const message = await interaction.reply({
      content: `<@${user.id}> please react here`,
      fetchReply: true,
    });
    message.react("👍");
    const filter = (reaction, user) => {
      return (
        ["👍"].includes(reaction.emoji.name) && user.id === interaction.user.id
      );
    };
    message
      .awaitReactions({ filter, max: 1, time: 3000, errors: ["time"] })
      .then((collected) => {
        const reaction = collected.first();

        if (reaction.emoji.name === "👍") {
          message.reply(`Thanks <@${user.id}> for the thumbs up!`);
        } else {
          message.reply("That's not a reaction we're looking for!");
        }
      })
      .catch((collected) => {
        message.reply("No one reacted!");
      });
  },
};
