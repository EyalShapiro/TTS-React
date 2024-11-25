import React, { useState, useEffect } from "react";
// import { Button } from "primereact/button";
import { ToggleButton } from "primereact/togglebutton";
import { getCookie, setCookie } from "../utils/cookie";

interface ThemeSwitcherProps {
	onThemeChange: (isDarkMode: boolean) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ onThemeChange }) => {
	const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

	useEffect(() => {
		// Check cookie on load
		const userPreference = getCookie("user_preference");
		const darkModeEnabled = userPreference === "dark_mode";
		setIsDarkMode(darkModeEnabled);
		onThemeChange(darkModeEnabled);
	}, [onThemeChange]);

	const toggleTheme = (checked: boolean) => {
		const newMode = checked ? "dark_mode" : "light_mode";
		setCookie("user_preference", newMode, 7); // Update the cookie
		setIsDarkMode(checked); // Update the state
		onThemeChange(checked); // Notify parent
	};

	return (
		<ToggleButton
			onLabel="Dark Mode"
			offLabel="Light Mode"
			onIcon="pi pi-moon"
			offIcon="pi pi-sun"
			checked={isDarkMode}
			onChange={(e) => toggleTheme(e.value)}
			className="p-button-rounded p-button-outlined"
			style={{
				backgroundColor: isDarkMode ? "#ffffff" : "#121212",
				color: isDarkMode ? "#121212" : "#ffffff",
				border: "1px solid",
				transition: "background-color 0.3s, color 0.3s",
			}}
		/>
	);
};

export default ThemeSwitcher;
