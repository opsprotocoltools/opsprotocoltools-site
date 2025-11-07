"use client";
import { useState } from "react";
const items = [
  { q: "I use neutral language in texts.", k: "neutral" },
  { q: "Handoffs start/end on time.", k: "time" },
  { q: "I log facts weekly (Sunday Dump).", k: "log" },
];
export default function Quiz() {
  const [ans, setAns] = useState<number[]>(Array(items.length).fill(3)); // 1..5
  const score = Math.round((ans.reduce((a, b) => a + b, 0) / ans.length) * 20);
  return (
    <div className="space-y-4">
      {items.map((it, i) => (
        <div key={it.k}>
          <label>{it.q} — {ans[i]}</label>
          <input type="range" min={1} max={5} value={ans[i]} onChange={(e) => {
            const n = [...ans]; n[i] = +e.target.value; setAns(n);
          }} className="w-full" />
        </div>
      ))}
      <div className="p-3 border rounded">Estimated Bridge Integrity: <b>{score}%</b></div>
    </div>
  );
}
