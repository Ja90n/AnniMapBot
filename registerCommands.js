const { REST, Routes } = require('discord.js')

const commands = [
    {
        name: 'addmaprole',
        description: 'Pings you when your registered maps are being voted on.',
        options: [{
            name: 'map',
            description: 'The map you want notifications for if they are voted on.',
            required: true,
            type: 3
        }]
    },
    {
        name: 'removemaprole',
        description: 'Removes your map role.',
        options: [{
            name: 'map',
            description: 'The map you don\'t want notifications for.',
            required: true,
            type: 3
        }]
    },
];

const rest = new REST({ version: '10' }).setToken('');

try {
    console.log('Started refreshing application (/) commands.');

    rest.put(Routes.applicationCommands('1134145511885127780','1134116455697350746'), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
} catch (error) {
    console.error(error);
}