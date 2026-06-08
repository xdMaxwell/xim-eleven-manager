import { useState } from "react";
import { useGameState } from "../lib/game-state";
import { CountryCard, PACK_REWARDS } from "../lib/constants";
import { CardComponent } from "../components/card-component";
import { useToast } from "../hooks/use-toast";
import { StadiumBackdrop } from "../components/stadium-backdrop";
import { PackageOpen, Sparkles, Lock, Zap, ArrowRight } from "lucide-react";

export default function Packs() {
  const { packs, openPack } = useGameState();
  const { toast } = useToast();
  
  const [opening, setOpening] = useState(false);
  const [pulledCard, setPulledCard] = useState<CountryCard | null>(null);
  const [selectedPack, setSelectedPack] = useState<"starter" | "fever">("starter");

  const handleOpen = (type: "starter" | "fever") => {
    if (packs[type] <= 0) {
      toast({
        title: "Out of packs",
        description: "Acquire more packs to rip.",
        variant: "destructive"
      });
      return;
    }
    setOpening(true);
    setPulledCard(null);

    setTimeout(() => {
      const card = openPack(type);
      setPulledCard(card);
      setOpening(false);
    }, 2000);
  };

  const hasPacks = packs[selectedPack] > 0;

  return (
    <div className="p-3 md:p-5 h-full min-h-[calc(100vh-140px)] flex flex-col relative">
      {/* Ambient tunnel / locker room vibe */}
      <div className="absolute inset-0 -z-10 rounded-3xl overflow-hidden pointer-events-none">
        <StadiumBackdrop intensity={0.5} />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="flex items-center justify-between mb-4 md:mb-6 px-2">
        <div>
          <h2 className="display text-2xl md:text-3xl text-white uppercase leading-none">Pack Machine</h2>
          <p className="text-[11px] text-muted-foreground uppercase tracking-widest mt-1">Acquire New Assets</p>
        </div>
        <div className="glass px-3 py-1.5 rounded-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-blink" />
          <span className="text-[10px] uppercase tracking-widest text-primary">System Online</span>
        </div>
      </div>

      {!opening && !pulledCard && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 md:gap-6">
          
          {/* Left sidebar: Inventory & Selector */}
          <div className="flex flex-col gap-4">
            <div className="glass-strong rounded-2xl p-4 flex flex-col gap-3">
              <h3 className="display text-sm text-white uppercase text-glow-primary">Select Pack</h3>
              
              <button
                onClick={() => setSelectedPack("starter")}
                className={`relative overflow-hidden text-left p-4 rounded-xl border transition-all duration-300 ${
                  selectedPack === "starter" 
                  ? "bg-white/10 border-primary shadow-[0_0_20px_rgba(34,211,120,0.2)]" 
                  : "bg-black/40 border-white/10 hover:bg-white/5"
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="display text-lg text-white">Starter Pack</div>
                  <div className="chip bg-primary/20 text-primary border-primary/30">x{packs.starter}</div>
                </div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wide">Base Nations</div>
                {selectedPack === "starter" && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary glow-primary" />
                )}
              </button>

              <button
                onClick={() => setSelectedPack("fever")}
                className={`relative overflow-hidden text-left p-4 rounded-xl border transition-all duration-300 ${
                  selectedPack === "fever" 
                  ? "bg-white/10 border-destructive shadow-[0_0_20px_rgba(245,158,11,0.2)]" 
                  : "bg-black/40 border-white/10 hover:bg-white/5"
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="display text-lg text-white">Fever Pack</div>
                  <div className="chip bg-destructive/20 text-destructive border-destructive/30">x{packs.fever}</div>
                </div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wide">High Output Potential</div>
                {selectedPack === "fever" && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-destructive glow-heat" />
                )}
              </button>
            </div>

            <div className="glass rounded-2xl p-4 flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-accent" />
                <h3 className="display text-sm text-white uppercase text-glow-accent">Possible Pulls</h3>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {PACK_REWARDS.map((r) => (
                  <span key={r} className="chip bg-white/5 border-white/10 text-white/70 text-[10px]">{r}</span>
                ))}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Card Rarity</div>
              <ul className="flex flex-col gap-2">
                <li className="flex justify-between items-center bg-black/30 p-2 rounded-lg border border-white/5">
                  <span className="text-[11px] uppercase text-white/70">Common</span>
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                </li>
                <li className="flex justify-between items-center bg-black/30 p-2 rounded-lg border border-white/5">
                  <span className="text-[11px] uppercase text-white/70">Rare</span>
                  <span className="w-2 h-2 rounded-full bg-blue-400 glow-secondary" />
                </li>
                <li className="flex justify-between items-center bg-black/30 p-2 rounded-lg border border-white/5">
                  <span className="text-[11px] uppercase text-white/70">Epic</span>
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                </li>
                <li className="flex justify-between items-center bg-black/30 p-2 rounded-lg border border-white/5">
                  <span className="text-[11px] uppercase text-white/70">Mythic</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 glow-accent" />
                </li>
              </ul>
            </div>
          </div>

          {/* Central Area: Big Pack Display */}
          <div className="glass-strong rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Ambient spotlights behind pack */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[80%] opacity-40 blur-[100px] pointer-events-none"
              style={{ background: selectedPack === "starter" ? "var(--color-primary)" : "var(--color-destructive)" }}
            />

            {/* The Pack Object */}
            <div 
              onClick={() => hasPacks && handleOpen(selectedPack)}
              className={`relative w-48 h-72 md:w-64 md:h-[22rem] rounded-[20px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center isolate overflow-hidden transition-transform duration-300 ${hasPacks ? 'cursor-pointer hover:-translate-y-2 hover:scale-105 fcard-tilt fcard-shine' : 'opacity-60 grayscale cursor-not-allowed'}`}
              style={{ 
                background: selectedPack === "starter" 
                  ? "linear-gradient(145deg, #1f2d3d 0%, #0d141e 100%)" 
                  : "linear-gradient(145deg, #3d1c1a 0%, #1a0a09 100%)",
                border: selectedPack === "starter" ? "2px solid rgba(34,211,120,0.4)" : "2px solid rgba(245,158,11,0.4)"
              }}
            >
              {/* Pack details / foil texture */}
              <div className="absolute inset-0 opacity-30" style={{ background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)" }} />
              
              <PackageOpen className={`w-16 h-16 md:w-20 md:h-20 mb-4 opacity-80 ${selectedPack === "starter" ? "text-primary text-glow-primary" : "text-destructive text-glow-heat"}`} />
              
              <h2 className="display text-3xl md:text-4xl text-white uppercase text-center leading-none tracking-tight z-10 px-4">
                {selectedPack} <br/>
                <span className={`text-xl md:text-2xl ${selectedPack === "starter" ? "text-primary" : "text-destructive"}`}>Pack</span>
              </h2>

              {!hasPacks && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                  <Lock className="w-12 h-12 text-white/50" />
                </div>
              )}
            </div>

            {/* Action Area */}
            <div className="mt-10 w-full max-w-sm text-center">
              <button 
                onClick={() => handleOpen(selectedPack)}
                disabled={!hasPacks}
                className={`btn w-full py-4 text-lg ${selectedPack === "starter" ? "btn-primary glow-primary" : "btn-heat glow-heat"}`}
              >
                {hasPacks ? "Rip Pack" : "Sold Out"} <Zap className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Opening Animation State */}
      {opening && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative w-48 h-72 md:w-64 md:h-[22rem] rounded-[20px] shadow-[0_0_80px_rgba(255,255,255,0.2)] anim-spin-slow isolate overflow-hidden"
            style={{ 
              background: selectedPack === "starter" 
                ? "linear-gradient(145deg, #1f2d3d 0%, #0d141e 100%)" 
                : "linear-gradient(145deg, #3d1c1a 0%, #1a0a09 100%)"
            }}
          >
             <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
          <h2 className="mt-12 display text-3xl text-white uppercase tracking-widest animate-blink">Decrypting Asset...</h2>
        </div>
      )}

      {/* Reveal State */}
      {pulledCard && !opening && (
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[300px] h-[300px] rounded-full bg-white/20 blur-[80px] anim-burst" />
          </div>
          
          <h2 className="display text-3xl md:text-5xl text-white uppercase mb-8 text-glow-primary anim-reveal" style={{ animationDelay: "0.2s" }}>
            Asset Acquired
          </h2>
          
          <div className="mb-12 anim-reveal scale-110 md:scale-125" style={{ animationDelay: "0.4s" }}>
            <CardComponent card={pulledCard} size="lg" />
          </div>
          
          <div className="anim-reveal" style={{ animationDelay: "0.8s" }}>
            <button 
              onClick={() => setPulledCard(null)}
              className="btn btn-secondary px-8 py-4 glow-secondary text-lg"
            >
              Continue <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
