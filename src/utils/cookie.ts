export const setCookie = (name: string, value: string, days: number) => {
	const date = new Date();
	date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
	document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
};

export const getCookie = (name: string): string | null => {
	const nameEQ = `${name}=`;
	const ca = document.cookie.split(";");
	for (let c of ca) {
		while (c.charAt(0) === " ") c = c.substring(1);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
	}
	return null;
};
