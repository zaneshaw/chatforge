<script lang="ts">
	import Setting from "./Setting.svelte";

	const USERNAME_PLACEHOLDER = "username";
	const MESSAGE_PLACEHOLDER = "click to edit";

	let usernameValue = $state(USERNAME_PLACEHOLDER);
	let messageValue = $state(MESSAGE_PLACEHOLDER);

	let badges = ["3267646d-33f0-4b17-b3df-f923a41db1d0", "18b92728-aa7a-4e24-acb5-b14ea17c8b2b"];
</script>

<div class="flex size-full items-center justify-center text-sm">
	{#await document.fonts.ready}
		<span class="text-zinc-600">loading font...</span>
	{:then}
		<div class="max-w-85 px-4 py-1 leading-5.5">
			<span class="*:mr-0.75 *:mb-0.5 *:inline-block *:size-4.5 *:align-middle">
				{#each badges as badge}
					<span class="bg-[url(https://static-cdn.jtvnw.net/badges/v1/{badge}/1)]"></span>
				{/each}
			</span><Setting label="" key="username.text" bind:value={usernameValue} minimal>
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<span
					bind:innerText={usernameValue}
					contenteditable="true"
					onfocus={(e) => window.getSelection()?.selectAllChildren(e.target as HTMLInputElement)}
					onkeydown={(e) => {
						if (e.key == "Enter" || e.key == " ") e.preventDefault();
					}}
					oninput={() => {
						usernameValue = usernameValue.trim().replace(/\n|\s/g, "");
					}}
					onblur={() => {
						if (usernameValue.length == 0) usernameValue = USERNAME_PLACEHOLDER;
						window.getSelection()?.empty();
					}}
					spellcheck="false"
					class="editable font-bold break-all text-[#00ff00]"
				></span>
			</Setting><span>:</span>
			<span class="wrap-break-word">
				<Setting label="" key="message.text" bind:value={messageValue} minimal>
					<span
						bind:innerText={messageValue}
						contenteditable="true"
						onfocus={(e) => window.getSelection()?.selectAllChildren(e.target as HTMLInputElement)}
						oninput={() => {
							messageValue = messageValue.trim().replace(/\n\s*\n/g, "\n");
						}}
						onblur={() => {
							if (messageValue.length == 0) messageValue = MESSAGE_PLACEHOLDER;
							window.getSelection()?.empty();
						}}
						spellcheck="false"
						class="editable"
					></span>
				</Setting>
			</span>
		</div>
	{/await}
</div>
