import { flatten, unflatten } from "flat";
import { writable, type Writable } from "svelte/store";

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
