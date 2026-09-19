import { NextResponse } from "next/server";
import {
  generateLocalCoachResponse,
  buildCoachSystemPrompt,
} from "@/lib/coach/coach-engine";
import type { CareerCoachContext } from "@/lib/career-details/career-context";

// ── In-Memory Sliding Window Rate Limiter ─────────────────────────────
interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests per minute

function checkRateLimit(clientIp: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  let entry = rateLimitStore.get(clientIp);

  if (!entry) {
    entry = { timestamps: [] };
    rateLimitStore.set(clientIp, entry);
  }

  // Prune expired entries
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  entry.timestamps = entry.timestamps.filter((ts) => ts > cutoff);

  if (entry.timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = entry.timestamps[0] || now;
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((RATE_LIMIT_WINDOW_MS - (now - oldest)) / 1000)
    );
    return { allowed: false, retryAfter: retryAfterSeconds };
  }

  entry.timestamps.push(now);
  return { allowed: true, retryAfter: 0 };
}

// ── Coach Route Handler ───────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
    const { allowed, retryAfter } = checkRateLimit(clientIp);

    if (!allowed) {
      return NextResponse.json(
        {
          error: "rate_limit_exceeded",
          message: "Too many coaching requests. Please pause for a moment before continuing.",
          retry_after_seconds: retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
          },
        }
      );
    }

    // 2. Parse JSON Payload
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request payload" },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Request payload must be a JSON object" },
        { status: 400 }
      );
    }

    const payload = body as Record<string, unknown>;
    const message = payload.message;
    const context = payload.context as CareerCoachContext | undefined;
    const rawHistory = payload.history;

    // 3. Message Validation
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "A valid non-empty message string is required" },
        { status: 400 }
      );
    }

    const cleanMessage = message.trim().slice(0, 2000);

    // 4. Context Validation
    if (
      !context ||
      typeof context !== "object" ||
      !context.career ||
      typeof context.career.title !== "string" ||
      !context.career.title.trim()
    ) {
      return NextResponse.json(
        { error: "A valid CareerCoachContext object with targeted career title is required" },
        { status: 400 }
      );
    }

    // 5. History Validation (sanitize & limit length)
    const sanitizedHistory: { role: "user" | "assistant"; content: string }[] = [];
    if (Array.isArray(rawHistory)) {
      const allowedRoles = new Set(["user", "assistant", "coach", "system"]);
      for (const item of rawHistory.slice(-10)) {
        if (
          item &&
          typeof item === "object" &&
          typeof item.role === "string" &&
          typeof item.content === "string" &&
          allowedRoles.has(item.role)
        ) {
          sanitizedHistory.push({
            role: item.role === "user" ? "user" : "assistant",
            content: item.content.slice(0, 2000),
          });
        }
      }
    }

    // 6. External LLM (if configured in environment)
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && apiKey.trim()) {
      try {
        const systemPrompt = buildCoachSystemPrompt(context);
        const messages = [
          { role: "system", content: systemPrompt },
          ...sanitizedHistory.slice(-6),
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
          signal: AbortSignal.timeout(8000), // 8 second timeout protection
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
        }
      } catch (err) {
        // Upstream failure or timeout - safely fall through to local deterministic engine
        console.warn("External LLM call failed or timed out; falling back to grounded engine:", err);
      }
    }

    // 7. Grounded Deterministic Coach Engine (instant, zero external dependency, 100% data-grounded)
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
