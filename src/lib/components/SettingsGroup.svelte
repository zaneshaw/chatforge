<script lang="ts">
	import { InfoIcon } from "@lucide/svelte";

	type Props = {
		children: any;
		label: string;
		help?: string;
	};

	let { children, label, help }: Props = $props();
</script>

<div class="box flex flex-col gap-1 p-2">
	<div class="between">
		<h2>{label}</h2>
		{#if help}
			<span title={help}>
				<InfoIcon class="hover:stroke-twitch-text size-4 cursor-help stroke-zinc-400" />
			</span>
		{/if}
	</div>
	<div class="flex flex-col gap-1 *:ml-1.5">
		{@render children()}
	</div>
</div>
