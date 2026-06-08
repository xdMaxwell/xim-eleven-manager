import { useState } from "react";
import { useGameState } from "../lib/game-state";
import { Button } from "../components/ui/button";
import { CountryCard } from "../lib/constants";
import { CardComponent } from "../components/card-component";
import { PackageOpen, Share2, PlusSquare } from "lucide-react";
import { useToast } from "../hooks/use-toast";

export default function Packs() {
  const { packs, openPack } = useGameState();
  const { toast } = useToast();
  
  const [opening, setOpening] = useState(false);
  const [pulledCard, setPulledCard] = useState<CountryCard | null>(null);

  const handleOpen = (type: "starter" | "fever") => {
    if (packs[type] <= 0) {
      toast({
        title: "No packs available",
        description: "You don't have any of these packs left.",
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
          title: "Pack Opened!",
          description: `You pulled ${card.name} (${card.rarity}).`,
        });
      }
    }, 2000); // 2s fake reveal delay
  };

  const handleShare = () => {
    toast({
      title: "Result Shared",
      description: "Copied to clipboard: 'Just pulled a Mythic!' (Fake success)",
    });
  };

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto pb-12 min-h-[80vh] justify-center">
      {!opening && !pulledCard && (
        <div className="w-full flex flex-col md:flex-row gap-8 items-center justify-center">
          
          {/* Starter Pack */}
          <div className="bg-card border border-border p-8 rounded-2xl flex flex-col items-center text-center w-full max-w-sm relative group hover:border-primary/50 transition-colors">
            <div className="w-48 h-64 bg-gradient-to-br from-gray-800 to-black border-2 border-gray-600 rounded-xl mb-6 flex flex-col items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] opacity-20" />
              <PackageOpen className="w-16 h-16 text-gray-400 mb-4 z-10" />
              <h3 className="font-black text-2xl uppercase tracking-widest text-white z-10 glow-text drop-shadow-md">
                STARTER
              </h3>
              <p className="text-xs text-gray-400 mt-2 z-10 font-mono">1 Country Card</p>
            </div>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Owned:</span>
              <span className="text-xl font-black text-foreground">{packs.starter}</span>
            </div>
            
            <Button 
              onClick={() => handleOpen("starter")}
              disabled={packs.starter === 0}
              size="lg" 
              className="w-full font-black uppercase tracking-widest"
            >
              Open Pack
            </Button>
          </div>

          {/* Fever Pack */}
          <div className="bg-card border border-border p-8 rounded-2xl flex flex-col items-center text-center w-full max-w-sm relative group hover:border-secondary/50 transition-colors">
            <div className="w-48 h-64 bg-gradient-to-br from-secondary/40 to-black border-2 border-secondary rounded-xl mb-6 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)] group-hover:scale-105 transition-transform duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-secondary opacity-10 mix-blend-overlay" />
              <PackageOpen className="w-16 h-16 text-secondary mb-4 z-10 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              <h3 className="font-black text-2xl uppercase tracking-widest text-white z-10 drop-shadow-md">
                FEVER
              </h3>
              <p className="text-xs text-secondary-foreground/70 mt-2 z-10 font-mono">High Mutation Chance</p>
            </div>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Owned:</span>
              <span className="text-xl font-black text-foreground">{packs.fever}</span>
            </div>
            
            <Button 
              onClick={() => handleOpen("fever")}
              disabled={packs.fever === 0}
              size="lg" 
              className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-black uppercase tracking-widest glow-box"
            >
              Open Pack
            </Button>
          </div>
        </div>
      )}

      {opening && (
        <div className="flex flex-col items-center justify-center animate-pulse duration-1000">
          <div className="w-64 h-96 bg-white/10 border-4 border-white/30 rounded-xl flex items-center justify-center shadow-[0_0_100px_rgba(255,255,255,0.2)]">
            <PackageOpen className="w-20 h-20 text-white/50 animate-bounce" />
          </div>
          <h2 className="mt-8 text-3xl font-black uppercase tracking-widest glow-text">Revealing...</h2>
        </div>
      )}

      {pulledCard && !opening && (
        <div className="flex flex-col items-center animate-in zoom-in duration-500 fade-in">
          <div className="mb-8">
            <CardComponent card={pulledCard} size="lg" className="shadow-[0_0_50px_rgba(255,255,255,0.1)]" />
          </div>
          
          <h2 className="text-3xl font-black uppercase tracking-widest mb-2" style={{ color: pulledCard.color }}>
            {pulledCard.rarity} Pull!
          </h2>
          <p className="text-muted-foreground font-mono mb-8">Card added to your Locker.</p>

          <div className="flex gap-4">
            <Button 
              onClick={() => setPulledCard(null)} 
              variant="outline" 
              className="font-bold uppercase tracking-widest border-border"
            >
              <PlusSquare className="w-4 h-4 mr-2" /> Open Another
            </Button>
            <Button 
              onClick={handleShare}
              className="bg-accent hover:bg-accent/80 text-accent-foreground font-bold uppercase tracking-widest"
            >
              <Share2 className="w-4 h-4 mr-2" /> Share Pull
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
