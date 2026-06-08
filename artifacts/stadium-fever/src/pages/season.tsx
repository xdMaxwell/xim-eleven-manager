import { Lock, Unlock, PlayCircle, Trophy } from "lucide-react";
import { cn } from "../lib/utils";

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
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-start relative">
      
      {/* Side Panel */}
      <div className="w-full md:w-64 bg-black/80 border-2 border-white/20 p-6 rounded-xl shrink-0 sticky top-24 backdrop-blur-md z-10">
        <Trophy className="w-12 h-12 text-accent mb-4" />
        <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2 leading-tight">
          Tournament Bracket
        </h2>
        <p className="text-sm font-mono text-gray-400 mb-6">
          Game first. Token later. Every match creates heat. Your stadium captures it.
        </p>

        <div className="border-t-2 border-white/10 pt-6">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Locked Systems</h3>
          <ul className="flex flex-col gap-2 font-mono text-xs text-gray-600">
            {["Marketplace", "Token Claim", "Live API", "Premium Events"].map(f => (
              <li key={f} className="flex items-center gap-2 bg-black px-2 py-1.5 rounded border border-gray-800">
                <Lock className="w-3 h-3" /> {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Map */}
      <div className="flex-1 bg-black/40 border-2 border-white/10 rounded-xl p-6 md:p-12 relative overflow-hidden backdrop-blur-sm">
        
        {/* Background visual map connection line */}
        <div className="absolute top-12 bottom-12 left-10 md:left-24 w-4 bg-gray-900 border-x-2 border-gray-800 rounded-full" />
        
        <div className="flex flex-col gap-12 relative z-10">
          {PHASES.map((p, i) => (
            <div key={p.id} className="flex items-center gap-6 md:gap-12">
              
              {/* Node */}
              <div className="relative shrink-0 flex items-center justify-center">
                <div className={cn(
                  "w-16 h-16 rounded-xl border-4 flex items-center justify-center transform rotate-45 transition-all shadow-xl",
                  p.status === "COMPLETED" ? "bg-blue-900 border-blue-400" :
                  p.status === "ACTIVE" ? "bg-primary/20 border-primary shadow-[0_0_20px_rgba(34,197,94,0.4)]" :
                  "bg-black border-gray-700"
                )}>
                  <div className="transform -rotate-45">
                    {p.status === "COMPLETED" ? <Unlock className="w-6 h-6 text-blue-400" /> :
                     p.status === "ACTIVE" ? <PlayCircle className="w-6 h-6 text-primary animate-pulse" /> :
                     <Lock className="w-6 h-6 text-gray-600" />}
                  </div>
                </div>
                
                {/* Connection line to content */}
                <div className="absolute left-16 right-0 w-8 md:w-16 h-1 bg-gray-800 -z-10 translate-x-1" />
              </div>

              {/* Content Panel */}
              <div className={cn(
                "flex-1 border-2 p-6 rounded-xl transition-all",
                p.status === "ACTIVE" ? "bg-black/90 border-primary" :
                p.status === "COMPLETED" ? "bg-black/60 border-blue-900" :
                "bg-black/40 border-gray-800 opacity-70"
              )}>
                <span className={cn(
                  "text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-widest inline-block mb-2",
                  p.status === "COMPLETED" ? "text-blue-400 border-blue-400/50 bg-blue-900/30" :
                  p.status === "ACTIVE" ? "text-black border-primary bg-primary" :
                  "text-gray-500 border-gray-700 bg-black"
                )}>
                  {p.status}
                </span>
                <h3 className={cn(
                  "text-2xl font-black uppercase tracking-widest mb-1",
                  p.status === "ACTIVE" ? "text-white glow-text" : "text-gray-300"
                )}>
                  {p.title}
                </h3>
                <p className="text-sm font-mono text-gray-400">
                  {p.desc}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
