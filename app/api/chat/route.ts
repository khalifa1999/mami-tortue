import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import axios from "axios";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    // Check if Groq API key is present
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Groq API key not configured" },
        { status: 500 }
      );
    }

    // Get response from Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Tu es Mamie Tortue, une grand-mère bienveillante et sage qui aime parler de la vie quotidienne, de la famille, des souvenirs et donner des conseils doux. Tu réponds en français avec chaleur et empathie.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.3-70b-versatile", // Using a currently supported Groq model
      temperature: 0.8,
    });

    const responseText =
      chatCompletion.choices[0]?.message?.content ||
      "Je suis désolée, je n'ai pas compris. Pourriez-vous répéter?";

    // Try to generate audio using ElevenLabs, but fall back to text-only if it fails
    let audioUrl: string | null = null;
    let duration: number = 0;

    if (process.env.ELEVENLABS_API_KEY) {
      try {
        // Generate audio using ElevenLabs
        const audioResponse = await axios.post(
          `https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM`, // Using a default voice
          {
            text: responseText,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5,
            },
          },
          {
            headers: {
              Accept: "audio/mpeg",
              "Content-Type": "application/json",
              "xi-api-key": process.env.ELEVENLABS_API_KEY,
            },
            responseType: "arraybuffer",
          }
        );

        // Convert audio buffer to base64 for sending back to client
        const audioBase64 = Buffer.from(audioResponse.data, "binary").toString(
          "base64"
        );
        audioUrl = `data:audio/mpeg;base64,${audioBase64}`;

        // Estimate duration (rough approximation: ~150 chars per second for English, adjust for French)
        duration = Math.max(1, Math.round(responseText.length / 12));
      } catch (elevenLabsError) {
        // Log ElevenLabs error but continue with text-only response
        console.warn(
          "ElevenLabs TTS failed, falling back to text-only:",
          elevenLabsError.message
        );
        // Continue without audio - this is not a failure of the overall request
      }
    } else {
      console.info(
        "ElevenLabs API key not configured, providing text-only response"
      );
    }

    return NextResponse.json({
      response: responseText,
      audioUrl,
      duration,
    });
  } catch (error) {
    console.error("Error in chat API:", error);

    // Return more specific error information in development
    if (process.env.NODE_ENV === "development") {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      let errorDetails: Record<string, unknown> = {};

      if (
        error instanceof Error &&
        "response" in error &&
        error.response !== null
      ) {
        const typedError = error as {
          response?: { status?: number; data?: unknown };
        };
        if (typedError.response) {
          errorDetails = {
            status: typedError.response.status,
            data: typedError.response.data,
          };
        }
      }

      return NextResponse.json(
        {
          error: "Internal server error",
          details: errorMessage,
          ...errorDetails,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
