<script lang="ts">
	type Props = { options: { [name: string]: string }; selected: string };

	let { options, selected = $bindable() }: Props = $props();
</script>

<div class="ml-auto flex">
	{#each Object.entries(options) as [name, value], i}
		<button onclick={() => (selected = value)} class="btn rounded-none! {value == selected ? "bg-zinc-800!" : "text-zinc-400"} {i == 0 ? 'rounded-l-xs!' : ''} {i == Object.entries(options).length - 1 ? 'rounded-r-xs!' : ''}">
			{name}
		</button>
	{/each}
</div>
