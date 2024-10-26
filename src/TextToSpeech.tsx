import React, { useState, useEffect, useRef } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const TextToSpeech: React.FC = () => {
	const [text, setText] = useState<string>("");
	const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
	const [highlightedText, setHighlightedText] = useState<string>("");
	const toast = useRef<Toast>(null);
	const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

	// Handle text input
	const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(e.target.value);
	};

	// Start speech synthesis with word highlighting
	const handleSpeak = () => {
		if (!text.trim()) {
			toast.current?.show({
				severity: "warn",
				summary: "Empty Text",
				detail: "Please enter text to speak.",
				life: 3000,
			});
			return;
		}

		if ("speechSynthesis" in window) {
			const utterance = new SpeechSynthesisUtterance(text);
			utteranceRef.current = utterance;
			setIsSpeaking(true);

			let wordIndex = 0;
			const words = text.split(" ");

			// Highlight each word during speech
			utterance.onboundary = (event) => {
				if (event.name === "word") {
					setHighlightedText(words[wordIndex] || "");
					wordIndex++;
				}
			};

			utterance.onend = () => {
				setIsSpeaking(false);
				setHighlightedText("");
				toast.current?.show({
					severity: "success",
					summary: "Speech Finished",
					detail: "The speech has ended. Enjoy the sunset!",
					life: 3000,
				});
			};

			utterance.onerror = (error) => {
				setIsSpeaking(false);
				setHighlightedText("");
				toast.current?.show({
					severity: "error",
					summary: "Error",
					detail: "An error occurred during speech synthesis.",
					life: 3000,
				});
				console.error("Speech synthesis error:", error);
			};

			window.speechSynthesis.speak(utterance);
		} else {
			toast.current?.show({
				severity: "error",
				summary: "Unsupported",
				detail: "Speech synthesis is not supported in this browser.",
				life: 3000,
			});
		}
	};

	// Stop ongoing speech
	const handleStop = () => {
		if (utteranceRef.current) {
			window.speechSynthesis.cancel();
			setIsSpeaking(false);
			setHighlightedText("");
			toast.current?.show({ severity: "info", summary: "Stopped", detail: "Speech has been stopped.", life: 3000 });
		}
	};

	// Export audio as a downloadable file (simulation)
	const handleExport = () => {
		// Simulating the download feature since SpeechSynthesis API does not provide direct audio export
		const blob = new Blob([text], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "speech_text.txt"; // Placeholder for audio file
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);

		toast.current?.show({
			severity: "success",
			summary: "Exported",
			detail: "Text has been exported as a placeholder file.",
			life: 3000,
		});
	};

	// Highlighted text with bold styling
	const highlightedDisplay = text.split(" ").map((word, index) => (
		<span key={index} style={{ fontWeight: word === highlightedText ? "bold" : "normal" }}>
			{word}{" "}
		</span>
	));

	return (
		<Card>
			<Toast ref={toast} />
			<div className="p-field p-col-12">
				<label htmlFor="text">Text to Speak</label>
				<InputTextarea
					id="text"
					value={text}
					onChange={handleTextChange}
					rows={5}
					cols={30}
					autoResize
					placeholder="Enter text here..."
				/>
			</div>
			<div className="p-field p-col-12">
				<Button
					label={isSpeaking ? "Speaking..." : "Speak"}
					icon="pi pi-volume-up"
					onClick={handleSpeak}
					disabled={isSpeaking}
					className="p-button-primary"
				/>
				<Button
					label="Stop"
					icon="pi pi-stop"
					onClick={handleStop}
					disabled={!isSpeaking}
					className="p-button-secondary ml-2"
				/>
				<Button label="Export" icon="pi pi-download" onClick={handleExport} className="p-button-success ml-2" />
			</div>
			<div className="p-field p-col-12">
				<label>Preview with Highlighted Words</label>
				<p>{highlightedDisplay}</p>
			</div>
		</Card>
	);
};

export default TextToSpeech;
