import { Client } from "discord.js";
import dotenv from 'dotenv';
import { log } from "./logger.js";

async function main() {
  dotenv.config();

  const client = new Client({
    intents: [
      'Guilds',
      'GuildMembers',
      'GuildPresences',
      'MessageContent',
    ]
  });

  client.login(process.env.APP_TOKEN).then(() => {
    log('INFO', `Logged in as ${client.user?.tag}`);
  });
}

export default main();