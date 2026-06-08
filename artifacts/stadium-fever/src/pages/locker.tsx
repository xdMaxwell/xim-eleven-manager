import { useState } from "react";
import { useGameState } from "../lib/game-state";
import { CardComponent } from "../components/card-component";
import { CountryCard } from "../lib/constants";
import { useToast } from "../hooks/use-toast";

export default function Locker() {
  const { ownedCards, equipped, equipCard, unequipCard, upgradeCard, overchargeCard } = useGameState();
  const { toast } = useToast();
  
  const [selected, setSelected] = useState<CountryCard | null>(ownedCards[0] || null);
  const [overchargeResult, setOverchargeResult] = useState<{result: string, message: string} | null>(null);
  const [showScout, setShowScout] = useState(false);

  const isEquipped = selected ? equipped.some(c => c?.id === selected.id) : false;
  const equippedIndex = selected ? equipped.findIndex(c => c?.id === selected.id) : -1;

  const handleEquip = () => {
    if (!selected) return;
    if (isEquipped) {
      unequipCard(equippedIndex);
      toast({ title: "UNEQUIPPED", description: "Card removed from formation." });
    } else {
      const emptySlot = equipped.findIndex(c => c === null);
      if (emptySlot === -1) {
        toast({ title: "FORMATION FULL", description: "Unequip a card first.", variant: "destructive" });
      } else {
        equipCard(selected.id, emptySlot);
        toast({ title: "EQUIPPED", description: `Added to slot ${emptySlot + 1}.` });
      }
    }
  };

  const handleUpgrade = () => {
    if (!selected) return;
    const success = upgradeCard(selected.id);
    if (success) {
      toast({ title: "UPGRADE COMPLETE", description: "+5 ROAR Power." });
      setSelected(ownedCards.find(c => c.id === selected.id) || null);
    } else {
      toast({ title: "INSUFFICIENT FUNDS", description: "Requires 300 Pitch Points.", variant: "destructive" });
    }
  };

  const handleOvercharge = () => {
    if (!selected) return;
    const res = overchargeCard(selected.id);
    if (res) {
      setOverchargeResult(res);
      setTimeout(() => setOverchargeResult(null), 3000);
      setSelected(ownedCards.find(c => c.id === selected.id) || null);
    } else {
      toast({ title: "INSUFFICIENT FUNDS", description: "Requires 500 Pitch Points.", variant: "destructive" });
    }
  };

  return (
    <div className="relative flex flex-col gap-6 w-full pb-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}locker-bg.png)`, imageRendering: "pixelated" }} />
      
      {/* Overcharge Dramatic Overlay */}
      {overchargeResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="text-center p-10 pixel-panel max-w-xl w-full mx-4 border-[8px] border-white">
            <h2 className={`text-4xl md:text-6xl font-mono uppercase mb-6 ${
              overchargeResult.result === "Fail" ? "text-destructive" : 
              overchargeResult.result === "Mutation" ? "text-purple-500" : "text-accent"
            } animate-blink`}>
              {overchargeResult.result}
            </h2>
            <p className="font-mono text-2xl text-white">{overchargeResult.message}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="pixel-panel p-4 flex items-center justify-between">
        <h2 className="font-mono text-2xl text-white uppercase">Locker Room</h2>
        <div className="font-mono text-sm text-gray-400">TOTAL ASSETS: {ownedCards.length}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Selected Card Focus */}
        <div className="pixel-panel p-8 flex flex-col items-center gap-6 bg-[#0a0f1c] min-h-[400px]">
          {selected ? (
            <>
              <div className="scale-110 mt-4">
                <CardComponent card={selected} size="lg" />
              </div>

              <div className="w-full mt-2">
                <button
                  onClick={() => setShowScout((v) => !v)}
                  className="pixel-btn bg-black text-white border-gray-500 w-full py-2 text-xs flex items-center justify-between px-3"
                >
                  <span>SCOUT STATS</span>
                  <span className="font-mono">{showScout ? "[-]" : "[+]"}</span>
                </button>

                {showScout && selected.scout && (
                  <div className="mt-3 bg-black border-2 border-gray-700 p-3 flex flex-col gap-2">
                    <ScoutBar label="Attack" value={selected.scout.attack} color="#ef4444" />
                    <ScoutBar label="Defense" value={selected.scout.defense} color="#3b82f6" />
                    <ScoutBar label="Tempo" value={selected.scout.tempo} color="#22c55e" />
                    <ScoutBar label="Stamina" value={selected.scout.stamina} color="#eab308" />
                    <ScoutBar label="Spirit" value={selected.scout.spirit} color="#f59e0b" />
                    <ScoutBar label="Chaos" value={selected.scout.chaos} color="#8b5cf6" />
                  </div>
                )}
                {showScout && !selected.scout && (
                  <div className="mt-3 bg-black border-2 border-gray-700 p-3 font-mono text-[10px] text-gray-500">
                    No scout report on file.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="font-mono text-gray-500 text-xl my-auto">NO ASSET SELECTED</div>
          )}
        </div>

        {/* Actions Panel */}
        <div className="pixel-panel p-6 flex flex-col">
          <h3 className="font-mono text-xl text-white uppercase border-b-4 border-white pb-2 mb-6">Operations</h3>
          
          {selected ? (
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex justify-between items-center bg-black border-2 border-gray-700 p-3 mb-4">
                <span className="font-mono text-xs text-gray-400">STATUS</span>
                <span className={`font-mono text-sm ${isEquipped ? 'text-primary' : 'text-gray-300'}`}>
                  {isEquipped ? `DEPLOYED (SLOT ${equippedIndex + 1})` : 'RESERVE'}
                </span>
              </div>

              <button 
                onClick={handleEquip}
                className={`pixel-btn py-4 text-xl ${isEquipped ? "bg-gray-700 text-white border-gray-500" : "pixel-btn-primary"}`}
              >
                {isEquipped ? "RECALL TO BENCH" : "DEPLOY TO PITCH"}
              </button>

              <div className="grid grid-cols-2 gap-4 mt-auto">
                <button 
                  onClick={handleUpgrade}
                  className="pixel-btn bg-blue-600 text-white py-3 flex flex-col items-center"
                >
                  <span className="text-sm">UPGRADE</span>
                  <span className="text-[8px] mt-1">300 PP</span>
                </button>
                <button 
                  onClick={handleOvercharge}
                  className="pixel-btn bg-purple-600 text-white py-3 flex flex-col items-center"
                >
                  <span className="text-sm">OVERCHARGE</span>
                  <span className="text-[8px] mt-1">500 PP</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="font-mono text-gray-500 text-sm">Select an asset from the binder.</div>
          )}
        </div>

        {/* Binder / Roster */}
        <div className="pixel-panel p-6 flex flex-col h-[500px] lg:h-auto overflow-hidden">
           <h3 className="font-mono text-xl text-white uppercase border-b-4 border-white pb-2 mb-4 shrink-0">Binder</h3>
           <div className="flex-1 overflow-y-auto hide-scrollbar grid grid-cols-2 gap-4 content-start">
             {ownedCards.map(card => {
               const isSel = selected?.id === card.id;
               const isEq = equipped.some(c => c?.id === card.id);
               return (
                 <div key={card.id} className="relative" onClick={() => setSelected(card)}>
                   <CardComponent card={card} size="sm" selected={isSel} />
                   {isEq && (
                     <div className="absolute top-1 right-1 bg-primary text-black font-mono text-[8px] px-1 border border-black z-20">
                       DPL
                     </div>
                   )}
                 </div>
               )
             })}
           </div>
        </div>

      </div>
    </div>
  );
}

function ScoutBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[9px] text-gray-400 uppercase w-16 shrink-0">{label}</span>
      <div className="flex-1 h-3 bg-gray-900 border border-gray-700 flex gap-px p-px">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex-1"
            style={{ backgroundColor: i < value ? color : "transparent", imageRendering: "pixelated" }}
          />
        ))}
      </div>
      <span className="font-mono text-[9px] text-white w-5 text-right">{value}</span>
    </div>
  );
}
