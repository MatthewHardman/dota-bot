const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Display info about this server."),
  async execute(interaction) {

    // Check if the user has the Bot Dev role
    const botDevRole = interaction.guild.roles.cache.find(
      (role) => role.name === "Bot Dev"
    );
    if (!interaction.member.roles.cache.has(botDevRole.id)) {
      await interaction.reply({
        content:
          "You do not have the required role (Bot Dev) to use this command.",
        ephemeral: true,
      });
      return;
    }

    // Defer the reply
    await interaction.deferReply();

    // Execute the deploy-commands.js script
    exec("node ./deploy-commands.js", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing the script: ${error.message}`);
        interaction.editReply(
          "An error occurred while executing the deploy-commands.js script. Please check the console for more information."
        );
        return;
      }

      interaction.editReply("The deploy-commands.js script has been executed successfully.");
    });

    // return interaction.reply(
    //   `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
    // );
  },   
};
