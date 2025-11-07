// app/coach/page.tsx

"use client";

import { FormEvent, useState } from "react";

type Mode = "bridge" | "phase" | "sunday";

type CoachReply = {
  sessionId: number;
  reply: {
    id: number;
    role: string;
    mode: string;
    content: string;
    structured?: unknown;
    createdAt: string;
  };
};

export default function CoachPage() {
  const [mode, setMode] = useState<Mode>("bridge");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string; mode: Mode }[]
  >([]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const text = input.trim();
    setInput("");
    setLoading(true);

    // Show your message immediately
    setMessages((prev) => [
      ...prev,
      { role: "user", text, mode },
    ]);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          input: text,
          sessionId,
        }),
      });

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text:
              "The coach hit an error interpreting that input. Try again.",
            mode,
          },
        ]);
        setLoading(false);
        return;
      }

      const data: CoachReply = await res.json();
      if (!sessionId) setSessionId(data.sessionId);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "Here is your input normalized into the Ops Protocol view. This prototype is strict and factual, not emotional.",
          mode,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "Network/server error. Your input may not have been saved.",
          mode,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
      {/* Header */}
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-50">
          Ops Protocol Coach
        </h1>
        <p className="text-xs text-slate-300">
          A structured assistant for Bridge events, Phase mapping, and Sunday
          dumps. It rewrites chaos into clean operational signals. No therapy,
          no storytelling, just structure.
        </p>
        <p className="text-[9px] text-slate-500">
          Avoid names and unnecessary details. Focus on actions, patterns, and
          concrete decisions.
        </p>
      </section>

      {/* Mode selector */}
      <section className="space-y-2 text-[10px]">
        <div className="inline-flex gap-1 rounded-full border border-slate-800 bg-slate-950/80 p-1">
          <button
            type="button"
            onClick={() => setMode("bridge")}
            className={`rounded-full px-3 py-1 ${
              mode === "bridge"
                ? "bg-cyan-500 text-slate-950 text-[9px] font-semibold"
                : "text-[9px] text-slate-300 hover:text-cyan-300"
            }`}
          >
            Bridge
          </button>
          <button
            type="button"
            onClick={() => setMode("phase")}
            className={`rounded-full px-3 py-1 ${
              mode === "phase"
                ? "bg-violet-500 text-slate-950 text-[9px] font-semibold"
                : "text-[9px] text-slate-300 hover:text-violet-300"
            }`}
          >
            Phase Map
          </button>
          <button
            type="button"
            onClick={() => setMode("sunday")}
            className={`rounded-full px-3 py-1 ${
              mode === "sunday"
                ? "bg-emerald-500 text-slate-950 text-[9px] font-semibold"
                : "text-[9px] text-slate-300 hover:text-emerald-300"
            }`}
          >
            Sunday Dump
          </button>
        </div>

        <p className="text-[9px] text-slate-500">
          Bridge = log concrete events. Phase = label state over time. Sunday =
          weekly synthesis and next moves.
        </p>
      </section>

      {/* Conversation window */}
      <section className="space-y-2">
        <div className="min-h-[180px] space-y-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-[10px]">
          {messages.length === 0 && (
            <p className="text-[9px] text-slate-500">
              Choose a pillar, describe what happened or where things stand,
              and the coach will respond with a normalized Ops Protocol view.
            </p>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                  m.role === "user"
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-slate-900/90 text-slate-200 border border-slate-800"
                }`}
              >
                <div className="mb-1 text-[7px] uppercase tracking-wide text-slate-400">
                  {m.mode === "bridge"
                    ? "Bridge"
                    : m.mode === "phase"
                    ? "Phase Map"
                    : "Sunday Dump"}{" "}
                  • {m.role === "user" ? "You" : "Coach"}
                </div>
                <div className="text-[9px] leading-snug">
                  {m.text}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-[9px] text-slate-500">
              Processing input with Ops Protocol rules...
            </div>
          )}
        </div>
      </section>

      {/* Input form */}
      <section>
        <form
          onSubmit={handleSubmit}
          className="space-y-2 text-[10px]"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2 text-[10px] text-slate-100 outline-none focus:border-cyan-400"
            placeholder={
              mode === "bridge"
                ? "Describe one concrete event. What happened, what was said, what changed."
                : mode === "phase"
                ? "Describe the pattern over time. What signals tell you the phase you’re in."
                : "Dump the week. Key events, tension points, wins, and what needs to change next."
            }
          />
          <div className="flex items-center justify-between gap-2">
            <div className="text-[8px] text-slate-500">
              Prototype only. Output is structural guidance, not advice.
            </div>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-full bg-cyan-500 px-4 py-2 text-[9px] font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-40"
            >
              {loading ? "Working" : "Send to Coach"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
