import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { execSync } from "child_process";
import "dotenv/config";

//https://ogs.google.co.il/widget/app/so

const WEBSITE = "https://www.google.co.uk/";

// Fetch cookies using the Selenium script
const fetchCookies = async () => {
	try {
		const output = execSync("node fetchCookies.js", { encoding: "utf-8" });
		const cookies = output.match(/Formatted Cookies: (.+)/)?.[1]?.trim();
		console.log("Fetched Cookies:", cookies);
		return cookies;
	} catch (error) {
		console.error("Error fetching cookies:", error);
		return "";
	}
};

export default defineConfig(async ({ mode, command }) => {
	const env = loadEnv(mode, process.cwd());
	const customCookie = await fetchCookies();

	const proxy: Record<string, string | import("vite").ProxyOptions> | undefined =
		command === "serve"
			? {
					"/api": {
						target: WEBSITE,
						changeOrigin: true,
						secure: false,
						configure: (proxy) => {
							if (customCookie) {
								proxy.on("proxyReq", (proxyReq) => {
									proxyReq.setHeader("Cookie", customCookie);
								});
							}
							proxy.on("proxyRes", (proxyRes) => {
								console.log("Proxy Response Headers:", proxyRes.headers);
							});
						},
					},
			  }
			: undefined;

	return {
		plugins: [react()],
		server: {
			port: Number(env?.VITE_PORT || process.env?.VITE_PORT) || 3000,
			proxy,
		},
	};
});
