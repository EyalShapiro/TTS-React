import React, { useState } from "react";
import TextToSpeech from "./Components/TextToSpeech";

import "primereact/resources/themes/saga-blue/theme.css"; // Theme for PrimeReact
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { ToastProvider } from "./context/ToastContext";
import ThemeSwitcher from "./Components/ThemeSwitcher";

const App: React.FC = () => {
	const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

	const handleThemeChange = (darkMode: boolean) => {
		setIsDarkMode(darkMode);
	};

	return (
		<ToastProvider>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					width: "100vw",
					height: "100vh",
					backgroundColor: isDarkMode ? "#121212" : "#fff9",
					color: isDarkMode ? "#fff" : "#000000",
					transition: "background-color 0.3s, color 0.3s",
				}}
			>
				<h1>Text-to-Speech Converter</h1>

				<div style={{ position: "absolute", top: 25, left: 25 }}>
					<ThemeSwitcher onThemeChange={handleThemeChange} />
				</div>

				<TextToSpeech />
			</div>
		</ToastProvider>
	);
};

export default App;
