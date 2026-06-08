import { useGameState } from "../lib/game-state";
import { EVENTS } from "../lib/constants";
import { useLocation } from "wouter";
import { StadiumBackdrop } from "../components/stadium-backdrop";
import { Flame, Lock, ChevronRight, Swords, Activity, Timer, Clock } from "lucide-react";

export default function FeverBoard() {
  const { heat, setFeverTarget } = useGameState();
  const [, setLocation] = useLocation();

  const liveEvents = EVENTS.filter((e) => e.status === "LIVE");

  const enterFever = (eventName: string) => {
    setFeverTarget(eventName);
    setLocation("/formation");
  };

  return (
    <div className="p-3 md:p-5 flex flex-col gap-4">
      {/* Scoreboard Header */}
      <div className="glass rounded-3xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl grid place-items-center bg-gradient-to-br from-destructive to-orange-700 glow-heat">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="display text-2xl md:text-3xl text-white uppercase leading-none">Fever Board</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive anim-live" />
              <span className="text-[11px] uppercase tracking-widest text-destructive font-bold">Match-Day Operations</span>
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
          {liveEvents.slice(0, 1).map((event) => (
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
                      <span className="chip bg-primary/10 border-primary/20 text-primary">Stadium Output</span>
                      <span className="chip bg-destructive/10 border-destructive/20 text-destructive">Heat Gain</span>
                      <span className="chip bg-purple-500/10 border-purple-500/20 text-purple-400">Mutation Roll</span>
                    </div>
                  </div>

                  <button onClick={() => enterFever(event.name)} className="btn btn-primary w-full py-4 text-lg group">
                    <Swords className="w-5 h-5 mr-1" />
                    Enter Fever
                    <ChevronRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Event List */}
        <div className="glass rounded-3xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between mb-2 px-2">
            <h3 className="display text-lg text-white uppercase">Events</h3>
            <span className="text-[11px] text-muted-foreground uppercase tracking-widest">{EVENTS.length} Total</span>
          </div>

          <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-3">
            {EVENTS.slice(1).map((event) => {
              const isLive = event.status === "LIVE";
              const isSettling = event.status === "SETTLING";
              return (
                <button
                  key={event.id}
                  onClick={() => isLive && enterFever(event.name)}
                  disabled={!isLive}
                  className={`w-full text-left rounded-2xl p-4 transition-all duration-300 border relative overflow-hidden group
                    ${isLive
                      ? "glass hover:bg-white/5 border-secondary/30 hover:border-secondary cursor-pointer"
                      : isSettling
                        ? "bg-amber-500/5 border-amber-500/20 cursor-not-allowed"
                        : "bg-black/20 border-white/5 opacity-60 cursor-not-allowed"
                    }`}
                >
                  <div className="relative z-10 flex justify-between items-start mb-2">
                    <h4 className="display text-base text-white uppercase truncate pr-4">{event.name}</h4>
                    {isLive ? (
                      <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(56,160,255,0.8)] shrink-0 mt-1.5" />
                    ) : isSettling ? (
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed mb-2">{event.rule}</p>
                  <span
                    className={`chip text-[9px] ${
                      isLive
                        ? "bg-secondary/10 border-secondary/30 text-secondary"
                        : isSettling
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                          : "bg-white/5 border-white/10 text-muted-foreground"
                    }`}
                  >
                    {event.status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
