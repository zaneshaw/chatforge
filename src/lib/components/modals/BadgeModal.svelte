<script lang="ts">
	import { settings } from "../../stores/settings";
	import { badges, getBadge } from "../../stores/badges";
	import Modal from "../Modal.svelte";

	let { modal = $bindable() }: { modal: Modal } = $props();

	function addBadge(id: string) {
		$settings.badges.push(id);
		$settings.badges = $settings.badges;
		modal.close();
	}
</script>

<Modal bind:this={modal} class="flex flex-col gap-2">
	<h1>Add a Badge</h1>
	<div class="flex gap-1">
		{#each badges as badge}
			<button onclick={() => addBadge(badge.id)} class="cursor-pointer w-6">
				<img src={getBadge(badge.id, 2)} alt={badge.name} />
			</button>
		{/each}
	</div>
</Modal>
