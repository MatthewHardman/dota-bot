// schedule.js
const { SlashCommandBuilder, CommandInteraction } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("schedule")
    .setDescription("Schedule a Dota game at a specific time")
    .addIntegerOption((option) =>
      option
        .setName("stacksize")
        .setDescription("The minimum number of people you need to play")
        .setRequired(true)
        .setMinValue(1)
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription(
          "The time you want to schedule the game (24-hour format, e.g., 1430 for 14:30)"
        )
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("timezone")
        .setDescription("Your time zone offset in hours (e.g., 4)")
        .setRequired(true)
    ),


  async execute(interaction) {
    let stackSize = interaction.options.getInteger("stacksize");

    //const query = interaction.options.getString("query");
    const timeZoneOffset = interaction.options.getInteger("timezone");
    const timeInput = interaction.options.getString("time");
    const standardizedTime = (parseInt(timeInput)+timeZoneOffset*100).toString();

    console.log("Requested time: "+timeInput);
    console.log("Adjusted for GMT: "+standardizedTime);
    //const adjustedQuery = adjustScheduledTime(query, timeZoneOffset);
    //const result = await getInfo(adjustedQuery);

    if (!/^\d{4}$/.test(standardizedTime)) {
      await interaction.reply(
        "Invalid time format. Please provide a 4-digit time in 24-hour format, e.g., 1430 for 14:30."
      );
      return;
    }

    const scheduledHour = parseInt(standardizedTime.slice(0, 2));
    const scheduledMinute = parseInt(standardizedTime.slice(2));

    const now = new Date();
    const scheduledTime = new Date(now);
    scheduledTime.setHours(scheduledHour, scheduledMinute, 0, 0);

    if (scheduledTime <= now) {
      await interaction.reply(
        "The scheduled time has already passed. Please provide a future time."
      );
      return;
    }

    const role = interaction.guild.roles.cache.find(
      (role) => role.name.toLowerCase() === "dooters"
    );

    if (!role) {
      await interaction.reply(
        "The 'dooters' role does not exist in this server."
      );
      return;
    }

    const message = await interaction.reply({
      content: `A Dota game has been scheduled for ${scheduledTime.toLocaleString()} (${timezoneString}) with a stack size of ${stackSize}. React with 👍 if you want to join.`,
      fetchReply: true,
      ephemeral: false,
    });

    message.react("👍");

    const filter = (reaction, user) => {
      return ["👍"].includes(reaction.emoji.name);
    };

    const collector = message.createReactionCollector({
      filter,
      dispose: true,
    });

    let idArray = [];

    collector.on("collect", (reaction, user) => {
      if (user !== interaction.user && !idArray.includes(user.id)) {
        idArray.push(user.id);
      }
      if (idArray.length === stackSize) {
        collector.stop();
      }
    });

    collector.on("remove", (reaction, user) => {
      if (user !== interaction.user) {
        const index = idArray.indexOf(user.id);
        idArray.splice(index, 1);
      }
    });

    const tenMinutesBefore = new Date(scheduledTime);
    tenMinutesBefore.setMinutes(tenMinutesBefore.getMinutes() - 10);

    setTimeout(() => {
      const usersString = idArray.map((userId) => `<@${userId}>`).join(" ");
      interaction.channel.send(
        `Reminder: The scheduled Dota game will start in 10 minutes. ${usersString}`
      );
    }, tenMinutesBefore - now);

    setTimeout(() => {
      const usersString = idArray.map((userId) => `<@${userId}>`).join(" ");
      interaction.channel.send(
        `Reminder: The scheduled Dota game is starting now. ${usersString}`
      );
    }, scheduledTime - now);
  },
};