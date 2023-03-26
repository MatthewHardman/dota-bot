const { SlashCommandBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const requiredRole = "Regulars"

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
    //console.log(interaction.member);

    if (!interaction.member.roles.cache.has(botDevRole.id)) {
      await interaction.reply({
        content:
          "You do not have the required role "+ requiredRole + " to use this command.",

        ephemeral: true,
      });
      return;
    }

    // Defer the reply
    await interaction.deferReply();

    try {
      const imageUrl = await getImage(prompt);
      console.log("Image URL: " + imageUrl);

      await interaction.editReply({ embeds: [{
        color: 3447003,
        author: {
          name: interaction.member.nickname,
          icon_url: "https://cdn.discordapp.com/avatars/"+interaction.member.user.id+"/"+interaction.member.user.avatar+".jpg"
        },
        image: {
          url: imageUrl
        },
        title: prompt,
        description: "Generative art created by the WSKBosch bot and " + interaction.member.nickname,
        // fields: [{
        //   name: "This is a single field title, it can hold 256 characters",
        //   value: "This is a field value, it can hold 1024 characters.",
        //   inline: false
        // }],
        timestamp: new Date(),
        footer: {
          icon_url: "",
          text: "Thanks for playing!"
        }
      }]});
    } catch (error) {
      console.log("Image Prompt: " + prompt);
      console.log(interaction.member.nickname);
      console.error(`Error while calling OpenAI Images API: ${error.message}`);
      await interaction.editReply({
        content: "An error occurred while processing your request. Please try again later.",
        ephemeral: true
      });
    }
  },
};