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

// optout.js
const { SlashCommandBuilder, CommandInteraction } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("optout")
    .setDescription("Opt-out of the dooters role"),

  async execute(interaction) {
    const dootersRole = interaction.guild.roles.cache.find(role => role.name.toLowerCase() === 'dooters');

    if (!dootersRole) {
      await interaction.reply("The 'dooters' role does not exist in this server.");
      return;
    }

    if (!interaction.member.roles.cache.has(dootersRole.id)) {
      await interaction.reply("You don't have the 'dooters' role.");
      return;
    }

    await interaction.member.roles.remove(dootersRole);
    await interaction.reply("You have been removed from the 'dooters' role.");
  },
};