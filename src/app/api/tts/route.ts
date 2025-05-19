import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return new NextResponse("Missing OpenAI API key", { status: 500 });
  }

  const openaiRes = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "tts-1",
      input: text,
      voice: "alloy"
    })
  });

  if (!openaiRes.ok) {
    const errorText = await openaiRes.text();
    return new NextResponse(errorText, { status: openaiRes.status });
  }

  const audioBuffer = await openaiRes.arrayBuffer();
  return new NextResponse(audioBuffer, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg"
    }
  });
} 