import { WebSocketServer } from 'ws';

import pkg from 'mineflayer';
const {mineflayer} = pkg;

const wss = new WebSocketServer({ port: 7080 });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    startBot(ws)
  });
});


function startBot(ws) {
    const bot = pkg.createBot({
        host: "play.shotbow.net",
        port: 25565,
        auth: 'microsoft',
        username: process.argv[2],
        version: '1.12.2',
        hideErrors: true
    })

    bot.on('spawn', () => {
        bot.setQuickBarSlot(0);
        bot.activateItem();
    })

    bot.on('windowOpen', (window) => {
        console.log('opened window')
        if (window.title === '{"text":"Shotbow"}') {
            bot.clickWindow(5,0,0);
            bot.clickWindow(5,0,0);
        } else if (window.title === '{"text":"Select Server"}') {
            let message = '';
            for (let i = 0; i < 9; i++) {
                try {
                    let map = window.slots[i].customLore[0]?.slice(2); // Can also be voting
                    let phase = window.slots[i].customLore[1]?.slice(2);
                    let playerCount = window.slots[i].customLore[2]?.slice(2);
    
                    if (phase.startsWith('Phase 3')) {
                        phase = 'Phase 3' // Removes '(§bPremium§r join privilege)'
                    }
    
                    message = message + '!' + map + ',' + phase + ',' + playerCount
                    
                } catch (error) {
                    
                }
            } 
            ws.send(message)
            bot.end()
        }
    })
}