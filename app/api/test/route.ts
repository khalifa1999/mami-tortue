import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    groqKeyExists: !!process.env.GROQ_API_KEY,
    elevenlabsKeyExists: !!process.env.ELEVENLABS_API_KEY,
    groqKeyPrefix: process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.substring(0, 10) + "..." : "not set",
    elevenlabsKeyPrefix: process.env.ELEVENLABS_API_KEY ? process.env.ELEVENLABS_API_KEY.substring(0, 10) + "..." : "not set",
    nodeEnv: process.env.NODE_ENV,
  });
}