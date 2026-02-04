import { get, writable, type Writable } from "svelte/store";
import { flatten, unflatten } from "flat";
import _ from "lodash";

export const settings: Writable<{ [key: string]: any }> = writable(getSettingsFromStorage());

function getSettingsFromStorage() {
	const storage = localStorage.getItem("settings");

	if (storage) {
		return JSON.parse(storage);
	}

	localStorage.setItem("settings", "{}");
	return {};
}

settings.subscribe((value: any) => {
	localStorage.setItem("settings", JSON.stringify(value));
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
