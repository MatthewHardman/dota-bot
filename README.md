# dota-bot
Discord bot using discord.js and node.js designed to help groups of people organize a game. In this case, that game is dota.  

Users interact with this bot via slash-commands. The command "dota" prompts the user to input the number of people they want to play with and how long they are willing
to wait. The bot then sends a message to the discord channel in which it was activated, asking users to respond to the message if they woudl like to play. When the 
message receives a number of reactions equal to the number requested by the original user the bot pings everyone that reacted. If not enough people react in the allotted
time the bot sends a message that there is not enough people to play currently.

AI GENERATED README _____________

# Discord Bot with OpenAI Integration

This Discord bot is designed to enhance your server experience by offering a variety of commands, including some that leverage the power of OpenAI's GPT-4 and Images API. The bot offers a mix of utility, fun, and gaming-related commands that cater to different user preferences.

## Features

- **GPT-4 Chatbot**: Utilize the "/gpt4" command to ask questions or get information from the GPT-4 API. The bot sends your query to the GPT-4 API and returns a response based on the AI model. It also allows users to input their time zone and adjusts the scheduled time in the query accordingly.

- **OpenAI Images**: Generate images based on a text prompt using the "/wskbosch" command. The bot sends the provided prompt to the OpenAI Images API and returns an image URL based on the AI model's output.

- **Dota 2 Stack**: The "/dota" command creates a message that asks users to react in order to join a Dota 2 stack. This helps in organizing and managing stacks for Dota 2 gaming sessions within your server.

- **Opt-in and Opt-out**: The "/optin" and "/optout" commands allow users to join or leave a specific role, which is pinged when the "/dota" command is used. Users can opt-in to receive notifications for Dota 2 stack invitations or opt-out if they do not wish to be notified.

## Installation and Setup

1. Clone the repository or download the source code.
2. Run `npm install` to install the required dependencies.
3. Create a `.env` file in the root directory and add your Discord bot token and OpenAI API key:

```
DISCORD_BOT_TOKEN=your_discord_bot_token
OPENAI_API_KEY=your_openai_api_key
```

4. Run `node index.js` to start the bot.
5. Invite the bot to your server and start using the commands!

## Usage

To use the available commands, simply type the command followed by the required input. For example:

- For GPT-4 chatbot: `/gpt4 query:"your query" timezone:your_timezone_offset`
- For OpenAI Images: `/wskbosch prompt:"your image prompt"`
- For Dota 2 Stack: `/dota`
- For Opt-in: `/optin`
- For Opt-out: `/optout`

Enjoy using the bot and exploring the various commands it offers!

