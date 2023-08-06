const mineflayer = require('mineflayer')
const registry = require('prismarine-registry')('1.16')
const { Client, Events, GatewayIntentBits, ActivityType, IntentsBitField  } =  require('discord.js');
const { time } = require('discord.js');
const discordClient = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, IntentsBitField.Flags.GuildPresences, GatewayIntentBits.GuildMessageReactions]});

const options = {
    host: 'play.shotbow.net', // Change this to the ip you want.
    port: 25565 ,// Change this to the port you want.
    auth: 'microsoft',
    username: '',
    password: '',
    version: '1.12.2',
    logErrors: false,
    hideErrors: true
}

const votingMaps = new Map();

let reactMessage;
let timer;
let editMessage;
let minecraftBot;

discordClient.on('ready',async () => {
    discordClient.user.setPresence({
        activities: [{
            name: "anni",
            type: "PLAYING"
        }],
        status: "dnd"
    })
    console.log(`Logged in as ${discordClient.user.tag}!`);

    votingMaps.clear()

    await discordClient.channels.cache.get('1134238271824736307').messages.fetch('1134239588097982575').then(message => setReactionMessage(message))
    await discordClient.channels.cache.get('1134238271824736307').messages.fetch('1134244462923632710').then(message => setEditMessage(message))

    react()
    restartTimer()

});

discordClient.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (!user.bot) {
        if (reaction.message.id === '1134239588097982575') {
            console.log('reaction received')
            await reaction.remove();
            editMessage.edit('𝙇𝙤𝙖𝙙𝙞𝙣𝙜...')
            spawnMinecraftBot(user.username);
            setTimeout(react,4000)
        }
    }
})

discordClient.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'addmaprole') {
        const mapName = interaction.options.getString("map")

        let roleId = nameToRoleId(mapName)

        if (roleId == null) {
            await interaction.reply('Map not found! Try checking your spelling or contact ja90n');
            return;
        }

        const myGuild = discordClient.guilds.cache.get('1134116455697350746');
        const myRole = myGuild.roles.cache.find(role => role.id.toString() === roleId);

        if (interaction.member.roles.cache.has(roleId)) {
            await interaction.reply('You already have that role!');
            return;
        }

        interaction.member.roles.add(myRole);

        await interaction.reply('Succes! You will be notified when ' + mapName + ' is voted on!');

    } else if (interaction.commandName === 'removemaprole') {
        const mapName = interaction.options.getString("map")

        let roleId = nameToRoleId(mapName)

        if (roleId == null) {
            await interaction.reply('Map not found! Try checking your spelling or contact ja90n');
            return;
        }

        if (interaction.member.roles.cache.has(roleId)) {
            interaction.member.roles.remove(roleId)
            await interaction.reply('Your role has been removed!');
        } else {
            await interaction.reply('You don\'t have that role!');
        }
    }
});

function setReactionMessage(message) {
    reactMessage = message;
}

function setEditMessage(message) {
    editMessage = message;
}

function restartTimer() {
    clearTimeout(timer);
    timer = setTimeout(spawnMinecraftBot,300000,'automatic update')
}

function react() {
    reactMessage.react('✅')
}


function spawnMinecraftBot(user) {

    try {
        console.log('-------------------')
        console.log('spawning minecraft bot')
        minecraftBot = mineflayer.createBot(options);
        minecraftBot.logErrors = false;
        minecraftBot.hideErrors = true;
        let isInAnni = false;

        // On spawn opens gui
        minecraftBot.on('spawn', () => {
            minecraftBot.setQuickBarSlot(0);
            minecraftBot.activateItem();
        })

        // Checks if we have joined the Anni server instead of the lobby by looking at the welcome reactMessage
        minecraftBot.on('message', (msg) => {
            let chatMessage;
            chatMessage = JSON.stringify(msg)
            if (chatMessage.includes("\"color\":\"green\",\"text\":\"Welcome back \"")) {
                isInAnni = true;
            }
        })

        minecraftBot.on('windowOpen', (window) => {
            console.log('opened window')
            if (isInAnni) {
                getMapsFromAnniGui(window, user);
            } else {
                minecraftBot.clickWindow(5,0,0)
            }
        })
    }
    catch(err) {
        discordClient.channels.cache.get('1134238271824736307').messages.fetch('1134244462923632710').then(discordMessage => discordMessage.edit("Something went wrong! Try again later"))
        console.log(err)
        console.log('sukkel')
    }
}

function getMapsFromAnniGui(window, user) {
    console.log('get information from window')
    let message = '';
    const channel = discordClient.channels.cache.get('1134238271824736307');
    for (let i = 0; i < window.slots.length; i++) {
        if (window.slots[i] === null) {
            break;
        }

        // The .slice(2) removes the colour code from the string
        let map = window.slots[i].customLore[0].slice(2); // Can also be voting
        let phase = window.slots[i].customLore[1].slice(2);
        let playerCount = window.slots[i].customLore[2].slice(2);

        if (phase.startsWith('Phase 3')) {
            phase = 'Phase 3' // Removes '(§bPremium§r join privilege)'
        }

        if (!votingMaps.has(i)) {
            votingMaps.set(i,i.toString())
        }

        if (map.startsWith('Voting: ')) {
            pingMaps(i,map.slice(8)) // The .slice(8) removes the 'Voting: ' from the string
        } else {
            votingMaps.set(i,i.toString());
        }

        message = message + (i+1) + ': ' + map + ', ' + phase + ', ' + playerCount + '\n';
    }

    message = message + 'Last updated ' + '<t:' + Math.round((Date.now().toPrecision()/1000)) + ':R>'
    message = message + '. Requested by: ' + user

    discordClient.channels.cache.get('1134238271824736307').messages.fetch('1134244462923632710').then(discordMessage => discordMessage.edit(message))

    console.log(message)

    restartTimer()

    minecraftBot.quit();
}

