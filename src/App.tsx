import React from "react";
import TextToSpeech from "./Components/TextToSpeech";

import "primereact/resources/themes/saga-blue/theme.css"; // Theme for PrimeReact
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { ToastProvider } from "./context/ToastContext";

const App: React.FC = () => {
	return (
		<ToastProvider>
			<div
				className="App"
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					width: "100vw",
					height: "100vh",
					padding: "1px",
				}}
			>
				<h1>Text-to-Speech Converter</h1>
				<TextToSpeech />
			</div>
		</ToastProvider>
	);
};
export default App;
