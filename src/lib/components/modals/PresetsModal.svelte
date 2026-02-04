<script lang="ts">
	import { onMount } from "svelte";
	import { PlusIcon, TrashIcon, XIcon } from "@lucide/svelte";
	import { settings } from "../../stores/settings";
	import Modal from "../Modal.svelte";
	import { getBadge, getBadgeUrl } from "../../stores/badges";

	type Preset = {
		username: {
			colour: string;
			text: string;
		};
		messageColour: string;
		badgeIds: string[];
	};

	let { modal = $bindable() }: { modal: Modal } = $props();

	onMount(() => {
		if ($settings?.presets == undefined) {
			$settings.presets = [
				{
					username: {
						colour: "#5e8b69",
						text: "Liam",
					},
					messageColour: "#ffffff",
					badgeIds: ["5527c58c-fb7d-422d-b71b-f309dcb85cc1", "01998862-3032-4f9c-bc81-fd78b0c35763", "d12a2e27-16f6-41d0-ab77-b780518f00a3"],
				},
			];
		}
	});

	function addPreset() {
		const currentSettings = $settings;

		($settings.presets as Preset[]).push({
			username: {
				colour: currentSettings.username.colour,
				text: currentSettings.username.text,
			},
			messageColour: currentSettings.message.colour,
			badgeIds: currentSettings.badges,
		});

		$settings.presets = $settings.presets;
	}

	function loadPreset(preset: Preset) {
		$settings.username = preset.username;
		$settings.message.colour = preset.messageColour;
		$settings.badges = preset.badgeIds;
		location.reload(); // scuffed
	}

	function deletePreset(index: number) {
		$settings.presets.splice(index, 1);
		$settings.presets = $settings.presets;
	}
</script>

<Modal bind:this={modal} class="flex flex-col gap-2">
	<h1>User Presets</h1>
	<button
		onclick={() => addPreset()}
		class="hover:text-twitch-text flex cursor-pointer items-center justify-around rounded-xs p-2 text-zinc-500 outline-1 outline-zinc-700 outline-dashed hover:outline-zinc-500"
	>
		<PlusIcon class="h-4 stroke-3" />
		New preset with current settings
		<PlusIcon class="h-4 stroke-3" />
	</button>
	<div class="flex flex-col-reverse gap-2">
		{#each $settings.presets as Preset[] as preset, i}
			<div class="flex">
				<button onclick={() => loadPreset(preset)} class="group relative flex grow cursor-pointer items-center overflow-hidden rounded-l-xs p-2 outline-1 outline-zinc-700">
					<div class="mx-auto flex items-center gap-0.75 text-sm">
						{#each preset.badgeIds as badgeId}
							{@const badge = getBadge(badgeId)}
							{#if badge}
								<img class="w-4.5" src={getBadgeUrl(badge.id, 1)} alt={badge.name} />
							{/if}
						{/each}
						<div class="flex">
							<span class="truncate font-bold" style="color: {preset.username.colour}">{preset.username.text}</span>
							<span>:</span>
						</div>
						<span style="color: {preset.messageColour};">message</span>
					</div>
					<span class="absolute left-0 flex size-full items-center justify-center bg-black/75 not-group-hover:hidden">Load preset</span>
				</button>
				<button onclick={() => deletePreset(i)} class="btn group/delete ml-px rounded-l-none!">
					<XIcon class="size-4 stroke-zinc-700 group-hover/delete:stroke-white group-active/delete:stroke-white" />
				</button>
			</div>
		{/each}
	</div>
</Modal>
