const { SlashCommandBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

async function getImage(prompt) {
  const openai = new OpenAIApi(configuration);

  const response = await openai.createImage({
    prompt: prompt,
    n: 1,
    size: "1024x1024",
  });

  const imageUrl = response.data.data[0].url;
  return imageUrl;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wskbosch")
    .setDescription("Generate an image using OpenAI Images API")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("The prompt for generating the image")
        .setRequired(true)
    ),
  async execute(interaction) {
    const prompt = interaction.options.getString("prompt");

    // Defer the reply
    await interaction.deferReply();

    try {
      const imageUrl = await getImage(prompt);

      await interaction.editReply({ content: "Prompt: " + prompt + "\n", embed: {
        color: 0x0099ff,
        title: prompt,
        author: {
          name: interaction.member.displayName,
          icon_url: interaction.member.avatar,
        },
        description: 'Art created by WSKBosch and the author.',
        thumbnail: {
          url: imageUrl,
        },
        image: {
          url: imageUrl,
        },
        timestamp: new Date().toISOString(),
      }});
    } catch (error) {
      console.error(`Error while calling OpenAI Images API: ${error.message}`);
      await interaction.editReply(
        "An error occurred while processing your request. Please try again later."
      );
    }
  },
};