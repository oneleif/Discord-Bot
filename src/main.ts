import { Client } from "discord.js";
import dotenv from 'dotenv';
import { log } from "./logger.js";
import initStatistics from "./modules/statistics.js";

async function main() {
  dotenv.config();

  const client = new Client({
    intents: [
      "DirectMessageReactions",
      "DirectMessageTyping",
      "DirectMessages",
      'Guilds',
      'GuildMembers',
      "GuildBans",
      "GuildEmojisAndStickers",
      "GuildIntegrations",
      "GuildInvites",
      "GuildMessageReactions",
      "GuildMessageTyping",
      "GuildMessages",
      "GuildPresences",
      "GuildScheduledEvents",
      "GuildVoiceStates",
      "GuildWebhooks",
      "MessageContent"
    ]
  });

  initStatistics(client);

  client.login(process.env.APP_TOKEN).then(() => {
    log('INFO', `Logged in as ${client.user?.tag}`);
  });
}

export default main();