import { Check } from "lucide-react";

export default function Season() {
  const PHASES = [
    {
      id: "Preseason",
      title: "PRESEASON",
      desc: "Claim stadium, open starter pack, collect first cards.",
      status: "COMPLETED",
    },
    {
      id: "Kickoff",
      title: "KICKOFF",
      desc: "Stadium mining, pack opening, card upgrades.",
      status: "ACTIVE",
    },
    {
      id: "Mining Live",
      title: "MINING LIVE",
      desc: "Daily claims, Roar Power boosts, stadium upgrades.",
      status: "LOCKED",
    },
    {
      id: "Fever Live",
      title: "FEVER LIVE",
      desc: "Fever Board, Fan Formation, Match Receipts, mutation windows.",
      status: "LOCKED",
    },
    {
      id: "Final Run",
      title: "FINAL RUN",
      desc: "Leaderboard, season snapshot, rare cosmetics, token eligibility later.",
      status: "LOCKED",
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      <div className="pixel-panel p-6 bg-black">
        <h2 className="font-mono text-3xl text-white uppercase mb-4">Season Map</h2>
        <p className="font-mono text-sm text-gray-400">
          Game first. Token later. Every match creates heat. Your stadium captures it.
        </p>
      </div>

      <div className="pixel-panel p-6 bg-[#0a1128]">
        <div className="flex flex-col gap-6 relative">
          {/* Connecting line */}
          <div className="absolute top-0 bottom-0 left-8 w-2 bg-gray-800" />
          
          {PHASES.map((p) => (
            <div key={p.id} className="flex items-start gap-6 relative z-10">
              
              {/* Node */}
              <div className={`w-16 h-16 shrink-0 flex items-center justify-center border-4 ${
                p.status === "COMPLETED" ? "bg-blue-900 border-blue-500" :
                p.status === "ACTIVE" ? "bg-primary border-white animate-pulse" :
                "bg-black border-gray-700"
              }`}>
                {p.status === "COMPLETED" ? <Check className="w-5 h-5 text-white" style={{ imageRendering: "pixelated" }} /> :
                 p.status === "ACTIVE" ? <span className="font-mono text-xl text-black">!</span> :
                 <span className="font-mono text-xl text-gray-600">X</span>}
              </div>

              {/* Content */}
              <div className={`flex-1 border-4 p-4 ${
                p.status === "ACTIVE" ? "bg-black border-primary" :
                p.status === "COMPLETED" ? "bg-black border-blue-900" :
                "bg-black border-gray-800 opacity-60"
              }`}>
                <div className="font-mono text-[10px] mb-2 px-2 py-1 inline-block bg-white text-black">{p.status}</div>
                <h3 className="font-mono text-2xl text-white uppercase mb-2">{p.title}</h3>
                <p className="font-mono text-sm text-gray-400">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
