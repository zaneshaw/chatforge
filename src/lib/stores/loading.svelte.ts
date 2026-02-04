export const loading: { state: boolean; progress: number; max: number; label: string; showProgress: boolean; showProgressText: boolean } = $state({
	state: true,
	progress: 0,
	max: 100,
	label: "",
	showProgress: false,
	showProgressText: false,
});
