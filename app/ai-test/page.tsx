"use client";
import { useState } from "react";

export default function AiTest() {
  const [health, setHealth] = useState("");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");

  async function checkHealth() {
    setHealth(""); setReply(""); setError("");
    const res = await fetch("/api/ai-chat");
    const data = await res.json().catch(() => ({}));
    setHealth(JSON.stringify(data));
  }

  async function ask() {
    setReply(""); setError("");
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: "Say hi in one short line." }] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setReply(data.reply || "");
    } catch (e: any) {
      setError(String(e.message || e));
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
      <h1>AI Route Smoke Test</h1>
      <button onClick={checkHealth}>GET /api/ai-chat</button>
      <div>{health}</div>

      <div style={{ marginTop: 16 }}>
        <button onClick={ask}>POST /api/ai-chat</button>
        {reply && <pre>{reply}</pre>}
        {error && <div style={{ color: "crimson" }}>Error: {error}</div>}
      </div>
    </main>
  );
}
