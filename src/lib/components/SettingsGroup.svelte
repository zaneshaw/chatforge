<script lang="ts">
	import { InfoIcon } from "@lucide/svelte";

	type Props = {
		children: any;
		label: string;
		help?: string;
		disabled?: boolean;
	};

	let { children, label, help, disabled = false }: Props = $props();
</script>

<div class="box relative flex flex-col gap-1 overflow-hidden p-2 {disabled ? 'pointer-events-none outline-zinc-900!' : ''}">
	{#if disabled}
		<div class="absolute top-0 left-0 size-full bg-zinc-950/80"></div>
	{/if}
	<div class="between">
		<h2>{label}</h2>
		{#if help}
			<span title={help}>
				<InfoIcon class="hover:stroke-twitch-text size-4 cursor-help stroke-zinc-400" />
			</span>
		{/if}
	</div>
	<div class="flex flex-col gap-1 *:ml-1.5">
		{@render children?.()}
	</div>
</div>
