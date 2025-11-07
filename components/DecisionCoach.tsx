"use client";
import { useState } from "react";
export default function DecisionCoach(){
  const [q,setQ]=useState(""); const [a,setA]=useState<string|null>(null);
  function run(){
    const t=q.toLowerCase();
    if(t.includes("handoff")||t.includes("pickup")) setA("Use neutral, timestamped confirmation. Child-first language. Log in Bridge Tracker.");
    else if(t.includes("conflict")) setA("Pause 10 minutes. Facts only. Offer one concrete next step. No tone words.");
    else if(t.includes("schedule")) setA("Propose 2 options with dates. Confirm in calendar. Send one-line summary.");
    else setA("Define goal → 2 options → pick lowest-risk child-first path → confirm in writing.");
  }
  return (
    <div className="space-y-3">
      <textarea className="w-full border p-2 rounded" placeholder="Describe the decision…" value={q} onChange={e=>setQ(e.target.value)}/>
      <button onClick={run} className="px-3 py-2 bg-black text-white rounded">Get Guidance</button>
      {a && <div className="border p-3 rounded bg-gray-50">{a}</div>}
    </div>
  );
}
