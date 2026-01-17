<script lang="ts">
	import Modal from "./lib/components/Modal.svelte";
	import Setting from "./lib/components/Setting.svelte";
	import SettingsGroup from "./lib/components/SettingsGroup.svelte";
	import SettingsRow from "./lib/components/SettingsRow.svelte";

	let preferencesModal: Modal;
</script>

<main class="flex h-full grow flex-col justify-between">
	<div class="flex flex-col gap-2">
		<button class="btn ml-auto" onclick={preferencesModal.open}>Preferences</button>
		<SettingsGroup label="Background">
			<Setting label="Colour" isChild>
				<input type="color" name="" id="" />
			</Setting>
			<Setting label="Opacity" isChild>
				<input type="range" name="" id="" />
			</Setting>
		</SettingsGroup>
		<SettingsGroup label="Outline">
			<Setting label="Colour" isChild>
				<input type="color" name="" id="" />
			</Setting>
			<Setting label="Opacity" isChild>
				<input type="range" name="" id="" />
			</Setting>
		</SettingsGroup>
		<SettingsRow>
			<Setting label="First Message">
				<input type="checkbox" name="" id="" />
			</Setting>
			<Setting label="Removed Message">
				<input type="checkbox" name="" id="" />
			</Setting>
		</SettingsRow>
		<Setting label="Emotes">
			<button class="btn">Configure Emotes</button>
		</Setting>
	</div>
	<hr />
	<div class="flex flex-col gap-2">
		<div class="box relative h-62.5 w-full">
			<button class="btn absolute top-1.5 left-1.5">Presets</button>
			<label class="btn absolute top-1.5 right-1.5 flex items-center gap-1">
				<input type="checkbox" name="" id="" />
				Preview Background
			</label>
			<div class="flex size-full items-center justify-center text-sm">
				<span class="font-bold">squidee_</span><span>: yo</span>
			</div>
		</div>
		<div class="ml-auto flex">
			<button class="btn rounded-r-none!">Quick Export</button>
			<button class="btn rounded-l-none!">Export...</button>
		</div>
	</div>
</main>

<div class="bg-twitch-background-light w-full border-t border-zinc-800 px-3 py-0.5 font-light text-zinc-400">Hover over something for help...</div>

<Modal bind:this={preferencesModal} class="flex flex-col gap-2">
	<h1>Preferences</h1>
	<Setting label="setting1" minimal class="between">input1</Setting>
	<Setting label="setting2" minimal class="between">input2</Setting>
</Modal>
