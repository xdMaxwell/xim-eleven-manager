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

  const handleShare = () => {
    toast({
      title: "COPIED TO CLIPBOARD",
      description: "Link ready to share.",
    });
  };

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto min-h-[70vh] justify-center relative">
      
      {/* Tunnel Background elements */}
      <div className="absolute inset-0 flex justify-center items-end pointer-events-none -z-10 opacity-30">
        <div className="w-[800px] h-full bg-gradient-to-t from-black to-transparent" />
        <div className="absolute bottom-0 w-[400px] h-[400px] bg-primary blur-[150px] opacity-20" />
      </div>

      {!opening && !pulledCard && (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Pack Inventory (Left) */}
          <div className="flex flex-col gap-4 order-2 md:order-1">
            <h2 className="text-xl font-black uppercase tracking-widest text-white border-b-2 border-white/10 pb-2 mb-2">Inventory</h2>
            
            <button
              type="button"
              onClick={() => setSelectedPack("starter")}
              className={`text-left bg-black/80 border-2 p-4 rounded-xl flex items-center justify-between transition-all ${selectedPack === "starter" ? "border-primary shadow-[0_0_20px_rgba(34,197,94,0.4)] scale-[1.02]" : "border-white/20 hover:border-white/40"}`}
            >
              <div>
                <div className="font-black uppercase tracking-widest text-gray-300">Starter Pack</div>
                <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">1x Country Card</div>
              </div>
              <div className="font-mono text-2xl font-bold text-white bg-white/10 px-3 py-1 rounded">
                {packs.starter}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPack("fever")}
              className={`text-left bg-black/80 border-2 p-4 rounded-xl flex items-center justify-between transition-all ${selectedPack === "fever" ? "border-secondary shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-[1.02]" : "border-secondary/50 hover:border-secondary/80"}`}
            >
              <div>
                <div className="font-black uppercase tracking-widest text-secondary glow-text">Fever Pack</div>
                <div className="text-[10px] text-secondary/70 uppercase font-black tracking-widest mt-1">High Mutation Chance</div>
              </div>
              <div className="font-mono text-2xl font-bold text-secondary bg-secondary/10 px-3 py-1 rounded">
                {packs.fever}
              </div>
            </button>
          </div>

          {/* Central 3D Pack (Middle) */}
          <div className="flex flex-col items-center justify-center order-1 md:order-2">
            <div className="relative group perspective-[1000px]">
              <div className={`w-64 h-80 border-4 rounded-xl flex flex-col items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden transform transition-transform duration-500 hover:rotate-y-12 hover:rotate-x-12 ${selectedPack === "fever" ? "bg-gradient-to-br from-blue-700 via-blue-950 to-black border-secondary" : "bg-gradient-to-br from-gray-700 via-gray-900 to-black border-gray-500"}`}>
                <div className="absolute inset-0 pack-foil opacity-40 mix-blend-overlay pointer-events-none" />
                <PackageOpen className={`w-24 h-24 mb-4 z-10 ${selectedPack === "fever" ? "text-secondary" : "text-gray-400"}`} />
                <h3 className="font-black text-3xl uppercase tracking-widest text-white z-10 drop-shadow-xl text-center">
                  {selectedPack === "fever" ? "FEVER" : "STARTER"}
                </h3>
              </div>
            </div>
            
            <Button 
              onClick={() => handleOpen(selectedPack)}
              disabled={packs[selectedPack] === 0}
              size="lg" 
              className="mt-8 w-64 btn-arcade btn-primary-arcade text-xl py-6"
            >
              RIP PACK
            </Button>
            {packs[selectedPack] === 0 && (
              <p className="mt-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground text-center">
                No {selectedPack} packs left — pull from a Fever event to earn more
              </p>
            )}
          </div>

          {/* Possible Pulls (Right) */}
          <div className="flex flex-col gap-4 order-3 bg-black/80 border-2 border-white/10 rounded-xl p-6 h-full">
            <h2 className="text-xl font-black uppercase tracking-widest text-white border-b-2 border-white/10 pb-2 mb-2">Pack Contents</h2>
            <ul className="flex flex-col gap-3">
              {['Country Card', 'Stadium Part', 'Fever Ticket', 'Boost Item', 'Mutation Shard'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" /> {item}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-4 text-[10px] font-mono text-muted-foreground">
              Contents pulled randomly. Unused packs remain in inventory.
            </div>
          </div>

        </div>
      )}

      {opening && (
        <div className="flex flex-col items-center justify-center">
          <div className="w-64 h-80 bg-white border-4 border-primary rounded-xl flex items-center justify-center shadow-[0_0_100px_rgba(34,197,94,0.5)] animate-pulse">
            <PackageOpen className="w-24 h-24 text-primary animate-bounce" />
          </div>
          <h2 className="mt-8 text-4xl font-black uppercase tracking-widest text-primary glow-text animate-pulse">RIPPING...</h2>
        </div>
      )}

      {pulledCard && !opening && (
        <div className="flex flex-col items-center animate-in zoom-in duration-300">
          <div className="relative">
            <div className="absolute inset-0 bg-white blur-[100px] opacity-20 -z-10 rounded-full" />
            <CardComponent card={pulledCard} size="lg" className="shadow-[0_0_50px_rgba(255,255,255,0.2)]" />
          </div>
          
          <h2 className="text-4xl font-black uppercase tracking-widest mt-8 mb-2 glow-text" style={{ color: pulledCard.color }}>
            {pulledCard.rarity} PULL
          </h2>
          <p className="text-gray-400 font-mono font-bold mb-8 uppercase tracking-widest">Added to Locker</p>

          <div className="flex gap-4">
            <Button 
              onClick={() => setPulledCard(null)} 
              className="btn-arcade bg-gray-800 border-gray-900 text-white hover:bg-gray-700"
            >
              <ArrowRight className="w-4 h-4 mr-2" /> NEXT
            </Button>
            <Button 
              onClick={handleShare}
              className="btn-arcade bg-accent border-yellow-700 text-accent-foreground hover:bg-yellow-400"
            >
              <Share2 className="w-4 h-4 mr-2" /> SHARE PULL
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
