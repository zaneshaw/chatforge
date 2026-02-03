import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";
import { loadBadges } from "./lib/stores/badges";
import { loading } from "./lib/stores/loading.svelte";
import { loadEmotes } from "./lib/stores/emotes";

const app = mount(App, {
	target: document.body,
});

await loadBadges();
await loadEmotes();
loading.state = false;

export default app;
