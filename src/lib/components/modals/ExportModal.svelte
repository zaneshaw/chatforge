<script lang="ts">
	import { downloadDir } from "@tauri-apps/api/path";
	import { open } from "@tauri-apps/plugin-dialog";
	import { settings } from "../../stores/settings";
	import Modal from "../Modal.svelte";
	import Setting from "../Setting.svelte";
	import RadioButton from "../RadioButton.svelte";
	import MessagePreview from "../MessagePreview.svelte";

	let { modal = $bindable(), preview }: { modal: Modal; preview: MessagePreview } = $props();

	let copyToClipboardValue: boolean = $state(false);
	let outputDirectoryValue: string = $state("");
	let exportResolutionValue: string = $state("fit");
	let customExportWidthValue: number = $state(1920);
	let customExportHeightValue: number = $state(1080);
	let openDirectoryValue: boolean = $state(false);
	let scaleValue: number = $state(1);
	let fileFormatValue: "png" | "webp" | "jpeg" = $state("png");
	let webpQualityValue: number = $state(80);
	let jpegQualityValue: number = $state(80);

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
		<input type="checkbox" bind:checked={copyToClipboardValue} disabled />
	</Setting>
	<Setting label="Open in Explorer" key="export.open_directory" bind:value={openDirectoryValue} noBorder>
		<input type="checkbox" bind:checked={openDirectoryValue} />
	</Setting>
	<div>
		<Setting label="File Format" key="export.file_format" bind:value={fileFormatValue} noBorder>
			<div class="ml-auto flex">
				<RadioButton bind:selected={fileFormatValue} name="png" first>PNG</RadioButton>
				<RadioButton bind:selected={fileFormatValue} name="webp">WebP</RadioButton>
				<RadioButton bind:selected={fileFormatValue} name="jpeg" last>JPEG</RadioButton>
			</div>
		</Setting>
		{#if fileFormatValue == "webp"}
			<Setting label="Quality" key="export.webp_quality" bind:value={webpQualityValue} noBorder class="ml-1.5">
				<div class="flex items-center gap-1">
					<input type="range" min="20" max="100" step="5" bind:value={webpQualityValue} />
					<span class="w-8">{webpQualityValue}%</span>
				</div>
			</Setting>
		{/if}
		{#if fileFormatValue == "jpeg"}
			<Setting label="Quality" key="export.jpeg_quality" bind:value={jpegQualityValue} noBorder class="ml-1.5">
				<div class="flex items-center gap-1">
					<input type="range" min="20" max="100" step="5" bind:value={jpegQualityValue} />
					<span class="w-8">{jpegQualityValue}%</span>
				</div>
			</Setting>
		{/if}
	</div>
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
