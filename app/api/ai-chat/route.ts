// app/api/ai-chat/route.ts
// Use Node runtime so process.env works
export const runtime = "nodejs";

import { NextRequest } from "next/server";



// If you have the new SDK, you can swap to `google-genai` later.
// This works with your current dependency "@google/generative-ai": "^0.24.1"
import { GoogleGenerativeAI } from "@google/generative-ai";

/** GET /api/ai-chat — simple health check for your AiTest page */
export async function GET() {
  const hasKey = !!(
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY
  );
  return Response.json({
    ok: true,
    modelDefault: "gemini-2.5-flash",
    hasKey,
  });
}

/** POST /api/ai-chat — chat */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      messages?: Array<{ role: "user" | "assistant"; content: string }>;
      model?: string;
    };

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Missing GEMINI_API_KEY in .env.local (server). Restart dev server after adding." },
        { status: 500 }
      );
    }

    // ✅ Use a current REST model (not a Live-only one)
    const modelName = body?.model || "gemini-2.5-flash";

    const genai = new GoogleGenerativeAI(apiKey);
    const model = genai.getGenerativeModel({ model: modelName });

    // Build a minimal prompt from last user turn
    const last = body?.messages?.filter(Boolean).at(-1)?.content || "Hello!";
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: last }] }],
    });

    const reply = result?.response?.text?.() || "No response";
    return Response.json({ reply });
  } catch (err: any) {
    // Surface useful error text (e.g., 404 model not found)
    const msg =
      typeof err?.message === "string" ? err.message : "Server error during AI call";
    // Common model error? Give a hint.
    const hint = /not found|unsupported/i.test(msg)
      ? "Pick a REST model like gemini-2.5-flash or gemini-2.5-pro (not a Live/*native-audio* variant)."
      : undefined;

    return Response.json({ error: hint ? `${msg} — ${hint}` : msg }, { status: 500 });
  }
}
