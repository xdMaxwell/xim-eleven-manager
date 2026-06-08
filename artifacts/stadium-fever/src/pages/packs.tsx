import { useState } from "react";
import { useGameState } from "../lib/game-state";
import { CountryCard } from "../lib/constants";
import { CardComponent } from "../components/card-component";
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
    }, 2000);
  };

  return (
    <div className="relative flex flex-col gap-6 w-full pb-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}pack-bg.png)`, imageRendering: "pixelated" }} />
      
      {/* Header */}
      <div className="pixel-panel p-4 flex justify-between items-center">
        <h2 className="font-mono text-2xl text-white uppercase">Pack Machine</h2>
        <div className="font-mono text-sm text-accent animate-blink">INSERT COIN</div>
      </div>

      {!opening && !pulledCard && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Inventory Rack */}
          <div className="pixel-panel p-6 flex flex-col gap-4">
            <h3 className="font-mono text-xl text-white uppercase border-b-4 border-white pb-2">Inventory</h3>
            
            <button
              onClick={() => setSelectedPack("starter")}
              className={`text-left border-4 p-4 transition-transform ${selectedPack === "starter" ? "bg-primary text-black border-white translate-x-2" : "bg-black text-white border-gray-600 hover:border-white"}`}
            >
              <div className="flex justify-between font-mono text-lg mb-1">
                <span>Starter Pack</span>
                <span>x{packs.starter}</span>
              </div>
              <div className={`font-mono text-[10px] ${selectedPack === "starter" ? "text-black" : "text-gray-400"}`}>Base Nations</div>
            </button>

            <button
              onClick={() => setSelectedPack("fever")}
              className={`text-left border-4 p-4 transition-transform ${selectedPack === "fever" ? "bg-secondary text-black border-white translate-x-2" : "bg-black text-white border-gray-600 hover:border-white"}`}
            >
              <div className="flex justify-between font-mono text-lg mb-1">
                <span>Fever Pack</span>
                <span>x{packs.fever}</span>
              </div>
              <div className={`font-mono text-[10px] ${selectedPack === "fever" ? "text-black" : "text-gray-400"}`}>Mutation Chance</div>
            </button>
          </div>

          {/* Central Machine */}
          <div className="lg:col-span-2 pixel-panel p-8 flex flex-col items-center justify-center bg-[#1a0b2e]">
             <div className={`w-48 h-64 border-8 flex items-center justify-center mb-8 relative ${selectedPack === "starter" ? "bg-green-900 border-primary" : "bg-blue-900 border-secondary"} ${packs[selectedPack] > 0 ? "animate-float cursor-pointer" : "opacity-50 grayscale"}`}
                onClick={() => packs[selectedPack] > 0 && handleOpen(selectedPack)}
             >
               <div className="text-center font-mono text-white">
                 <div className="text-3xl mb-2">?</div>
                 <div className="text-xl uppercase">{selectedPack}</div>
               </div>
               <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)] pointer-events-none" />
             </div>

             <button 
               onClick={() => handleOpen(selectedPack)}
               disabled={packs[selectedPack] === 0}
               className={`pixel-btn w-64 py-4 text-2xl ${selectedPack === "starter" ? "pixel-btn-primary" : "pixel-btn-secondary"}`}
             >
               OPEN PACK
             </button>
          </div>
        </div>
      )}

      {/* Opening Anim */}
      {opening && (
        <div className="h-[500px] pixel-panel flex flex-col items-center justify-center bg-black">
          <div className="w-32 h-48 bg-white border-4 border-black animate-blink flex items-center justify-center">
             <div className="font-mono text-4xl text-black">!</div>
          </div>
          <h2 className="mt-8 text-3xl font-mono text-white uppercase animate-blink">Decrypting...</h2>
        </div>
      )}

      {/* Result */}
      {pulledCard && !opening && (
        <div className="pixel-panel p-10 flex flex-col items-center bg-[#050f1a]">
          <h2 className="text-4xl font-mono uppercase text-white mb-10 pixel-text-shadow">New Asset Acquired</h2>
          
          <div className="mb-10 transform scale-125">
            <CardComponent card={pulledCard} size="lg" />
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setPulledCard(null)}
              className="pixel-btn bg-white text-black py-3 px-8 text-xl"
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
