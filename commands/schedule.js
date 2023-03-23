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
        .setDescription("The time you want to schedule the game (24-hour format, e.g., 1430 for 14:30)")
        .setRequired(true)
    ),
    .addIntegerOption((option) =>
      option
        .setName("timezone")
        .setDescription("Your time zone offset in hours (e.g., +4)")
        .setRequired(true)
    ),

  async execute(interaction) {
    let stackSize = interaction.options.getInteger("stacksize");
    const timeInput = interaction.options.getString("time");

      const query = interaction.options.getString("query");
      const timeZoneOffset = interaction.options.getInteger("timezone");
      const adjustedQuery = adjustScheduledTime(query, timeZoneOffset);
      const result = await getInfo(adjustedQuery);

    // Get the local timezone offset in minutes
    const timezoneOffset = new Date().getTimezoneOffset();
    // Convert the offset to hours
    const timezoneOffsetHours = Math.abs(timezoneOffset) / 60;
    // Determine the timezone sign
    const timezoneSign = timezoneOffset > 0 ? "-" : "+";
    // Format the timezone string
    const timezoneString = `UTC${timezoneSign}${timezoneOffsetHours}`;

    if (!/^\d{4}$/.test(timeInput)) {
      await interaction.reply("Invalid time format. Please provide a 4-digit time in 24-hour format, e.g., 1430 for 14:30.");
      return;
    }

    const scheduledHour = parseInt(timeInput.slice(0, 2));
    const scheduledMinute = parseInt(timeInput.slice(2));

    const now = new Date();
    const scheduledTime = new Date(now);
    scheduledTime.setHours(scheduledHour, scheduledMinute, 0, 0);

    if (scheduledTime <= now) {
      await interaction.reply("The scheduled time has already passed. Please provide a future time.");
      return;
    }

    const role = interaction.guild.roles.cache.find(
      (role) => role.name.toLowerCase() === 'dooters'
    );

    if (!role) {
      await interaction.reply("The 'dooters' role does not exist in this server.");
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
      const usersString = idArray.map(userId => `<@${userId}>`).join(' ');
      interaction.channel.send(`Reminder: The scheduled Dota game will start in 10 minutes. ${usersString}`);
    }, tenMinutesBefore - now);

    setTimeout(() => {
      const usersString = idArray.map(userId => `<@${userId}>`).join(' ');
      interaction.channel.send(`Reminder: The scheduled Dota game is starting now. ${usersString}`);
    }, scheduledTime - now);
  },
};

function adjustScheduledTime(query, timeZoneOffset) {
  const timeRegex = /(\d{1,2}:\d{2}\s?(?:[AP]M)?)/gi;
  const timeMatches = query.match(timeRegex);

  if (timeMatches) {
    timeMatches.forEach((time) => {
      const adjustedTime = adjustTime(time, timeZoneOffset);
      query = query.replace(time, adjustedTime);
    });
  }

  return query;
}

function adjustTime(time, timeZoneOffset) {
  const isAMPM = /(?:[AP]M)?/i.test(time);
  let [hours, minutes] = time.replace(/(?:[AP]M)?/i, "").split(":");

  hours = parseInt(hours, 10) + timeZoneOffset;
  if (isAMPM) {
    if (hours < 1) {
      hours += 12;
    } else if (hours > 12) {
      hours -= 12;
    }
  } else {
    if (hours < 0) {
      hours += 24;
    } else if (hours > 23) {
      hours -= 24;
    }
  }

  return `${hours}:${minutes}${isAMPM ? (hours >= 12 ? " PM" : " AM") : ""}`;
}