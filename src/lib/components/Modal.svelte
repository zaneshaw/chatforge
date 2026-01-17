<script lang="ts">
	import { onMount } from "svelte";

	type Props = {
		children: any;
		afterOpen?: () => void;
		beforeClose?: () => void;
		centered?: boolean;
		minimal?: boolean;
		class?: string;
	};

	let { children, afterOpen = () => {}, beforeClose = () => {}, centered = true, minimal = false, class: _class = "" }: Props = $props();

	let dialog: HTMLDialogElement;
	// svelte-ignore non_reactive_update
	let container: HTMLElement;

	export function open() {
		dialog.show();
		afterOpen();
	}

	export function close() {
		if (!minimal) container.scrollTo(0, 0);
		beforeClose();
		dialog.close();
	}
</script>

<dialog
	bind:this={dialog}
	onclick={(e) => {
		if (e.target == e.currentTarget) close();
	}}
	closedby="closerequest"
	class="fixed top-0 left-0 z-10 size-full justify-center border-0 bg-black/50 outline-none open:flex {centered ? 'items-center' : 'items-start pt-8'}"
>
	{#if minimal}
		{@render children()}
	{:else}
		<div bind:this={container} class="box max-h-100 w-3/4 flex-col gap-2 overflow-y-auto p-3 [scrollbar-gutter:stable] {_class}">
			{@render children()}
		</div>
	{/if}
</dialog>
