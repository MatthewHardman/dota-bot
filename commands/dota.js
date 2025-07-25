const {
  SlashCommandBuilder,
  Client,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
  MessageFlags,
} = require("discord.js");

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
    let owner = interaction.user;
    const role = interaction.guild.roles.cache.find(
      (role) => role.id === "1071259658943217745"
    );
    /*
    const reactionEmoji = interaction.guild.emojis.cache.find(
      (emoji) => emoji.name === "dotes"
    );
    */
    const currentTime = Math.floor(Date.now() / 1000);
    const endTime = currentTime + timeOutInMin * 60;
    //const formattedStartTime = `<t:${currentTime}:F>`;
    const formattedEndTime = `<t:${endTime}:R>`;
    const absoluteEndTime = `<t:${endTime}:t>`;
    console.log("Stack requested by " + owner.username + " for " + endTime);
    const stackSizeText = stackSize >= 5 ? stackSize : stackSize + " or more";

    var joinLabel = "Join stack";
    var leaveLabel = "Leave the stack";

    const joinButton = new ButtonBuilder()
      .setCustomId("join_dota")
      .setLabel(joinLabel)
      .setStyle(ButtonStyle.Primary);

    const leaveButton = new ButtonBuilder()
      .setCustomId("leave_dota")
      .setLabel(leaveLabel)
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(joinButton, leaveButton);

    const response = await interaction.reply({
      content:
        `Hello <@&${role.id}>, **${owner.username}** would like to play with a **stack of ${stackSizeText}** ${formattedEndTime}! Please click below if you'd like to be pinged when a stack forms. \n*(` +
        owner.username +
        `, You do not have to click the button.)*`,
      withResponse: true,
      components: [row],
    });
    const message = response.resource.message;

    const collector = message.createMessageComponentCollector({
      ComponentType: ComponentType.Button,
      time: timeOutInMS,
    });

    let idArray = [];
    let usernameArray = [];
    let replyMessage = "";
    idArray.push(owner.id);

    //Declarring various content variables
    //Base messages
    let replyPlayingListBase = ``;
    let replyStackSuccess = `It's time to play!`;

    //Join button responses
    let replyJoinThanks = `Thanks for clicking! I'll notify you if/when a stack forms`;
    let replyJoinOwner = `I told you that you didn't have to click on it, dummy.`;
    let replyAlreadyJoined = [
      `Don't be greedy, you've already clicked once.`,
      `Clicking it more won't make people join faster.`,
      `Clicking buttons is fun!`,
    ];

    //Leave button responses
    let replyLeaveOwner = `Uh, no, you aren't allowed to leave your own party.`;
    let replyLeaveNotJoined = [
      `You haven't even said you could play yet!`,
      `You can't leave a stack you haven't joined.`,
      `ಠ_ಠ`,
    ];
    let replyStackTimeout = `Not enough for a stack right now. Try again later!`;
    let replyLeaveSad = [
      `Please, don't go.`,
      `I didn't want to play with you anyway`,
      `♫ Okay, byyyeeee ♫`,
    ];

    function buildReplyList() {
      replyPlayingListBase = `\nSo far the following ${idArray.length} people have said they will play:\n- ${owner.username}`;
      let buildingReply = replyPlayingListBase;

      for (let i = 0; i < usernameArray.length; i++) {
        buildingReply = buildingReply.concat(`\n- `, `${usernameArray[i]}`);
      }

      return buildingReply;
    }

    //Button collector functions
    collector.on("collect", (i) => {
      //first we handle the join button
      let currentUser = i.user;
      if (i.customId == "join_dota") {
        if (currentUser == owner) {
          i.reply({
            content: replyJoinOwner,
            flags: MessageFlags.Ephemeral,
          });
        } else if (!idArray.includes(currentUser.id)) {
          console.log(`Adding ${currentUser.username} to list`);
          idArray.push(currentUser.id);
          usernameArray.push(currentUser.username);
          i.reply({
            content: replyJoinThanks,
            flags: MessageFlags.Ephemeral,
          });

          //set the reply message to the base message before appending the list of users to it
          replyMessage = buildReplyList();

          // for (let i = 0; i < usernameArray.length; i++) {
          //   replyMessage = replyMessage.concat(`\n - `, `${usernameArray[i]}`);
          // }
          let fullReplyMessage =
            `Hello <@&${role.id}>, **<@${owner.id}>** would like to play with a **stack of ${stackSize}** before ${absoluteEndTime} (${formattedEndTime})! Click "Join" if you'd like to be pinged when a stack forms.` +
            replyMessage;
          message.edit(fullReplyMessage);
        } else if (idArray.includes(currentUser.id)) {
          i.reply({
            content:
              replyAlreadyJoined[
                Math.floor(Math.random() * replyAlreadyJoined.length)
              ],
            flags: MessageFlags.Ephemeral,
          });
        }
        if (idArray.length == stackSize) {
          collector.stop();
        }
      }
      //and the code to handle clicking the leave button
      if (i.customId == "leave_dota") {
        //we don't let the stack creator bail on the stack
        if (currentUser == owner) {
          i.reply({
            content: replyLeaveOwner,
            flags: MessageFlags.Ephemeral,
          });
        } else if (idArray.includes(currentUser.id)) {
          console.log(`Removing ${currentUser.username} from list`);

          let index = idArray.indexOf(currentUser.id);
          idArray.splice(index, 1);
          index = usernameArray.indexOf(currentUser.username);
          usernameArray.splice(index, 1);
          i.reply({
            content:
              replyLeaveSad[Math.floor(Math.random() * replyLeaveSad.length)],
            flags: MessageFlags.Ephemeral,
          });

          //set the reply message to the base message before appending the list of users to it
          replyMessage = buildReplyList();

          // for (let i = 0; i < usernameArray.length; i++) {
          //   replyMessage = replyMessage.concat(` `, `${usernameArray[i]}`);
          // }
          let fullReplyMessage =
            `Hello <@&${role.id}>, **<@${owner.id}>** would like to play with a **stack of ${stackSize}** before ${absoluteEndTime} (${formattedEndTime})! Click "Join" if you'd like to be pinged when a stack forms.` +
            replyMessage;
          message.edit(fullReplyMessage);
        } else {
          i.reply({
            content:
              replyLeaveNotJoined[
                Math.floor(Math.random() * replyLeaveNotJoined.length)
              ],
            flags: MessageFlags.Ephemeral,
          });
        }
      }
    });

    collector.on("end", (collected) => {
      if (idArray.length == stackSize) {
        replyMessage = replyStackSuccess;
        for (let i = 0; i < idArray.length; i++) {
          replyMessage = replyMessage.concat(` `, `<@${idArray[i]}>`);
        }
        message.reply(replyMessage);

        const formedTime = Math.floor(Date.now() / 1000);

        message.edit({
          content: `*The stack of ${stackSize} requested by ${owner.username} formed <t:${formedTime}:R>.*`,
          components: [],
        });
      } else {
        replyMessage = `*The stack didn't form in time for ${owner.username}.  However, the following people might still be interested in playing:*`;
        for (let i = 0; i < idArray.length; i++) {
          replyMessage = replyMessage.concat(`\n- `, `<@${idArray[i]}>`);
        }

        message.reply(replyMessage);
        message.edit({
          content: replyStackTimeout,
          components: [],
        });
      }
    });

    /*
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

        const formedTime = Math.floor(Date.now()/1000)

        message.edit(`*The stack of ${stackSize} requested by ${interaction.user.username} formed <t:${formedTime}:R>.*`);
      } else {
        message.reply("Not enough for a stack right now. Try again later!");
         message.edit(`*The stack didn't form in time for ${interaction.user.username}.*`);
      }
    });
    */
  },
};
