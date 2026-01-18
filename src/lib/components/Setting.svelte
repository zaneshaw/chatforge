<script lang="ts">
	import { onMount } from "svelte";
	import { settingsStorage } from "../stores/settingsStorage";

	type Props = {
		children: any;
		label: string;
		key?: string;
		value?: any;
		isChild?: boolean;
		minimal?: boolean;
		class?: string;
	};

	let { children, label, key, value = $bindable(), isChild = false, minimal = false, class: _class = "" }: Props = $props();

	onMount(() => {
		if (key != undefined && key in $settingsStorage) {
			value = $settingsStorage[key];
		}
	});

	$effect(() => {
		if (key != undefined) {
			$settingsStorage[key] = value;
		}
	});
</script>

{#if isChild}
	<div class="{minimal ? '' : 'between h-6'} {_class}">
		<span>{label}</span>
		{@render children()}
	</div>
{:else}
	<div class="{minimal ? '' : 'box between h-10 p-2'} {_class}">
		<h2>{label}</h2>
		{@render children()}
	</div>
{/if}
