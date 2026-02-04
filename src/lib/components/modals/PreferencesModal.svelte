<script lang="ts">
	import { getCurrentWindow } from "@tauri-apps/api/window";
	import { relaunch } from "@tauri-apps/plugin-process";
	import Modal from "../Modal.svelte";
	import Setting from "../Setting.svelte";
	import { clearBadgeCache } from "../../stores/badges";
	import { getStore } from "@tauri-apps/plugin-store";
	import { settings } from "../../stores/settings";

	let { modal = $bindable() }: { modal: Modal } = $props();

	let alwaysOnTop: boolean = $state(true);
	let factoryResetTimer: number | undefined;

	function factoryReset() {
		if (!factoryResetTimer) {
			factoryResetTimer = setTimeout(async () => {
				$settings = {};
				await clearBadgeCache();

				location.reload();
				await relaunch();
			}, 1500);
		}
	}

	function onMouseUp() {
		if (factoryResetTimer) clearTimeout(factoryResetTimer);
	}

	$effect(() => {
		getCurrentWindow().setAlwaysOnTop(alwaysOnTop);
	});
</script>

<svelte:window onmouseup={onMouseUp} />

<Modal bind:this={modal} class="flex flex-col gap-2">
	<h1>Preferences</h1>
	<Setting label="Always On Top" key="always_on_top" bind:value={alwaysOnTop} noBorder>
		<input type="checkbox" bind:checked={alwaysOnTop} />
	</Setting>
	<Setting label="Emote Cache" noBorder>
		<button class="btn">Clear</button>
	</Setting>
	<Setting label="Badge Cache" noBorder>
		<button
			onclick={async () => {
				await clearBadgeCache();
				location.reload();
			}}
			class="btn">Clear</button
		>
	</Setting>
	<br />
	<Setting label="Factory Reset" noBorder>
		<button onmousedown={factoryReset} class="btn btn-danger">Reset</button>
	</Setting>
</Modal>
