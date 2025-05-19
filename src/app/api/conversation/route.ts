import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getAssistantStub, getSystemPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  const { messages, topic, userPrefs } = await req.json();

  const userPrompt = messages
    .filter((msg: any) => msg.role === "user")
    .at(-1)?.content;

  const systemPrompt = getSystemPrompt(topic, userPrefs, userPrompt);

  const chatHistory = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  let feedback: string | null = null;

  if (messages.length > 0 && messages[messages.length - 1].role === "user") {
    feedback = getAssistantStub();
  }

  const chatHistoryWithFeedback = chatHistory.concat(
    feedback ? [{ role: "assistant", content: feedback }] : []
  );

  const systemResponse = streamText({
    model: openai("gpt-4o"),
    messages: chatHistoryWithFeedback,
  });

  return systemResponse.toTextStreamResponse();
}
