import { useState } from "react";
import { useGameState } from "../lib/game-state";
import { CardComponent } from "../components/card-component";
import { CountryCard } from "../lib/constants";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { Zap, Activity, ArrowUpCircle, XCircle } from "lucide-react";

export default function Locker() {
  const { ownedCards, equipped, equipCard, unequipCard, upgradeCard, overchargeCard } = useGameState();
  const { toast } = useToast();
  
  const [selected, setSelected] = useState<CountryCard | null>(ownedCards[0] || null);
  const [overchargeResult, setOverchargeResult] = useState<{result: string, message: string} | null>(null);

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
    <div className="flex flex-col gap-8 max-w-6xl mx-auto min-h-[70vh] relative">
      
      {/* Overcharge Overlay */}
      {overchargeResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
          <div className="text-center p-8 bg-black border-4 border-white/20 rounded-2xl shadow-2xl">
            <h2 className={`text-6xl font-black uppercase tracking-widest glow-text mb-4 ${
              overchargeResult.result === "Fail" ? "text-destructive" : 
              overchargeResult.result === "Mutation" ? "text-purple-500" : "text-primary"
            }`}>
              {overchargeResult.result}
            </h2>
            <p className="font-mono text-2xl text-white font-bold">{overchargeResult.message}</p>
          </div>
        </div>
      )}

      {/* Top Layout: Selected Card & Stats */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Selected Card Preview */}
        <div className="shrink-0 flex justify-center items-center p-4 bg-black/40 border-2 border-white/10 rounded-2xl relative overflow-hidden">
          {selected ? (
            <>
              <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-gradient-to-b from-current to-transparent z-0 blur-xl" style={{ color: selected.color }} />
              <CardComponent card={selected} size="lg" />
            </>
          ) : (
            <div className="w-64 h-96 flex items-center justify-center border-4 border-dashed border-gray-700 rounded-xl text-gray-500 font-black uppercase tracking-widest">
              SELECT CARD
            </div>
          )}
        </div>

        {/* Stats & Actions */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-black/60 border-2 border-white/10 rounded-xl p-6 backdrop-blur-md h-full flex flex-col">
            <h2 className="text-2xl font-black uppercase tracking-widest text-white border-b-2 border-white/10 pb-2 mb-6">
              Operations
            </h2>

            <div className="flex flex-col gap-4 mt-auto">
              <Button 
                onClick={handleEquip}
                className={`btn-arcade w-full py-6 text-xl ${
                  isEquipped 
                    ? "bg-gray-800 text-white border-gray-900 hover:bg-gray-700" 
                    : "btn-primary-arcade"
                }`}
              >
                {isEquipped ? <><XCircle className="mr-2" /> REMOVE FROM FORMATION</> : <><Zap className="mr-2" /> ADD TO FORMATION</>}
              </Button>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={handleUpgrade}
                  className="btn-arcade bg-gray-900 text-white border-gray-950 hover:bg-gray-800 flex-col h-auto py-4"
                >
                  <span className="flex items-center gap-1 text-sm"><ArrowUpCircle className="w-4 h-4 text-accent" /> UPGRADE</span>
                  <span className="font-mono text-xs text-accent mt-1 bg-accent/20 px-2 py-0.5 rounded">300 PP</span>
                </Button>
                
                <Button 
                  onClick={handleOvercharge}
                  className="btn-arcade bg-black border-purple-900 text-purple-400 hover:bg-purple-950 hover:text-purple-300 flex-col h-auto py-4"
                >
                  <span className="flex items-center gap-1 text-sm"><Activity className="w-4 h-4" /> OVERCHARGE</span>
                  <span className="font-mono text-xs opacity-70 mt-1">500 PP</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Active Formation Preview */}
          <div className="bg-black/60 border-2 border-white/10 rounded-xl p-4 backdrop-blur-md">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-3">Active Formation</h3>
            <div className="flex gap-2">
              {equipped.map((c, i) => (
                <div key={i} className={`flex-1 h-12 rounded border-2 flex items-center justify-center text-xs font-black uppercase tracking-widest ${
                  c ? "border-primary bg-primary/10 text-primary" : "border-dashed border-gray-700 text-gray-600"
                }`}>
                  {c ? c.name : `SLOT ${i+1}`}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Layout: Binder / Carousel */}
      <div className="bg-black/80 border-t-4 border-white/20 -mx-4 md:mx-0 md:rounded-xl p-6 overflow-x-auto hide-scrollbar">
        <h2 className="text-xl font-black uppercase tracking-widest text-white mb-4">
          Collection Binder ({ownedCards.length})
        </h2>
        <div className="flex gap-4 min-w-max">
          {ownedCards.map(card => {
            const isSel = selected?.id === card.id;
            const isEq = equipped.some(c => c?.id === card.id);
            return (
              <div key={card.id} className="relative">
                <CardComponent 
                  card={card} 
                  size="sm" 
                  selected={isSel}
                  onClick={() => setSelected(card)}
                />
                {isEq && (
                  <div className="absolute -top-2 -right-2 bg-primary text-black text-[10px] font-black px-2 py-1 rounded border-2 border-black uppercase z-20">
                    IN PLAY
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
