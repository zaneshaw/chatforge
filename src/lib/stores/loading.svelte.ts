export const loading: { state: boolean; progress: number; max: number; label: string; showProgress: boolean } = $state({
	state: true,
	progress: 0,
	max: 100,
	label: "Loading...",
	showProgress: false,
});
