import { writeFile, mkdir, remove, BaseDirectory, exists } from "@tauri-apps/plugin-fs";
import { join, dirname, appDataDir } from "@tauri-apps/api/path";
import { load } from "@tauri-apps/plugin-store";
import { loading } from "./loading.svelte";
import { convertFileSrc } from "@tauri-apps/api/core";
import { settings } from "./settings";
import { get } from "svelte/store";

type EmoteProvider = "twitch_global" | "twitch" | "ffz" | "bttv" | "7tv";

export type Emote = {
	id: string;
	token: string;
	provider: EmoteProvider;
	path: string;
	ts: number;
	data?: any;
};

const checkCacheInterval = 24 * 60 * 60 * 1000; // check cache after 24 hours
const cacheLifetime = 28 * 24 * 60 * 60 * 1000; // expire after 28 days

const emoteCache = await load("emote_cache.json", {
	defaults: {} as {
		[id: string]: Emote;
	},
	autoSave: 5000,
});

export const allEmotes: Emote[] = [];

export function getEmote(id: string) {
	const emote = allEmotes.find((emote) => emote.id == id);

	return emote;
}
export function getEmoteUrl(id: string) {
	const emote = getEmote(id);

	if (emote) {
		return convertFileSrc(emote.path);
	} else {
		return "/fallback-badge.png";
	}
}

export async function loadEmotes() {
	const _settings = get(settings);
	const now = Date.now();

	if (!_settings.last_emote_check || now >= _settings.last_emote_check + checkCacheInterval) {
		await loadTwitchGlobalEmotes();
		if (_settings?.emotes?.channel != undefined) {
			await clearEmoteProviderCache("twitch");
			if (_settings.emotes.twitch) {
				await loadTwitchEmotes(_settings.emotes.channel);
			} else {
				// await clearEmoteProviderCache("twitch");
			}
		}

		settings.update((state) => {
			state.last_emote_check = now;
			return state;
		});

		loading.progress = 1;
		loading.max = 1;
		loading.label = "Done!";
		loading.showProgressText = false;
	}

	const cached = (await emoteCache.values()) as Emote[];
	allEmotes.push(...cached);
}

export async function clearEmoteCache() {
	await emoteCache.clear();
	await emoteCache.save();

	const path = await join("cache", "emotes");
	if (await exists(path, { baseDir: BaseDirectory.AppData })) {
		await remove(path, {
			baseDir: BaseDirectory.AppData,
			recursive: true,
		});
	}

	settings.update((state) => {
		state.last_emote_check = 0;
		return state;
	});
}

// todo: delete file cache
export async function clearEmoteProviderCache(provider: EmoteProvider) {
	for (const [key, emote] of (await emoteCache.entries()) as [key: string, emote: Emote][]) {
		if (emote.provider == provider) {
			await emoteCache.delete(key);
		}
	}
	await emoteCache.save();
}

async function cacheEmote(id: string, token: string, provider: EmoteProvider, fileName: string, url: string, data?: any) {
	const cached = await emoteCache.get<Emote>(id);
	const now = Date.now();

	if (!cached || now >= cached.ts + cacheLifetime) {
		const emoteRes = await fetch(url);
		const emoteBytes = new Uint8Array(await emoteRes.arrayBuffer());

		const emotePath = await join("cache", "emotes", provider, fileName);

		await mkdir(await dirname(emotePath), { recursive: true, baseDir: BaseDirectory.AppData });
		await writeFile(emotePath, emoteBytes, { baseDir: BaseDirectory.AppData });

		await emoteCache.set(id, {
			id: id,
			token: token,
			provider: provider,
			path: await join(await appDataDir(), emotePath),
			ts: now,
			data: data,
		} as Emote);
	}
}

async function loadTwitchGlobalEmotes() {
	loading.label = "Getting list of Twitch emotes...";
	loading.showProgress = false;
	loading.showProgressText = false;

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

	loading.progress = 0;
	loading.max = emotes.length;
	loading.label = "Caching Twitch emotes...";
	loading.showProgress = true;
	loading.showProgressText = true;

	for await (const emote of emotes) {
		await cacheEmote(emote.id, emote.token, "twitch_global", `${emote.id}.gif`, `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/1.0`);

		loading.progress++;
	}
}

async function loadTwitchEmotes(channel: string) {
	loading.label = `Getting list of ${channel}'s Twitch emotes...`;
	loading.showProgress = false;
	loading.showProgressText = false;

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

	loading.progress = 0;
	loading.max = emotes.length;
	loading.label = `Caching ${channel}'s Twitch emotes...`;
	loading.showProgress = true;
	loading.showProgressText = true;

	for await (const emote of emotes) {
		await cacheEmote(emote.id, emote.token, "twitch", `${emote.id}.gif`, `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/1.0`, {
			channel: channel,
			tier: emote.subscriptionTier,
		});

		loading.progress++;
	}
}
