// ToastContext.tsx
import React, { createContext, useContext, useRef } from "react";
import { Toast } from "primereact/toast";

export type ToastSeverityType = "success" | "info" | "warn" | "error" | "secondary" | "contrast"; // Define a type for severity

interface ToastContextProps {
	showToast: (severity: ToastSeverityType, summary: string, detail: string, life?: number) => void; // Use the defined type
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const toastRef = useRef<Toast>(null);

	const showToast = (severity: ToastSeverityType, summary: string, detail: string, life: number = 3000) => {
		if (toastRef.current) {
			toastRef.current.show({ severity, summary, detail, life });
		}
	};

	return (
		<ToastContext.Provider value={{ showToast }}>
			<Toast ref={toastRef} />
			{children}
		</ToastContext.Provider>
	);
};

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
};
