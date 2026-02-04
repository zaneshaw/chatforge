<script lang="ts">
	import { settings } from "../../stores/settings";
	import { allBadges, getBadge, getBadgeUrl, loadTwitchChannelBadges, type Badge } from "../../stores/badges";
	import Modal from "../Modal.svelte";
	import { onMount, type Component } from "svelte";
	import { AsteriskIcon, ClockIcon, PlusIcon, RefreshCwIcon } from "@lucide/svelte";
	import BadgeImage from "../BadgeImage.svelte";
	import { twitchLoginExists } from "../../utils";

	type Tab = {
		id: string;
		label: string;
		isProvider: boolean;
		imgSrc?: string;
		component?: Component;
	};

	let { modal = $bindable() }: { modal: Modal } = $props();

	let channelNameValue: string | undefined = $state();
	let twitchSearchValue: string = $state("");
	let loadingChannel: boolean = $state(false);

	$effect(() => {
		channelNameValue = channelNameValue?.trim().toLocaleLowerCase() || undefined;
	});

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
		recentBadges = recentBadges.slice(0, 9 * 5);
		$settings.recent_badges = recentBadges;
	}

	async function loadChannelBadges() {
		loadingChannel = true;

		if (channelNameValue) {
			if (await twitchLoginExists(channelNameValue)) {
				await loadTwitchChannelBadges(channelNameValue);
				location.reload();
			}
		} else {
			// todo: clear cache
		}

		loadingChannel = false;
	}
</script>

{#snippet tabButton(tabId: string, imgSrc?: string, Component?: Component)}
	<button
		onclick={() => {
			currentTabId = tabId;
			twitchSearchValue = "";
		}}
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
		<button onclick={() => addBadge(badge.id)} class="flex aspect-square cursor-pointer items-center justify-center rounded-xs p-0.5 outline-zinc-700 hover:outline-1">
			<BadgeImage badgeId={badge.id} />
		</button>
	{/if}
{/snippet}

<Modal
	bind:this={modal}
	afterOpen={() => {
		currentTabId = "recent";
		channelNameValue = "";
		twitchSearchValue = "";
	}}
	class="flex flex-col gap-2"
>
	<h1>Add a Badge</h1>
	<div class="flex gap-1.5">
		<div bind:clientHeight={tabsHeight} class="flex flex-col gap-1 border-r border-zinc-800 pr-1.5">
			{#each tabs as tab}
				{@render tabButton(tab.id, tab.imgSrc, tab.component)}
			{/each}
		</div>
		<div class="relative flex grow flex-col gap-1 overflow-y-auto px-px" style="height: {tabsHeight}px;">
			{#if currentTab}
				<h2>{currentTab.label}</h2>
				{#if currentTabId == "recent"}
					<button onclick={() => ($settings.recent_badges = [])} class="hover:text-twitch-text absolute top-0 right-0 cursor-pointer text-zinc-400">Clear</button>
					<div class="flex flex-wrap gap-0.5">
						{#each $settings.recent_badges as badgeId}
							{@render badgeButton(getBadge(badgeId) as Badge)}
						{:else}
							<span class="text-zinc-500 w-max">No recent badges</span>
						{/each}
					</div>
				{:else if currentTabId == "channel"}
					<div class="flex">
						<input bind:value={channelNameValue} type="text" placeholder="Twitch channel name" class="grow" />
						{#if loadingChannel}
							<button class="btn cursor-default! rounded-l-none! p-1!"><RefreshCwIcon class="size-3.5 animate-spin stroke-neutral-400" /></button>
						{:else}
							<button onclick={loadChannelBadges} class="btn rounded-l-none! p-1!"><PlusIcon class="size-3.5" /></button>
						{/if}
					</div>
					<div class="flex flex-wrap gap-0.5">
						{#each allBadges.filter((badge) => badge.provider == "twitch_channel") as badge}
							{@render badgeButton(badge)}
						{/each}
					</div>
				{:else if currentTabId == "twitch"}
					<div class="flex">
						<input bind:value={twitchSearchValue} type="text" placeholder="Search" class="grow" />
					</div>
					<div class="flex flex-wrap gap-0.5">
						{#each allBadges.filter((badge) => {
							const isTwitchBadge = badge.provider == "twitch";
							let matchesSearch = true;
							if (twitchSearchValue) {
								matchesSearch = badge.name.toLowerCase().replace(/\s/g, "").includes(twitchSearchValue.replace(/\s/g, ""));
							}

							return isTwitchBadge && matchesSearch;
						}) as badge}
							{@render badgeButton(badge)}
						{/each}
					</div>
				{:else if currentTab.isProvider}
					<div class="flex flex-wrap gap-0.5">
						{#each allBadges.filter((badge) => badge.provider == currentTab.id) as badge}
							{@render badgeButton(badge)}
						{/each}
					</div>
				{/if}
			{:else}
				<span class="text-zinc-500">Tab error</span>
			{/if}
		</div>
	</div>
</Modal>
