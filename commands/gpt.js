const { SlashCommandBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

async function getInfo(query) {
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: 'gpt-4-32k',
    messages: [{ role: 'user', content: query }],

    max_tokens: 1024,
    n: 1,
    stop: null,
    temperature: 0.7,
  });

  const assistantMessage = completion.data.choices[0].message.content;

  return assistantMessage;
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
    ),
  async execute(interaction) {
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

    const query = interaction.options.getString("query");
    const result = await getInfo(query);

    if (result) {
      await interaction.reply(result);
    } else {
      await interaction.reply(
        "Sorry, I could not find any information for that query."
      );
    }
  },
};
