'use client';

import VoiceInput from "@/components/VoiceInput";
import AudioPlayer from "@/components/AudioPlayer";
import QuickButtons from "@/components/QuickButtons";
import ResponseDisplay from "@/components/ResponseDisplay";
import { useState, useRef } from "react";

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [responseText, setResponseText] = useState<string>("");
  const [quickButtonClicked, setQuickButtonClicked] = useState<string | null>(null);
  const conversationRef = useRef<Array<{question: string; answer: string; audioUrl: string | null; duration: number}>>([]);

  const handleVoiceInput = async (text: string) => {
    setTranscript(text);
    setIsListening(false);
    await processChat(text);
  };

  const handleQuickButtonClick = async (topic: string) => {
    setQuickButtonClicked(topic);
    await processChat(topic);
  };

  const processChat = async (message: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setResponseText(data.response || "");
      setAudioUrl(data.audioUrl || null);
      setAudioDuration(data.duration || 0);

      // Add to conversation history
      conversationRef.current.push({
        question: message,
        answer: data.response || "",
        audioUrl: data.audioUrl || null,
        duration: data.duration || 0,
      });
    } catch (error) {
      console.error("Error processing chat:", error);
      setResponseText("Sorry, I encountered an error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Mamie Tortue 🐢
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Votre assistant vocal bienveillant pour parler de la vie quotidienne
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Voice Input Section */}
          <VoiceInput
            isListening={isListening}
            transcript={transcript}
            onVoiceInput={handleVoiceInput}
            onToggleListen={() => setIsListening(!isListening)}
          />

          {/* Quick Buttons Section */}
          <QuickButtons onButtonClick={handleQuickButtonClick} />

          {/* Response Display Section */}
          {responseText || transcript ? (
            <ResponseDisplay
              responseText={responseText}
              transcript={transcript}
              isProcessing={isProcessing}
              audioUrl={audioUrl}
              audioDuration={audioDuration}
              onAudioPlay={() => {
                // Audio player handles its own play logic
              }}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Appuyez sur le microphone pour commencer à parler
              </p>
            </div>
          )}

          {/* Audio Player Section */}
          {audioUrl && (
            <AudioPlayer
              audioUrl={audioUrl}
              duration={audioDuration}
              onDurationChange={setAudioDuration}
            />
          )}
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Mamie Tortue - Assistant vocal bienveillant
        </div>
      </footer>
    </div>
  );
}