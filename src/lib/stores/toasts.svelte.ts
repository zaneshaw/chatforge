export type ToastLevel = "error" | "warning" | "info";

export type Toast = {
	level: ToastLevel;
	text: string;
	id: number;
};

export let toasts: Toast[] = $state([]);
let currentId = 0;

export function pushToast(level: ToastLevel, text: string, duration: number = 5000) {
	const id = currentId;

	const toast = {
		level: level,
		text: text,
		id: id,
	};

	if (duration > -1) {
		setTimeout(() => dismissToast(id), duration);
	}

	currentId++;
	toasts.push(toast);
}

export function dismissToast(id: number) {
	for (let i = 0; i < toasts.length; i++) {
		if (toasts[i].id == id) {
			toasts.splice(i, 1);
			return;
		}
	}
}

export function dismissAllToasts() {
	toasts.splice(0, toasts.length);
}