function pingMaps(mapNumber,map) {
    if (votingMaps.get(mapNumber) === map) {
    } else {
        votingMaps.set(mapNumber,map)
        let splitMaps = map.split(', ')
        for (let i = 0; i < splitMaps.length; i++) {
            pingMap(nameToRoleId(splitMaps[i]))
        }
    }
}

//I am so sorry
function nameToRoleId(name) {
    if (name.includes('Andorra')) {
        return '1134496238000165077'
    }
    if (name.includes('Villages')) {
        return '1134496317796798645'
    }
    if (name.includes('Hamlet')) {
        return '1134496389955584000'
    }
    if (name.includes('Canyon')) {
        return '1134496445806940200'
    }
    if (name.includes('Aftermath')) {
        return '1134496560068165682'
    }
    if (name.includes('Cherokee')) {
        return '1134496645250297996'
    }
    if (name.includes('Kingdom')) {
        return '1134496790859759617'
    }
    if (name.includes('Nature')) {
        return '1134497012704891031'
    }
    if (name.includes('Alpine')) {
        return '1134497102844678245'
    }
    if (name.includes('Amazon')) {
        return '1134497192674074634'
    }
    if (name.includes('AnniZ')) {
        return '1134497268855226378'
    }
    if (name.includes('Babylon')) {
        return '1134497332923215923'
    }
    if (name.includes('Castaway')) {
        return '1134497386509631589'
    }
    if (name.includes('Castles')) {
        return '1134497458127376415'
    }
    if (name.includes('Cavern')) {
        return '1134497512582029414'
    }
    if (name.includes('Chasm')) {
        return '1134497561797988384'
    }
    if (name.includes('Collis')) {
        return '1134497631566041180'
    }
    if (name.includes('Districts')) {
        return '1134497848176672778'
    }
    if (name.includes('Etna')) {
        return '1134497914471858259'
    }
    if (name.includes('Fossils')) {
        return '1134497997531652137'
    }
    if (name.includes('Foxberry')) {
        return '1134498065093492766'
    }
    if (name.includes('Galleons')) {
        return '1134498113705476197'
    }
    if (name.includes('Grasslands')) {
        return '1134498186799616040'
    }
    if (name.includes('Highnorth')) {
        return '1134498330232234065'
    }
    if (name.includes('Ikusa')) {
        return '1134498386112946186'
    }
    if (name.includes('Meteor')) {
        return '1134498433571491850'
    }
    if (name.includes('Mythos')) {
        return '1134498482833592400'
    }
    if (name.includes('Pokatoto')) {
        return '1134498564165353512'
    }
    if (name.includes('Rifts')) {
        return '1134498626341716088'
    }
    if (name.includes('Royal')) {
        return '1134498846291017808'
    }
    if (name.includes('Sherwood')) {
        return '1134498908161191957'
    }
    if (name.includes('Shiloh')) {
        return '1134498983390228523'
    }
    if (name.includes('Shroomlette')) {
        return '1134499034837549177'
    }
    if (name.includes('Skylands')) {
        return '1134499158041047041'
    }
    if (name.includes('Solomque')) {
        return '1134499218225123358'
    }
    if (name.includes('StoneHaven')) {
        return '1134499296625041528'
    }
    if (name.includes('Temples')) {
        return '1134499532412031127'
    }
    if (name.includes('Thaw')) {
        return '1134502211225911336'
    }
    if (name.includes('Thallos')) {
        return'1134502165696757820'
    }
    if (name.includes('Tides')) {
        return '1134502277160386630'
    }
    if (name.includes('Tireus')) {
        return '1134502328683221012'
    }
    if (name.includes('Tirreg')) {
        return '1134502412648980500'
    }
    if (name.includes('Tropics')) {
        return '1134502460984148028'
    }
    if (name.includes('Twilight')) {
        return '1134502536020242464'
    }
    if (name.includes('Valleys')) {
        return '1134502705650479285'
    }
    if (name.includes('Yggdrasil')) {
        return '1134502890455707738'
    }
    if (name.includes('Wintertide')) {
        return '1134503319344254987'
    }
    if (name.includes('Thallos')) {
        return '1134502165696757820'
    }
    if (name.includes('Cronos')) {
        return '1135234347851587605'
    }
    if (name.includes('Summerstal')) {
        return '1135294379863580802'
    }
    return null;
}

function pingMap(roleId) {
    discordClient.channels.fetch('1134571091164155994').then(channel => channel.send('<@&' + roleId + '>'));
}

discordClient.login('')
console.log('Finished!');