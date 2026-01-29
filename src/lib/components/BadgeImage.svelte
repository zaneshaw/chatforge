<script lang="ts">
	import { getBadge, getBadgeUrl } from "../stores/badges";

	let { badgeId }: { badgeId: string } = $props();

	let badge = $derived(getBadge(badgeId));
</script>

{#if badge && badge.provider == "ffz"}
	<div class="size-4.5 rounded-xs bg-contain bg-center bg-no-repeat" style="background-color: {badge.data.colour}; background-image: url({getBadgeUrl(badgeId, 1)});"></div>
{:else}
	<div class="size-4.5 bg-contain bg-center bg-no-repeat" style="background-image: url({getBadgeUrl(badgeId, 1)});"></div>
{/if}
