<script lang="ts">
	import Setting from "./Setting.svelte";

	const USERNAME_PLACEHOLDER = "username";
	const MESSAGE_PLACEHOLDER = "click to edit";

	let usernameValue = $state(USERNAME_PLACEHOLDER);
	let messageValue = $state(MESSAGE_PLACEHOLDER);
</script>

<div class="flex size-full items-center justify-center text-sm">
	{#await document.fonts.ready}
		<span class="text-zinc-600">loading font...</span>
	{:then}
		<div class="flex max-w-75">
			<Setting label="" key="username.text" bind:value={usernameValue} minimal>
				<span
					bind:textContent={usernameValue}
					contenteditable="true"
					onfocus={(e) => window.getSelection()?.selectAllChildren(e.target as HTMLInputElement)}
					onblur={(e) => {
						if (usernameValue.length == 0) usernameValue = USERNAME_PLACEHOLDER;
						window.getSelection()?.empty();
					}}
					spellcheck="false"
					class="inline-block min-w-0.75 rounded-xs p-0 font-bold outline-0 outline-zinc-700 hover:outline-1 focus:outline-1 focus:outline-zinc-600"
				></span>
			</Setting>
			<span class="mr-1">:</span>
			<Setting label="" key="message.text" bind:value={messageValue} minimal>
				<span
					bind:textContent={messageValue}
					contenteditable="true"
					onfocus={(e) => window.getSelection()?.selectAllChildren(e.target as HTMLInputElement)}
					onblur={() => {
						if (messageValue.length == 0) messageValue = MESSAGE_PLACEHOLDER;
						window.getSelection()?.empty();
					}}
					spellcheck="false"
					class="inline-block min-w-0.75 rounded-xs p-0 wrap-break-word break-all outline-0 outline-zinc-700 hover:outline-1 focus:outline-1 focus:outline-zinc-600"
				></span>
			</Setting>
		</div>
	{/await}
</div>
