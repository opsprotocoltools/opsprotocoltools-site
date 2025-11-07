"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type Pt = { day: string; phase: number };

export default function PhaseMap() {
  const [data, setData] = useState<Pt[]>([]);

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem("bridge_log") || "[]");
    const last = raw.slice(-14); // last 14 entries
    const mapped = last.map((e: any, i: number) => ({
      day: `${i + 1}`,
      phase: Math.max(1, Math.min(5, Math.round(((e?.score ?? 70) as number) / 20))),
    }));
    setData(mapped.length ? mapped : Array.from({ length: 10 }, (_, i) => ({ day: `${i + 1}`, phase: 3 })));
  }, []);

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
          <Tooltip />
          <Line type="monotone" dataKey="phase" />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-sm mt-2">Phase scale: 1 = strained … 5 = strong.</p>
    </div>
  );
}
