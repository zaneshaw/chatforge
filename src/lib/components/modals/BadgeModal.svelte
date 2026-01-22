<script lang="ts">
	import { settings } from "../../stores/settings";
	import { badges, getBadge, getBadgeUrl, type Badge } from "../../stores/badges";
	import Modal from "../Modal.svelte";
	import { onMount, type Component } from "svelte";
	import { AsteriskIcon, ClockIcon, RefreshCwIcon } from "@lucide/svelte";

	type Tab = {
		id: string;
		label: string;
		isProvider: boolean;
		imgSrc?: string;
		component?: Component;
	};

	let { modal = $bindable() }: { modal: Modal } = $props();

	let tabs: Tab[] = [
		{ id: "recent", label: "Recent Badges", isProvider: false, component: ClockIcon },
		{ id: "channel", label: "Channel Badges", isProvider: false, imgSrc: "/icons/channel-flat.png" },
		{ id: "twitch", label: "Twitch Badges", isProvider: true, imgSrc: "/icons/twitch-flat.png" },
		{ id: "ffz", label: "FFZ Badges", isProvider: true, imgSrc: "/icons/ffz-flat.png" },
		{ id: "bttv", label: "BTTV Badges", isProvider: true, imgSrc: "/icons/bttv-flat.png" },
		{ id: "7tv", label: "7TV Badges", isProvider: true, imgSrc: "/icons/7tv-flat.png" },
	];
	let currentTabId: string = $state("recent");
	let currentTab = $derived(tabs.find((tab) => tab.id == currentTabId));

	let tabsHeight: number = $state(0);

	function addBadge(id: string) {
		$settings.badges = [...$settings.badges, id];

		let recentBadges = ($settings.recent_badges as string[]) ?? [];
		if (recentBadges.includes(id)) recentBadges.splice(recentBadges.indexOf(id), 1);
		recentBadges.unshift(id);
		recentBadges = recentBadges.slice(0, 30);
		$settings.recent_badges = recentBadges;
	}
</script>

{#snippet tabButton(tabId: string, imgSrc?: string, Component?: Component)}
	<button
		onclick={() => (currentTabId = tabId)}
		class:current={currentTabId == tabId}
		class="flex size-6 cursor-pointer items-center justify-center rounded-xs p-1 hover:bg-zinc-800 [.current]:bg-zinc-700"
	>
		{#if Component}
			<Component />
		{:else if imgSrc}
			<img src={imgSrc} alt="" />
		{/if}
	</button>
{/snippet}

{#snippet badgeButton(badge: Badge)}
	{#if badge}
		<button onclick={() => addBadge(badge.id)} class="cursor-pointer rounded-xs p-px outline-zinc-700 hover:outline-1">
			<img src={getBadgeUrl(badge.id, 1)} alt={badge.name} />
		</button>
	{/if}
{/snippet}

<Modal bind:this={modal} afterOpen={() => (currentTabId = "recent")} class="flex flex-col gap-2">
	<h1>Add a Badge</h1>
	<div class="flex gap-1.5">
		<div bind:clientHeight={tabsHeight} class="flex flex-col gap-1">
			{#each tabs as tab}
				{@render tabButton(tab.id, tab.imgSrc, tab.component)}
			{/each}
		</div>
		<div class="w-px bg-zinc-800"></div>
		<div class="flex grow flex-col gap-1 overflow-y-auto px-px" style="height: {tabsHeight}px;">
			{#if currentTab}
				<h2>{currentTab.label}</h2>
				{#if currentTab.isProvider}
					<div class="flex">
						<input type="text" placeholder="Search" class="grow" />
					</div>
					<div class="flex flex-wrap gap-0.5">
						{#each badges.filter((badge) => badge.provider == currentTab.id) as badge}
							{@render badgeButton(badge)}
						{/each}
					</div>
				{:else if currentTabId == "recent"}
					<div class="flex flex-wrap gap-0.5">
						{#each $settings.recent_badges as badgeId}
							{@render badgeButton(getBadge(badgeId) as Badge)}
						{:else}
							<span class="text-zinc-500">No recent badges</span>
						{/each}
					</div>
				{:else if currentTabId == "channel"}
					<div class="flex">
						<input type="text" placeholder="Twitch channel name" class="grow" />
						<button class="btn rounded-l-none! p-1!"><RefreshCwIcon class="size-3.5" /></button>
					</div>
					<span class="text-zinc-500">Not implemented</span>
				{/if}
			{:else}
				<span class="text-zinc-500">Tab error</span>
			{/if}
		</div>
	</div>
</Modal>
