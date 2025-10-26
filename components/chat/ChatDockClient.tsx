// components/chat/ChatDockClient.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatDockClient() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm InvestEd's tutor. Ask about compounding, DCA, IRAs/401(k)s, fees, or this dashboard.",
    },
  ]);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Open-on-event so any CTA can trigger this exact dock
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("invested:open-chat", onOpen);
    return () => window.removeEventListener("invested:open-chat", onOpen);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 0);
  }, [open]);

  async function fetchJSON(url: string, init: RequestInit, ms = 20000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    try {
      const res = await fetch(url, { ...init, signal: ctrl.signal });
      let json: any = null;
      try {
        json = await res.json();
      } catch {}
      return { ok: res.ok, status: res.status, json };
    } finally {
      clearTimeout(t);
    }
  }

  function normalizeReply(json: any): string | null {
    if (!json) return null;
    if (typeof json.reply === "string") return json.reply;
    if (typeof json.text === "string") return json.text;
    if (Array.isArray(json.output) && typeof json.output[0] === "string")
      return json.output[0];
    if (typeof json.message === "string") return json.message;
    if (typeof json.answer === "string") return json.answer;
    return null;
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const { ok, status, json } = await fetchJSON("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!ok) {
        const friendly =
          (json && (json.error || json.message)) ||
          (status === 405
            ? "The chat route isn’t exporting a POST handler. Make sure app/api/ai-chat/route.ts exports `export async function POST(...)`."
            : status === 500
            ? "Server error. If you’re using Gemini, confirm GEMINI_API_KEY is set in .env.local and the dev server was restarted."
            : `Request failed (HTTP ${status}).`);
        setMessages((m) => [...m, { role: "assistant", content: friendly }]);
        return;
      }
      const reply = normalizeReply(json) ?? "No response";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e: any) {
      const abort = e?.name === "AbortError";
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: abort
            ? "The request timed out. Try again."
            : "I'm having trouble connecting right now. If you’re using Gemini, make sure GEMINI_API_KEY is set in .env.local and restart the dev server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open ? (
        <Button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-emerald-500 text-black font-semibold shadow-xl"
        >
          Ask InvestEd
        </Button>
      ) : (
        <div className="w-[448px] max-w-[90vw] rounded-2xl border border-white/10 bg-[#0e1a2a] text-slate-200 shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="font-semibold text-white">InvestEd Chat</div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          </div>

          <div className="max-h-[50vh] overflow-y-auto px-4 py-3 space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "text-right" : "text-left"}
              >
                <div
                  className={
                    "inline-block rounded-xl px-3 py-2 max-w-[80%] break-words " +
                    (m.role === "user"
                      ? "bg-emerald-400/20 text-emerald-100"
                      : "bg-white/10 text-slate-100")
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-slate-400">Thinking…</div>}
          </div>

          <div className="px-3 pb-3 pt-2 border-t border-white/10">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              rows={2}
              placeholder="Ask about DCA, IRAs, compounding, fees…"
              className="w-full resize-none rounded-lg bg-white/10 text-white p-2 outline-none border-0"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-slate-400">
                Powered by Gemini AI
              </span>
              <Button
                onClick={send}
                disabled={loading}
                className="bg-emerald-400 text-black font-semibold"
              >
                {loading ? "Sending…" : "Send"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
