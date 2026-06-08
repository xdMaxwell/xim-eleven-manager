import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useGameState } from "../lib/game-state";
import { EVENTS, CountryCard } from "../lib/constants";
import { CardComponent } from "../components/card-component";
import { StadiumBackdrop } from "../components/stadium-backdrop";
import {
  Swords,
  ChevronLeft,
  Plus,
  X,
  Activity,
  Zap,
  Flame,
  TrendingUp,
  Shield,
  Sparkles,
} from "lucide-react";

const IMPACT_POOL = [
  { icon: Zap, label: "Pitch Points", tone: "text-primary", sign: "+" },
  { icon: Flame, label: "Heat", tone: "text-destructive", sign: "+" },
  { icon: TrendingUp, label: "Form", tone: "text-secondary", sign: "+" },
  { icon: Shield, label: "Fatigue", tone: "text-amber-300", sign: "-" },
  { icon: Sparkles, label: "Mutation", tone: "text-purple-400", sign: "?" },
];

export default function FormationBuilder() {
  const { equipped, ownedCards, roarPower, startMatch, feverTarget, setFeverTarget } = useGameState();
  const { equipCard, unequipCard } = useGameState();
  const [, setLocation] = useLocation();
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [deploying, setDeploying] = useState(false);

  const liveEvent = EVENTS.find((e) => e.status === "LIVE");
  const eventName = feverTarget ?? liveEvent?.name ?? "Night Match Fever";

  const activeCards = equipped.filter((c): c is CountryCard => c !== null);
  const ready = activeCards.length >= 2;
  const equippedIds = new Set(activeCards.map((c) => c.id));

  const handleBenchTap = (card: CountryCard) => {
    if (deploying || equippedIds.has(card.id)) return;
    const firstEmpty = equipped.findIndex((c) => c === null);
    const target = firstEmpty === -1 ? selectedSlot : firstEmpty;
    equipCard(card.id, target);
    const next = equipped.findIndex((c, i) => c === null && i !== target);
    if (next !== -1) setSelectedSlot(next);
  };

  const handleSlotTap = (i: number) => {
    if (deploying) return;
    if (equipped[i]) {
      unequipCard(i);
      setSelectedSlot(i);
    } else {
      setSelectedSlot(i);
    }
  };

  const handleDeploy = () => {
    if (!ready || deploying) return;
    setDeploying(true);
    setTimeout(() => {
      startMatch(eventName, activeCards);
      setFeverTarget(null);
      setDeploying(false);
      setLocation("/fever-match");
    }, 1100);
  };

  return (
    <div className="p-3 md:p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/fever" className="btn btn-ghost py-2 px-3 shrink-0">
            <ChevronLeft className="w-4 h-4" /> Fever
          </Link>
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Tactics</div>
            <h1 className="display text-xl md:text-3xl text-white uppercase leading-none truncate">Formation Builder</h1>
          </div>
        </div>
        <div className="glass px-3 py-2 rounded-xl text-right shrink-0">
          <div className="text-[9px] uppercase tracking-widest text-muted-foreground leading-none mb-0.5">Deploying Into</div>
          <div className="display text-sm md:text-base text-destructive text-glow-heat leading-none">{eventName}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        {/* ============ THE PITCH ============ */}
        <div className="relative rounded-3xl overflow-hidden glass-strong min-h-[440px] flex flex-col">
          <StadiumBackdrop intensity={0.7} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />

          {/* pitch markings */}
          <div className="absolute inset-x-6 inset-y-8 rounded-2xl border border-primary/20 pointer-events-none">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-primary/15" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-primary/15" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/40" />
          </div>

          {/* total roar chip */}
          <div className="absolute top-4 left-4 z-20 glass px-3 py-1.5 rounded-xl border-secondary/30 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Total Roar</span>
            <span className="num text-lg text-white leading-none">{roarPower}</span>
          </div>

          {/* slots */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6 p-6">
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
              {equipped.map((card, i) => (
                <div
                  key={i}
                  className={i === 1 ? "md:-translate-y-8" : "md:translate-y-4"}
                >
                  {card ? (
                    <div className="relative group">
                      <CardComponent card={card} size="sm" tilt={!deploying} className={deploying ? "animate-pulse" : ""} />
                      {!deploying && (
                        <button
                          onClick={() => handleSlotTap(i)}
                          className="absolute -top-2 -right-2 z-20 w-7 h-7 rounded-full bg-destructive text-white grid place-items-center border-2 border-black/40 shadow-lg hover:scale-110 transition-transform"
                          aria-label="Remove from formation"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 chip bg-primary/20 border-primary/40 text-primary text-[9px] whitespace-nowrap">
                        On Pitch
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSlotTap(i)}
                      className={`w-32 h-48 md:w-36 md:h-52 rounded-2xl border-2 border-dashed grid place-items-center text-center transition-all duration-200
                        ${selectedSlot === i
                          ? "border-primary/60 bg-primary/5 glow-primary"
                          : "border-white/15 bg-white/[0.02] hover:border-primary/40"}`}
                    >
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Plus className="w-6 h-6" />
                        <span className="display text-xs uppercase">Slot {i + 1}</span>
                        <span className="text-[9px] uppercase tracking-wider">{selectedSlot === i ? "Tap a card" : "Empty"}</span>
                      </div>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* status footer on pitch */}
          <div className="relative z-10 px-5 py-3 bg-black/40 border-t border-white/10 flex items-center justify-between">
            {ready ? (
              <span className="text-primary text-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-blink" /> Formation ready — {activeCards.length} deployed
              </span>
            ) : (
              <span className="text-destructive text-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive" /> Deploy at least 2 nation cards
              </span>
            )}
          </div>
        </div>

        {/* ============ SIDE: IMPACT + DEPLOY ============ */}
        <div className="flex flex-col gap-4">
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3 text-secondary">
              <Activity className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-widest font-bold">Possible Match Impact</span>
            </div>
            <ul className="flex flex-col gap-2">
              {IMPACT_POOL.map((imp) => (
                <li key={imp.label} className="flex items-center justify-between bg-black/30 rounded-lg p-2.5 border border-white/5">
                  <span className="flex items-center gap-2 text-[12px] text-white/80">
                    <imp.icon className={`w-3.5 h-3.5 ${imp.tone}`} /> {imp.label}
                  </span>
                  <span className={`num text-sm ${imp.tone}`}>{imp.sign}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleDeploy}
            disabled={!ready || deploying}
            className={`btn w-full text-base py-4 ${deploying ? "bg-white/10 text-white/50 border-white/5 cursor-wait" : ready ? "btn-heat glow-heat" : "bg-white/5 text-white/40 border-white/10 cursor-not-allowed"}`}
          >
            {deploying ? (
              <span className="flex items-center justify-center gap-2"><Activity className="w-5 h-5 animate-spin" /> Deploying...</span>
            ) : (
              <span className="flex items-center justify-center gap-2"><Swords className="w-5 h-5" /> Deploy XI</span>
            )}
          </button>
        </div>
      </div>

      {/* ============ BENCH ============ */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="display text-lg text-white uppercase">Card Bench</h3>
          <span className="text-[11px] text-muted-foreground uppercase tracking-widest">{ownedCards.length} Cards</span>
        </div>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
          {ownedCards.map((card) => {
            const onPitch = equippedIds.has(card.id);
            return (
              <button
                key={card.id}
                onClick={() => handleBenchTap(card)}
                disabled={onPitch || deploying}
                className={`shrink-0 transition-all duration-200 ${onPitch ? "opacity-40 grayscale cursor-not-allowed" : "hover:-translate-y-1"}`}
              >
                <CardComponent card={card} size="sm" tilt={false} />
              </button>
            );
          })}
        </div>
        {ownedCards.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">No cards yet — open a pack to scout nations.</p>
        )}
      </div>
    </div>
  );
}
