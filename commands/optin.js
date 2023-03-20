// optin.js
const { SlashCommandBuilder, CommandInteraction } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("optin")
    .setDescription("Opt-in to the dooters role"),

  async execute(interaction) {
    const dootersRole = interaction.guild.roles.cache.find(role => role.name.toLowerCase() === 'dooters');

    if (!dootersRole) {
      await interaction.reply("The 'dooters' role does not exist in this server.");
      return;
    }

    if (interaction.member.roles.cache.has(dootersRole.id)) {
      await interaction.reply("You already have the 'dooters' role.");
      return;
    }

    await interaction.member.roles.add(dootersRole);
    await interaction.reply("You have been given the 'dooters' role.");
  },
};