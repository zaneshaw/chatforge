<script lang="ts">
	import Setting from "./Setting.svelte";

	const USERNAME_PLACEHOLDER = "username";
	const MESSAGE_PLACEHOLDER = "click to edit";

	let usernameValue = $state("");
	let usernameWidth = $derived(getTextWidth(usernameValue || USERNAME_PLACEHOLDER, 14, 700));

	let messageValue = $state("");
	let messageWidth = $derived(getTextWidth(messageValue || MESSAGE_PLACEHOLDER, 14, 500));

	function getTextWidth(text: string, size: number = 14, weight: number = 500) {
		let width: number;

		const temp = document.createElement("span");
		temp.style.position = "absolute";
		temp.style.whiteSpace = "pre";
		temp.style.fontSize = `${size}px`;
		temp.style.fontWeight = `${weight}`;
		temp.innerText = text;

		document.body.appendChild(temp);
		width = temp.offsetWidth;
		document.body.removeChild(temp);

		return width;
	}
</script>

<div class="flex size-full items-center justify-center text-sm">
	{#await document.fonts.ready}
		<span class="text-zinc-600">loading font...</span>
	{:then}
		<Setting label="" key="username.text" bind:value={usernameValue} minimal>
			<input
				type="text"
				bind:value={usernameValue}
				onfocus={(e) => (e.target as HTMLInputElement).select()}
				placeholder={USERNAME_PLACEHOLDER}
				autocomplete="off"
				spellcheck="false"
				class="rounded-xs p-0 font-bold outline-0 outline-zinc-700 hover:outline-1 focus:outline-1 focus:outline-zinc-600"
				style="width: {usernameWidth}px;"
			/>
		</Setting>
		<span class="mr-1">:</span>
		<Setting label="" key="message.text" bind:value={messageValue} minimal>
			<input
				type="text"
				bind:value={messageValue}
				onfocus={(e) => (e.target as HTMLInputElement).select()}
				placeholder={MESSAGE_PLACEHOLDER}
				autocomplete="off"
				spellcheck="false"
				class="rounded-xs p-0 outline-0 outline-zinc-700 hover:outline-1 focus:outline-1 focus:outline-zinc-600"
				style="width: {messageWidth}px;"
			/>
		</Setting>
	{/await}
</div>
