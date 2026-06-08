import { useState } from "react";
import { useGameState } from "../lib/game-state";
import { CardComponent } from "../components/card-component";
import { CountryCard } from "../lib/constants";
import { useToast } from "../hooks/use-toast";
import {
  Zap,
  Swords,
  TrendingUp,
  Lock,
  Star,
  ChevronDown,
  ChevronUp,
  X,
  ArrowUpCircle,
  Database
} from "lucide-react";

export default function Locker() {
  const {
    ownedCards,
    equipped,
    equipCard,
    unequipCard,
    upgradeCard,
    overchargeCard,
  } = useGameState();
  const { toast } = useToast();

  const [selected, setSelected] = useState<CountryCard | null>(
    ownedCards[0] || null
  );
  const [overchargeResult, setOverchargeResult] = useState<{
    result: string;
    message: string;
  } | null>(null);
  const [showScout, setShowScout] = useState(false);

  // Sync selected card state after upgrades/overcharges
  const currentCard = selected
    ? ownedCards.find((c) => c.id === selected.id) || selected
    : null;

  const isEquipped = currentCard
    ? equipped.some((c) => c?.id === currentCard.id)
    : false;
  const equippedIndex = currentCard
    ? equipped.findIndex((c) => c?.id === currentCard.id)
    : -1;

  const handleEquip = () => {
    if (!currentCard) return;
    if (isEquipped) {
      unequipCard(equippedIndex);
      toast({
        title: "Recalled",
        description: "Asset removed from active formation.",
      });
    } else {
      const emptySlot = equipped.findIndex((c) => c === null);
      if (emptySlot === -1) {
        toast({
          title: "Formation Full",
          description: "Recall an asset first.",
          variant: "destructive",
        });
      } else {
        equipCard(currentCard.id, emptySlot);
        toast({
          title: "Deployed",
          description: `Added to Slot ${emptySlot + 1}.`,
        });
      }
    }
  };

  const handleUpgrade = () => {
    if (!currentCard) return;
    const success = upgradeCard(currentCard.id);
    if (success) {
      toast({ title: "Upgrade Complete", description: "+5 Roar Power." });
      setSelected(
        ownedCards.find((c) => c.id === currentCard.id) || currentCard
      );
    } else {
      toast({
        title: "Insufficient Funds",
        description: "Requires 300 Pitch Points.",
        variant: "destructive",
      });
    }
  };

  const handleOvercharge = () => {
    if (!currentCard) return;
    const res = overchargeCard(currentCard.id);
    if (res) {
      setOverchargeResult(res);
      setSelected(
        ownedCards.find((c) => c.id === currentCard.id) || currentCard
      );
    } else {
      toast({
        title: "Insufficient Funds",
        description: "Requires 500 Pitch Points.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-3 md:p-5 relative flex flex-col gap-4 md:gap-6 min-h-screen">
      {/* Background Ambience */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(70% 50% at 50% 0%, rgba(132,204,22,0.08), transparent 70%)" }}
      />

      {/* Overcharge Dramatic Overlay */}
      {overchargeResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="glass-strong rounded-3xl p-8 md:p-12 max-w-xl w-full mx-4 flex flex-col items-center text-center border-t border-white/20 shadow-2xl anim-burst">
            <div className="w-20 h-20 mb-6 rounded-full bg-white/5 border border-white/10 grid place-items-center">
              {overchargeResult.result === "Fail" ? (
                <TrendingUp className="w-10 h-10 text-destructive rotate-180" />
              ) : overchargeResult.result === "Mutation" ? (
                <Zap className="w-10 h-10 text-purple-400" />
              ) : overchargeResult.result === "Great Success" ? (
                <Star className="w-10 h-10 text-secondary" />
              ) : (
                <Swords className="w-10 h-10 text-primary" />
              )}
            </div>
            <h2
              className={`display text-4xl md:text-6xl uppercase tracking-tight mb-2 leading-none ${
                overchargeResult.result === "Fail"
                  ? "text-destructive text-glow-heat"
                  : overchargeResult.result === "Mutation"
                  ? "text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.5)]"
                  : overchargeResult.result === "Great Success"
                  ? "text-secondary text-glow-secondary"
                  : "text-primary text-glow-primary"
              }`}
            >
              {overchargeResult.result}
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8 num">
              {overchargeResult.message}
            </p>
            <button
              onClick={() => setOverchargeResult(null)}
              className="btn btn-ghost px-8"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display text-2xl md:text-3xl text-white uppercase">
            Club Locker
          </h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
            Asset Management
          </p>
        </div>
        <div className="chip border-white/10">
          <Database className="w-3 h-3 text-primary" />
          <span className="text-white">
            {ownedCards.length} <span className="text-muted-foreground">Assets</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-4 md:gap-6">
        {/* Left Column: Selected Card + Binder */}
        <div className="flex flex-col gap-4 md:gap-6">
          {/* Selected Card Focus */}
          <div className="glass rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            {currentCard ? (
              <>
                <div className="shrink-0 relative z-10">
                  <CardComponent card={currentCard} size="lg" />
                  {isEquipped && (
                    <div className="absolute -top-3 -right-3 z-20 bg-primary text-[#06210c] px-3 py-1 rounded-full border border-white/40 text-[10px] uppercase font-display font-extrabold tracking-widest shadow-lg">
                      Deployed
                    </div>
                  )}
                </div>

                <div className="w-full flex-1 z-10 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
                        Scout Report
                      </div>
                      <h3 className="display text-xl text-white">
                        {currentCard.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowScout((v) => !v)}
                      className="btn btn-ghost py-1 px-3 text-xs"
                    >
                      {showScout ? "Hide" : "Show"} Stats
                      {showScout ? (
                        <ChevronUp className="w-4 h-4 ml-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </button>
                  </div>

                  {showScout && currentCard.scout && (
                    <div className="flex flex-col gap-3 anim-reveal">
                      <ScoutBar
                        label="Attack"
                        value={currentCard.scout.attack}
                        color="from-rose-500 to-red-400"
                      />
                      <ScoutBar
                        label="Defense"
                        value={currentCard.scout.defense}
                        color="from-blue-500 to-cyan-400"
                      />
                      <ScoutBar
                        label="Tempo"
                        value={currentCard.scout.tempo}
                        color="from-emerald-500 to-primary"
                      />
                      <ScoutBar
                        label="Stamina"
                        value={currentCard.scout.stamina}
                        color="from-amber-500 to-accent"
                      />
                      <ScoutBar
                        label="Spirit"
                        value={currentCard.scout.spirit}
                        color="from-orange-500 to-amber-400"
                      />
                      <ScoutBar
                        label="Chaos"
                        value={currentCard.scout.chaos}
                        color="from-purple-600 to-fuchsia-400"
                      />
                    </div>
                  )}
                  {showScout && !currentCard.scout && (
                    <div className="bg-black/30 rounded-xl p-4 text-center text-xs text-muted-foreground uppercase tracking-widest border border-white/5 anim-reveal">
                      No advanced telemetry available.
                    </div>
                  )}

                  {!showScout && (
                    <div className="grid grid-cols-2 gap-3 opacity-60">
                      <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <div className="text-[10px] uppercase text-muted-foreground mb-1">
                          Base Roar
                        </div>
                        <div className="num text-xl text-primary">
                          {currentCard.stats.roar}
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <div className="text-[10px] uppercase text-muted-foreground mb-1">
                          Current Form
                        </div>
                        <div className="num text-xl text-secondary">
                          {currentCard.stats.form}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="w-full text-center text-muted-foreground py-12 uppercase tracking-widest text-sm">
                No Asset Selected
              </div>
            )}
          </div>

          {/* Binder / Roster */}
          <div className="glass rounded-3xl p-5 flex flex-col h-[500px] lg:h-auto lg:flex-1">
            <h3 className="display text-lg text-white uppercase mb-4 shrink-0 px-1">
              Binder
            </h3>
            <div className="flex-1 overflow-y-auto hide-scrollbar grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-4 content-start pb-4 px-1">
              {ownedCards.map((card) => {
                const isSel = currentCard?.id === card.id;
                const isEq = equipped.some((c) => c?.id === card.id);
                return (
                  <div
                    key={card.id}
                    className="relative group"
                    onClick={() => setSelected(card)}
                  >
                    <CardComponent
                      card={card}
                      size="sm"
                      selected={isSel}
                      className="mx-auto"
                    />
                    {isEq && (
                      <div className="absolute -top-2 -right-2 bg-primary text-[#06210c] text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border border-white/30 z-20 shadow-md">
                        Deployed
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Actions Panel */}
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="glass rounded-3xl p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-white" />
              <h3 className="display text-lg text-white uppercase">
                Operations
              </h3>
            </div>

            {currentCard ? (
              <div className="flex flex-col gap-3 flex-1">
                <div className="rounded-xl bg-black/30 border border-white/10 p-3 mb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Status
                    </span>
                    <span
                      className={`chip ${
                        isEquipped
                          ? "bg-primary/20 text-primary border-primary/30"
                          : "text-white"
                      }`}
                    >
                      {isEquipped
                        ? `Deployed (Slot ${equippedIndex + 1})`
                        : "Reserve"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleEquip}
                  className={`btn w-full ${
                    isEquipped ? "btn-ghost text-muted-foreground" : "btn-primary"
                  }`}
                >
                  {isEquipped ? (
                    <>
                      <X className="w-4 h-4" /> Recall to Bench
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4" /> Deploy to Pitch
                    </>
                  )}
                </button>

                <div className="h-px bg-white/10 my-2" />

                <button
                  onClick={handleUpgrade}
                  className="btn btn-secondary w-full flex-col py-3 gap-1"
                >
                  <span className="flex items-center gap-1">
                    <ArrowUpCircle className="w-4 h-4" /> Upgrade
                  </span>
                  <span className="num text-[10px] text-secondary-foreground/60">
                    300 PP
                  </span>
                </button>

                <button
                  onClick={handleOvercharge}
                  className="btn btn-heat w-full flex-col py-3 gap-1 group overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="flex items-center gap-1">
                    <Zap className="w-4 h-4" /> Overcharge
                  </span>
                  <span className="num text-[10px] text-white/80">
                    500 PP
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center text-[11px] text-muted-foreground uppercase tracking-widest">
                Select an asset
                <br />
                from the binder
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoutBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const pct = (value / 10) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider w-16 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
        <div
          className={`h-full bg-gradient-to-r ${color} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="num text-xs text-white w-5 text-right">{value}</span>
    </div>
  );
}
