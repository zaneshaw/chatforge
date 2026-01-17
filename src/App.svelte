<script lang="ts">
	import Modal from "./lib/components/Modal.svelte";
	import Setting from "./lib/components/Setting.svelte";
	import SettingsGroup from "./lib/components/SettingsGroup.svelte";
	import SettingsRow from "./lib/components/SettingsRow.svelte";

	let preferencesModal: Modal;
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
				<button class="btn" onclick={preferencesModal.open}>Preferences</button>
			</div>
		</div>
		<SettingsRow>
			<Setting label="Name Color">
				<input type="color" name="" id="" class="w-9" />
			</Setting>
			<Setting label="Message Color">
				<input type="color" name="" id="" class="w-9" />
			</Setting>
		</SettingsRow>
		<Setting label="Emotes">
			<button class="btn">Configure Emotes</button>
		</Setting>
		<SettingsRow>
			<SettingsGroup label="Background">
				<Setting label="Colour" isChild>
					<input type="color" name="" id="" class="w-9" />
				</Setting>
				<Setting label="Opacity" isChild>
					<input type="number" name="" id="" value="1" min="0" max="1" step="0.1" class="w-9" />
				</Setting>
			</SettingsGroup>
			<SettingsGroup label="Outline">
				<Setting label="Colour" isChild>
					<input type="color" name="" id="" class="w-9" />
				</Setting>
				<Setting label="Thickness" isChild>
					<input type="number" name="" id="" value="0" min="0" max="5" class="w-9" />
				</Setting>
			</SettingsGroup>
		</SettingsRow>
		<Setting label="Message Type">
			<div class="ml-auto flex">
				<button class="btn rounded-r-none! bg-zinc-800!">Default</button>
				<button class="btn rounded-none! text-zinc-400">First</button>
				<button class="btn rounded-l-none! text-zinc-400">Deleted</button>
			</div>
		</Setting>
		<Setting label="Text Wrapping (force to Twitch's width)">
			<input type="checkbox" name="" id="" />
		</Setting>
	</div>
	<hr />
	<div class="flex flex-col gap-2">
		<div class="box relative h-62.5 w-full overflow-hidden">
			<label class="btn absolute top-0 right-0 flex items-center gap-1.5 rounded-none! rounded-bl-xs!">
				<input type="checkbox" name="" id="" />
				Background Preview
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

<div class="bg-twitch-background-light w-full border-t border-zinc-800 px-3 py-0.5 font-light text-zinc-500">Hover over something for help...</div>

<Modal bind:this={preferencesModal} class="flex flex-col gap-2">
	<h1>Preferences</h1>
	<Setting label="Always On Top" minimal class="between">
		<input type="checkbox" name="" id="" />
	</Setting>
	<Setting label="Emote Cache" isChild>
		<button class="btn">Reset</button>
	</Setting>
	<Setting label="Badge Cache" isChild>
		<button class="btn">Reset</button>
	</Setting>
	<br />
	<Setting label="Factory Reset" isChild>
		<button class="btn">Reset and Exit</button>
	</Setting>
</Modal>
