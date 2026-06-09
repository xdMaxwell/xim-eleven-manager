import { useState } from "react";
import { useGameState } from "../lib/game-state";
import { CountryCard, PACK_REWARDS } from "../lib/constants";
import { CardComponent } from "../components/card-component";
import { useToast } from "../hooks/use-toast";
import { ximAssets } from "../lib/assets";
import { CheckCircle2, Lock, Share2, Sparkles, Zap } from "lucide-react";

const PACK_LABELS = {
  starter: "Starter Pack",
  fever: "Fever Pack",
} as const;

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
        description: "Acquire more packs to open.",
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

  const handleSharePull = () => {
    if (!pulledCard) return;

    const shareText = `XIM pull: ${pulledCard.name} (${pulledCard.rarity})`;
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(shareText).then(() => {
        toast({
          title: "Pull copied",
          description: `${pulledCard.name} is ready to share.`,
        });
      });
      return;
    }

    toast({
      title: "Pull ready",
      description: `${pulledCard.name} is in your locker.`,
    });
  };

  const hasPacks = packs[selectedPack] > 0;
  const selectedPackAsset = ximAssets.packs[selectedPack];
  const selectedPackLabel = PACK_LABELS[selectedPack];
  const pulledRarity = pulledCard?.rarity.toLowerCase() ?? "common";

  return (
    <div className="pack-page-shell p-3 md:p-5 h-full min-h-[calc(100vh-140px)] flex flex-col relative">
      <div className="pack-page-ambient absolute inset-0 -z-10 rounded-3xl overflow-hidden pointer-events-none" />

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
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_280px] gap-4 md:gap-6">
          
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
                <div className="pack-selector-content">
                  <img className="pack-selector-thumb" src={ximAssets.packs.starter} alt="" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between mb-1 gap-2">
                      <div className="display text-lg text-white">Starter Pack</div>
                      <div className="chip bg-primary/20 text-primary border-primary/30">x{packs.starter}</div>
                    </div>
                    <div className="text-[11px] text-muted-foreground uppercase tracking-wide">Base Nations</div>
                  </div>
                </div>
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
                <div className="pack-selector-content">
                  <img className="pack-selector-thumb" src={ximAssets.packs.fever} alt="" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between mb-1 gap-2">
                      <div className="display text-lg text-white">Fever Pack</div>
                      <div className="chip bg-destructive/20 text-destructive border-destructive/30">x{packs.fever}</div>
                    </div>
                    <div className="text-[11px] text-muted-foreground uppercase tracking-wide">High Output Potential</div>
                  </div>
                </div>
                {selectedPack === "fever" && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-destructive glow-heat" />
                )}
              </button>
            </div>
          </div>

          {/* Central Area: Big Pack Display */}
          <div className="glass-strong rounded-3xl p-6 flex flex-col items-center justify-start relative overflow-hidden pack-stage pack-stage-panel">
            {/* Ambient spotlights behind pack */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[80%] opacity-40 blur-[100px] pointer-events-none"
              style={{ background: selectedPack === "starter" ? "var(--color-primary)" : "var(--color-destructive)" }}
            />

            {/* The Pack Object */}
            <div 
              onClick={() => hasPacks && handleOpen(selectedPack)}
              className={`pack-product xim-pack-display pack-product--${selectedPack} ${selectedPack === "starter" ? "is-starter" : "is-fever"} ${hasPacks ? 'cursor-pointer fcard-shine' : 'is-sold-out cursor-not-allowed'}`}
            >
              <img className="xim-pack-art" src={selectedPackAsset} alt={`${selectedPackLabel} artwork`} />

              {!hasPacks && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                  <Lock className="w-12 h-12 text-white/50" />
                </div>
              )}
            </div>

            {/* Action Area */}
            <div className="mt-6 w-full max-w-sm text-center">
              <button 
                onClick={() => handleOpen(selectedPack)}
                disabled={!hasPacks}
                className={`btn w-full py-4 text-lg ${selectedPack === "starter" ? "btn-primary glow-primary" : "btn-heat glow-heat"}`}
              >
                {hasPacks ? "Open Pack" : "Sold Out"} <Zap className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>

          <div className="glass rounded-2xl p-4 flex flex-col pack-reward-panel">
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
      )}

      {/* Opening Animation State */}
      {opening && (
        <div className="pack-reveal-overlay" role="status" aria-live="polite">
          <div className="pack-reveal-stage">
            <div className={`pack-reveal-pack pack-product--${selectedPack} pack-reveal-pack--opening ${selectedPack === "starter" ? "is-starter" : "is-fever"}`}>
              <img className="xim-pack-art" src={selectedPackAsset} alt="" />
              <div className="pack-opening-flare" />
              <div className="pack-reveal-burst" />
            </div>
            <div className="pack-reveal-status">
              <span>Pack Machine</span>
              <strong>Opening Pack</strong>
            </div>
          </div>
        </div>
      )}

      {/* Reveal State */}
      {pulledCard && !opening && (
        <div className={`pack-reveal-overlay pack-reveal-overlay--reward rarity-${pulledRarity}`} role="dialog" aria-label="Pack reward">
          <div className="pack-reveal-stage">
            <div className="pack-reveal-copy">
              <span>Reward Acquired</span>
              <h2>{pulledCard.name}</h2>
              <p>{pulledCard.rarity} Nation Card</p>
            </div>

            <div className={`pack-reveal-card pack-reveal-card--enter rarity-${pulledRarity}`}>
              <CardComponent card={pulledCard} size="lg" />
            </div>

            <div className="pack-reveal-actions">
              <button 
                onClick={() => setPulledCard(null)}
                className="btn btn-primary px-7 py-3 glow-primary"
              >
                Add to Locker <CheckCircle2 className="w-5 h-5 ml-2" />
              </button>
              <button 
                onClick={handleSharePull}
                className="btn btn-secondary px-7 py-3"
              >
                Share Pull <Share2 className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
