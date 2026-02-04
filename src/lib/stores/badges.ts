import { writeFile, mkdir, BaseDirectory } from "@tauri-apps/plugin-fs";
import { join, dirname, appCacheDir } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/core";
import { load } from "@tauri-apps/plugin-store";
import { loading } from "./loading.svelte";

import { fetch } from "@tauri-apps/plugin-http";
import { parse } from "node-html-parser";

export type Badge = {
	id: string;
	name: string;
	provider: "twitch" | "ffz" | "bttv" | "7tv";
	path: string;
	ts: number;
};

const checkBadges = false; // temp
const cacheLifetime = 24 * 60 * 60 * 1000;

const badgeCacheStore = await load("badge_cache.json", {
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
	badges.push(...(await loadTwitchBadges()));

	loading.progress = 1;
	loading.max = 1;
	loading.label = "Finished Loading"
	loading.showProgress = false;

	await new Promise(r => setTimeout(r, 500));

	loading.state = false;
}

// todo: concurrency
async function loadTwitchBadges(): Promise<Badge[]> {
	if (checkBadges) {
		loading.label = "Getting list of Twitch badges...";

		const res = await fetch("https://www.streamdatabase.com/twitch/global-badges?sort_by=set_id&sort_direction=ascending", {
			method: "GET",
		});
		const root = parse(await res.text());

		const column = root.querySelector("div.grow.flex.m-auto.w-full > div.flex.flex-col");
		const badgeContainers = column?.querySelectorAll("a.relative.bg-neutral-900.rounded.font-bold.uppercase");
		if (badgeContainers) {
			loading.progress = 0;
			loading.max = badgeContainers.length;
			loading.label = "Caching Twitch badges...";
			loading.showProgress = true;

			const appCache = await appCacheDir();

			for await (const [i, badgeContainer] of badgeContainers.entries()) {
				const imageElement = badgeContainer.querySelector("img");
				if (imageElement) {
					const src = imageElement.getAttribute("src");
					if (src) {
						const badgeId = src.split("/").at(-2) as string;
						const badgeCache = await badgeCacheStore.get<Badge>(badgeId);
						const now = Date.now();

						if (!badgeCache || now >= badgeCache.ts + cacheLifetime) {
							const badgeRes = await fetch(src);
							const badgeBytes = new Uint8Array(await badgeRes.arrayBuffer());
							const badgePath = await join("cache", "badges", "twitch", `${badgeId}.png`);

							await mkdir(await dirname(badgePath), { recursive: true, baseDir: BaseDirectory.AppCache });
							await writeFile(badgePath, badgeBytes, { baseDir: BaseDirectory.AppCache });

							await badgeCacheStore.set(badgeId, {
								id: badgeId,
								name: "aga",
								provider: "twitch",
								path: await join(appCache, badgePath),
								ts: now,
							} as Badge);
						}
					}
				}

				loading.progress++;
			}
		}
	}

	return await badgeCacheStore.values();
}
