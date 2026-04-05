'use client';

import { useState, useEffect } from "react";

// Extend the Window interface to include SpeechRecognition types
interface Window {
  SpeechRecognition: typeof webkitSpeechRecognition;
  webkitSpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
  };
}

interface VoiceInputProps {
  isListening: boolean;
  transcript: string;
  onVoiceInput: (text: string) => void;
  onToggleListen: () => void;
}

export default function VoiceInput({
  isListening,
  transcript,
  onVoiceInput,
  onToggleListen,
}: VoiceInputProps) {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  // Check if Web Speech API is supported
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSupported(
        "SpeechRecognition" in window ||
        "webkitSpeechRecognition" in window
      );
    }
  }, []);

  if (isSupported === false) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
        <p className="flex items-center space-x-2">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          Votre navigateur ne supporte pas la reconnaissance vocale.
          Veuillez utiliser Chrome, Edge ou Safari.
        </p>
      </div>
    );
  }

  const handleStartListening = () => {
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      return;
    }

    const SpeechRecognition =
      // @ts-ignore
      window.SpeechRecognition || // @ts-ignore
      window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "fr-FR";

    recognition.onresult = (event: Event) => {
      const speechRecognitionEvent = event as SpeechRecognitionEvent;
      const transcript = Array.from(speechRecognitionEvent.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      // Update interim transcript
      onVoiceInput(transcript);

      if (speechRecognitionEvent.results[0].isFinal) {
        recognition.stop();
      }
    };

    recognition.onend = () => {
      onToggleListen();
    };

    recognition.onerror = (event: Event) => {
      const speechRecognitionEvent = event as SpeechRecognitionEvent;
      console.warn("Speech recognition warning:", speechRecognitionEvent.error);
      // Don't toggle listen on error as it might be recoverable
      // Only toggle on actual end or fatal errors
      if (speechRecognitionEvent.error === 'not-allowed' || speechRecognitionEvent.error === 'service-not-allowed') {
        onToggleListen();
      }
    };

    recognition.start();
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col items-center space-y-4">
        {/* Microphone Button */}
        <button
          onClick={handleStartListening}
          disabled={isListening}
          className={`
            flex items-center justify-center w-20 h-20 rounded-full
            ${isListening ? "bg-red-500" : "bg-gray-200 dark:bg-gray-700"}
            text-${isListening ? "white" : "gray-600 dark:text-gray-300"}
            transition-all duration-300 transform
            ${isListening ? "animate-pulse" : ""}
            hover:${!isListening ? "bg-gray-300 dark:bg-gray-600" : ""}
          `}
          aria-label={isListening ? "Écoute en cours..." : "Commencer à parler"}
        >
          {isListening ? (
            <svg className="h-6 w-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l4 4H6l4-4z"></path>
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3M9 12h6m-6 4h6M5 18h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v8a2 2 0 002 2z"></path>
            </svg>
          )}
          <span className="mt-2 text-xs font-medium">
            {isListening ? "Écoute..." : "Parler"}
          </span>
        </button>

        {/* Status */}
        {!isListening && transcript ? (
          <p className="text-gray-500 dark:text-gray-400 italic">
            "{transcript}"
          </p>
        ) : isListening ? (
          <p className="text-gray-500 dark:text-gray-400 italic animate-pulse">
            Écoute en cours...
          </p>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            Appuyez sur le microphone et parlez
          </p>
        )}
      </div>
    </div>
  );
}