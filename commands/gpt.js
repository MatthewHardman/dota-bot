const { SlashCommandBuilder } = require('discord.js');
const openai = require('openai');
const OPENAI_API_KEY = 'your_openai_api_key_here';
openai.api_key = OPENAI_API_KEY;

async function getInfo(query) {
  const data = {
    'model': 'gpt-4-32k',
    'messages': [{'role': 'user', 'content': query}],
    'temperature': 0.7
  };

  try {
    const response = await openai.ChatCompletion.create(data);
    const assistantMessage = response.choices[0].message.content;
    return assistantMessage;
  } catch (error) {
    console.error(`Error calling OpenAI API: ${error.message}`);
    return null;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gpt4')
    .setDescription('Get information using GPT-4 API')
        .addStringOption(option => 
            option.setName('query')
            .setDescription('The query you want to ask GPT-4 API')
            .setRequired(true)
        ),
  async execute(interaction) {
    // Check if the user has the "Bot Dev" role
    const botDevRole = interaction.guild.roles.cache.find(role => role.name === 'Bot Dev');
    if (!interaction.member.roles.cache.has(botDevRole.id)) {
        await interaction.reply({ content: 'You do not have the required role (Bot Dev) to use this command.', ephemeral: true });
        return;
    }

    const query = interaction.options.getString('query');
    const result = await getInfo(query);

    if (result) {
        await interaction.reply(result);
    } else {
        await interaction.reply('Sorry, I could not find any information for that query.');
    }
  },
};