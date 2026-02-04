<script lang="ts">
	import { allEmotes, getEmoteUrl, type Emote } from "../../stores/emotes";
	import { pushToast } from "../../stores/toasts.svelte";
	import { writeText } from "@tauri-apps/plugin-clipboard-manager";
	import Modal from "../Modal.svelte";
	import { settings } from "../../stores/settings";

	let { modal = $bindable() }: { modal: Modal } = $props();

	let searchValue: string = $state("");

	function copyEmoteToken(emote: Emote) {
		writeText(emote.token);
		pushToast("info", `"${emote.token}" copied to clipboard!`);

		modal.close();
	}
</script>

{#snippet emoteButton(emote: Emote)}
	{#if emote}
		<button onclick={() => copyEmoteToken(emote)} title={emote.token} class="flex size-7 cursor-pointer items-center justify-center rounded-xs p-0.5 outline-zinc-700 hover:outline-1">
			<img src={getEmoteUrl(emote.id)} alt={emote.token} style="display: inline-block;" />
		</button>
	{/if}
{/snippet}

<Modal
	bind:this={modal}
	afterOpen={() => {
		searchValue = "";
	}}
	class="flex h-full flex-col gap-2"
>
	<div>
		<h1>Emote Palette (temporary)</h1>
		<p class="text-[11px] text-neutral-400">Click an emote to copy to clipboard.</p>
	</div>
	<input type="text" placeholder="Search" bind:value={searchValue} />
	{#if searchValue}
		<div class="flex flex-wrap gap-0.5">
			{#each allEmotes.filter((emote) => emote.token.toLowerCase().replace(/\s/g, "").includes(searchValue.replace(/\s/g, ""))) as emote}
				{@render emoteButton(emote)}
			{/each}
		</div>
	{:else}
		{#if $settings.emotes.channel}
			<div>
				<h2>{$settings.emotes.channel}'s Twitch Emotes</h2>
				<div class="flex flex-wrap gap-0.5">
					{#each allEmotes.filter((emote) => emote.provider == "twitch") as emote}
						{@render emoteButton(emote)}
					{/each}
				</div>
			</div>
		{/if}
		<div>
			<h2>Global Twitch Emotes</h2>
			<div class="flex flex-wrap gap-0.5">
				{#each allEmotes.filter((emote) => emote.provider == "twitch_global") as emote}
					{@render emoteButton(emote)}
				{/each}
			</div>
		</div>
	{/if}
</Modal>
