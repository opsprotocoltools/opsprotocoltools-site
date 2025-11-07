"use client";
import { useState } from "react";
export default function Simulator(){
  const [baseline,setBaseline]=useState(70);
  const [changes,setChanges]=useState({sleep:0,conflict:0,logs:0});
  const result = Math.max(0, Math.min(100, baseline + changes.sleep*2 - changes.conflict*3 + changes.logs*2));
  return (
    <div className="space-y-3">
      <label>Baseline Integrity: {baseline}</label>
      <input type="range" min={0} max={100} value={baseline} onChange={e=>setBaseline(+e.target.value)} className="w-full"/>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div><label>More sleep nights /wk: {changes.sleep}</label><input type="range" min={0} max={7} value={changes.sleep} onChange={e=>setChanges({...changes,sleep:+e.target.value})} className="w-full"/></div>
        <div><label>Conflicts /wk: {changes.conflict}</label><input type="range" min={0} max={7} value={changes.conflict} onChange={e=>setChanges({...changes,conflict:+e.target.value})} className="w-full"/></div>
        <div><label>Sunday Dumps /mo: {changes.logs}</label><input type="range" min={0} max={4} value={changes.logs} onChange={e=>setChanges({...changes,logs:+e.target.value})} className="w-full"/></div>
      </div>
      <div className="p-3 border rounded">Projected Integrity: <b>{result}%</b></div>
    </div>
  );
}
