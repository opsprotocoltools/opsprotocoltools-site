"use client";
import { useEffect, useState } from "react";

type Entry = { date: string; score: number; note: string };

export default function BridgeTracker() {
  const [score, setScore] = useState(70);
  const [note, setNote] = useState("");
  const [log, setLog] = useState<Entry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("bridge_log");
    if (saved) setLog(JSON.parse(saved));
  }, []);

  function save() {
    const entry = { date: new Date().toISOString().slice(0, 10), score, note };
    const next = [entry, ...log].slice(0, 30);
    setLog(next);
    localStorage.setItem("bridge_log", JSON.stringify(next));
    setNote("");
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Bridge Tracker</h2>
      <label className="block">Score: {score}</label>
      <input
        type="range"
        min={0}
        max={100}
        value={score}
        onChange={(e) => setScore(+e.target.value)}
        className="w-full"
      />
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note (optional)"
        className="w-full border p-2 rounded"
      />
      <button onClick={save} className="px-3 py-2 bg-black text-white rounded">
        Save
      </button>
      <div className="pt-4">
        <h3 className="font-medium">Last 7 entries</h3>
        <ul className="text-sm mt-2 space-y-1">
          {log.slice(0, 7).map((e, i) => (
            <li key={i} className="border p-2 rounded">
              {e.date} — {e.score} — {e.note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
