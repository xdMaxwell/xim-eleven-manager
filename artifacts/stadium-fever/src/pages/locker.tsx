import { useState } from "react";
import { useGameState } from "../lib/game-state";
import { CardComponent } from "../components/card-component";
import { CountryCard } from "../lib/constants";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { Zap, Activity, ArrowUpCircle, XCircle, ShieldAlert } from "lucide-react";

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="text-center p-12 bg-black border-8 border-white rounded-2xl shadow-[0_0_100px_rgba(255,255,255,0.2)]">
            <h2 className={`text-8xl font-black uppercase tracking-widest text-flash mb-6 ${
              overchargeResult.result === "Fail" ? "text-destructive" : 
              overchargeResult.result === "Mutation" ? "text-purple-500" : "text-accent"
            }`}>
              {overchargeResult.result}
            </h2>
            <div className="bg-gray-900 border-4 border-gray-700 py-4 px-8 inline-block">
              <p className="font-mono text-3xl text-white font-bold">{overchargeResult.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Layout: Selected Card & Stats */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Selected Card Preview */}
        <div className="shrink-0 flex justify-center items-center p-8 retro-panel rounded-2xl relative overflow-hidden bg-gradient-to-b from-gray-900 to-black">
          {selected ? (
            <div className="relative group perspective-[1000px]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] blur-[80px] opacity-30 pointer-events-none" style={{ backgroundColor: selected.color }} />
              <div className="transform transition-all duration-300 hover:scale-105 hover:rotate-y-6">
                <CardComponent card={selected} size="lg" className="shadow-[0_20px_50px_rgba(0,0,0,0.8)]" />
              </div>
            </div>
          ) : (
            <div className="w-64 h-96 flex items-center justify-center border-4 border-dashed border-gray-700 bg-black rounded-xl text-gray-500 font-black uppercase tracking-widest text-2xl">
              SELECT
            </div>
          )}
        </div>

        {/* Stats & Actions */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="retro-panel rounded-xl p-6 h-full flex flex-col bg-gray-900">
            <h2 className="text-3xl font-black uppercase tracking-widest text-white border-b-4 border-gray-700 pb-2 mb-6 flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-primary" /> OPERATIONS
            </h2>

            <div className="flex flex-col gap-4 mt-auto">
              <Button 
                onClick={handleEquip}
                className={`btn-arcade w-full py-8 text-2xl ${
                  isEquipped 
                    ? "bg-gray-800 text-white border-gray-600 hover:bg-gray-700" 
                    : "btn-primary-arcade"
                }`}
              >
                {isEquipped ? <><XCircle className="mr-3 w-6 h-6" /> UNEQUIP</> : <><Zap className="mr-3 w-6 h-6" /> EQUIP</>}
              </Button>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={handleUpgrade}
                  className="btn-arcade bg-blue-900 text-white border-blue-700 hover:bg-blue-800 flex-col h-auto py-6"
                >
                  <span className="flex items-center gap-2 text-xl"><ArrowUpCircle className="w-5 h-5 text-accent" /> UPGRADE</span>
                  <span className="font-mono text-sm text-accent mt-2 bg-black px-3 py-1 rounded border-2 border-accent/50">300 PP</span>
                </Button>
                
                <Button 
                  onClick={handleOvercharge}
                  className="btn-arcade bg-purple-900 text-white border-purple-700 hover:bg-purple-800 flex-col h-auto py-6"
                >
                  <span className="flex items-center gap-2 text-xl"><Activity className="w-5 h-5" /> OVERCHARGE</span>
                  <span className="font-mono text-sm mt-2 bg-black px-3 py-1 rounded border-2 border-white/20">500 PP</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Active Formation Preview */}
          <div className="bg-black border-4 border-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-3 text-center">Active Formation</h3>
            <div className="flex gap-2">
              {equipped.map((c, i) => (
                <div key={i} className={`flex-1 h-14 rounded-lg border-4 flex items-center justify-center text-sm font-black uppercase tracking-widest shadow-inner ${
                  c ? "border-primary bg-primary/20 text-primary" : "border-gray-800 bg-gray-900 text-gray-600"
                }`}>
                  {c ? c.name : `SLOT ${i+1}`}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Layout: Binder / Carousel */}
      <div className="retro-panel -mx-4 md:mx-0 p-6 overflow-x-auto hide-scrollbar rounded-xl bg-gray-900">
        <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-6 border-b-4 border-gray-700 pb-2 inline-block">
          CARD BINDER [{ownedCards.length}]
        </h2>
        <div className="flex gap-6 min-w-max pb-4 px-2">
          {ownedCards.map(card => {
            const isSel = selected?.id === card.id;
            const isEq = equipped.some(c => c?.id === card.id);
            return (
              <div key={card.id} className="relative group">
                <CardComponent 
                  card={card} 
                  size="md" 
                  selected={isSel}
                  onClick={() => setSelected(card)}
                  className={`transition-all duration-300 ${isSel ? '-translate-y-4' : 'hover:-translate-y-2'}`}
                />
                {isEq && (
                  <div className="absolute -top-3 -right-3 bg-primary text-black text-xs font-black px-3 py-1 rounded border-4 border-black uppercase z-20 shadow-lg animate-pulse">
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
