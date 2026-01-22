<script lang="ts">
	import { snapdom } from "@zumer/snapdom";
	import { join } from "@tauri-apps/api/path";
	import { writeFile } from "@tauri-apps/plugin-fs";
	import { writeImage } from "@tauri-apps/plugin-clipboard-manager";
	import { Image } from "@tauri-apps/api/image";
	import { settings } from "../stores/settings";
	import { revealItemInDir } from "@tauri-apps/plugin-opener";
	import Modal from "./Modal.svelte";
	import Setting from "./Setting.svelte";
	import BadgeModal from "./modals/BadgeModal.svelte";
	import { PlusIcon, XIcon } from "@lucide/svelte";
	import { onMount } from "svelte";
	import { getBadgeUrl } from "../stores/badges";

	type Props = {
		backgroundPreview: boolean;
	};

	const USERNAME_PLACEHOLDER = "username";
	const MESSAGE_PLACEHOLDER = "click to edit";

	let { backgroundPreview }: Props = $props();

	let usernameValue = $state(USERNAME_PLACEHOLDER);
	let messageValue = $state(MESSAGE_PLACEHOLDER);

	// svelte-ignore non_reactive_update
	let previewElement: HTMLElement;
	// svelte-ignore non_reactive_update
	let messageElement: HTMLElement;
	// svelte-ignore non_reactive_update
	let badgeModal: Modal;

	let backgroundColourHex = $derived(
		`${$settings?.background?.colour}${Math.floor($settings?.background?.opacity * 255)
			.toString(16)
			.padStart(2, "0")}`,
	);

	let maxWidth: number | undefined = $derived.by(() => {
		switch ($settings.max_width) {
			case "twitch":
				return 340;
			case "custom":
				return $settings.custom_max_width;
			default:
				return undefined;
		}
	});

	onMount(() => {
		if ($settings.badges == undefined) {
			$settings.badges = ["3267646d-33f0-4b17-b3df-f923a41db1d0", "18b92728-aa7a-4e24-acb5-b14ea17c8b2b"];
		}
	});

	export async function exportMessage() {
		if ($settings?.export?.output_directory) {
			const path = await join($settings.export.output_directory, `chatforge-${Date.now()}.png`);

			messageElement.appendChild(previewElement.cloneNode(true));
			if ($settings.export.resolution == "custom") {
				messageElement.style.width = `${$settings.export.custom_resolution.width}px`;
				messageElement.style.height = `${$settings.export.custom_resolution.height}px`;
			}

			const result = await snapdom.toBlob(messageElement, {
				type: "png",
				embedFonts: true,
				scale: $settings.export.scale,
			});

			messageElement.innerHTML = "";
			messageElement.style.removeProperty("width");
			messageElement.style.removeProperty("height");

			const bytes = new Uint8Array(await result.arrayBuffer());
			const image = await Image.fromBytes(bytes);

			await writeFile(path, bytes);

			if ($settings.export.copy_to_clipboard) {
				await writeImage(image);
			}

			if ($settings.export.open_directory) {
				await revealItemInDir(path);
			}
		}
	}
</script>

<div class="relative size-full">
	{#if backgroundPreview}
		<div class="pointer-events-none absolute top-0 left-0 size-full bg-[url(/transparent.png)] bg-size-[10%] bg-center [image-rendering:pixelated]"></div>
	{/if}
	<div class="group absolute top-0 left-0 flex size-full items-center justify-center overflow-auto text-sm" style="background-color: {backgroundPreview ? backgroundColourHex : 'unset'};">
		{#await document.fonts.ready}
			<span class="text-zinc-600">loading font...</span>
		{:then}
			<div bind:this={previewElement} class="z-10 px-4 py-1 leading-5.5" style="max-width: {maxWidth ? `${maxWidth}px` : 'unset'}; min-width: {maxWidth ? 'unset' : 'max-content'};">
				<span class="*:mr-0.75 *:mb-0.5 *:inline-flex *:size-4.5 *:align-middle">
					{#each $settings?.badges as badgeId, i}
						<button
							onclick={() => {
								$settings.badges.splice(i, 1);
								$settings.badges = $settings.badges;
							}}
							class="group/badge cursor-pointer items-center justify-center overflow-hidden"
							style="background-image: url({getBadgeUrl(badgeId, 1)});"
						>
							<div class="size-full bg-black/50 not-group-hover/badge:hidden"></div>
							<XIcon class="absolute stroke-white stroke-3 p-1.25 not-group-hover/badge:hidden" />
						</button>
					{/each}<button
						onclick={() => badgeModal.open()}
						class="cursor-pointer items-center justify-center overflow-hidden rounded-xs border-2 border-dashed border-zinc-600 transition-[margin,width,opacity] not-group-hover:-mr-1! not-group-hover:w-0 not-group-hover:opacity-0 hover:brightness-125"
					>
						<PlusIcon class="stroke-zinc-600 stroke-3" />
					</button>
				</span><Setting label="" key="username.text" bind:value={usernameValue} minimal>
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<span
						bind:innerText={usernameValue}
						contenteditable="true"
						onfocus={(e) => window.getSelection()?.selectAllChildren(e.target as HTMLInputElement)}
						onkeydown={(e) => {
							if (e.key == "Enter" || e.key == " ") e.preventDefault();
						}}
						onblur={() => {
							usernameValue = usernameValue.trim().replace(/\n|\s/g, "");
							if (usernameValue.length == 0) usernameValue = USERNAME_PLACEHOLDER;
							window.getSelection()?.empty();
						}}
						spellcheck="false"
						class="editable font-bold break-all"
						style="color: {$settings?.username?.colour};"
					></span>
				</Setting><span>:</span>
				<span class="wrap-break-word">
					<Setting label="" key="message.text" bind:value={messageValue} minimal>
						<span
							bind:innerText={messageValue}
							contenteditable="true"
							onfocus={(e) => window.getSelection()?.selectAllChildren(e.target as HTMLInputElement)}
							onblur={() => {
								messageValue = messageValue
									.trim()
									.replace(/\n\s*\n/g, "\n")
									.replace(/\s\s*\s/g, " ");
								if (messageValue.length == 0) messageValue = MESSAGE_PLACEHOLDER;
								window.getSelection()?.empty();
							}}
							spellcheck="false"
							class="editable"
							style="color: {$settings?.message?.colour};"
						></span>
					</Setting>
				</span>
			</div>
		{/await}
	</div>
</div>

<div bind:this={messageElement} class="pointer-events-none fixed top-full left-full -z-100 flex w-max items-center justify-center text-sm" style="background-color: {backgroundColourHex};"></div>

<BadgeModal bind:modal={badgeModal} />
