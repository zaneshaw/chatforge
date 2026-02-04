import { get, writable, type Writable } from "svelte/store";
import { load } from "@tauri-apps/plugin-store";
import { flatten, unflatten } from "flat";
import _ from "lodash";

const tauriStore = await load("store.json", { defaults: { settings: {} }, autoSave: true });

export const settings: Writable<{ [key: string]: any }> = writable(await tauriStore.get("settings"));

settings.subscribe(async (value: any) => {
	await tauriStore.set("settings", value);
});

export function getFlattenedSetting(flattenedKey: string) {
	const flattened = flatten(get(settings)) as any;
	if (flattenedKey in flattened) {
		return flattened[flattenedKey];
	}
}

export function setFlattenedSetting(flattenedKey: string, value: any) {
	settings.update((state) =>
		_.merge(
			state,
			unflatten({
				[flattenedKey]: value,
			}),
		),
	);
}
