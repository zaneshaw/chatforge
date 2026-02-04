<script lang="ts">
	import { getCurrentWindow } from "@tauri-apps/api/window";
	import { SettingsIcon } from "@lucide/svelte";
	import { settingsStorage } from "./lib/stores/settingsStorage";
	import Modal from "./lib/components/Modal.svelte";
	import Setting from "./lib/components/Setting.svelte";
	import SettingsGroup from "./lib/components/SettingsGroup.svelte";
	import SettingsRow from "./lib/components/SettingsRow.svelte";
	import RadioGroup from "./lib/components/RadioGroup.svelte";
	import MessagePreview from "./lib/components/MessagePreview.svelte";

	// svelte-ignore non_reactive_update
	let preferencesModal: Modal;

	let usernameColourValue: string = $state("#ffffff");
	let messageColourValue: string = $state("#ffffff");
	let backgroundColourValue: string = $state("#18181b");
	let backgroundOpacityValue: number = $state(1);
	let outlineColourValue: string = $state("#000000");
	let outlineThicknessValue: number = $state(0);
	let messageTypeValue: string = $state("default");
	let wrapValue: boolean = $state(false);
	let alwaysOnTopValue: boolean = $state(true);
	let backgorundPreviewValue: boolean = $state(true);

	$effect(() => {
		getCurrentWindow().setAlwaysOnTop(alwaysOnTopValue);
	});

	let factoryResetTimer: number | undefined;

	function factoryReset() {
		if (!factoryResetTimer) {
			factoryResetTimer = setTimeout(() => {
				$settingsStorage = {};
				location.reload();
			}, 1500);
		}
	}

	function onMouseUp() {
		if (factoryResetTimer) clearTimeout(factoryResetTimer);
	}
</script>

<svelte:window onmouseup={onMouseUp} />

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
				<button class="group cursor-pointer" onclick={preferencesModal.open}>
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
				<Setting label="Colour" key="bg.colour" bind:value={backgroundColourValue} isChild>
					<input type="color" bind:value={backgroundColourValue} class="w-9" />
				</Setting>
				<Setting label="Opacity" key="bg.opacity" bind:value={backgroundOpacityValue} isChild>
					<input type="number" bind:value={backgroundOpacityValue} min="0" max="1" step="0.1" class="w-9" />
				</Setting>
			</SettingsGroup>
			<SettingsGroup label="Outline" help="Outline will only render in the exported image" disabled>
				<Setting label="Colour" key="outline.colour" bind:value={outlineColourValue} isChild>
					<input type="color" bind:value={outlineColourValue} class="w-9" />
				</Setting>
				<Setting label="Thickness" key="outline.thickness" bind:value={outlineThicknessValue} isChild>
					<input type="number" bind:value={outlineThicknessValue} min="0" max="5" class="w-9" />
				</Setting>
			</SettingsGroup>
		</SettingsRow>
		<Setting label="Message Type" key="message_type" bind:value={messageTypeValue}>
			<RadioGroup
				bind:selected={messageTypeValue}
				options={{
					Default: "default",
					First: "first",
					Deleted: "deleted",
				}}
			/>
		</Setting>
		<Setting label="Text Wrapping (force to Twitch's width)" key="wrap" bind:value={wrapValue}>
			<input type="checkbox" bind:checked={wrapValue} />
		</Setting>
	</div>
	<hr />
	<div class="flex flex-col gap-2">
		<div class="box relative h-62.5 w-full overflow-hidden">
			<label class="btn absolute top-0 right-0 z-20 flex items-center gap-1.5 rounded-none! rounded-bl-xs! outline-zinc-800!">
				<input type="checkbox" bind:checked={backgorundPreviewValue} />
				Background Preview
			</label>
			<MessagePreview
				usernameColour={usernameColourValue}
				messageColour={messageColourValue}
				backgroundColor="{backgroundColourValue}{Math.floor(backgroundOpacityValue * 255)
					.toString(16)
					.padStart(2, '0')}"
				backgroundPreview={backgorundPreviewValue}
			/>
		</div>
		<div class="ml-auto flex">
			<button class="btn rounded-r-none!">Quick Export</button>
			<button class="btn rounded-l-none!">Export...</button>
		</div>
	</div>
</main>

<Modal bind:this={preferencesModal} class="flex flex-col gap-2">
	<h1>Preferences</h1>
	<Setting label="Always On Top" key="always_on_top" bind:value={alwaysOnTopValue} isChild>
		<input type="checkbox" bind:checked={alwaysOnTopValue} />
	</Setting>
	<Setting label="Emote Cache" isChild>
		<button class="btn">Clear</button>
	</Setting>
	<Setting label="Badge Cache" isChild>
		<button class="btn">Clear</button>
	</Setting>
	<br />
	<Setting label="Factory Reset" isChild>
		<button onmousedown={factoryReset} class="btn btn-danger">Reset</button>
	</Setting>
</Modal>
