<script lang="ts">
	import { onMount } from "svelte";
	import { getFlattenedSetting, setFlattenedSetting } from "../stores/settings";

	type Props = {
		children: any;
		label: string;
		key?: string;
		value?: any;
		noBorder?: boolean;
		minimal?: boolean;
		disabled?: boolean;
		class?: string;
	};

	let { children, label, key, value = $bindable(), noBorder = false, minimal = false, disabled = false, class: _class = "" }: Props = $props();

	onMount(() => {
		if (key != undefined) {
			const stored = getFlattenedSetting(key);
			if (stored != undefined) {
				value = stored;
			} else {
				setFlattenedSetting(key, value);
			}
		}
	});

	$effect(() => {
		if (key != undefined) {
			setFlattenedSetting(key, value);
		}
	});
</script>

{#if minimal}
	{@render children?.()}
{:else if noBorder}
	<div class="between h-6 {_class}">
		<span>{label}</span>
		{@render children?.()}
	</div>
{:else}
	<div class:disabled class="box between relative h-10 overflow-hidden p-2 [.disabled]:pointer-events-none [.disabled]:outline-zinc-900! {_class}">
		{#if disabled}
			<div class="absolute top-0 left-0 size-full bg-zinc-950/80"></div>
		{/if}
		<h2>{label}</h2>
		{@render children?.()}
	</div>
{/if}
