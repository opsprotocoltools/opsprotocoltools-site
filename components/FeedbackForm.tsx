"use client";
import { useState } from "react";

export default function FeedbackForm() {
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);

  function save() {
    const key = "opt_feedback";
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    list.unshift({ ts: new Date().toISOString(), msg });
    localStorage.setItem(key, JSON.stringify(list.slice(0, 50)));
    setMsg(""); setOk(true); setTimeout(() => setOk(false), 1200);
  }

  return (
    <div className="space-y-3">
      <textarea className="w-full border p-2 rounded" placeholder="Feedback…" value={msg} onChange={(e) => setMsg(e.target.value)} />
      <button onClick={save} className="px-3 py-2 bg-black text-white rounded">Send</button>
      {ok && <div className="text-sm text-green-700">Saved locally.</div>}
    </div>
  );
}
