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
		class?: string;
	};

	let { children, label, key, value = $bindable(), noBorder: isChild = false, minimal = false, class: _class = "" }: Props = $props();

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
			console.log(key, value);
			setFlattenedSetting(key, value);
		}
	});
</script>

{#if minimal}
	{@render children?.()}
{:else if isChild}
	<div class="between h-6 {_class}">
		<span>{label}</span>
		{@render children?.()}
	</div>
{:else}
	<div class="box between h-10 p-2 {_class}">
		<h2>{label}</h2>
		{@render children?.()}
	</div>
{/if}
