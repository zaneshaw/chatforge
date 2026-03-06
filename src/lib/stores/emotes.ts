import { EmoteFetcher } from "@mkody/twitch-emoticons";
import { loading } from "./loading.svelte";
import { twitchLoginToId } from "../utils";
import { load } from "@tauri-apps/plugin-store";
import { get } from "svelte/store";
import { settings } from "./settings";
import { pushToast } from "./toasts.svelte";

const cacheLifetime = 24 * 60 * 60 * 1000; // expire after 1 day

const emoteCache = await load("emote_cache.json", {
	defaults: {} as { emotes: any[] },
	autoSave: 5000,
});

export const fetcher = new EmoteFetcher();

export async function loadEmotes() {
	const _settings = get(settings);
	const now = Date.now();

	let cached = await emoteCache.get<any[]>("emotes");
	const cachedTime = (await emoteCache.get<number>("ts")) ?? 0;
	const cachedChannel = await emoteCache.get<string>("channel");

	console.log(cachedChannel);

	if (cachedChannel != undefined && cachedChannel != _settings?.emotes?.channel) {
		cached = undefined;
		console.log("channel changed");
	}

	if (!cached || now >= cachedTime + cacheLifetime) {
		loading.label = "Loading emotes...";
		loading.showProgress = false;
		loading.showProgressText = false;

		await fetchTwitchGlobalEmotes(fetcher);
		await fetcher.fetchBTTVEmotes();
		await fetcher.fetchSevenTVEmotes();
		await fetcher.fetchFFZEmotes();

		if (_settings?.emotes?.channel) {
			const channel = _settings.emotes.channel;
			const channelId = await twitchLoginToId(channel);

			if (channelId) {
				try {
					await fetchTwitchEmotes(fetcher, channel, channelId);
					await fetcher.fetchBTTVEmotes(channelId);
					await fetcher.fetchSevenTVEmotes(channelId);
					await fetcher.fetchFFZEmotes(channelId);
				} catch (err) {
					pushToast("error", "Failed to load some or all channel emotes!");
				}
			}
		}

		await emoteCache.set(
			"emotes",
			fetcher.emotes.map((emote: any) => emote.toObject()),
		);
		await emoteCache.set("ts", Date.now());
		await emoteCache.set("channel", _settings.emotes.channel);
	} else {
		fetcher.fromObject([...cached]);
	}
}

export async function clearEmoteCache() {
	await emoteCache.clear();
	await emoteCache.save();
}

async function fetchTwitchGlobalEmotes(fetcher: EmoteFetcher) {
	const res = await fetch("https://gql.twitch.tv/gql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"client-id": "kimne78kx3ncx6brgo4mv6wki5h1ko",
		},
		body: JSON.stringify({
			query: `
				query GlobalEmotes {
					emoteSet(id: "0") {
						emotes {
							id
							token
							assetType
						}
					}
				}
			`,
		}),
	});

	const data = await res.json();
	const emotes = data.data.emoteSet.emotes;

	fetcher.fromObject(
		emotes.map((emote: any) => ({
			"code": emote.token,
			"id": emote.id,
			"channel_id": null,
			"animated": emote.assetType == "ANIMATED",
			"type": "twitch",
		})),
	);
}

async function fetchTwitchEmotes(fetcher: EmoteFetcher, channel: string, channelId: number | null) {
	const res = await fetch("https://gql.twitch.tv/gql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"client-id": "kimne78kx3ncx6brgo4mv6wki5h1ko",
		},
		body: JSON.stringify({
			query: `
				query ChannelEmotes($login: String!) {
					user(login: $login) {
						subscriptionProducts {
							emotes {
								id
								token
								subscriptionTier
							}
						}
					}
				}
			`,
			variables: { login: channel },
		}),
	});

	const data = await res.json();
	const emotes = data.data.user.subscriptionProducts.flatMap((x: any) => x.emotes);

	if (channelId == null) channelId = await twitchLoginToId(channel);

	fetcher.fromObject(
		emotes.map((emote: any) => ({
			"code": emote.token,
			"id": emote.id,
			"channel_id": channelId,
			"animated": emote.assetType == "ANIMATED",
			"type": "twitch",
		})),
	);
}
