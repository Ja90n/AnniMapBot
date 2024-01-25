package com.ja90n.events;

import com.ja90n.AnniMapBot;
import com.ja90n.Client;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.entities.Message;
import net.dv8tion.jda.api.entities.emoji.Emoji;
import net.dv8tion.jda.api.events.message.react.MessageReactionAddEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

import java.net.URI;
import java.util.Timer;
import java.util.TimerTask;

public class ReactionEvent extends ListenerAdapter {

    private AnniMapBot anniMapBot;

    public ReactionEvent(AnniMapBot anniMapBot) {
        this.anniMapBot = anniMapBot;
    }

    @Override
    public void onMessageReactionAdd(MessageReactionAddEvent event) {
        if (event.getUser().isBot()) return;
        if (!event.getMessageId().equals("1199831871471751268")) return;

        event.getReaction().removeReaction(anniMapBot.getBot().getSelfUser()).queue();
        event.getReaction().removeReaction(event.getUser()).queue();

        if (event.getReaction().getEmoji().getAsReactionCode().equals("✅")) {
            try {
                Client c = new Client(new URI("ws://localhost:7080"), anniMapBot);
                c.connect();
                c.close();
            } catch (Exception e){}
            Message loadingMessage = anniMapBot.getBot().getTextChannelById(1199795392615829585L).retrieveMessageById(1199842439163293729L).complete();
            loadingMessage.editMessage("Loading...").queue();
        }

        Timer timer = new Timer();
        TimerTask task = new TimerTask() {
            public void run() {
                anniMapBot.getBot().getTextChannelById(1199795392615829585L).retrieveMessageById(1199831871471751268L).complete().addReaction(Emoji.fromUnicode("U+2705")).queue();
            }
        };

        timer.schedule(task,5000);
    }
}
