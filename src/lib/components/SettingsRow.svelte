<script lang="ts">
	type Props = {
		children: any;
	};

	let { children }: Props = $props();
</script>

<div class="flex gap-2 [&>div]:grow [&>div]:basis-0">
	{@render children?.()}
</div>
