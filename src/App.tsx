import React from "react";
import TextToSpeech from "./TextToSpeech";

import "primereact/resources/themes/saga-blue/theme.css"; // Theme for PrimeReact
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const App: React.FC = () => {
	return (
		<div className="App">
			<h1>Text-to-Speech Converter</h1>
			<TextToSpeech />
		</div>
	);
};

export default App;
