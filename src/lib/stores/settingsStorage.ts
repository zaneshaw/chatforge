import { writable, type Writable } from "svelte/store";

export const settingsStorage: Writable<{ [key: string]: any }> = writable(getSettingsFromStorage());

function getSettingsFromStorage() {
	const storage = localStorage.getItem("settings");

	if (storage) {
		return JSON.parse(storage);
	}

	localStorage.setItem("settings", "{}");
	return {};
}

settingsStorage.subscribe((value: any) => {
	localStorage.setItem("settings", JSON.stringify(value));
});
