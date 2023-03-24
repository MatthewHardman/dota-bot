const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
//const { token } = require("./config.json");
const token = process.env.token;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.on("messageCreate", async (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;
  
  // Check if the message is a reply and mentions the bot
  if (message.reference && message.mentions.has(client.user)) {
    // Get the replied message
    const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
    
    // Call the isFunnyJoke function with the replied message content
    const result = await isFunnyJoke(repliedMessage.content);
    
    // Reply with the result ("yes" or "no")
    message.reply(result);
  }
});

async function isFunnyJoke(message) {
  const query = `Is this joke funny? "${message}"`;
  const response = await getInfo(query);

  // Check if the response from GPT-4 indicates that the joke is funny
  if (response.toLowerCase().includes("yes")) {
    return "Yes, that's funny";
  } else {
    return "No, that isn't funny.";
  }
}

client.login(token);
