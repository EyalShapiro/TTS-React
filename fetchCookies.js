import { Builder, By, until } from "selenium-webdriver";

async function fetchCookiesFromWebsite(targetUrl, waitElementSelector = null, waitTimeout = 10000) {
	console.log("%c Starting fetchCookiesFromWebsite", "color: blue");

	try {
		const driver = await new Builder().forBrowser("chrome").build();
		await driver.manage().window().maximize(); // Maximize browser window for reliable element detection

		await driver.get(targetUrl);

		// Use explicit waits for page loading (recommended)
		if (waitElementSelector) {
			await driver.wait(
				until.elementLocated(By.css(waitElementSelector)),
				waitTimeout,
				"Timed out waiting for element"
			);
		} else {
			console.log("No waitElementSelector provided, using default timeout of", waitTimeout, "ms.");
		}

		const cookies = await driver.manage().getCookies();
		console.log("Cookies:", cookies);

		const formattedCookies = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
		console.log("Formatted Cookies:", formattedCookies);

		return formattedCookies;
	} catch (error) {
		console.error("Error fetching cookies:", error);
		throw error; // Re-throw the error for handling in the caller
	} finally {
		await driver.quit();
		console.log("fetchCookiesFromWebsite finished");
	}
}
