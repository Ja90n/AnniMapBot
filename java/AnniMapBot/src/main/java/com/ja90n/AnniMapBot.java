package com.ja90n;

import com.ja90n.events.ReactionEvent;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.entities.Activity;
import net.dv8tion.jda.api.entities.Message;

import java.util.Date;

import static net.dv8tion.jda.api.requests.GatewayIntent.DIRECT_MESSAGES;
import static net.dv8tion.jda.api.requests.GatewayIntent.GUILD_MESSAGES;

public class AnniMapBot {

    private JDA bot;

    public AnniMapBot() {

        bot = JDABuilder.createDefault("token")
                .enableIntents(DIRECT_MESSAGES)
                .enableIntents(GUILD_MESSAGES)
                .setActivity(Activity.watching("clanwars"))
                .build();

        bot.addEventListener(new ReactionEvent(this));
    }

    public void gotReply(String reply) {
        System.out.println("Got reply");

        StringBuilder replyEditor = new StringBuilder(reply);
        replyEditor.delete(0,1);

        String message = "";
        StringBuilder stringBuilder = new StringBuilder(message);
        String[] list = replyEditor.toString().split("!");
        for (String map : list) {
            System.out.println(map);
            String[] part = map.split(",");
            stringBuilder.append(part[0]).append(", ").append(part[1]).append(", ").append(part[2]).append("\n");
        }

        Message loadingMessage = bot.getTextChannelById(1199795392615829585L).retrieveMessageById(1199842439163293729L).complete();
        stringBuilder.append("Last update: <t:").append(Math.round((float) new Date().getTime() /1000)).append(":R>");
        loadingMessage.editMessage(stringBuilder).complete();
    }

    public JDA getBot() {
        return bot;
    }
}
