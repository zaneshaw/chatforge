<script lang="ts">
	import { getCurrentWindow } from "@tauri-apps/api/window";
	import { SettingsIcon } from "@lucide/svelte";
	import { settings } from "./lib/stores/settings";
	import Modal from "./lib/components/Modal.svelte";
	import Setting from "./lib/components/Setting.svelte";
	import SettingsGroup from "./lib/components/SettingsGroup.svelte";
	import SettingsRow from "./lib/components/SettingsRow.svelte";
	import RadioButton from "./lib/components/RadioButton.svelte";
	import MessagePreview from "./lib/components/MessagePreview.svelte";
	import ExportModal from "./lib/components/modals/ExportModal.svelte";
	import PreferencesModal from "./lib/components/modals/PreferencesModal.svelte";

	// svelte-ignore non_reactive_update
	let preferencesModal: Modal;
	// svelte-ignore non_reactive_update
	let exportModal: Modal;
	// svelte-ignore non_reactive_update
	let messagePreview: MessagePreview;

	let usernameColourValue: string = $state("#ffffff");
	let messageColourValue: string = $state("#ffffff");
	let backgroundColourValue: string = $state("#18181b");
	let backgroundOpacityValue: number = $state(1);
	let outlineColourValue: string = $state("#000000");
	let outlineThicknessValue: number = $state(0);
	let messageTypeValue: string = $state("default");
	let maxWidthValue: string = $state("twitch");
	let customMaxWidthValue: number = $state(340);

	let backgorundPreviewValue: boolean = $state(true);

	$effect(() => {
		getCurrentWindow().setAlwaysOnTop($settings.always_on_top);
	});
</script>

<main class="flex h-full grow flex-col justify-between">
	<div class="flex flex-col gap-2">
		<div class="between flex">
			<div class="grow basis-0">
				<button class="btn">Presets</button>
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
			<button class="btn">Configure Emotes</button>
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
			<SettingsGroup label="Outline" help="Outline will only render in the exported image" disabled>
				<Setting label="Colour" key="outline.colour" bind:value={outlineColourValue} noBorder>
					<input type="color" bind:value={outlineColourValue} class="w-9" />
				</Setting>
				<Setting label="Thickness" key="outline.thickness" bind:value={outlineThicknessValue} noBorder>
					<input type="number" bind:value={outlineThicknessValue} min="0" max="5" class="w-9" />
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
				<input type="checkbox" bind:checked={backgorundPreviewValue} />
				Background Preview
			</label>
			<MessagePreview bind:this={messagePreview} backgroundPreview={backgorundPreviewValue} />
		</div>
		<button onclick={() => exportModal.open()} class="btn ml-auto">Export...</button>
	</div>
</main>

<PreferencesModal bind:modal={preferencesModal} />
<ExportModal bind:modal={exportModal} preview={messagePreview} />
