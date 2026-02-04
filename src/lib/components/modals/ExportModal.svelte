<script lang="ts">
	import { downloadDir } from "@tauri-apps/api/path";
	import { open, save } from "@tauri-apps/plugin-dialog";
	import { settings } from "../../stores/settings";
	import Modal from "../Modal.svelte";
	import Setting from "../Setting.svelte";
	import RadioButton from "../RadioButton.svelte";
	import MessagePreview from "../MessagePreview.svelte";

	let { modal = $bindable(), preview }: { modal: Modal; preview: MessagePreview } = $props();

	let copyToClipboardValue: boolean = $state(true);
	let outputDirectoryValue: string = $state("");
	let exportResolutionValue: string = $state("fit");
	let customExportWidthValue: number = $state(1920);
	let customExportHeightValue: number = $state(1080);
	let openDirectoryValue: boolean = $state(false);
	let scaleValue: number = $state(1);

	let exporting: boolean = $state(false);

	$effect(() => {
		if (outputDirectoryValue == "") {
			downloadDir().then((dir) => {
				outputDirectoryValue = dir;
			});
		}
	});

	async function changeOutputDirectory() {
		const path = await open({
			directory: true,
			defaultPath: $settings?.export?.output_directory,
		});

		if (path) {
			$settings.export.output_directory = path;
		}
	}
</script>

<Modal bind:this={modal} class="flex flex-col gap-2">
	<h1>Export</h1>
	<div class="flex flex-col">
		<Setting label="Output Directory" key="export.output_directory" bind:value={outputDirectoryValue} noBorder>
			<button onclick={changeOutputDirectory} class="btn">Change</button>
		</Setting>
		<span class="text-zinc-500">{$settings?.export?.output_directory}</span>
	</div>
	<Setting label="Resolution" key="export.resolution" bind:value={exportResolutionValue} noBorder>
		<div class="ml-auto flex">
			<RadioButton bind:selected={exportResolutionValue} name="fit" first>Fit</RadioButton>
			<RadioButton bind:selected={exportResolutionValue} name="custom" last>
				{#if $settings?.export?.resolution == "custom"}
					<span>w:</span>
					<Setting label="" key="export.custom_resolution.width" bind:value={customExportWidthValue} minimal>
						<input type="number" bind:value={customExportWidthValue} class="w-12" />
					</Setting>
					<span>h:</span>
					<Setting label="" key="export.custom_resolution.height" bind:value={customExportHeightValue} minimal>
						<input type="number" bind:value={customExportHeightValue} class="w-12" />
					</Setting>
				{:else}
					Custom
				{/if}
			</RadioButton>
		</div>
	</Setting>
	<Setting label="Output Scale" key="export.scale" bind:value={scaleValue} noBorder>
		<input type="number" bind:value={scaleValue} min="1" max="10" class="w-9" />
	</Setting>
	<Setting label="Copy to Clipboard" key="export.copy_to_clipboard" bind:value={copyToClipboardValue} noBorder>
		<input type="checkbox" bind:checked={copyToClipboardValue} />
	</Setting>
	<Setting label="Open in Explorer" key="export.open_directory" bind:value={openDirectoryValue} noBorder>
		<input type="checkbox" bind:checked={openDirectoryValue} />
	</Setting>
	<br />
	<div class="ml-auto flex">
		{#if exporting}
			<button class="btn" disabled>Exporting...</button>
		{:else}
			<button
				onclick={async () => {
					exporting = true;
					await preview.exportMessage();
					modal.close();
					exporting = false;
				}}
				class="btn">Export</button
			>
		{/if}
	</div>
</Modal>
