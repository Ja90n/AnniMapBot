package com.ja90n;

import com.ja90n.events.ReactionEvent;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.entities.Activity;
import net.dv8tion.jda.api.entities.Message;

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
        Message loadingMessage = bot.getTextChannelById(1199795392615829585L).retrieveMessageById(1199842439163293729L).complete();
        loadingMessage.editMessage(reply).complete();
    }
}
