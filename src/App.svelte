<script lang="ts">
	import { SettingsIcon, SmileIcon } from "@lucide/svelte";
	import { fade } from "svelte/transition";
	import { settings } from "./lib/stores/settings";
	import { loading } from "./lib/stores/loading.svelte";
	import Modal from "./lib/components/Modal.svelte";
	import Setting from "./lib/components/Setting.svelte";
	import SettingsGroup from "./lib/components/SettingsGroup.svelte";
	import SettingsRow from "./lib/components/SettingsRow.svelte";
	import RadioButton from "./lib/components/RadioButton.svelte";
	import MessagePreview from "./lib/components/MessagePreview.svelte";
	import ExportModal from "./lib/components/modals/ExportModal.svelte";
	import PreferencesModal from "./lib/components/modals/PreferencesModal.svelte";
	import PresetsModal from "./lib/components/modals/PresetsModal.svelte";
	import EmotesModal from "./lib/components/modals/EmotesModal.svelte";
	import ToastNotification from "./lib/components/ToastNotification.svelte";
	import { dismissAllToasts, pushToast, toasts } from "./lib/stores/toasts.svelte";
	import { onMount } from "svelte";
	import EmotePaletteModal from "./lib/components/modals/EmotePaletteModal.svelte";

	// svelte-ignore non_reactive_update
	let preferencesModal: Modal;
	// svelte-ignore non_reactive_update
	let presetsModal: Modal;
	// svelte-ignore non_reactive_update
	let emotesModal: Modal;
	// svelte-ignore non_reactive_update
	let emotePaletteModal: Modal;
	// svelte-ignore non_reactive_update
	let exportModal: Modal;
	// svelte-ignore non_reactive_update
	let messagePreview: MessagePreview;

	let usernameColourValue: string = $state("#ffffff");
	let messageColourValue: string = $state("#ffffff");
	let backgroundColourValue: string = $state("#18181b");
	let backgroundOpacityValue: number = $state(1);
	let fontFamilyValue: string = $state("Inter");
	let fontBoldValue: boolean = $state(false);
	let messageTypeValue: string = $state("default");
	let maxWidthValue: string = $state("twitch");
	let customMaxWidthValue: number = $state(340);

	let backgroundPreviewValue: boolean = $state(true);

	onMount(() => {
		dismissAllToasts();
	});
</script>

