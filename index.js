const { Client, Intents, Collection } = require('discord.js')
const { token, prefix } = require('./config.json')

const fs = require('fs')

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ],
});

client.commands = new Collection();

fs.readdirSync('./commands').forEach(dirs => {
    const commands = fs.readdirSync(`./commands/${dirs}`).filter((files) => files.endsWith('.js'));

    for (const file of commands) {
        const command = require(`./commands/${dirs}/${file}`);
        client.commands.set(command.name, command);
        if (command.name) {
            console.log(`Command: ${command.name} - ${command.category} Category Load.`);
        } else {
            console.log(`${file} - is missing a help.name, or content.`);
        }
        
    };
});

const events = fs.readdirSync(`./events`).filter((file) => file.endsWith('.js'));

for (const file of events) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (args) => event.execute(args, client));
    } else {
        client.on(event.name, (args) => event.execute(args, client));
    }
}

client.login(token)