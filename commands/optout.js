// optout.js
const {
  SlashCommandBuilder,
  CommandInteraction,
  MessageFlags,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("optout")
    .setDescription("Opt-out of the dooters role"),

  async execute(interaction) {
    const dootersRole = interaction.guild.roles.cache.find(role => role.name.toLowerCase() === 'dooters');

    if (!dootersRole) {
      await interaction.reply({
        content: "The 'dooters' role does not exist in this server.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (!interaction.member.roles.cache.has(dootersRole.id)) {
      await interaction.reply({
        content: "You don't have the 'dooters' role.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.member.roles.remove(dootersRole);
    await interaction.reply({
      content: "You have been removed from the 'dooters' role.",
      flags: MessageFlags.Ephemeral,
    });
  },
};
