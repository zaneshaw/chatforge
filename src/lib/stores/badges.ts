import { writeFile, mkdir, BaseDirectory } from "@tauri-apps/plugin-fs";
import { join, dirname, appCacheDir } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/core";
import { load } from "@tauri-apps/plugin-store";
import { fetch } from "@tauri-apps/plugin-http";
import { parse } from "node-html-parser";
import { loading } from "./loading.svelte";
import { settings } from "./settings";
import { get } from "svelte/store";

export type Badge = {
	id: string;
	name: string;
	provider: "twitch" | "ffz" | "bttv" | "7tv";
	path: string;
	ts: number;
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

	return badge ?? badges.find((badge) => badge.id == "18b92728-aa7a-4e24-acb5-b14ea17c8b2b"); // todo: better fallback
}

export function getBadgeUrl(id: string, quality: number) {
	const badge = getBadge(id);

	if (badge) {
		return convertFileSrc(badge.path);
	}

	return `https://static-cdn.jtvnw.net/badges/v1/18b92728-aa7a-4e24-acb5-b14ea17c8b2b/1`; // todo: better fallback
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

	await new Promise((r) => setTimeout(r, 500));

	loading.state = false;
}

export function clearBadgeCache() {
	badgeCache.clear();
	badgeCache.save();

	settings.update((state) => {
		state.last_badge_check = 0;
		return state;
	});

	location.reload();
}

async function tryWriteToCache(id: string, name: string, provider: string, url: string) {
	const cached = await badgeCache.get<Badge>(id);
	const now = Date.now();

	if (!cached || now >= cached.ts + cacheLifetime) {
		const badgeRes = await fetch(url);
		const badgeBytes = new Uint8Array(await badgeRes.arrayBuffer());

		// todo: better image type detection
		let fileExtension = url.split(".").at(-1) || "png";
		if (fileExtension.length > 4) fileExtension = "png";

		const badgePath = await join("cache", "badges", provider, `${id}.${fileExtension}`);

		await mkdir(await dirname(badgePath), { recursive: true, baseDir: BaseDirectory.AppCache });
		await writeFile(badgePath, badgeBytes, { baseDir: BaseDirectory.AppCache });

		await badgeCache.set(id, {
			id: id,
			name: name,
			provider: provider,
			path: await join(await appCacheDir(), badgePath),
			ts: now,
		} as Badge);
	}
}

// todo: concurrency
async function loadTwitchBadges() {
	loading.label = "Getting list of Twitch badges...";

	const res = await fetch("https://www.streamdatabase.com/twitch/global-badges?sort_by=set_id&sort_direction=ascending", { method: "GET" });
	const root = parse(await res.text());

	const column = root.querySelector("div.grow.flex.m-auto.w-full > div.flex.flex-col");
	const badgeContainers = column?.querySelectorAll("a.relative.bg-neutral-900.rounded.font-bold.uppercase");
	if (badgeContainers) {
		loading.progress = 0;
		loading.max = badgeContainers.length;
		loading.label = "Caching Twitch badges...";
		loading.showProgressText = true;

		for await (const badgeContainer of badgeContainers) {
			const imageElement = badgeContainer.querySelector("img");
			if (imageElement) {
				const src = imageElement.getAttribute("src");
				if (src) {
					const badgeId = src.split("/").at(-2) as string;

					await tryWriteToCache(badgeId, "aga", "twitch", src);
				}
			}

			loading.progress++;
		}
	}
}

async function loadFFZBadges() {
	loading.label = "Getting list of FFZ badges...";

	const res = await fetch("https://api.frankerfacez.com/v1/_badges", { method: "GET" });
	const data = await res.json();

	loading.progress = 0;
	loading.max = data.badges.length;
	loading.label = "Caching FFZ badges...";
	loading.showProgressText = true;

	for await (const badge of data.badges) {
		await tryWriteToCache(`ffz_${badge.id}`, badge.title, "ffz", Object.values(badge.urls).at(-1) as string);

		loading.progress++;
	}
}

async function loadBTTVBadges() {
	loading.label = "Getting list of BTTV badges...";

	const res = await fetch("https://api.betterttv.net/3/cached/badges/twitch", { method: "GET" });
	const users = await res.json();

	const badgesStringified = new Set(users.map((user: any) => JSON.stringify(user.badge)));
	const badges = Array.from(badgesStringified).map((x: any) => JSON.parse(x));
	const badgesSorted = badges.sort((a, b) => a.type - b.type);

	loading.progress = 0;
	loading.max = badgesSorted.length;
	loading.label = "Caching BTTV badges...";
	loading.showProgressText = true;

	for await (const badge of badgesSorted) {
		await tryWriteToCache(`bttv_${badge.type}`, badge.description, "bttv", badge.svg);

		loading.progress++;
	}
}

async function load7TVBadges() {
	loading.label = "Getting list of 7TV badges...";

	const res = await fetch("https://7tv.io/v3/gql", {
		method: "POST",
		body: JSON.stringify({
			query: "query Cosmetics { cosmetics { badges { id tooltip host { url } } } }",
		}),
	});
	const data = await res.json();
	const badges = data.data.cosmetics.badges;

	loading.progress = 0;
	loading.max = badges.length;
	loading.label = "Caching 7TV badges...";
	loading.showProgressText = true;

	for await (const badge of badges) {
		await tryWriteToCache(`7tv_${badge.id}`, badge.tooltip, "7tv", `https://${badge.host.url}/4x.webp`);

		loading.progress++;
	}
}
