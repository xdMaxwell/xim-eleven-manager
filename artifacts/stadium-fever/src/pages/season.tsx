import { Check, Lock, Map as MapIcon, Trophy, Star, ChevronRight } from "lucide-react";
import { SEASON_LEADERBOARD, LOCKED_FEATURES } from "../lib/constants";
import { StadiumBackdrop } from "../components/stadium-backdrop";

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
    <div className="p-3 md:p-5 flex flex-col gap-6 w-full pb-10">
      
      {/* ============ HERO SECTION ============ */}
      <div className="relative w-full h-64 md:h-80 rounded-3xl overflow-hidden glass flex flex-col items-center justify-center text-center p-6">
        <StadiumBackdrop intensity={0.6} />
        
        <div className="relative z-10 anim-reveal">
          <div className="flex items-center justify-center gap-2 mb-3">
            <MapIcon className="w-6 h-6 text-primary" />
            <h1 className="display text-3xl md:text-5xl text-white uppercase text-glow-primary">
              Season Map
            </h1>
          </div>
          <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed mb-4">
            <span className="text-white font-semibold">Game first. Token later.</span><br/>
            Every match creates heat. Your stadium captures it.
          </p>
        </div>
      </div>

      {/* ============ LEADERBOARD PREVIEW ============ */}
      <div className="glass rounded-3xl p-5 md:p-6">
        <div className="flex items-center gap-2 mb-5">
          <Trophy className="w-5 h-5 text-accent" />
          <h3 className="display text-xl text-white uppercase">Season Leaders</h3>
          <span className="chip ml-auto">Preview</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          {SEASON_LEADERBOARD.map((entry) => (
            <div 
              key={entry.id} 
              className="glass-strong rounded-2xl p-4 flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
            >
              <div 
                className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ background: `linear-gradient(135deg, ${entry.color}, transparent)` }}
              />
              <div className="absolute top-0 right-0 w-16 h-16 rounded-full blur-[24px] opacity-20" style={{ background: entry.color }} />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">{entry.label}</div>
                <div className="flex items-center gap-2 mt-auto mb-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color, boxShadow: `0 0 10px ${entry.color}` }} />
                  <div className="text-xs font-bold text-white uppercase truncate">{entry.holder}</div>
                </div>
                <div className="num text-xl md:text-2xl" style={{ color: entry.color, textShadow: `0 0 12px ${entry.color}66` }}>
                  {entry.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============ LOCKED FEATURES ============ */}
      <div className="glass rounded-3xl p-5 md:p-6">
        <div className="flex items-center gap-2 mb-5">
          <Lock className="w-5 h-5 text-muted-foreground" />
          <h3 className="display text-xl text-white uppercase">Locked Features</h3>
          <span className="chip ml-auto bg-white/5 border-white/10 text-muted-foreground">Coming Later</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {LOCKED_FEATURES.map((f) => (
            <div key={f} className="rounded-2xl bg-black/30 border border-white/10 p-4 flex flex-col items-center text-center gap-2 opacity-70">
              <Lock className="w-5 h-5 text-muted-foreground" />
              <span className="display text-sm text-white/80 uppercase">{f}</span>
              <span className="chip text-[9px] bg-white/5 border-white/10 text-muted-foreground">Locked</span>
            </div>
          ))}
        </div>
      </div>

      {/* ============ SEASON ROADMAP ============ */}
      <div className="glass rounded-3xl p-5 md:p-8">
        <div className="flex items-center gap-2 mb-8">
          <Star className="w-5 h-5 text-secondary" />
          <h3 className="display text-xl text-white uppercase">Progression Path</h3>
        </div>

        <div className="relative pl-4 md:pl-8 py-4">
          {/* Vertical connecting line */}
          <div className="absolute top-0 bottom-0 left-8 md:left-12 w-0.5 bg-white/5" />
          
          <div className="flex flex-col gap-8 md:gap-12 relative z-10">
            {PHASES.map((p, index) => {
              const isCompleted = p.status === "COMPLETED";
              const isActive = p.status === "ACTIVE";
              const isLocked = p.status === "LOCKED";
              
              return (
                <div key={p.id} className="flex items-start gap-4 md:gap-8 group">
                  {/* Node */}
                  <div className="relative flex-shrink-0 flex items-center justify-center w-9 h-9 md:w-10 md:h-10 mt-1">
                    <div className="absolute inset-0 rounded-full bg-background" />
                    
                    {isCompleted && (
                      <div className="absolute inset-0 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/40 glow-secondary">
                        <Check className="w-4 h-4 text-secondary" />
                      </div>
                    )}
                    
                    {isActive && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary glow-primary anim-live">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <div className="absolute -inset-2 rounded-full border border-primary/30 anim-beacon" />
                      </>
                    )}
                    
                    {isLocked && (
                      <div className="absolute inset-0 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 rounded-2xl p-4 md:p-5 transition-all duration-300 ${
                    isActive ? "glass-strong border-primary/30 shadow-[0_0_30px_-10px_rgba(34,211,120,0.2)] scale-[1.02]" : 
                    isCompleted ? "glass border-secondary/20" : 
                    "glass border-white/5 opacity-60"
                  }`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2 md:mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`chip ${
                          isActive ? "bg-primary/10 text-primary border-primary/20" : 
                          isCompleted ? "bg-secondary/10 text-secondary border-secondary/20" : 
                          "bg-white/5 text-muted-foreground border-white/10"
                        }`}>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-blink" />}
                          {p.status}
                        </div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Phase {index + 1}</span>
                      </div>
                    </div>
                    
                    <h4 className={`display text-lg md:text-2xl uppercase mb-1.5 ${
                      isActive ? "text-white text-glow-primary" :
                      isCompleted ? "text-white text-glow-secondary" :
                      "text-white/70"
                    }`}>
                      {p.title}
                    </h4>
                    
                    <p className={`text-sm leading-relaxed ${
                      isActive ? "text-primary/90" :
                      "text-muted-foreground"
                    }`}>
                      {p.desc}
                    </p>
                    
                    {isActive && (
                      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs text-white/60">Current stadium phase</span>
                        <ChevronRight className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
    </div>
  );
}
