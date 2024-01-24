package com.ja90n.events;

import com.ja90n.AnniMapBot;
import com.ja90n.Client;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.entities.Message;
import net.dv8tion.jda.api.entities.emoji.Emoji;
import net.dv8tion.jda.api.events.message.react.MessageReactionAddEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

import java.net.URI;

public class ReactionEvent extends ListenerAdapter {

    private AnniMapBot anniMapBot;

    public ReactionEvent(AnniMapBot anniMapBot) {
        this.anniMapBot = anniMapBot;
    }

    @Override
    public void onMessageReactionAdd(MessageReactionAddEvent event) {
        if (event.getUser().isBot()) return;
        if (!event.getMessageId().equals("1199831871471751268")) return;

        if (event.getReaction().getEmoji().getAsReactionCode().equals("✅")) {
            try {
                Client c = new Client(new URI("ws://localhost:7080"), anniMapBot);
                c.connect();
                c.close();
            } catch (Exception e){}
        }

        event.getReaction().removeReaction(event.getUser()).queue();
        //event.getReaction().removeReaction(bot.getSelfUser()).queue();

        Message message = event.retrieveMessage().complete();
        message.addReaction(Emoji.fromUnicode("U+2705")).queue();
    }
}
