import { flatten, unflatten } from "flat";
import { writable, type Writable } from "svelte/store";

export const settingsStorage: Writable<{ [key: string]: any }> = writable(getSettingsFromStorage());

function getSettingsFromStorage() {
	const storage = localStorage.getItem("settings");

	if (storage) {
		return flatten(JSON.parse(storage)) as any;
	}

	localStorage.setItem("settings", "{}");
	return {};
}

settingsStorage.subscribe((value: any) => {
	localStorage.setItem("settings", JSON.stringify(unflatten(value)));
});
