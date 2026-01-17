<script lang="ts">
	type Props = {
		children: any;
		label: string;
		isChild?: boolean;
	};

	let { children, label, isChild = false }: Props = $props();
</script>

{#if isChild}
	<div class="between">
		<span>{label}</span>
		{@render children()}
	</div>
{:else}
	<div class="box between p-2 [&>div]:ml-3">
		<h2>{label}</h2>
		{@render children()}
	</div>
{/if}