{#if loading.state}
	<div transition:fade={{ duration: 250 }} class="bg-twitch-background fixed top-0 left-0 z-999 flex size-full items-center justify-center">
		<div class="flex flex-col items-center gap-2">
			<span>
				{loading.label}
				{#if loading.showProgressText}
					<span class="text-zinc-400">({loading.progress} / {loading.max})</span>
				{/if}
			</span>
			<div class="h-0.5 w-40">
				{#if loading.showProgress}
					<div class="size-full bg-zinc-800">
						<div class="bg-twitch-text h-full transition-[width] duration-50" style="width: {Math.max(0, Math.min(loading.progress / loading.max, 1)) * 100}%"></div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{:else}
	<main class="flex h-full grow flex-col justify-between">
		<div class="flex flex-col gap-2">
			<div class="between flex">
				<div class="grow basis-0">
					<button onclick={() => presetsModal.open()} class="btn">User Presets</button>
				</div>
				<div class="flex gap-2">
					<img src="/garf.png" alt="" class="h-5" />
					<h1>ChatForge</h1>
					<img src="/garf.png" alt="" class="h-5" />
				</div>
				<div class="flex grow basis-0 justify-end">
					<button class="group cursor-pointer" onclick={() => preferencesModal.open()}>
						<SettingsIcon class="group-hover:stroke-twitch-text size-5 stroke-zinc-400" />
					</button>
				</div>
			</div>
			<SettingsRow>
				<Setting label="Name Colour" key="username.colour" bind:value={usernameColourValue}>
					<input type="color" bind:value={usernameColourValue} class="w-9" />
				</Setting>
				<Setting label="Message Colour" key="message.colour" bind:value={messageColourValue}>
					<input type="color" bind:value={messageColourValue} class="w-9" />
				</Setting>
			</SettingsRow>
			<Setting label="Emotes">
				<button onclick={() => emotesModal.open()} class="btn">Configure Emotes</button>
			</Setting>
			<SettingsRow>
				<SettingsGroup label="Background">
					<Setting label="Colour" key="background.colour" bind:value={backgroundColourValue} noBorder>
						<input type="color" bind:value={backgroundColourValue} class="w-9" />
					</Setting>
					<Setting label="Opacity" key="background.opacity" bind:value={backgroundOpacityValue} noBorder>
						<input type="number" bind:value={backgroundOpacityValue} min="0" max="1" step="0.1" class="w-9" />
					</Setting>
				</SettingsGroup>
				<SettingsGroup label="Font" help="System fonts will be added soon">
					<Setting label="Family" key="font.family" bind:value={fontFamilyValue} noBorder>
						<div class="ml-auto flex">
							<RadioButton bind:selected={fontFamilyValue} name="Inter" first>Inter</RadioButton>
							<RadioButton bind:selected={fontFamilyValue} name="MADE" last>MADE</RadioButton>
						</div>
					</Setting>
					<Setting label="Bold" key="font.bold" bind:value={fontBoldValue} noBorder>
						<input type="checkbox" bind:checked={fontBoldValue} disabled />
					</Setting>
				</SettingsGroup>
			</SettingsRow>
			<Setting label="Message Type" key="message_type" bind:value={messageTypeValue}>
				<div class="ml-auto flex">
					<RadioButton bind:selected={messageTypeValue} name="default" first>Default</RadioButton>
					<RadioButton bind:selected={messageTypeValue} name="first">First</RadioButton>
					<RadioButton bind:selected={messageTypeValue} name="deleted" last>Deleted</RadioButton>
				</div>
			</Setting>
			<Setting label="Maximum Width" key="max_width" bind:value={maxWidthValue}>
				<div class="ml-auto flex">
					<RadioButton bind:selected={maxWidthValue} name="off" first>Off</RadioButton>
					<RadioButton bind:selected={maxWidthValue} name="twitch">Twitch</RadioButton>
					<RadioButton bind:selected={maxWidthValue} name="custom" last>
						{#if $settings?.max_width == "custom"}
							<Setting label="" key="custom_max_width" bind:value={customMaxWidthValue} minimal>
								<input type="number" min="10" max="999" step="10" bind:value={customMaxWidthValue} class="-mx-2 -my-1 w-12 px-1 outline-0!" />
							</Setting>
						{:else}
							Custom
						{/if}
					</RadioButton>
				</div>
			</Setting>
		</div>
		<hr />
		<div class="flex flex-col gap-2">
			<div class="box relative h-62.5 w-full overflow-hidden">
				<label class="btn absolute top-0 right-0 z-20 flex items-center gap-1.5 rounded-none! rounded-bl-xs! outline-zinc-800!">
					<input type="checkbox" bind:checked={backgroundPreviewValue} />
					Background Preview
				</label>
				<MessagePreview bind:this={messagePreview} backgroundPreview={backgroundPreviewValue} />
				<button class="absolute right-2 bottom-2">
					<SmileIcon onclick={() => emotePaletteModal.open()} class="hover:stroke-twitch-text size-5 cursor-pointer stroke-neutral-700" />
				</button>
			</div>
			<button onclick={() => exportModal.open()} class="btn ml-auto">Export...</button>
		</div>
	</main>

	<div class="fixed bottom-2 left-2 z-999 flex w-0 flex-col gap-1">
		{#each toasts as toast (toast.id)}
			<ToastNotification {toast} />
		{/each}
	</div>

	<PreferencesModal bind:modal={preferencesModal} />
	<PresetsModal bind:modal={presetsModal} />
	<EmotesModal bind:modal={emotesModal} />
	<EmotePaletteModal bind:modal={emotePaletteModal} />
	<ExportModal bind:modal={exportModal} preview={messagePreview} />
{/if}
