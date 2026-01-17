<script lang="ts">
	type Props = {
		children: any;
		label: string;
		isChild?: boolean;
		minimal?: boolean;
		class?: string;
	};

	let { children, label, isChild = false, minimal = false, class: _class = "" }: Props = $props();
</script>

{#if isChild}
	<div class="{minimal ? "" : "between"} {_class}">
		<span>{label}</span>
		{@render children()}
	</div>
{:else}
	<div class="{minimal ? "" : "box between p-2"} {_class}">
		<h2>{label}</h2>
		{@render children()}
	</div>
{/if}
