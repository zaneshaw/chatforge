// this probably all sucks

import { writable, type Writable } from "svelte/store";

export const loadingState: Writable<{ loading: boolean; progress: number; max: number; label: string; showProgress: boolean }> = writable(start(100, "Loading...", false));

function start(max: number, label: string = "Loading...", showProgress: boolean) {
	return {
		loading: true,
		progress: 0,
		max: max,
		label: label,
		showProgress: showProgress,
	};
}

export function startLoadingSequence(max: number, label?: string, showProgress: boolean = true) {
	loadingState.update(() => start(max, label, showProgress));
}

export function endLoadingSequence() {
	loadingState.update((state) => {
		state.loading = false;
		state.progress = state.max;

		return state
	});
}

export function addLoadingProgress(amount: number) {
	loadingState.update((state) => {
		if (state.loading) {
			const newProgress = Math.min(state.progress + amount, state.max);

			state.progress = newProgress;
			if (state.progress == state.max) {
				// state.loading = false;
			}
		}

		return state;
	});
}
