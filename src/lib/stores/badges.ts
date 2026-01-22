type Badge = {
	id: string;
	name: string;
};

export const badges: Badge[] = [
	{ id: "3267646d-33f0-4b17-b3df-f923a41db1d0", name: "Moderator" },
	{ id: "18b92728-aa7a-4e24-acb5-b14ea17c8b2b", name: "Gears of War Superfan Badge" },
	{ id: "d12a2e27-16f6-41d0-ab77-b780518f00a3", name: "Verified" },
	{ id: "5527c58c-fb7d-422d-b71b-f309dcb85cc1", name: "Broadcaster" },
	{ id: "01998862-3032-4f9c-bc81-fd78b0c35763", name: "5-Year Subscriber" },
];

export function getBadge(id: string) {
	return badges.find((badge) => badge.id == id);
}

// todo: cache
export function getBadgeUrl(id: string, quality: number) {
	return `https://static-cdn.jtvnw.net/badges/v1/${id}/${quality}`;
}
