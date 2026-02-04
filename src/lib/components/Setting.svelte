<script lang="ts">
	import { onMount } from "svelte";
	import { settings } from "../stores/settings";
	import { flatten, unflatten } from "flat";
	import _ from "lodash";

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
			const flattened = flatten($settings) as any;
			if (key in flattened) {
				value = flattened[key];
			}
		}
	});

	$effect(() => {
		if (key != undefined) {
			settings.update((state) =>
				_.merge(
					state,
					unflatten({
						[key]: value,
					}),
				),
			);
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
