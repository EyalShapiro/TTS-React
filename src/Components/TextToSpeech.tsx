// TextToSpeech.tsx
import React, { useState, useEffect, useRef } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { useToast } from "../context/ToastContext";

const TextToSpeech: React.FC = () => {
	const [text, setText] = useState<string>("");
	const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
	const [highlightedText, setHighlightedText] = useState<string>("");
	const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
	const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
	const [searchTerm, setSearchTerm] = useState<string>("");

	const { showToast } = useToast(); // Use the useToast hook
	const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

	// Load available voices
	useEffect(() => {
		const loadVoices = () => {
			const availableVoices = window.speechSynthesis.getVoices();
			setVoices(availableVoices);

			// Set default voice if available
			if (availableVoices.length > 0) {
				setSelectedVoice(availableVoices[0]); // Set first available voice as default
			}
		};
		loadVoices();
		window.speechSynthesis.onvoiceschanged = loadVoices;
	}, []);

	// Handle text input
	const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(e.target.value);
	};

	// Start speech synthesis with word highlighting
	const handleSpeak = () => {
		if (!text.trim()) {
			showToast("warn", "Empty Text", "Please enter text to speak.");
			return;
		}

		if ("speechSynthesis" in window) {
			window.speechSynthesis.cancel(); // Cancel any ongoing speech

			const utterance = new SpeechSynthesisUtterance(text);
			utteranceRef.current = utterance;
			setIsSpeaking(true);

			if (selectedVoice) utterance.voice = selectedVoice;

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
				showToast("success", "Speech Finished", "The speech has ended. Enjoy the sunset!");
			};

			utterance.onerror = (error) => {
				setIsSpeaking(false);
				setHighlightedText("");
				showToast("error", "Error", "An error occurred during speech synthesis.");
				console.error("Speech synthesis error:", error);
			};

			window.speechSynthesis.speak(utterance);
		} else {
			showToast("error", "Unsupported", "Speech synthesis is not supported in this browser.");
		}
	};

	// Stop ongoing speech
	const handleStop = () => {
		if (utteranceRef.current) {
			window.speechSynthesis.cancel();
			setIsSpeaking(false);
			setHighlightedText("");
			showToast("info", "Stopped", "Speech has been stopped.");
		}
	};

	// Export recorded audio as a downloadable file (placeholder)
	const handleExport = () => {
		const textBlob = new Blob([text], { type: "text/plain" });
		const url = URL.createObjectURL(textBlob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "speech_text.txt"; // Placeholder for audio file
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);

		showToast("success", "Exported", "Text has been exported as a placeholder file.");
	};

	// Filter voices based on search term
	const filteredVoices = voices.filter((voice) => voice.name.toLowerCase().includes(searchTerm.toLowerCase()));

	const isButtonDisabled = !text.trim() || isSpeaking; // Disable buttons if no text or if speaking

	return (
		<div>
			<Card style={{ width: "100%" }} title={"Text to Speak"} role="region">
				<FloatLabel>
					<label htmlFor="text">Text to Speak</label>
					<InputTextarea
						id="text"
						style={{ width: "100%" }}
						value={text}
						onChange={handleTextChange}
						rows={5}
						autoResize
						placeholder="Enter text here..."
					/>
				</FloatLabel>
				<Dropdown
					showClear
					value={selectedVoice}
					options={filteredVoices}
					onChange={(e) => {
						setSelectedVoice(e.value);
					}}
					optionLabel="name"
					placeholder="Select a Voice"
					editable
					style={{ width: "100%" }}
					panelStyle={{ background: "deepskyblue" }}
					showOnFocus
				/>
				<>
					<Button
						label={isSpeaking ? "Speaking..." : "Speak"}
						icon="pi pi-volume-up"
						onClick={handleSpeak}
						disabled={isButtonDisabled} // Disable if no text or speaking
					/>
					<Button
						label="Stop"
						icon="pi pi-stop"
						onClick={handleStop}
						disabled={!isSpeaking} // Only disable if not speaking
						style={{ marginLeft: "0.5rem" }}
					/>
				</>
			</Card>
			<Card
				title={<label>Preview with Highlighted Words</label>}
				style={{ marginTop: 8 }}
				footer={
					<Button
						label="Export to Text"
						icon="pi pi-download"
						onClick={handleExport}
						disabled={!text.trim()} /* Disable if no text */
					/>
				}
			>
				<p
					style={{
						color: highlightedText ? "darkcyan" : "black",
						fontWeight: highlightedText ? "bold" : "normal",
					}}
				>
					{text.split(" ").map((word, index) => (
						<span key={index}>{word} </span>
					))}
				</p>
			</Card>
		</div>
	);
};

export default TextToSpeech;
