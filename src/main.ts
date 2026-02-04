import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";
import { loadBadges } from "./lib/stores/badges";
import { loading } from "./lib/stores/loading.svelte";
import { loadEmotes } from "./lib/stores/emotes";
import { get } from "svelte/store";
import { settings } from "./lib/stores/settings";

const app = mount(App, {
	target: document.body,
});

await loadBadges();
await loadEmotes();
loading.state = false;

console.log(get(settings))

export default app;
