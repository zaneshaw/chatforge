type Badge = {
	id: string;
	name: string;
};

export const badges: Badge[] = [
	{ id: "3267646d-33f0-4b17-b3df-f923a41db1d0", name: "Moderator" },
	{ id: "18b92728-aa7a-4e24-acb5-b14ea17c8b2b", name: "Gears of War Superfan Badge" },
];

// todo: cache
export function getBadge(id: string, quality: number) {
	return `https://static-cdn.jtvnw.net/badges/v1/${id}/${quality}`;
}
