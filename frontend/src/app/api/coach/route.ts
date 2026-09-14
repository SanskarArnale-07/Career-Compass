import { NextResponse } from "next/server";
import {
  generateLocalCoachResponse,
  buildCoachSystemPrompt,
} from "@/lib/coach/coach-engine";
import type { CareerCoachContext } from "@/lib/career-details/career-context";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, context, history } = body as {
      message: string;
      context: CareerCoachContext;
      history?: { role: string; content: string }[];
    };

    if (!message || !context) {
      return NextResponse.json(
        { error: "Message and CareerCoachContext are required" },
        { status: 400 }
      );
    }

    // Check if an external LLM key is configured (OpenAI/Anthropic/Gemini)
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        const systemPrompt = buildCoachSystemPrompt(context);
        const messages = [
          { role: "system", content: systemPrompt },
          ...(history || []).slice(-6),
          { role: "user", content: message },
        ];

        const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages,
            temperature: 0.7,
            max_tokens: 800,
          }),
        });

        if (openAiRes.ok) {
          const data = await openAiRes.json();
          const aiResponse = data.choices?.[0]?.message?.content;
          if (aiResponse) {
            return NextResponse.json({
              response: aiResponse,
              timestamp: Date.now(),
              engine: "llm",
            });
          }
        }
      } catch (err) {
        console.warn("LLM API call failed, falling back to local coach engine:", err);
      }
    }

    // Default: Grounded Local Coach Engine (fast, zero external dependency)
    const localResponse = await generateLocalCoachResponse(message, context);

    return NextResponse.json({
      response: localResponse,
      timestamp: Date.now(),
      engine: "grounded-engine",
    });
  } catch (error) {
    console.error("Coach API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
