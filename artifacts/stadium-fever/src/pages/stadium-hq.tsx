import { useState } from "react";
import { useGameState } from "../lib/game-state";
import { CardComponent } from "../components/card-component";
import { StadiumBackdrop } from "../components/stadium-backdrop";
import { EVENTS } from "../lib/constants";
import { Link, useLocation } from "wouter";
import { useToast } from "../hooks/use-toast";
import { Zap, ArrowUpCircle, ChevronRight, Plus } from "lucide-react";

export default function StadiumHQ() {
  const { stadiumLevel, roarPower, equipped, claimPoints, upgradeStadium, setFeverTarget } = useGameState();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [claimAnim, setClaimAnim] = useState(false);
  const [stadiumPulse, setStadiumPulse] = useState(false);

  const handleClaim = () => {
    claimPoints();
    setClaimAnim(true);
    setTimeout(() => setClaimAnim(false), 1300);
    toast({ title: "+450 Pitch Points", description: "Stadium roar converted to output." });
  };

  const handleUpgrade = () => {
    const success = upgradeStadium();
    if (success) {
      setStadiumPulse(true);
      setTimeout(() => setStadiumPulse(false), 1000);
      toast({ title: "Stadium upgraded", description: `Level ${stadiumLevel + 1} unlocked. +80 Roar Power.` });
    } else {
      toast({ title: "Not enough Pitch Points", description: "Requires 500 Pitch Points.", variant: "destructive" });
    }
  };

  const liveEvent = EVENTS.find((e) => e.status === "LIVE");
  const roarPct = Math.min(100, (roarPower / 1000) * 100);
  const equippedCount = equipped.filter(Boolean).length;

  return (
    <div className="p-3 md:p-5">
      {/* ============ CINEMATIC HERO ============ */}
      <div className="relative w-full h-[clamp(440px,64vh,620px)] rounded-3xl overflow-hidden glass">
        <StadiumBackdrop pulse={stadiumPulse} intensity={1 + stadiumLevel * 0.12} />

        {/* top row: club identity + live event */}
        <div className="absolute inset-x-0 top-0 z-30 flex items-start justify-between p-4 md:p-6 gap-3">
          {/* club overlay */}
          <div className="glass-strong rounded-2xl p-4 w-[200px] md:w-[260px] anim-reveal">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-primary">XIM Club</div>
                <h2 className="display text-lg md:text-2xl text-white leading-none">Neon Home<br />Ground</h2>
              </div>
              <div className="shrink-0 w-12 h-12 rounded-xl grid place-items-center bg-gradient-to-br from-primary to-emerald-600 glow-primary">
                <span className="display text-xl text-[#06210c]">L{stadiumLevel}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider mb-1">
              <span className="text-secondary">Roar Power</span>
              <span className="num text-secondary">{roarPower}/1000</span>
            </div>
            <div className="h-2.5 rounded-full bg-black/50 overflow-hidden border border-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-secondary to-cyan-300 transition-all duration-500" style={{ width: `${roarPct}%` }} />
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-blink" />
              <span className="text-[10px] uppercase tracking-wider text-primary">Output Stable</span>
            </div>
          </div>

          {/* live fever overlay */}
          {liveEvent && (
            <div className="glass-strong rounded-2xl p-4 w-[200px] md:w-[260px] anim-reveal" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="chip bg-destructive/20 border-destructive/40 text-destructive anim-live">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive" /> Live
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Fever Event</span>
              </div>
              <h3 className="display text-lg md:text-2xl text-white leading-none mb-1">{liveEvent.name}</h3>
              <p className="text-[11px] text-muted-foreground leading-snug mb-3 line-clamp-2">{liveEvent.rule}</p>
              <button
                onClick={() => { setFeverTarget(liveEvent.name); setLocation("/formation"); }}
                className="btn btn-heat w-full text-sm"
              >
                Enter Fever <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* center claim CTA */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-6 md:bottom-8 z-30 flex flex-col items-center">
          {claimAnim && (
            <div className="absolute -top-4 left-1/2 num text-3xl text-primary text-glow-primary anim-reward pointer-events-none whitespace-nowrap">
              +450 PP
            </div>
          )}
          <button onClick={handleClaim} className="btn btn-primary text-base md:text-lg px-8 py-4 glow-primary group">
            <Zap className="w-5 h-5" /> Claim Pitch Points
          </button>
          <span className="num text-[11px] text-white/60 uppercase tracking-widest mt-2">+450 per claim</span>
        </div>
      </div>

      {/* ============ TOUCHLINE ROW ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 mt-4">
        {/* formation bench */}
        <div className="glass rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="display text-lg text-white uppercase">Active Formation</h3>
              <p className="text-[11px] text-muted-foreground">{equippedCount} of 3 nation cards deployed on the bench</p>
            </div>
            <Link href="/locker">
              <button className="btn btn-ghost text-xs py-2 px-3">Edit Squad</button>
            </Link>
          </div>
          <div className="flex gap-4 justify-center md:justify-start flex-wrap">
            {equipped.slice(0, 3).map((card, i) =>
              card ? (
                <CardComponent key={i} card={card} size="sm" />
              ) : (
                <Link key={i} href="/locker" className="w-36 h-52 rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/40 transition-colors grid place-items-center text-center group">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary">
                    <Plus className="w-7 h-7" />
                    <span className="display text-sm uppercase">Slot {i + 1}</span>
                    <span className="text-[10px] uppercase tracking-wider">Empty</span>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>

        {/* infrastructure upgrade module */}
        <div className="glass rounded-2xl p-4 md:p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <ArrowUpCircle className="w-5 h-5 text-accent" />
            <h3 className="display text-lg text-white uppercase">Infrastructure</h3>
          </div>
          <div className="rounded-xl bg-black/30 border border-white/10 p-3 mb-4 flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Current</span>
              <span className="chip text-white">Level {stadiumLevel}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Next tier</span>
              <span className="chip text-primary border-primary/30">Level {stadiumLevel + 1}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Bonus</span>
              <span className="num text-secondary text-sm">+80 Roar</span>
            </div>
          </div>
          <button onClick={handleUpgrade} className="btn btn-accent w-full">
            Upgrade Stadium
            <span className="num text-[11px] opacity-80">500 PP</span>
          </button>
        </div>
      </div>
    </div>
  );
}
