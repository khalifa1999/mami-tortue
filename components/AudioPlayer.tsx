'use client';

import { useState, useEffect, useRef } from "react";

interface AudioPlayerProps {
  audioUrl: string;
  duration: number;
  onDurationChange: (duration: number) => void;
}

export default function AudioPlayer({
  audioUrl,
  duration,
  onDurationChange,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [formattedDuration, setFormattedDuration] = useState("0:00");
  const [formattedCurrentTime, setFormattedCurrentTime] = useState("0:00");

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    setFormattedDuration(formatTime(duration));
  }, [duration]);

  useEffect(() => {
    setFormattedCurrentTime(formatTime(currentTime));
  }, [currentTime]);

  useEffect(() => {
    if (typeof window !== "undefined" && audioRef.current) {
      audioRef.current.addEventListener("timeupdate", () => {
        setCurrentTime(audioRef.current.currentTime);
      });

      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("timeupdate", () => {});
          audioRef.current.removeEventListener("ended", () => {});
        }
      };
    }
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const seekTime = (Number(e.target.value) / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <div className="flex items-center space-x-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className={`
            flex items-center justify-center w-10 h-10 rounded-full
            bg-gray-200 dark:bg-gray-700
            hover:bg-gray-300 dark:hover:bg-gray-600
            transition-colors
          `}
          aria-label={isPlaying ? "Pause" : "Lecture"}
        >
          {isPlaying ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 12M6 6l12 6"></path>
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v14l11-7z"></path>
            </svg>
          )}
        </button>

        {/* Progress Bar */}
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="100"
            value={isPlaying ? (currentTime / duration) * 100 : 0}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer"
            style={{ 
              background: `linear-gradient(to right, #3b82f6 ${isPlaying ? (currentTime / duration) * 100 : 0}%, #e5e7eb ${isPlaying ? (currentTime / duration) * 100 : 0}%)`,
              WebkitAppearance: "none"
            }}
          />
        </div>

        {/* Time Display */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{formattedCurrentTime}</span>
          <span>/</span>
          <span>{formattedDuration}</span>
        </div>
      </div>
      
      {/* Audio element (hidden) */}
      <audio 
        ref={audioRef} 
        src={audioUrl} 
        preload="auto"
      />
    </div>
  );
}