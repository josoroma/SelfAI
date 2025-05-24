import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge'; // for streaming

export async function POST(req: NextRequest) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return new NextResponse("Missing OpenAI API key", { status: 500 });
  }

  const formData = await req.formData();
  const file = formData.get("audio");
  if (!file || !(file instanceof Blob)) {
    return new NextResponse("No audio file uploaded", { status: 400 });
  }

  const openaiRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: (() => {
      const fd = new FormData();
      fd.append("file", file, "audio.webm");
      fd.append("model", "whisper-1");
      fd.append("response_format", "text");
      return fd;
    })()
  });

  if (!openaiRes.ok) {
    const errorText = await openaiRes.text();
    return new NextResponse(errorText, { status: openaiRes.status });
  }

  const text = await openaiRes.text();
  return new NextResponse(text, { status: 200 });
} 