import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";
import { loadBadges } from "./lib/stores/badges";

const app = mount(App, {
	target: document.body,
});

loadBadges();

export default app;
