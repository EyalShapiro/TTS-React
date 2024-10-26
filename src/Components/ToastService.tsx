// ToastService.ts
import { Toast } from "primereact/toast";
import { RefObject } from "react";

class ToastService {
	private toastRef: RefObject<Toast>;

	constructor(toastRef: RefObject<Toast>) {
		this.toastRef = toastRef;
	}

	show(severity: string, summary: string, detail: string, life: number = 3000) {
		this.toastRef.current?.show({ severity, summary, detail, life });
	}

	success(summary: string, detail: string) {
		this.show("success", summary, detail);
	}

	error(summary: string, detail: string) {
		this.show("error", summary, detail);
	}

	warn(summary: string, detail: string) {
		this.show("warn", summary, detail);
	}

	info(summary: string, detail: string) {
		this.show("info", summary, detail);
	}
}

export default ToastService;
