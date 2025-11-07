import BridgeTracker from "../../../components/BridgeTracker";
export default function Page(){
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <h1 className="text-3xl font-bold">Bridge Tracker</h1>
        <a className="link" href="/">Back to Home</a>
      </div>
      <div className="card">
        <BridgeTracker />
      </div>
    </section>
  );
}
