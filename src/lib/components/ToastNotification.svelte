<script lang="ts">
	import { CircleAlertIcon, InfoIcon, TriangleAlertIcon } from "@lucide/svelte";
	import { dismissToast, type Toast } from "../stores/toasts.svelte";
	import { fade } from "svelte/transition";

	let { toast }: { toast: Toast } = $props();
</script>

<button
	onclick={() => dismissToast(toast.id)}
	transition:fade={{ duration: 250 }}
	class={[
		toast.level == "info" && "bg-neutral-800",
		toast.level == "warning" && "bg-yellow-950 text-yellow-200",
		toast.level == "error" && "bg-red-950 text-red-200",
		"flex w-max min-w-40 cursor-pointer items-center gap-2 rounded-xs p-2 pr-4 transition-opacity hover:opacity-50",
	]}
>
	{#if toast.level == "info"}
		<InfoIcon class="size-5" />
	{:else if toast.level == "warning"}
		<TriangleAlertIcon class="size-5" />
	{:else if toast.level == "error"}
		<CircleAlertIcon class="size-5" />
	{/if}
	<span>{toast.text}</span>
</button>
