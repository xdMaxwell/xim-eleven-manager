import { useState } from "react";
import { useGameState } from "../lib/game-state";
import { EVENTS, CountryCard } from "../lib/constants";
import { useLocation } from "wouter";
import { CardComponent } from "../components/card-component";
import { StadiumBackdrop } from "../components/stadium-backdrop";
import { Flame, Lock, ChevronRight, Swords, X, Activity, Timer, Plus } from "lucide-react";

export default function FeverBoard() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const { heat } = useGameState();

  const liveEvents = EVENTS.filter(e => e.status === "LIVE");

  return (
    <div className="p-3 md:p-5 flex flex-col gap-4">
      {/* Scoreboard Header */}
      <div className="glass rounded-3xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl grid place-items-center bg-gradient-to-br from-destructive to-orange-700 glow-heat">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="display text-2xl md:text-3xl text-white uppercase leading-none">Fever Arena</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive anim-live" />
              <span className="text-[11px] uppercase tracking-widest text-destructive font-bold">Live Matches</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-black/40 rounded-2xl border border-white/10 p-3 flex items-center gap-4 md:gap-6 min-w-[200px]">
            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">
                <Flame className="w-3 h-3 text-destructive" /> Heat
              </div>
              <div className="num text-2xl text-destructive text-glow-heat leading-none">{heat}</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">
                <Timer className="w-3 h-3" /> Refresh
              </div>
              <div className="num text-xl text-white leading-none">02:14</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Featured Live Event */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {liveEvents.slice(0, 1).map(event => (
            <div key={event.id} className="relative w-full rounded-3xl overflow-hidden glass-strong min-h-[460px] flex flex-col">
              <StadiumBackdrop intensity={1.2} />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="relative z-10 flex-1 flex flex-col p-5 md:p-8">
                <div className="flex justify-between items-start mb-auto">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="chip bg-destructive/20 border-destructive/40 text-destructive anim-live">
                        <span className="w-1.5 h-1.5 rounded-full bg-destructive" /> Live Event
                      </span>
                    </div>
                    <h2 className="display text-3xl md:text-5xl text-white leading-tight uppercase text-glow-primary">{event.name}</h2>
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                  <div className="glass rounded-2xl p-4 md:p-6 border-secondary/30">
                    <div className="flex items-center gap-2 mb-2 text-secondary">
                      <Activity className="w-4 h-4" />
                      <span className="text-[11px] uppercase tracking-widest font-bold">Event Rules</span>
                    </div>
                    <p className="text-sm md:text-base text-white/90 leading-relaxed mb-4">{event.rule}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="chip bg-primary/10 border-primary/20 text-primary">Output Yield</span>
                      <span className="chip bg-destructive/10 border-destructive/20 text-destructive">Heat Gain</span>
                      <span className="chip bg-purple-500/10 border-purple-500/20 text-purple-400">Mutation Roll</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedEvent(event.id)}
                    className="btn btn-primary w-full py-4 text-lg group"
                  >
                    <Swords className="w-5 h-5 mr-1" />
                    Enter Fever
                    <ChevronRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mission List */}
        <div className="glass rounded-3xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between mb-2 px-2">
            <h3 className="display text-lg text-white uppercase">Operations</h3>
            <span className="text-[11px] text-muted-foreground uppercase tracking-widest">{EVENTS.length} Total</span>
          </div>
          
          <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-3">
            {EVENTS.slice(1).map(event => {
              const isLive = event.status === "LIVE";
              return (
                <button
                  key={event.id}
                  onClick={() => isLive && setSelectedEvent(event.id)}
                  disabled={!isLive}
                  className={`w-full text-left rounded-2xl p-4 transition-all duration-300 border relative overflow-hidden group
                    ${isLive 
                      ? 'glass hover:bg-white/5 border-secondary/30 hover:border-secondary cursor-pointer' 
                      : 'bg-black/20 border-white/5 opacity-60 cursor-not-allowed'
                    }`}
                >
                  <div className="relative z-10 flex justify-between items-start mb-2">
                    <h4 className="display text-base text-white uppercase truncate pr-4">{event.name}</h4>
                    {isLive ? (
                      <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(56,160,255,0.8)] shrink-0 mt-1.5" />
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{event.rule}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedEvent && (
        <FormationModal 
          event={EVENTS.find(e => e.id === selectedEvent)!} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </div>
  );
}

function FormationModal({ event, onClose }: { event: { id: string, name: string }, onClose: () => void }) {
  const { equipped, startMatch, roarPower } = useGameState();
  const [, setLocation] = useLocation();
  const [deploying, setDeploying] = useState(false);

  const activeCards = equipped.filter((c): c is CountryCard => c !== null);

  const handleDeploy = () => {
    if (activeCards.length < 2) return;
    setDeploying(true);
    setTimeout(() => {
      startMatch(event.name, activeCards);
      setDeploying(false);
      onClose();
      setLocation("/fever-match");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={!deploying ? onClose : undefined} />
      
      <div className="glass-strong w-full max-w-3xl rounded-3xl overflow-hidden flex flex-col relative z-10 border border-white/20 shadow-[0_0_50px_-12px_rgba(0,0,0,1)]">
        <div className="p-5 md:p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Deployment Protocol</div>
            <h2 className="display text-2xl text-white uppercase leading-none">{event.name}</h2>
          </div>
          <button onClick={onClose} disabled={deploying} className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 text-muted-foreground hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Formation UI */}
        <div className="p-6 md:p-10 relative min-h-[340px] flex flex-col items-center justify-center overflow-hidden">
          <StadiumBackdrop intensity={0.5} className="opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />

          <div className="relative z-10 flex flex-wrap justify-center gap-4 md:gap-6 w-full">
            {equipped.map((card, i) => (
              <div key={i} className="flex-shrink-0">
                {card ? (
                  <CardComponent card={card} size="sm" tilt={!deploying} className={deploying ? "animate-pulse" : ""} />
                ) : (
                  <div className="w-36 h-52 rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] flex items-center justify-center text-center">
                    <div className="flex flex-col items-center gap-2 text-white/30">
                      <Plus className="w-6 h-6" />
                      <span className="display text-xs uppercase">Slot {i + 1}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="absolute top-4 left-4 glass px-3 py-1.5 rounded-xl border-white/10 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Total Roar</span>
            <span className="num text-lg text-white leading-none">{roarPower}</span>
          </div>
        </div>

        <div className="p-5 md:p-6 bg-black/40 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm">
            {activeCards.length < 2 ? (
              <span className="text-destructive flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                Requires minimum 2 assets
              </span>
            ) : (
              <span className="text-primary flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Formation Ready
              </span>
            )}
          </div>
          <button 
            onClick={handleDeploy} 
            disabled={activeCards.length < 2 || deploying}
            className={`btn w-full md:w-auto min-w-[200px] text-base py-3 ${deploying ? "bg-white/10 text-white/50 border-white/5 cursor-wait" : "btn-heat"}`}
          >
            {deploying ? (
              <span className="flex items-center justify-center gap-2">
                <Activity className="w-4 h-4 animate-spin" /> Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Swords className="w-4 h-4" /> Execute Deployment
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
