import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";
import { loadBadges } from "./lib/stores/badges";
import { fetch } from "@tauri-apps/plugin-http";

const app = mount(App, {
	target: document.body,
});

await loadBadges();

export default app;
