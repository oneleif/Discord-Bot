import { Octokit } from "@octokit/core";
import { CategoryChannel, ChannelType, Client, PermissionsBitField } from "discord.js";
import dotenv from 'dotenv';
import { log } from "./logger.js";

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

  setInterval(async () => await updateStatistics(client), 1000);

  client.login(process.env.APP_TOKEN).then(() => {
    log('INFO', `Logged in as ${client.user?.tag}`);
  });
}

type Statistics = { readonly member_count: number, readonly repository_count: number }

async function updateStatistics(client: Client) {
  const guild = client.guilds.cache.first()!!;

  const statistics: Statistics = {
    member_count: guild.memberCount!!,
    repository_count: await fetchRepositoryCount()
  };

  for (const stat in statistics) {
    const prefix = stat.split('_')
      .map(p => `${p.charAt(0).toUpperCase() + p.toLowerCase().substring(1)}`)
      .join(" ")
      .concat(": ");

    let channel = guild.channels.cache.find(ch => ch.name.startsWith(prefix));
   
    if (channel) {
      await channel.delete();
    }

    if (!channel) {
      channel = await guild.channels.create({
         // @ts-ignore
        name: `${prefix} ${statistics[stat]}`,
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
          { id: guild.id, allow: ["ViewChannel"], deny: ["SendMessages", "ManageChannels"] }
        ]
      });
    }

    // @ts-ignore
    await channel.edit({ name: `${prefix} ${statistics[stat]}` });
  }
}

async function fetchRepositoryCount(): Promise<number> {
  const octokit = new Octokit({
    auth: process.env.APP_GH_TOKEN
  });

  const repositories = await octokit.request('GET /orgs/{org}/repos', {
    org: 'oneleif',
    type: 'public',
    per_page: 100,
  });

  // @ts-ignore
  return repositories.data.length;
}

export default main();