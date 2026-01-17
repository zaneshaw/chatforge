<script lang="ts">
	type Props = {
		children: any;
		label: string;
	};

	let { children, label }: Props = $props();
</script>

<div class="box flex flex-col gap-1 p-2 [&>div]:ml-1.5">
	<h2>{label}</h2>
	{@render children()}
</div>
