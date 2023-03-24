# dota-bot
Discord bot using discord.js and node.js designed to help groups of people organize a game. In this case, that game is dota.  

Users interact with this bot via slash-commands. The command "dota" prompts the user to input the number of people they want to play with and how long they are willing
to wait. The bot then sends a message to the discord channel in which it was activated, asking users to respond to the message if they woudl like to play. When the 
message receives a number of reactions equal to the number requested by the original user the bot pings everyone that reacted. If not enough people react in the allotted
time the bot sends a message that there is not enough people to play currently. 

