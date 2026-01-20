<script lang="ts">
	import Setting from "./Setting.svelte";

	type Props = {
		usernameColour: string;
		messageColour: string;
		backgroundColor: string;
		backgroundPreview: boolean;
	};

	const USERNAME_PLACEHOLDER = "username";
	const MESSAGE_PLACEHOLDER = "click to edit";

	let { usernameColour, messageColour, backgroundColor, backgroundPreview }: Props = $props();

	let usernameValue = $state(USERNAME_PLACEHOLDER);
	let messageValue = $state(MESSAGE_PLACEHOLDER);

	let badges = ["3267646d-33f0-4b17-b3df-f923a41db1d0", "18b92728-aa7a-4e24-acb5-b14ea17c8b2b"];
</script>

<div class="relative size-full">
	{#if backgroundPreview}
		<div class="pointer-events-none absolute top-0 left-0 size-full bg-[url(/transparent.png)] bg-size-[10%] bg-center [image-rendering:pixelated]"></div>
	{/if}
	<div class="absolute top-0 left-0 flex size-full items-center justify-center overflow-auto text-sm" style="background-color: {backgroundPreview ? backgroundColor : 'unset'};">
		{#await document.fonts.ready}
			<span class="text-zinc-600">loading font...</span>
		{:then}
			<div class="z-10 max-w-85 px-4 py-1 leading-5.5">
				<span class="*:mr-0.75 *:mb-0.5 *:inline-block *:size-4.5 *:align-middle">
					{#each badges as badge}
						<span style="background-image: url(https://static-cdn.jtvnw.net/badges/v1/{badge}/1);"></span>
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
						onblur={() => {
							usernameValue = usernameValue.trim().replace(/\n|\s/g, "");
							if (usernameValue.length == 0) usernameValue = USERNAME_PLACEHOLDER;
							window.getSelection()?.empty();
						}}
						spellcheck="false"
						class="editable font-bold break-all"
						style="color: {usernameColour};"
					></span>
				</Setting><span>:</span>
				<span class="wrap-break-word">
					<Setting label="" key="message.text" bind:value={messageValue} minimal>
						<span
							bind:innerText={messageValue}
							contenteditable="true"
							onfocus={(e) => window.getSelection()?.selectAllChildren(e.target as HTMLInputElement)}
							onblur={() => {
								messageValue = messageValue
									.trim()
									.replace(/\n\s*\n/g, "\n")
									.replace(/\s\s*\s/g, " ");
								if (messageValue.length == 0) messageValue = MESSAGE_PLACEHOLDER;
								window.getSelection()?.empty();
							}}
							spellcheck="false"
							class="editable"
							style="color: {messageColour};"
						></span>
					</Setting>
				</span>
			</div>
		{/await}
	</div>
</div>
