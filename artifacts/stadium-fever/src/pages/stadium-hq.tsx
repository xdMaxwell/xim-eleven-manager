import { useState } from "react";
import { useGameState } from "../lib/game-state";
import { CardComponent } from "../components/card-component";
import { EVENTS } from "../lib/constants";
import { Link } from "wouter";
import { useToast } from "../hooks/use-toast";

export default function StadiumHQ() {
  const { stadiumLevel, roarPower, equipped, claimPoints, upgradeStadium } = useGameState();
  const { toast } = useToast();
  
  const [claimAnim, setClaimAnim] = useState(false);
  const [stadiumPulse, setStadiumPulse] = useState(false);

  const handleClaim = () => {
    claimPoints();
    setClaimAnim(true);
    setTimeout(() => setClaimAnim(false), 1000);
    toast({
      title: "+450 PP EXTRACTED",
      description: "Stadium roar converted successfully.",
    });
  };

  const handleUpgrade = () => {
    const success = upgradeStadium();
    if (success) {
      setStadiumPulse(true);
      setTimeout(() => setStadiumPulse(false), 1000);
      toast({
        title: "STADIUM UPGRADED",
        description: `Level ${stadiumLevel + 1} unlocked. +80 Roar Power.`,
      });
    } else {
      toast({
        title: "INSUFFICIENT FUNDS",
        description: "Requires 500 Pitch Points.",
        variant: "destructive",
      });
    }
  };

  const liveEvent = EVENTS.find(e => e.status === "LIVE");

  return (
    <div className="relative flex flex-col gap-6 w-full pb-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}stadium-bg.png)`, imageRendering: "pixelated" }} />
      
      {/* Top Banner */}
      <div className="pixel-panel p-4 flex items-center justify-between">
        <h2 className="font-mono text-xl md:text-3xl text-white uppercase">Arcade Ground</h2>
        <div className="bg-primary text-black px-2 py-1 font-mono text-sm md:text-lg border-2 border-white">
          LVL {stadiumLevel}
        </div>
      </div>

      {/* Massive Pixel Stadium Scene */}
      <div className="relative w-full h-[400px] md:h-[500px] pixel-panel overflow-hidden flex items-center justify-center bg-[#050f1a]">
        
        {/* Pixel Environment Details */}
        {/* We use basic CSS blocks to simulate pixel art scene if image isn't available, but we rely on pixel-art styling */}
        <div className={`absolute w-64 h-64 md:w-96 md:h-96 bg-primary border-[8px] border-white transform rotate-45 scale-y-50 shadow-[0_20px_0px_#14532d] flex items-center justify-center transition-transform ${stadiumPulse ? 'scale-110 shadow-[0_20px_0px_#14532d,0_0_50px_#22c55e]' : ''}`}>
           {/* Pitch Markings */}
           <div className="w-1/2 h-1/2 border-[4px] border-white/50 rounded-full" />
           <div className="absolute w-full h-[4px] bg-white/50" />
           <div className="absolute w-[4px] h-full bg-white/50" />
           
           {/* Animated Crowd blocks */}
           <div className="absolute -top-16 -left-16 w-16 h-16 bg-blue-500 animate-blink" />
           <div className="absolute -bottom-16 -right-16 w-16 h-16 bg-red-500 animate-blink" style={{animationDelay: '0.2s'}} />
           <div className="absolute -top-16 -right-16 w-16 h-16 bg-yellow-500 animate-blink" style={{animationDelay: '0.4s'}} />
           <div className="absolute -bottom-16 -left-16 w-16 h-16 bg-purple-500 animate-blink" style={{animationDelay: '0.6s'}} />
        </div>
        
        {/* Decorative Pixel Signs */}
        <div className="absolute top-4 left-4 bg-black border-4 border-white p-2 text-white font-mono text-xs">
          <div className="text-secondary mb-1">ROAR: {roarPower}/1000</div>
          <div className="w-32 h-4 bg-gray-800 border-2 border-gray-600">
            <div className="h-full bg-accent" style={{width: `${(roarPower/1000)*100}%`}} />
          </div>
        </div>
        
        {liveEvent && (
          <div className="absolute top-4 right-4 bg-black border-4 border-destructive p-2 w-40">
            <div className="text-destructive font-mono text-[10px] animate-blink mb-1">LIVE EVENT</div>
            <div className="text-white font-mono text-xs truncate">{liveEvent.name}</div>
            <Link href="/fever">
              <button className="mt-2 w-full bg-destructive text-white font-mono text-[10px] py-1 border-2 border-white hover:bg-red-600">ENTER</button>
            </Link>
          </div>
        )}

        {/* Claim Button integrated in scene */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
          <button 
            onClick={handleClaim}
            className="pixel-btn pixel-btn-primary text-xl md:text-3xl px-8 py-4 flex items-center gap-4"
          >
            <span className="animate-float block">EXTRACT PP</span>
          </button>
          {claimAnim && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-primary font-mono text-3xl pixel-outline animate-float whitespace-nowrap pointer-events-none">
              +450 PP!
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Squad Bench */}
        <div className="lg:col-span-2 pixel-panel p-6 flex flex-col">
          <div className="flex justify-between items-center border-b-4 border-white pb-2 mb-4">
            <h3 className="font-mono text-xl text-white uppercase">Squad Bench</h3>
            <Link href="/locker" className="text-secondary font-mono text-sm hover:underline">OPEN LOCKER</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {equipped.map((card, i) => (
              <div key={i} className="flex-shrink-0">
                {card ? (
                  <CardComponent card={card} size="sm" />
                ) : (
                  <div className="w-32 h-48 border-4 border-dashed border-gray-600 bg-black flex items-center justify-center text-gray-500 font-mono text-sm flex-col">
                    <span>SLOT {i+1}</span>
                    <span className="text-[10px]">EMPTY</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade Module */}
        <div className="pixel-panel p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-mono text-xl text-white uppercase border-b-4 border-white pb-2 mb-4">Upgrades</h3>
            <div className="bg-black border-2 border-gray-600 p-3 font-mono text-xs text-gray-300 mb-4">
              Expand ROAR capacity and unlock high-tier boosts.
            </div>
            <div className="flex justify-between font-mono text-sm text-white mb-2">
              <span>CURRENT LVL</span>
              <span className="text-primary">{stadiumLevel}</span>
            </div>
            <div className="flex justify-between font-mono text-sm text-white mb-6">
              <span>NEXT LVL</span>
              <span className="text-accent">+{stadiumLevel + 1}</span>
            </div>
          </div>
          
          <button 
            onClick={handleUpgrade}
            className="pixel-btn bg-gray-200 text-black w-full py-4 text-lg flex flex-col items-center"
          >
            <span>INSTALL UPGRADE</span>
            <span className="text-[10px] mt-1 text-gray-700">COST: 500 PP</span>
          </button>
        </div>

      </div>
    </div>
  );
}
