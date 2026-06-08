import { Calendar, Lock, Unlock } from "lucide-react";
import { cn } from "../lib/utils";
import { useGameState } from "../lib/game-state";

export default function Season() {
  const { phase: currentPhase } = useGameState();

  const PHASES = [
    {
      id: "Preseason",
      title: "Phase 1: Preseason",
      desc: "Claim stadium, open starter pack, collect first cards.",
      status: "COMPLETED",
    },
    {
      id: "Kickoff",
      title: "Phase 2: Kickoff",
      desc: "Stadium mining, pack opening, card upgrades.",
      status: "ACTIVE",
    },
    {
      id: "Mining Live",
      title: "Phase 3: Mining Live",
      desc: "Daily claims, Roar Power boosts, stadium upgrades.",
      status: "LOCKED",
    },
    {
      id: "Fever Live",
      title: "Phase 4: Fever Live",
      desc: "Fever Board, Fan Formation, Match Receipts, mutation windows.",
      status: "LOCKED",
    },
    {
      id: "Final Run",
      title: "Phase 5: Final Run",
      desc: "Leaderboard, season snapshot, rare cosmetics, token eligibility later.",
      status: "LOCKED",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12 flex flex-col gap-12">
      
      <div className="flex flex-col gap-4 items-center text-center mt-8">
        <div className="w-16 h-16 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mb-2">
          <Calendar className="text-primary w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-foreground glow-text">
          Season Roadmap
        </h1>
        <p className="text-muted-foreground font-mono text-sm max-w-lg">
          Game first. Token later. Every match creates heat. Your stadium captures it.
        </p>
      </div>

      <div className="relative pl-6 md:pl-0">
        {/* Timeline vertical line */}
        <div className="absolute left-[11px] md:left-1/2 top-4 bottom-4 w-px bg-border md:-translate-x-1/2 z-0" />

        <div className="flex flex-col gap-8 md:gap-12 relative z-10">
          {PHASES.map((p, i) => {
            const isEven = i % 2 === 0;
            return (
              <div key={p.id} className={cn(
                "flex flex-col md:flex-row items-start md:items-center gap-6",
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              )}>
                
                {/* Content */}
                <div className={cn(
                  "flex-1 md:w-1/2 bg-card border p-6 rounded-xl relative",
                  p.status === "ACTIVE" ? "border-primary shadow-[0_0_15px_rgba(34,197,94,0.15)]" : "border-border",
                  isEven ? "md:text-right" : "md:text-left"
                )}>
                  <span className={cn(
                    "text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-widest inline-block mb-3",
                    p.status === "COMPLETED" && "text-gray-400 border-gray-600 bg-gray-800",
                    p.status === "ACTIVE" && "text-primary border-primary/50 bg-primary/10",
                    p.status === "LOCKED" && "text-gray-600 border-border bg-black/40"
                  )}>
                    {p.status}
                  </span>
                  <h3 className={cn(
                    "text-xl font-black uppercase tracking-widest mb-2",
                    p.status === "LOCKED" ? "text-muted-foreground" : "text-foreground"
                  )}>
                    {p.title}
                  </h3>
                  <p className="text-sm font-mono text-gray-400 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                {/* Node */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-4 border-background items-center justify-center z-20 transition-colors"
                     style={{ backgroundColor: p.status === "COMPLETED" ? "#3b82f6" : p.status === "ACTIVE" ? "#22c55e" : "#1f2937" }}>
                  {p.status === "LOCKED" ? <Lock className="w-3 h-3 text-gray-500" /> : <Unlock className="w-3 h-3 text-black" />}
                </div>
                
                {/* Mobile Node */}
                <div className="md:hidden absolute left-0 w-6 h-6 rounded-full border-4 border-background items-center justify-center flex z-20 mt-6 -ml-3"
                     style={{ backgroundColor: p.status === "COMPLETED" ? "#3b82f6" : p.status === "ACTIVE" ? "#22c55e" : "#1f2937" }}>
                   {p.status === "LOCKED" ? <Lock className="w-2 h-2 text-gray-500" /> : <Unlock className="w-2 h-2 text-black" />}
                </div>

                {/* Empty spacer for alignment */}
                <div className="hidden md:block flex-1 md:w-1/2" />
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-12 bg-[#0a0a0a] border border-border p-8 rounded-xl text-center">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">Future Protocol Features</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {["Marketplace", "Token Claim", "Live API", "Premium Events"].map(f => (
            <div key={f} className="flex items-center gap-2 bg-black px-4 py-2 rounded-lg border border-white/5 text-sm font-mono text-gray-500">
              <Lock className="w-3 h-3" /> {f} <span className="opacity-50 ml-2">Locked</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
