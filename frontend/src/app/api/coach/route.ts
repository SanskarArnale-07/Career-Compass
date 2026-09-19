import { NextResponse } from "next/server";
import {
  generateLocalCoachResponse,
  buildCoachSystemPrompt,
} from "@/lib/coach/coach-engine";
import type { CareerCoachContext } from "@/lib/career-details/career-context";

export async function POST(request: Request) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request payload" },
        { status: 400 }
      );
    }

    const { message, context, history } = (body || {}) as {
      message?: unknown;
      context?: CareerCoachContext;
      history?: { role: string; content: string }[];
    };

    // 1. Input Validation
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "A valid non-empty message string is required" },
        { status: 400 }
      );
    }

    if (!context || typeof context !== "object" || !context.career?.title) {
      return NextResponse.json(
        { error: "A valid CareerCoachContext object with targeted career is required" },
        { status: 400 }
      );
    }

    const cleanMessage = message.trim().slice(0, 2000);

    // 2. Check if an external LLM key is configured (OpenAI/Anthropic/Gemini)
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        const systemPrompt = buildCoachSystemPrompt(context);
        const messages = [
          { role: "system", content: systemPrompt },
          ...(Array.isArray(history) ? history.slice(-6) : []),
          { role: "user", content: cleanMessage },
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
            temperature: 0.6,
            max_tokens: 800,
          }),
          signal: AbortSignal.timeout(10000), // 10 second timeout protection
        });

        if (openAiRes.ok) {
          const data = await openAiRes.json();
          const aiResponse = data.choices?.[0]?.message?.content;
          if (aiResponse && typeof aiResponse === "string" && aiResponse.trim()) {
            return NextResponse.json({
              response: aiResponse,
              timestamp: Date.now(),
              engine: "llm",
            });
          }
        } else {
          console.warn(`External LLM API returned status ${openAiRes.status}, falling back to grounded engine`);
        }
      } catch (err) {
        console.warn("External LLM API call timed out or failed, falling back to local coach engine:", err);
      }
    }

    // 3. Grounded Deterministic Coach Engine (instant, zero external dependency, 100% data-grounded)
    const localResponse = await generateLocalCoachResponse(cleanMessage, context);

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
