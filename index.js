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

let reactMessage;
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

    await discordClient.channels.cache.get('1134238271824736307').messages.fetch('1134239588097982575').then(message => setReactionMessage(message))
    await discordClient.channels.cache.get('1134238271824736307').messages.fetch('1134244462923632710').then(message => setEditMessage(message))

    react()

});

function setReactionMessage(message) {
    reactMessage = message;
}

function setEditMessage(message) {
    editMessage = message;
}

discordClient.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (!user.bot) {
        if (reaction.message.id === '1134239588097982575') {
            console.log('reaction received')
            await reaction.remove();
            editMessage.edit('𝙇𝙤𝙖𝙙𝙞𝙣𝙜...')
            spawnMinecraftBot(user);
            setTimeout(react,4000)
        }
    }
})

function react() {
    reactMessage.react('✅')
}


function spawnMinecraftBot(user) {

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

        if (map.startsWith('Voting: ')) {
            mapToRole(map.slice(8)) // The .slice(8) removes the 'Voting: ' from the string
        }

        message = message + (i+1) + ': ' + map + ', ' + phase + ', ' + playerCount + '\n';
    }

    message = message + 'Last updated ' + '<t:' + Math.round((Date.now().toPrecision()/1000)) + ':R>'
    message = message + '. Requested by: ' + user.username

    discordClient.channels.cache.get('1134238271824736307').messages.fetch('1134244462923632710').then(discordMessage => discordMessage.edit(message))

    console.log(message)
    minecraftBot.quit();
}

//I am so sorry
function mapToRole(map) {
    if (map.includes('Andorra')) {
        pingMap('1134496238000165077')
    }
    if (map.includes('Villages')) {
        pingMap('1134496317796798645')
    }
    if (map.includes('Hamlet')) {
        pingMap('1134496389955584000')
    }
    if (map.includes('Canyon')) {
        pingMap('1134496445806940200')
    }
    if (map.includes('Aftermath')) {
        pingMap('1134496560068165682')
    }
    if (map.includes('Cherokee')) {
        pingMap('1134496645250297996')
    }
    if (map.includes('Kingdom')) {
        pingMap('1134496790859759617')
    }
    if (map.includes('Nature')) {
        pingMap('1134497012704891031')
    }
    if (map.includes('Alpine')) {
        pingMap('1134497102844678245')
    }
    if (map.includes('Amazon')) {
        pingMap('1134497192674074634')
    }
    if (map.includes('AnniZ')) {
        pingMap('1134497268855226378')
    }
    if (map.includes('Babylon')) {
        pingMap('1134497332923215923')
    }
    if (map.includes('Castaway')) {
        pingMap('1134497386509631589')
    }
    if (map.includes('Castles')) {
        pingMap('1134497458127376415')
    }
    if (map.includes('Cavern')) {
        pingMap('1134497512582029414')
    }
    if (map.includes('Chasm')) {
        pingMap('1134497561797988384')
    }
    if (map.includes('Collis')) {
        pingMap('1134497631566041180')
    }
    if (map.includes('Districts')) {
        pingMap('1134497848176672778')
    }
    if (map.includes('Etna')) {
        pingMap('1134497914471858259')
    }
    if (map.includes('Fossils')) {
        pingMap('1134497997531652137')
    }
    if (map.includes('Foxberry')) {
        pingMap('1134498065093492766')
    }
    if (map.includes('Galleons')) {
        pingMap('1134498113705476197')
    }
    if (map.includes('Grasslands')) {
        pingMap('1134498186799616040')
    }
    if (map.includes('Highnorth')) {
        pingMap('1134498330232234065')
    }
    if (map.includes('Ikusa')) {
        pingMap('1134498386112946186')
    }
    if (map.includes('Meteor')) {
        pingMap('1134498433571491850')
    }
    if (map.includes('Mythos')) {
        pingMap('1134498482833592400')
    }
    if (map.includes('Pokatoto')) {
        pingMap('1134498564165353512')
    }
    if (map.includes('Rifts')) {
        pingMap('1134498626341716088')
    }
    if (map.includes('Royal')) {
        pingMap('1134498846291017808')
    }
    if (map.includes('Sherwood')) {
        pingMap('1134498908161191957')
    }
    if (map.includes('Shiloh')) {
        pingMap('1134498983390228523')
    }
    if (map.includes('Shroomlette')) {
        pingMap('1134499034837549177')
    }
    if (map.includes('Skylands')) {
        pingMap('1134499158041047041')
    }
    if (map.includes('Solomque')) {
        pingMap('1134499218225123358')
    }
    if (map.includes('StoneHaven')) {
        pingMap('1134499296625041528')
    }
    if (map.includes('Temples')) {
        pingMap('1134499532412031127')
    }
    if (map.includes('Thaw')) {
        pingMap('1134502211225911336')
    }
    if (map.includes('Thallos')) {
        pingMap('1134502165696757820')
    }
    if (map.includes('Tides')) {
        pingMap('1134502277160386630')
    }
    if (map.includes('Tireus')) {
        pingMap('1134502328683221012')
    }
    if (map.includes('Tirreg')) {
        pingMap('1134502412648980500')
    }
    if (map.includes('Tropics')) {
        pingMap('1134502460984148028')
    }
    if (map.includes('Twilight')) {
        pingMap('1134502536020242464')
    }
    if (map.includes('Valleys')) {
        pingMap('1134502705650479285')
    }
    if (map.includes('Yggdrasil')) {
        pingMap('1134502890455707738')
    }
    if (map.includes('Wintertide')) {
        pingMap('1134503319344254987')
    }
    if (map.includes('Thallos')) {
        pingMap('1134502165696757820')
    }
}

function pingMap(roleId) {
    discordClient.channels.fetch('1134571091164155994').then(channel => channel.send('<@&' + roleId + '> is in voting!'));
}

discordClient.login('')
console.log('Finished!');