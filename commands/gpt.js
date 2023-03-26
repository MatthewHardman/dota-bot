const { SlashCommandBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const gpt4 = "gpt-4";
const gpt3 = "gpt-3.5-turbo";
let responseArray = [];
const requiredRole = "Regulars";
var logChannel = "";

var loggedTokenUse = 0;

async function getInfo(query, modelSelection) {
  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createChatCompletion({
      model: modelSelection,
      messages: [
        {
          role: "system",
          content:
            "You are an AI chatbot using GPT-4. Act like whatever persona people ask, but you are otherwise a normal (AI) member of the Whiskey Business (WSKB) Discord server!",
        },
        ...responseArray,
        { role: "user", content: query },
      ],
      max_tokens: 2048,
      n: 1,
      stop: null,
      temperature: 0.7,
    });

    const assistantMessage = completion.data.choices[0].message.content.trim();
    const tokensUsed = completion.data.usage.total_tokens;
    loggedTokenUse = loggedTokenUse + tokensUsed;

    responseArray.push({ role: "user", content: query });
    responseArray.push({ role: "assistant", content: assistantMessage });
    if (responseArray.length > 10) {
      responseArray.shift();
      responseArray.shift();
    }
    console.log("Tokens for this query: " + tokensUsed);
    console.log("Total tokens used since last reboot: " + loggedTokenUse)

    

    return assistantMessage;
  } catch (error) {
    console.error(`Error while calling OpenAI API: ${error.message}`);
    return `An error occurred while processing your request. Please try again later. \nError: ${error.message}`;
  }
}

async function isAboutDota(query) {
  const aboutDotaQuery = `Is this question about Dota 2 the video game? (Only answer with a single word, yes or no.) "${query}"`;
  const response = await getInfo(aboutDotaQuery, gpt3);
  console.log(query + ": " + response);
  // Check if the response from GPT-4 indicates that the question is about Dota
  return response.toLowerCase().includes("yes");
  return true
}

module.exports = {
  data: new SlashCommandBuilder()

    .setName("gpt4")
    .setDescription("Get information using GPT-4 API")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The query you want to ask GPT-4 API")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("model")
        .setDescription("Which GPT model you want to use (only Regulars can use GPT-4)")
        .setRequired(false)
        .setMaxValue(4)
        .setMinValue(3)
    ),
  async execute(interaction) {
    const botDevRole = interaction.guild.roles.cache.find(
      (role) => role.name === requiredRole
    );

    logChannel = interaction.guild.channels.cache.find((channel) => channel.name === "bot-logs");
    // console.log("Bot Log Channel: " + logChannel);
    //Only regulars can access this bot
    //changing a comment to force a deployment
    if (!interaction.member.roles.cache.has(botDevRole.id)) {
      await interaction.reply({
        content:
          "You do not have the required role "+ requiredRole + " to use this command.",

        ephemeral: true,
      });
      return;
    }

    const query = interaction.options.getString("query");
    const parameterModel = interation.options.getInteger("model");
    var selectedModel = gpt3;

    if(parameterModel === 4) {
      selectedModel = gpt4;
    } else {
      selectedModel = gpt3;
    }

    // Defer the reply
    await interaction.deferReply();

    //const isDotaRelated = await isAboutDota(query);

    // if (!isDotaRelated) {
    //   await interaction.deleteReply();
    //   await interaction.followUp({
    //     content: "This command only accepts questions about Dota.",
    //     ephemeral: true,
    //   });
    //   return;
    // }

    // Call the getInfo function after deferring the reply
    const result = await getInfo(query, selectedModel);

    // Log token usage after processing the command
    // const usage = 0;
    logChannel.send(`Tokens used since last reboot: ${loggedTokenUse} tokens.`);

    if (result) {
      await interaction.editReply(
        interaction.user.username + " said: **" + query + "**\n*(Model: " + selectedModel + ")*\n" + result
        //+ "\nTokens used: " + usage + "."
      );
    } else {
      await interaction.editReply(
        "Sorry, I could not find any information for that query."
      );
    }
  },
};
