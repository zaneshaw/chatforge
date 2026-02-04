<script lang="ts">
	type Props = { children: any; selected: string; name: string; first?: boolean; last?: boolean };

	let { children, selected = $bindable(), name, first, last }: Props = $props();
</script>

<button
	onclick={() => (selected = name)}
	class:selected={selected == name}
	class:radioFirst={first}
	class:radioLast={last}
	class="btn [&:not(.selected]:text-zinc-400! flex gap-1.5 rounded-none! [&.radioFirst]:rounded-l-xs! [&.radioLast]:rounded-r-xs! [&.selected]:bg-zinc-800!"
>
	{@render children()}
</button>
