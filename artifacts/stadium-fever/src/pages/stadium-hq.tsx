import { useState } from "react";
import { useGameState } from "../lib/game-state";
import { CardComponent } from "../components/card-component";
import { PixelStadiumScene } from "../components/pixel-stadium-scene";
import { EVENTS } from "../lib/constants";
import { Link } from "wouter";
import { useToast } from "../hooks/use-toast";

export default function StadiumHQ() {
  const { stadiumLevel, roarPower, equipped, claimPoints, upgradeStadium } = useGameState();
  const { toast } = useToast();

  const [claimAnim, setClaimAnim] = useState(false);
  const [stadiumPulse, setStadiumPulse] = useState(false);

  const handleClaim = () => {
    claimPoints();
    setClaimAnim(true);
    setTimeout(() => setClaimAnim(false), 1000);
    toast({ title: "+450 PP EXTRACTED", description: "Stadium roar converted successfully." });
  };

  const handleUpgrade = () => {
    const success = upgradeStadium();
    if (success) {
      setStadiumPulse(true);
      setTimeout(() => setStadiumPulse(false), 1000);
      toast({ title: "STADIUM UPGRADED", description: `Level ${stadiumLevel + 1} unlocked. +80 Roar Power.` });
    } else {
      toast({ title: "INSUFFICIENT FUNDS", description: "Requires 500 Pitch Points.", variant: "destructive" });
    }
  };

  const liveEvent = EVENTS.find((e) => e.status === "LIVE");
  const roarPct = Math.min(100, (roarPower / 1000) * 100);

  return (
    <div className="relative w-full">
      {/* ============ HERO STADIUM SCENE ============ */}
      <div className="relative w-full h-[calc(100dvh-240px)] min-h-[470px] border-4 border-white overflow-hidden bg-[#05101e]" style={{ boxShadow: "6px 6px 0 #000" }}>
        {/* Stadium fills everything above the touchline strip */}
        <div className="absolute inset-x-0 top-0 bottom-[178px]">
          <PixelStadiumScene level={stadiumLevel} pulse={stadiumPulse} />
        </div>

        {/* LEFT SIGNBOARD — Arcade Ground */}
        <div className="absolute left-2 top-2 md:left-4 md:top-4 z-30 w-[170px] md:w-[200px]">
          <div className="bg-[#0a1530] border-4 border-white p-3" style={{ boxShadow: "4px 4px 0 #000" }}>
            <div className="flex items-center justify-between border-b-4 border-white pb-1 mb-2">
              <h2 className="font-mono text-[11px] md:text-xs text-white uppercase leading-tight">Arcade<br />Ground</h2>
              <div className="bg-primary text-black px-1.5 py-0.5 font-mono text-[10px] border-2 border-black">L{stadiumLevel}</div>
            </div>
            <div className="font-mono text-[8px] text-accent mb-1">ROAR {roarPower}/1000</div>
            <div className="w-full h-3 bg-black border-2 border-gray-600 mb-2">
              <div className="h-full bg-accent" style={{ width: `${roarPct}%` }} />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-primary animate-blink" />
              <span className="font-mono text-[8px] text-primary uppercase">Output: Stable</span>
            </div>
          </div>
          {/* sign post */}
          <div className="w-2 h-5 bg-gray-600 mx-auto" />
        </div>

        {/* RIGHT SIGNBOARD — Live Fever Event */}
        {liveEvent && (
          <div className="absolute right-2 top-2 md:right-4 md:top-4 z-30 w-[170px] md:w-[200px]">
            <div className="bg-[#0a1530] border-4 border-destructive p-3" style={{ boxShadow: "4px 4px 0 #000" }}>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-2 h-2 bg-destructive animate-blink" />
                <span className="font-mono text-[8px] text-destructive uppercase">Live Fever Event</span>
              </div>
              <div className="font-mono text-[11px] md:text-xs text-white uppercase leading-tight mb-2">{liveEvent.name}</div>
              <Link href="/fever">
                <button className="pixel-btn pixel-btn-destructive w-full py-2 text-[10px] hq-bob">ENTER</button>
              </Link>
            </div>
            <div className="w-2 h-5 bg-gray-600 mx-auto" />
          </div>
        )}

        {/* ============ TOUCHLINE FOREGROUND — bench + booth + extract ============ */}
        <div className="absolute bottom-0 left-0 right-0 h-[178px] z-30 bg-[#070d18] border-t-4 border-white px-2 md:px-3 py-2 flex gap-2 md:gap-3">

          {/* Formation Bench (dugout) */}
          <div className="flex-1 min-w-0 bg-[#0a1530] border-4 border-[#33508a] p-2 flex flex-col">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[9px] md:text-[10px] text-secondary uppercase">Active Formation</span>
              <Link href="/locker" className="font-mono text-[8px] text-white/70 hover:text-white underline">EDIT</Link>
            </div>
            <div className="flex gap-2 justify-center flex-1">
              {equipped.slice(0, 3).map((card, i) => (
                <div key={i} className="h-[118px] w-[80px] overflow-hidden">
                  {card ? (
                    <div className="origin-top-left scale-[0.62]">
                      <CardComponent card={card} size="sm" />
                    </div>
                  ) : (
                    <div className="h-full w-full border-4 border-dashed border-gray-600 bg-black flex flex-col items-center justify-center text-gray-500 font-mono">
                      <span className="text-[11px]">P{i + 1}</span>
                      <span className="text-[7px] mt-1">EMPTY</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade Booth */}
          <div className="bg-[#1a1206] border-4 border-accent p-2 flex flex-col justify-between w-[150px] md:w-[180px] shrink-0">
            <div>
              <div className="font-mono text-[9px] md:text-[10px] text-accent uppercase mb-1">Upgrade Booth</div>
              <div className="flex justify-between font-mono text-[8px] text-white">
                <span>LVL {stadiumLevel}</span>
                <span className="text-primary">NEXT {stadiumLevel + 1}</span>
              </div>
              <div className="font-mono text-[7px] text-white/60 mt-0.5">+80 ROAR / LEVEL</div>
            </div>
            <button onClick={handleUpgrade} className="pixel-btn pixel-btn-accent w-full py-2 text-[10px] flex flex-col items-center">
              <span>INSTALL</span>
              <span className="text-[7px] mt-0.5">COST 500 PP</span>
            </button>
          </div>

          {/* Extract Machine */}
          <div className="relative bg-[#06200f] border-4 border-primary p-2 flex flex-col justify-between w-[160px] md:w-[210px] shrink-0">
            <div className="font-mono text-[9px] md:text-[10px] text-primary uppercase mb-1">Pitch Extractor</div>
            <button onClick={handleClaim} className="pixel-btn pixel-btn-primary w-full flex-1 text-sm md:text-lg leading-tight">
              <span className="animate-float block">EXTRACT<br />PITCH POINTS</span>
            </button>
            {claimAnim && (
              <div className="absolute left-1/2 top-2 text-primary font-mono text-2xl pixel-outline hq-reward whitespace-nowrap pointer-events-none z-40">
                +450 PP
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
