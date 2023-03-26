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

  console.log("Image API Response: " + response.data);
  console.log("Image url: " + imageUrl);
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

      await interaction.editReply({ embeds: [{
        color: 3447003,
        author: {
          name: interaction.user.displayName,
          icon_url: "https://cdn.discordapp.com/avatars/"+interaction.user.id+"/"+interaction.user.avatar+".jpg"
        },
        thumbnail: {
          url: "http://i.imgur.com/p2qNFag.png"
        },
        image: {
          url: imageUrl
        },
        title: prompt,
        url: "https://discord.js.org/#/docs/main/master/class/MessageEmbed",
        description: "This is the main body of text, it can hold 2048 characters.",
        fields: [{
          name: "This is a single field title, it can hold 256 characters",
          value: "This is a field value, it can hold 1024 characters.",
          inline: false
        },
        {
          name: "Inline fields",
          value: "They can have different fields with small headlines, and you can inline them.",
          inline: true
        },
        {
          name: "Masked links",
          value: "You can put [masked links](https://discord.js.org/#/docs/main/master/class/MessageEmbed) inside of rich embeds.",
          inline: true
        },
        {
          name: "Markdown",
          value: "You can put all the *usual* **__Markdown__** inside of them.",
          inline: true
        },
        {
          name: "\u200b",
          value:"\u200b"
        }],
        timestamp: new Date(),
        footer: {
          icon_url: "http://i.imgur.com/w1vhFSR.png",
          text: "This is the footer text, it can hold 2048 characters"
        }
      }]});
    } catch (error) {
      console.error(`Error while calling OpenAI Images API: ${error.message}`);
      await interaction.editReply(
        "An error occurred while processing your request. Please try again later."
      );
    }
  },
};