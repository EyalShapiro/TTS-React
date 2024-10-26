import React from "react";
import TextToSpeech from "./Components/TextToSpeech";

import "primereact/resources/themes/saga-blue/theme.css"; // Theme for PrimeReact
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const App: React.FC = () => {
	return (
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
	);
};
export default App;
