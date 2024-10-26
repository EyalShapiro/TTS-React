import React, { useState, useEffect, useRef } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { FloatLabel } from "primereact/floatlabel";

const TextToSpeech: React.FC = () => {
	const [text, setText] = useState<string>("");
	const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
	const [highlightedText, setHighlightedText] = useState<string>("");
	const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
	const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
	const toast = useRef<Toast>(null);
	const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);

	// Load available voices
	useEffect(() => {
		const loadVoices = () => {
			const availableVoices = window.speechSynthesis.getVoices();
			setVoices(availableVoices);
		};
		loadVoices();
		window.speechSynthesis.onvoiceschanged = loadVoices;
	}, []);

	// Handle text input
	const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(e.target.value);
	};

	// Automatically select voice language based on text content
	const selectVoice = (text: string): SpeechSynthesisVoice | null => {
		for (let voice of voices) {
			if (voice.lang.startsWith(text.substring(0, 2).toLowerCase())) {
				return voice;
			}
		}
		return voices[0] || null; // Default to first available voice if no match found
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
			window.speechSynthesis.cancel(); // Cancel any ongoing speech

			const utterance = new SpeechSynthesisUtterance(text);
			utteranceRef.current = utterance;
			setIsSpeaking(true);

			const selectedVoice = selectVoice(text);
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
				toast.current?.show({
					severity: "success",
					summary: "Speech Finished",
					detail: "The speech has ended. Enjoy the sunset!",
					life: 3000,
				});

				// Stop recording if active (but not capturing audio in this case)
				if (mediaRecorderRef.current) {
					mediaRecorderRef.current.stop();
				}
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

			// Simulate speaking and audio export
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

	// Export recorded audio as a downloadable file (placeholder)
	const handleExport = () => {
		// This will only simulate the export
		const textBlob = new Blob([text], { type: "text/plain" });
		const url = URL.createObjectURL(textBlob);
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
		<div>
			<Card>
				<Toast ref={toast} />
				<FloatLabel>
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
				</FloatLabel>
				<div className="p-field p-col-12">
					<Button
						label={isSpeaking ? "Speaking..." : "Speak"}
						icon="pi pi-volume-up"
						onClick={handleSpeak}
						disabled={isSpeaking}
					/>
					<Button
						label="Stop"
						icon="pi pi-stop"
						onClick={handleStop}
						disabled={!isSpeaking}
						className="p-button-secondary ml-2"
					/>
					<Button label="Export to Text" icon="pi pi-download" onClick={handleExport} />
				</div>
			</Card>
			<Card>
				<label>Preview with Highlighted Words</label>
				<p>{highlightedDisplay}</p>
			</Card>
		</div>
	);
};

export default TextToSpeech;
