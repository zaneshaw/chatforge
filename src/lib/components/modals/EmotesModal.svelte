<script lang="ts">
	import { onMount } from "svelte";
	import { loading } from "../../stores/loading.svelte";
	import { settings } from "../../stores/settings";
	import Modal from "../Modal.svelte";
	import Setting from "../Setting.svelte";
	import { twitchLoginExists } from "../../utils";
	import { pushToast } from "../../stores/toasts.svelte";

	let { modal = $bindable() }: { modal: Modal } = $props();

	let channelInput: HTMLInputElement;

	async function saveSettings() {
		const channel = channelInput.value.trim().toLowerCase();

		if (channel.length > 0) {
			if (await twitchLoginExists(channel)) {
				$settings.emotes.channel = channel;

				$settings.last_emote_check = 0;

				pushToast("info", "Channel set! Restart to load emotes");
				modal.close();
			} else {
				console.error("twitch login doesn't exist");
				pushToast("warning", "Twitch channel doesn't exist!");
			}
		} else {
			$settings.emotes.channel = undefined;

			pushToast("info", "Channel unset! You should restart ChatForge");
			modal.close();
		}
	}

	onMount(async () => {
		if ($settings.emotes == undefined) {
			$settings.emotes = {
				channel: undefined,
				twitch: true,
				ffz: false,
				bttv: false,
				"7tv": false,
			};
		}
	});
</script>

<Modal bind:this={modal} class="flex flex-col gap-2">
	<div>
		<h1>Emotes</h1>
		<p class="text-[11px] text-neutral-400">Configure which channel's emote sets are used.</p>
	</div>
	<Setting label="Channel" noBorder>
		<input bind:this={channelInput} type="text" placeholder="Unset" value={$settings.emotes?.channel} />
	</Setting>
	<button onclick={saveSettings} class="btn ml-auto">Apply</button>
</Modal>
