import { Octokit } from "@octokit/core";
import { Webhooks } from "@octokit/webhooks";
import { ChannelType, Client } from "discord.js";

export type Statistics = { readonly member_count: number, readonly repository_count: number }

export default function init(client: Client) {
    const webhooks = new Webhooks({
        secret: process.env.APP_GH_TOKEN!!,
      });
      
      webhooks.onAny(({ id, name, payload }) => {
        console.log`${id} - ${name} - ${payload}`;
      });

    setInterval(async () => {
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

            if (!channel) {
                channel = await guild.channels.create({
                    // @ts-ignore
                    name: `${prefix} ${statistics[stat]}`,
                    type: ChannelType.GuildVoice,
                    position: 0,
                    permissionOverwrites: guild.roles.cache.mapValues(r => {
                        return { id: r.id, allow: ["ViewChannel"], deny: ["Connect",] }
                    })
                });
            }

            // @ts-ignore
            await channel.edit({ name: `${prefix} ${statistics[stat]}` });
        }
    }, 1000);
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