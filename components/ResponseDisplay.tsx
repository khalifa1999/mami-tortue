interface ResponseDisplayProps {
  responseText: string;
  transcript: string;
  isProcessing: boolean;
  audioUrl: string | null;
  audioDuration: number;
  onAudioPlay: () => void;
}

export default function ResponseDisplay({
  responseText,
  transcript,
  isProcessing,
  audioUrl,
  audioDuration,
  onAudioPlay,
}: ResponseDisplayProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <div className="space-y-4">
        {/* Transcript (if available) */}
        {transcript && !isProcessing && !responseText ? (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="font-medium text-gray-800 dark:text-gray-100">
              Vous avez dit :
            </p>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              "{transcript}"
            </p>
          </div>
        ) : null}

        {/* Processing state */}
        {isProcessing && !responseText ? (
          <div className="flex items-center space-x-3">
            <div className="h-4 w-4 border-2 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
            <span className="text-gray-600 dark:text-gray-300">
              Mamie Tortue réfléchit...
            </span>
          </div>
        ) : null}

        {/* Response text */}
        {responseText && (
          <div className="text-gray-800 dark:text-gray-100">
            <p className="font-medium mb-2">
              Mamie Tortue dit :
            </p>
            <p className="text-lg leading-relaxed">
              {responseText}
            </p>
          </div>
        )}

        {/* Audio info */}
        {audioUrl && audioDuration > 0 && (
          <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a2 2 0 110-4 2 2 0 010 4zM9 16v-6m6 6v-6"></path>
            </svg>
            <span>Durée estimée : {audioDuration}s</span>
          </div>
        )}
      </div>
    </div>
  );
}