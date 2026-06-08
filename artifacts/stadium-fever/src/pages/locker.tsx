import { useState } from "react";
import { useGameState } from "../lib/game-state";
import { CardComponent } from "../components/card-component";
import { CountryCard } from "../lib/constants";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { Zap, Activity, ArrowUpCircle, XCircle, ShieldAlert, Target, Database } from "lucide-react";

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
      setTimeout(() => setOverchargeResult(null), 3500);
      setSelected(ownedCards.find(c => c.id === selected.id) || null);
    } else {
      toast({ title: "INSUFFICIENT FUNDS", description: "Requires 500 Pitch Points.", variant: "destructive" });
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto min-h-[75vh] relative w-full">
      
      {/* Heavy Tactics Room Background */}
      <div className="absolute inset-0 bg-gray-950 rounded-3xl border-8 border-gray-800 shadow-[inset_0_0_100px_rgba(0,0,0,1)] overflow-hidden -z-20" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(255,255,255,0.01)_20px,rgba(255,255,255,0.01)_40px)] pointer-events-none -z-10" />

      {/* Overcharge Dramatic Overlay */}
      {overchargeResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="text-center p-16 bg-black border-[16px] border-white rounded-3xl shadow-[0_0_150px_rgba(255,255,255,0.3)] max-w-3xl w-full mx-4">
            <h2 className={`text-7xl md:text-9xl font-black uppercase tracking-widest text-flash mb-8 leading-none ${
              overchargeResult.result === "Fail" ? "text-destructive drop-shadow-[0_0_40px_rgba(239,68,68,1)]" : 
              overchargeResult.result === "Mutation" ? "text-purple-500 drop-shadow-[0_0_40px_rgba(168,85,247,1)]" : "text-accent drop-shadow-[0_0_40px_rgba(234,179,8,1)]"
            }`}>
              {overchargeResult.result}
            </h2>
            <div className="bg-gray-900 border-8 border-gray-700 py-6 px-10 inline-block shadow-inner">
              <p className="font-mono text-4xl text-white font-bold">{overchargeResult.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="p-8">
        <h1 className="text-4xl font-black uppercase tracking-widest text-white mb-8 border-b-8 border-gray-800 pb-4 flex items-center gap-4">
          <Database className="w-10 h-10 text-gray-500" /> LOCKER ROOM
        </h1>

        {/* Top Layout: Selected Card & Stats */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Selected Card Giant Preview */}
          <div className="shrink-0 flex justify-center items-center p-12 retro-panel rounded-3xl relative overflow-hidden bg-black border-4 border-gray-700 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_100%)] pointer-events-none" />
            
            {selected ? (
              <div className="relative group perspective-[1200px] scale-110 md:scale-125 my-8">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] blur-[100px] opacity-40 pointer-events-none transition-colors duration-500" style={{ backgroundColor: selected.color }} />
                <div className="transform transition-all duration-500 hover:scale-110 hover:rotate-y-12">
                  <CardComponent card={selected} size="lg" className="shadow-[0_30px_60px_rgba(0,0,0,0.9)] border-8" />
                </div>
              </div>
            ) : (
              <div className="w-80 h-[450px] flex items-center justify-center border-8 border-dashed border-gray-700 bg-gray-900 rounded-2xl text-gray-600 font-black uppercase tracking-widest text-3xl shadow-inner">
                NO ASSET SELECTED
              </div>
            )}
          </div>

          {/* Stats & Actions Dashboard */}
          <div className="flex-1 flex flex-col gap-8">
            <div className="retro-panel rounded-2xl p-8 h-full flex flex-col bg-black border-4 border-gray-700 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.2)_2px,rgba(0,0,0,0.2)_4px)] pointer-events-none" />
              
              <div className="relative z-10">
                <h2 className="text-3xl font-black uppercase tracking-widest text-white border-b-4 border-gray-800 pb-4 mb-8 flex items-center gap-4">
                  <ShieldAlert className="w-8 h-8 text-primary" /> TACTICAL OPERATIONS
                </h2>

                <div className="bg-gray-900 border-4 border-gray-800 p-6 rounded-xl mb-8 shadow-inner">
                   <h3 className="text-sm font-mono font-bold text-gray-500 uppercase tracking-widest mb-4">ASSET STATUS</h3>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="bg-black p-4 border-2 border-gray-700 rounded flex flex-col">
                       <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">DEPLOYMENT</span>
                       <span className={`text-xl font-black uppercase ${isEquipped ? 'text-primary' : 'text-gray-400'}`}>
                         {isEquipped ? `SLOT 0${equippedIndex + 1}` : 'RESERVE'}
                       </span>
                     </div>
                     <div className="bg-black p-4 border-2 border-gray-700 rounded flex flex-col">
                       <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">LEVEL</span>
                       <span className="text-xl font-black uppercase text-white">{selected?.level || 0}</span>
                     </div>
                   </div>
                </div>

                <div className="flex flex-col gap-6 mt-auto">
                  <Button 
                    onClick={handleEquip}
                    className={`btn-arcade w-full py-10 text-3xl shadow-xl ${
                      isEquipped 
                        ? "bg-gray-800 text-gray-400 border-gray-600 hover:bg-gray-700" 
                        : "btn-primary-arcade"
                    }`}
                  >
                    {isEquipped ? <><XCircle className="mr-4 w-8 h-8" /> RECALL TO BENCH</> : <><Zap className="mr-4 w-8 h-8 fill-current" /> DEPLOY TO PITCH</>}
                  </Button>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Button 
                      onClick={handleUpgrade}
                      className="btn-arcade bg-blue-900 text-white border-blue-700 hover:bg-blue-800 flex-col h-auto py-8 shadow-lg"
                    >
                      <span className="flex items-center gap-3 text-2xl"><ArrowUpCircle className="w-6 h-6 text-accent" /> UPGRADE (+5 R)</span>
                      <span className="font-mono text-base text-accent mt-3 bg-black px-4 py-2 rounded border-2 border-accent/50">COST: 300 PP</span>
                    </Button>
                    
                    <Button 
                      onClick={handleOvercharge}
                      className="btn-arcade bg-purple-900 text-white border-purple-700 hover:bg-purple-800 flex-col h-auto py-8 shadow-lg relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] group-hover:animate-pack-shake pointer-events-none" style={{animationDuration: '2s'}} />
                      <span className="flex items-center gap-3 text-2xl relative z-10"><Activity className="w-6 h-6 text-white" /> OVERCHARGE</span>
                      <span className="font-mono text-base mt-3 bg-black px-4 py-2 rounded border-2 border-white/20 relative z-10 text-white">COST: 500 PP</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Active Formation Preview Strip */}
            <div className="bg-black border-4 border-gray-700 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4 flex items-center justify-between">
                <span>Active Squad</span>
                <Target className="w-5 h-5" />
              </h3>
              <div className="flex gap-4">
                {equipped.map((c, i) => (
                  <div key={i} className={`flex-1 h-16 rounded-xl border-4 flex items-center justify-center text-sm font-black uppercase tracking-widest shadow-inner transition-colors ${
                    c ? "border-primary bg-primary/20 text-primary shadow-[0_0_15px_rgba(34,197,94,0.3)]" : "border-gray-800 bg-gray-900 text-gray-600"
                  }`}>
                    {c ? c.name : `SLOT 0${i+1}`}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Layout: Binder Strip */}
        <div className="mt-10 retro-panel p-8 overflow-x-auto hide-scrollbar rounded-2xl bg-black border-4 border-gray-700 shadow-2xl">
          <div className="flex items-center justify-between mb-8 border-b-4 border-gray-800 pb-4">
            <h2 className="text-2xl font-black uppercase tracking-widest text-white flex items-center gap-4">
              ASSET BINDER <span className="bg-gray-800 text-gray-400 px-3 py-1 rounded font-mono text-sm border-2 border-gray-600">{ownedCards.length} TOTAL</span>
            </h2>
          </div>
          <div className="flex gap-8 min-w-max pb-6 px-4">
            {ownedCards.map(card => {
              const isSel = selected?.id === card.id;
              const isEq = equipped.some(c => c?.id === card.id);
              return (
                <div key={card.id} className="relative group cursor-pointer" onClick={() => setSelected(card)}>
                  <div className={`transition-all duration-300 transform ${isSel ? '-translate-y-6 scale-105' : 'hover:-translate-y-3'}`}>
                    <CardComponent 
                      card={card} 
                      size="md" 
                      selected={isSel}
                      className="shadow-xl"
                    />
                  </div>
                  {isEq && (
                    <div className="absolute -top-4 -right-4 bg-primary text-black text-[10px] font-black px-3 py-1.5 rounded-md border-4 border-black uppercase z-20 shadow-lg animate-pulse whitespace-nowrap">
                      DEPLOYED
                    </div>
                  )}
                  {isSel && (
                     <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_10px_white]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
