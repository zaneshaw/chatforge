import { writeFile, mkdir, remove, BaseDirectory, exists } from "@tauri-apps/plugin-fs";
import { join, dirname, appDataDir } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/core";
import { load } from "@tauri-apps/plugin-store";
import { fetch } from "@tauri-apps/plugin-http";
import { loading } from "./loading.svelte";
import { settings } from "./settings";
import { get } from "svelte/store";

export type Badge = {
	id: string;
	name: string;
	provider: "twitch" | "ffz" | "bttv" | "7tv";
	path: string;
	ts: number;
	data?: any;
};

const checkCacheInterval = 24 * 60 * 60 * 1000; // check cache after 24 hours
const cacheLifetime = 28 * 24 * 60 * 60 * 1000; // expire after 28 days

const badgeCache = await load("badge_cache.json", {
	defaults: {} as {
		[id: string]: Badge;
	},
	autoSave: 5000,
});

export const badges: Badge[] = [];

export function getBadge(id: string) {
	const badge = badges.find((badge) => badge.id == id);

	return badge;
}

export function getBadgeUrl(id: string, quality: number) {
	const badge = getBadge(id);

	if (badge) {
		return convertFileSrc(badge.path);
	} else {
		return "/fallback-badge.png";
	}
}

export async function loadBadges() {
	const lastBadgeCheck = get(settings).last_badge_check;
	const now = Date.now();

	if (!lastBadgeCheck || now >= lastBadgeCheck + checkCacheInterval) {
		await loadTwitchBadges();
		await loadFFZBadges();
		await loadBTTVBadges();
		await load7TVBadges();

		settings.update((state) => {
			state.last_badge_check = now;
			return state;
		});

		loading.progress = 1;
		loading.max = 1;
		loading.label = "Done!";
		loading.showProgressText = false;
	}

	const cached = (await badgeCache.values()) as Badge[];
	badges.push(...cached);
}

export async function clearBadgeCache() {
	await badgeCache.clear();
	await badgeCache.save();

	const path = await join("cache", "badges");
	if (await exists(path, { baseDir: BaseDirectory.AppData })) {
		await remove(path, {
			baseDir: BaseDirectory.AppData,
			recursive: true,
		});
	}

	settings.update((state) => {
		state.last_badge_check = 0;
		return state;
	});
}

async function tryWriteToCache(id: string, name: string, provider: string, url: string, data?: any) {
	const cached = await badgeCache.get<Badge>(id);
	const now = Date.now();

	if (!cached || now >= cached.ts + cacheLifetime) {
		const badgeRes = await fetch(url);
		const badgeBytes = new Uint8Array(await badgeRes.arrayBuffer());

		// todo: better image type detection
		let fileExtension = url.split(".").at(-1) || "png";
		if (fileExtension.length > 4) fileExtension = "png";

		const badgePath = await join("cache", "badges", provider, `${id}.${fileExtension}`);

		await mkdir(await dirname(badgePath), { recursive: true, baseDir: BaseDirectory.AppData });
		await writeFile(badgePath, badgeBytes, { baseDir: BaseDirectory.AppData });

		await badgeCache.set(id, {
			id: id,
			name: name,
			provider: provider,
			path: await join(await appDataDir(), badgePath),
			ts: now,
			data: data,
		} as Badge);
	}
}

// todo: concurrency
async function loadTwitchBadges() {
	loading.label = "Getting list of Twitch badges...";
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
				query GlobalBadges {
					badges {
						setID
						title
						imageURL
					}
				}
			`,
		}),
	});
	const data = await res.json();
	const badges = data.data.badges;

	loading.progress = 0;
	loading.max = badges.length;
	loading.label = "Caching Twitch badges...";
	loading.showProgress = true;
	loading.showProgressText = true;

	for await (const badge of badges) {
		await tryWriteToCache(`twitch_${badge.imageURL.split("/").at(-2)}`, badge.title, "twitch", `${badge.imageURL.slice(0, -1)}3`);

		loading.progress++;
	}
}

async function loadFFZBadges() {
	loading.label = "Getting list of FFZ badges...";
	loading.showProgress = false;
	loading.showProgressText = false;

	const res = await fetch("https://api.frankerfacez.com/v1/_badges", { method: "GET" });
	const data = await res.json();

	loading.progress = 0;
	loading.max = data.badges.length;
	loading.label = "Caching FFZ badges...";
	loading.showProgress = true;
	loading.showProgressText = true;

	for await (const badge of data.badges) {
		await tryWriteToCache(`ffz_${badge.id}`, badge.title, "ffz", Object.values(badge.urls).at(-1) as string, { colour: badge.color });

		loading.progress++;
	}
}

async function loadBTTVBadges() {
	loading.label = "Getting list of BTTV badges...";
	loading.showProgress = false;
	loading.showProgressText = false;

	const res = await fetch("https://api.betterttv.net/3/cached/badges/twitch", { method: "GET" });
	const users = await res.json();

	const badgesStringified = new Set(users.map((user: any) => JSON.stringify(user.badge)));
	const badges = Array.from(badgesStringified).map((x: any) => JSON.parse(x));
	const badgesSorted = badges.sort((a, b) => a.type - b.type);

	loading.progress = 0;
	loading.max = badgesSorted.length;
	loading.label = "Caching BTTV badges...";
	loading.showProgress = true;
	loading.showProgressText = true;

	for await (const badge of badgesSorted) {
		await tryWriteToCache(`bttv_${badge.type}`, badge.description, "bttv", badge.svg);

		loading.progress++;
	}
}

async function load7TVBadges() {
	loading.label = "Getting list of 7TV badges...";
	loading.showProgress = false;
	loading.showProgressText = false;

	const res = await fetch("https://7tv.io/v3/gql", {
		method: "POST",
		body: JSON.stringify({
			query: `
				query Cosmetics {
					cosmetics {
						badges {
							id
							tooltip
							host {
								url
							}
						}
					}
				}
			`,
		}),
	});
	const data = await res.json();
	const badges = data.data.cosmetics.badges;

	loading.progress = 0;
	loading.max = badges.length;
	loading.label = "Caching 7TV badges...";
	loading.showProgress = true;
	loading.showProgressText = true;

	for await (const badge of badges) {
		await tryWriteToCache(`7tv_${badge.id}`, badge.tooltip, "7tv", `https://${badge.host.url}/4x.webp`);

		loading.progress++;
	}
}
