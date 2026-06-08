import { useState } from "react";
import { useGameState } from "../lib/game-state";
import { Button } from "../components/ui/button";
import { CountryCard } from "../lib/constants";
import { CardComponent } from "../components/card-component";
import { PackageOpen, Share2, ArrowRight } from "lucide-react";
import { useToast } from "../hooks/use-toast";

export default function Packs() {
  const { packs, openPack } = useGameState();
  const { toast } = useToast();
  
  const [opening, setOpening] = useState(false);
  const [pulledCard, setPulledCard] = useState<CountryCard | null>(null);
  const [selectedPack, setSelectedPack] = useState<"starter" | "fever">("starter");

  const handleOpen = (type: "starter" | "fever") => {
    if (packs[type] <= 0) {
      toast({
        title: "OUT OF PACKS",
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
      if (card) {
        toast({
          title: "PULL CONFIRMED",
          description: `Acquired ${card.name} (${card.rarity}).`,
        });
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center max-w-6xl mx-auto min-h-[70vh] justify-center relative">
      
      {/* Arcade Room Background elements */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none -z-10 opacity-40">
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.8)_100%)]" />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px] opacity-20 ${selectedPack === "fever" ? "bg-secondary" : "bg-primary"}`} />
      </div>

      {!opening && !pulledCard && (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10">
          
          {/* Pack Inventory (Left) */}
          <div className="flex flex-col gap-4 order-2 md:order-1">
            <div className="retro-panel p-6 rounded-xl">
              <h2 className="text-2xl font-black uppercase tracking-widest text-white border-b-4 border-gray-700 pb-2 mb-4">INVENTORY</h2>
              
              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedPack("starter")}
                  className={`text-left bg-black border-4 p-4 rounded-xl flex items-center justify-between transition-transform ${selectedPack === "starter" ? "border-primary shadow-[0_0_20px_rgba(34,197,94,0.5)] scale-105" : "border-gray-800 hover:border-gray-600"}`}
                >
                  <div>
                    <div className="font-black uppercase tracking-widest text-white text-lg">Starter Pack</div>
                    <div className="text-[10px] text-primary uppercase font-black tracking-widest mt-1">1x Country Card</div>
                  </div>
                  <div className="font-mono text-3xl font-bold text-primary bg-primary/10 px-3 py-1 rounded border-2 border-primary/30">
                    {packs.starter}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPack("fever")}
                  className={`text-left bg-black border-4 p-4 rounded-xl flex items-center justify-between transition-transform ${selectedPack === "fever" ? "border-secondary shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-105" : "border-gray-800 hover:border-gray-600"}`}
                >
                  <div>
                    <div className="font-black uppercase tracking-widest text-white text-lg">Fever Pack</div>
                    <div className="text-[10px] text-secondary uppercase font-black tracking-widest mt-1">High Mutation Chance</div>
                  </div>
                  <div className="font-mono text-3xl font-bold text-secondary bg-secondary/10 px-3 py-1 rounded border-2 border-secondary/30">
                    {packs.fever}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Central 3D Pack (Middle) */}
          <div className="flex flex-col items-center justify-center order-1 md:order-2">
            <div className="relative group perspective-[1200px]">
              <div className={`w-72 h-96 border-8 rounded-2xl flex flex-col items-center justify-center shadow-[0_30px_60px_rgba(0,0,0,0.9)] relative overflow-hidden transform transition-all duration-500 hover:rotate-y-12 hover:rotate-x-12 ${selectedPack === "fever" ? "bg-gradient-to-br from-blue-600 via-blue-900 to-black border-blue-400" : "bg-gradient-to-br from-green-600 via-green-900 to-black border-green-400"} ${packs[selectedPack] > 0 ? "animate-pack-shake hover:scale-105 cursor-pointer" : "opacity-50 grayscale"}`}
                onClick={() => packs[selectedPack] > 0 && handleOpen(selectedPack)}
              >
                <div className="absolute inset-0 card-foil opacity-50 mix-blend-overlay pointer-events-none" />
                <PackageOpen className={`w-32 h-32 mb-6 z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] ${selectedPack === "fever" ? "text-white" : "text-white"}`} />
                <h3 className="font-black text-4xl uppercase tracking-widest text-white z-10 drop-shadow-xl text-center bg-black/50 px-4 py-2 border-y-4 border-white/50 w-full">
                  {selectedPack === "fever" ? "FEVER" : "STARTER"}
                </h3>
              </div>
            </div>
            
            <Button 
              onClick={() => handleOpen(selectedPack)}
              disabled={packs[selectedPack] === 0}
              size="lg" 
              className={`mt-8 w-72 btn-arcade text-2xl py-8 ${selectedPack === 'fever' ? 'btn-secondary-arcade' : 'btn-primary-arcade'}`}
            >
              RIP PACK
            </Button>
            {packs[selectedPack] === 0 && (
              <p className="mt-4 text-xs font-mono uppercase tracking-widest text-gray-500 text-center bg-black p-2 border-2 border-gray-800 rounded">
                No {selectedPack} packs left. Play to earn more.
              </p>
            )}
          </div>

          {/* Possible Pulls (Right) */}
          <div className="flex flex-col gap-4 order-3 retro-panel p-6 rounded-xl h-full">
            <h2 className="text-2xl font-black uppercase tracking-widest text-white border-b-4 border-gray-700 pb-2 mb-4">CONTENTS</h2>
            <div className="bg-black border-2 border-gray-800 rounded p-4 flex-1">
              <ul className="flex flex-col gap-4">
                {[
                  { name: 'Country Card', color: 'text-primary' },
                  { name: 'Stadium Part', color: 'text-white' },
                  { name: 'Fever Ticket', color: 'text-secondary' },
                  { name: 'Boost Item', color: 'text-accent' },
                  { name: 'Mutation Shard', color: 'text-purple-400' }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-base font-black uppercase tracking-widest">
                    <div className={`w-3 h-3 ${item.color.replace('text-', 'bg-')} shadow-[0_0_5px_currentColor]`} /> 
                    <span className={item.color}>{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-2 text-[10px] font-mono text-gray-500 uppercase border-t-2 border-gray-800 mt-2">
              All pulls are final. Duplicates converted to PP.
            </div>
          </div>

        </div>
      )}

      {opening && (
        <div className="flex flex-col items-center justify-center z-50">
          <div className={`w-72 h-96 bg-white border-8 ${selectedPack === 'fever' ? 'border-secondary shadow-[0_0_150px_rgba(59,130,246,1)]' : 'border-primary shadow-[0_0_150px_rgba(34,197,94,1)]'} rounded-2xl flex items-center justify-center animate-pulse scale-110`}>
            <PackageOpen className={`w-32 h-32 animate-bounce ${selectedPack === 'fever' ? 'text-secondary' : 'text-primary'}`} />
          </div>
          <h2 className="mt-10 text-6xl font-black uppercase tracking-widest text-white glow-text animate-pulse">RIPPING...</h2>
        </div>
      )}

      {pulledCard && !opening && (
        <div className="flex flex-col items-center animate-in zoom-in duration-300 z-50">
          <div className="relative perspective-[1200px]">
            <div className="absolute inset-0 bg-white blur-[100px] opacity-30 -z-10 rounded-full" />
            <div className="animate-float-up" style={{ animation: "none", transform: "scale(1.2)" }}>
              <CardComponent card={pulledCard} size="lg" className="shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-4 border-white" />
            </div>
          </div>
          
          <div className="mt-12 text-center bg-black/80 border-4 border-white p-6 rounded-xl backdrop-blur-sm shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            <h2 className="text-5xl font-black uppercase tracking-widest mb-2" style={{ color: pulledCard.color, textShadow: `0 0 20px ${pulledCard.color}` }}>
              {pulledCard.rarity} PULL
            </h2>
            <p className="text-white font-mono text-xl mb-6 uppercase tracking-widest">{pulledCard.name} Acquired</p>

            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => setPulledCard(null)} 
                className="btn-arcade bg-gray-800 border-gray-600 text-white hover:bg-gray-700 py-6 px-8 text-xl"
              >
                <ArrowRight className="w-6 h-6 mr-2" /> NEXT
              </Button>
              <Button 
                onClick={() => toast({ title: "COPIED", description: "Link ready." })}
                className="btn-arcade btn-accent-arcade py-6 px-8 text-xl"
              >
                <Share2 className="w-6 h-6 mr-2" /> SHARE
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
