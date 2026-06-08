import { useState } from "react";
import { useGameState } from "../lib/game-state";
import { Button } from "../components/ui/button";
import { CountryCard } from "../lib/constants";
import { CardComponent } from "../components/card-component";
import { PackageOpen, Share2, ArrowRight, Layers, ScanFace } from "lucide-react";
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
    }, 2500); // slightly longer for more drama
  };

  return (
    <div className="flex flex-col items-center max-w-[1400px] mx-auto min-h-[75vh] justify-center relative w-full">
      
      {/* Massive Arcade Chamber Background */}
      <div className="absolute inset-0 bg-stadium-atmosphere rounded-3xl border-8 border-gray-800 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] overflow-hidden -z-20" />
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none -z-10 opacity-60">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] transition-colors duration-1000 ${selectedPack === "fever" ? "bg-secondary" : "bg-primary"}`} />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_100px,rgba(255,255,255,0.02)_100px,rgba(255,255,255,0.02)_101px)]" />
      </div>

      {/* Main Chamber Header */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center w-full z-10 px-4">
         <div className="inline-block bg-black border-4 border-gray-700 px-8 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
           <h1 className="text-4xl font-black uppercase tracking-widest text-white glow-text flex items-center justify-center gap-4">
             <ScanFace className="w-8 h-8 text-primary animate-pulse" /> REWARD BAY
           </h1>
         </div>
      </div>

      {!opening && !pulledCard && (
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 mt-20 px-8">
          
          {/* Pack Inventory Rack (Left) */}
          <div className="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1 h-full">
            <div className="retro-panel p-6 rounded-2xl bg-black border-4 border-gray-700 h-full flex flex-col shadow-2xl">
              <h2 className="text-2xl font-black uppercase tracking-widest text-white border-b-4 border-gray-800 pb-3 mb-6 flex items-center gap-2">
                <Layers className="text-gray-400 w-6 h-6" /> RACK
              </h2>
              
              <div className="flex flex-col gap-6">
                <button
                  type="button"
                  onClick={() => setSelectedPack("starter")}
                  className={`text-left bg-gray-900 border-4 p-5 rounded-xl flex flex-col transition-all duration-300 ${selectedPack === "starter" ? "border-primary shadow-[0_0_30px_rgba(34,197,94,0.4)] scale-105 bg-gray-800" : "border-gray-800 hover:border-gray-600"}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="font-black uppercase tracking-widest text-white text-xl">Starter</div>
                    <div className="font-mono text-3xl font-bold text-primary bg-black px-3 py-1 rounded border-2 border-gray-700 shadow-inner">
                      {packs.starter}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 uppercase font-black tracking-widest">Base Nations</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPack("fever")}
                  className={`text-left bg-gray-900 border-4 p-5 rounded-xl flex flex-col transition-all duration-300 ${selectedPack === "fever" ? "border-secondary shadow-[0_0_30px_rgba(59,130,246,0.4)] scale-105 bg-gray-800" : "border-gray-800 hover:border-gray-600"}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="font-black uppercase tracking-widest text-white text-xl">Fever</div>
                    <div className="font-mono text-3xl font-bold text-secondary bg-black px-3 py-1 rounded border-2 border-gray-700 shadow-inner">
                      {packs.fever}
                    </div>
                  </div>
                  <div className="text-xs text-purple-400 uppercase font-black tracking-widest">Mutation Chance</div>
                </button>
              </div>
            </div>
          </div>

          {/* Central Giant 3D Pack (Middle) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2">
            <div className="relative group perspective-[1500px]">
              <div className="absolute -inset-10 bg-white/5 blur-3xl rounded-full" />
              
              {/* 3D Box Representation */}
              <div className={`w-[340px] h-[480px] border-8 rounded-3xl flex flex-col items-center justify-center shadow-[0_40px_80px_rgba(0,0,0,0.9)] relative overflow-hidden transform transition-all duration-500 hover:rotate-y-12 hover:rotate-x-12 ${selectedPack === "fever" ? "bg-gradient-to-br from-blue-700 via-blue-900 to-black border-blue-400" : "bg-gradient-to-br from-green-700 via-green-900 to-black border-green-400"} ${packs[selectedPack] > 0 ? "animate-pack-shake hover:scale-105 cursor-pointer" : "opacity-40 grayscale"}`}
                onClick={() => packs[selectedPack] > 0 && handleOpen(selectedPack)}
              >
                {/* Pack Textures */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
                <div className="absolute inset-0 card-foil opacity-60 mix-blend-overlay pointer-events-none" />
                <div className="absolute top-0 inset-x-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent" />
                
                <PackageOpen className={`w-40 h-40 mb-8 z-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] ${selectedPack === "fever" ? "text-white" : "text-white"}`} />
                <div className="w-full bg-black/80 py-4 border-y-8 border-white/30 backdrop-blur-sm z-10 text-center relative shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                  <h3 className="font-black text-5xl uppercase tracking-widest text-white drop-shadow-xl">
                    {selectedPack === "fever" ? "FEVER" : "STARTER"}
                  </h3>
                  <div className="text-xs font-mono uppercase text-gray-400 tracking-widest mt-1">EDITION 01</div>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => handleOpen(selectedPack)}
              disabled={packs[selectedPack] === 0}
              size="lg" 
              className={`mt-12 w-[340px] btn-arcade text-3xl py-10 rounded-2xl shadow-2xl ${selectedPack === 'fever' ? 'btn-secondary-arcade' : 'btn-primary-arcade'}`}
            >
              RIP PACK
            </Button>
            
            {packs[selectedPack] === 0 && (
              <div className="mt-6 text-sm font-mono uppercase tracking-widest text-destructive bg-black px-6 py-3 border-4 border-destructive/50 rounded-lg shadow-lg">
                INVENTORY DEPLETED
              </div>
            )}
          </div>

          {/* Contents Data Panel (Right) */}
          <div className="lg:col-span-3 flex flex-col gap-6 order-3 h-full">
            <div className="retro-panel p-6 rounded-2xl bg-black border-4 border-gray-700 h-full flex flex-col shadow-2xl">
              <h2 className="text-2xl font-black uppercase tracking-widest text-white border-b-4 border-gray-800 pb-3 mb-6">DATA LOG</h2>
              
              <div className="bg-gray-900 border-4 border-gray-800 rounded-xl p-5 flex-1 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.2)_2px,rgba(0,0,0,0.2)_4px)]" />
                <ul className="flex flex-col gap-5 relative z-10">
                  {[
                    { name: 'Country Card', color: 'text-primary' },
                    { name: 'Stadium Module', color: 'text-white' },
                    { name: 'Fever Pass', color: 'text-secondary' },
                    { name: 'Boost Item', color: 'text-accent' },
                    { name: 'Mutation Shard', color: 'text-purple-400' }
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-sm font-black uppercase tracking-widest bg-black p-3 border-2 border-gray-700 rounded shadow-md">
                      <div className={`w-4 h-4 ${item.color.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor] border border-white/50`} /> 
                      <span className={item.color}>{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 text-xs font-mono text-gray-500 uppercase mt-4 text-center bg-gray-900 p-3 rounded border-2 border-gray-800">
                Pulls are final. Dupes yield PP.
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Opening Animation Sequence */}
      {opening && (
        <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center backdrop-blur-lg">
          <div className={`w-96 h-[500px] bg-white border-[16px] ${selectedPack === 'fever' ? 'border-secondary shadow-[0_0_200px_rgba(59,130,246,1)]' : 'border-primary shadow-[0_0_200px_rgba(34,197,94,1)]'} rounded-3xl flex items-center justify-center animate-pulse scale-110 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)] opacity-80" />
            <PackageOpen className={`w-48 h-48 animate-bounce ${selectedPack === 'fever' ? 'text-secondary' : 'text-primary'} relative z-10 drop-shadow-2xl`} />
          </div>
          <h2 className="mt-16 text-8xl font-black uppercase tracking-widest text-white glow-text animate-pulse">RIPPING</h2>
        </div>
      )}

      {/* Pulled Card Presentation */}
      {pulledCard && !opening && (
        <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center backdrop-blur-md animate-in fade-in duration-500">
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)]" />

          <div className="relative perspective-[1500px] mb-12">
            <div className="absolute inset-0 blur-[120px] opacity-40 -z-10 rounded-full" style={{ backgroundColor: pulledCard.color }} />
            <div className="animate-float-up" style={{ animation: "none", transform: "scale(1.5)" }}>
              <CardComponent card={pulledCard} size="lg" className="shadow-[0_40px_80px_rgba(0,0,0,0.9)] border-8 border-white" />
            </div>
          </div>
          
          <div className="text-center bg-gray-900 border-8 border-white p-10 rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.3)] mt-20 relative z-10 max-w-2xl w-full">
            <h2 className="text-6xl font-black uppercase tracking-widest mb-4 leading-none" style={{ color: pulledCard.color, textShadow: `0 0 30px ${pulledCard.color}` }}>
              {pulledCard.rarity}
            </h2>
            <p className="text-gray-300 font-mono text-2xl mb-8 uppercase tracking-widest bg-black inline-block px-6 py-2 rounded-lg border-2 border-gray-700">
              {pulledCard.name} Added to Binder
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                onClick={() => setPulledCard(null)} 
                className="btn-arcade bg-gray-800 border-gray-600 text-white hover:bg-gray-700 py-8 px-10 text-2xl"
              >
                <ArrowRight className="w-8 h-8 mr-3" /> NEXT
              </Button>
              <Button 
                onClick={() => toast({ title: "COPIED", description: "Link ready." })}
                className="btn-arcade btn-accent-arcade py-8 px-10 text-2xl"
              >
                <Share2 className="w-8 h-8 mr-3" /> SHARE
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
