import { useState } from "react";
import { useGameState } from "../lib/game-state";
import { Button } from "../components/ui/button";
import { CardComponent } from "../components/card-component";
import { EVENTS } from "../lib/constants";
import { Link } from "wouter";
import { Zap, ArrowUpCircle, Target, Activity, Settings, RadioReceiver, ShieldAlert, Cpu } from "lucide-react";
import { useToast } from "../hooks/use-toast";

export default function StadiumHQ() {
  const { stadiumLevel, roarPower, pitchPoints, equipped, claimPoints, upgradeStadium } = useGameState();
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
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
      
      {/* Fake 3D Stadium Scene - Massive Hero */}
      <div className="relative w-full h-[65vh] md:h-[75vh] retro-panel rounded-3xl overflow-hidden flex items-center justify-center bg-gradient-to-b from-blue-950 via-gray-900 to-black border-8 border-gray-800 shadow-[0_30px_60px_rgba(0,0,0,0.9)]">
        
        {/* Layered Atmosphere */}
        <div className="absolute inset-0 bg-stadium-atmosphere opacity-80" />
        <div className="scanline-sweep" />
        
        {/* Giant Isometric Stadium Object */}
        <div className="isometric-world absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-16 scale-125 md:scale-150">
          <div className={`iso-stadium ${stadiumPulse ? 'scale-110 drop-shadow-[0_0_80px_rgba(34,197,94,1)]' : ''}`}>
            <div className="stadium-base">
              <div className="stadium-pitch">
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_red] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_blue] animate-pulse" />
                <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-yellow-500 rounded-full shadow-[0_0_10px_yellow] animate-pulse" />
              </div>
              <div className="floodlight fl-1"><div className="absolute -top-10 -left-10 w-48 h-48 bg-white rounded-full blur-3xl opacity-30 pointer-events-none" /></div>
              <div className="floodlight fl-2"><div className="absolute -top-10 -right-10 w-48 h-48 bg-white rounded-full blur-3xl opacity-30 pointer-events-none" /></div>
              <div className="floodlight fl-3"><div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white rounded-full blur-3xl opacity-30 pointer-events-none" /></div>
              <div className="floodlight fl-4"><div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white rounded-full blur-3xl opacity-30 pointer-events-none" /></div>
            </div>
          </div>
        </div>

        {/* Dense Chrome HUD over scene */}
        {/* Top-left Info Panel */}
        <div className="absolute top-6 left-6 z-20 flex flex-col gap-3">
          <div className="bg-black/90 border-4 border-gray-700 p-4 rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.8)] backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
              <RadioReceiver className="w-5 h-5 text-secondary animate-pulse" />
              <span className="text-secondary font-mono font-bold text-xs uppercase tracking-widest">NETWORK LINK ACTIVE</span>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-2 drop-shadow-md">
              ARCADE GROUND
            </h1>
            <div className="flex items-center gap-3">
              <span className="bg-primary text-black px-3 py-1 rounded font-black text-sm uppercase tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.6)]">
                LVL {stadiumLevel}
              </span>
              <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded font-black text-sm border-2 border-gray-600 uppercase">
                CAPACITY: {10000 * stadiumLevel}
              </span>
            </div>
          </div>
          
          <div className="bg-black/90 border-4 border-gray-700 p-4 rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.8)] w-64 backdrop-blur-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400 uppercase font-black tracking-widest flex items-center gap-1"><Cpu className="w-4 h-4" /> ROAR OUTPUT</span>
              <span className="text-sm font-mono font-bold text-accent glow-text">{roarPower} <span className="text-gray-500">/ 1000</span></span>
            </div>
            <div className="w-full h-6 bg-gray-900 border-4 border-gray-800 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-accent absolute top-0 left-0 transition-all duration-500 shadow-[0_0_15px_rgba(234,179,8,1)]" 
                style={{ width: `${Math.min(100, (roarPower / 1000) * 100)}%` }}
              />
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(0,0,0,0.2)_5px,rgba(0,0,0,0.2)_10px)]" />
            </div>
          </div>
        </div>

        {/* Live Fever Broadcast Panel (Right) */}
        <div className="absolute top-6 right-6 z-20 hidden lg:flex flex-col w-80">
          <div className="bg-blue-950/90 border-4 border-blue-500 rounded-xl p-5 shadow-[0_0_30px_rgba(59,130,246,0.6)] relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 bg-destructive text-white text-xs font-black px-4 py-1 animate-pulse border-bl-4 border-blue-500">
              LIVE MATCH
            </div>
            <div className="flex items-center gap-2 mb-3 mt-2">
              <Activity className="w-6 h-6 text-secondary" />
              <span className="text-secondary font-black uppercase tracking-widest text-sm">FEVER NETWORK</span>
            </div>
            <h3 className="font-black text-white text-2xl uppercase tracking-wider mb-4 leading-tight drop-shadow-md">
              {liveEvent?.name}
            </h3>
            <div className="bg-black/50 p-3 rounded border-2 border-blue-800 mb-4 font-mono text-sm text-blue-200">
              Matches yielding Bonus Outputs. Deploy squad immediately.
            </div>
            <Link href="/fever" className="block">
              <Button size="lg" className="w-full btn-arcade btn-secondary-arcade text-lg py-6">
                ENTER FEVER BOARD
              </Button>
            </Link>
          </div>
        </div>

        {/* Center CTA */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/40 transition-all duration-300" />
            <Button 
              onClick={handleClaim}
              size="lg" 
              className="btn-arcade btn-primary-arcade text-3xl px-12 py-8 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.9)] border-b-[10px] active:border-b-4 hover:scale-110 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-pack-shake" style={{ animationDuration: '3s' }} />
              <Zap className="mr-4 w-10 h-10 fill-current" /> EXTRACT PP
            </Button>
            {claimAnim && (
              <div className="absolute left-1/2 -translate-x-1/2 top-0 text-white font-black text-6xl drop-shadow-[0_0_30px_rgba(34,197,94,1)] animate-float-up pointer-events-none z-50 whitespace-nowrap">
                +450 PP!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section - Management dense grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Active Formation Bench */}
        <div className="xl:col-span-2 retro-panel p-8 rounded-2xl bg-gray-950 border-4 border-gray-700 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)]" />
          
          <div className="relative z-10 flex items-center justify-between mb-6 border-b-4 border-gray-800 pb-4">
            <h2 className="text-2xl font-black uppercase tracking-widest text-white flex items-center gap-3">
              <Target className="text-accent w-8 h-8" /> SQUAD DEPLOYMENT
            </h2>
            <Link href="/locker" className="text-sm font-black bg-blue-900 text-blue-200 px-4 py-2 rounded uppercase tracking-widest hover:bg-blue-800 border-2 border-blue-700 shadow-md">
              OPEN LOCKER ROOM
            </Link>
          </div>
          
          <div className="relative z-10 flex gap-6 overflow-x-auto pb-4 hide-scrollbar justify-center xl:justify-start">
            {equipped.map((card, i) => (
              <div key={i} className="flex-shrink-0 relative group">
                {card ? (
                  <div className="transform transition-transform group-hover:-translate-y-2">
                    <CardComponent card={card} size="md" className="border-4 border-gray-500 shadow-xl" />
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black text-white font-mono text-xs px-3 py-1 rounded border-2 border-gray-600 uppercase tracking-widest shadow-md whitespace-nowrap">
                      SLOT 0{i+1}
                    </div>
                  </div>
                ) : (
                  <div className="w-48 h-72 rounded-xl border-4 border-dashed border-gray-600 bg-gray-900/80 flex flex-col items-center justify-center text-gray-500 relative overflow-hidden shadow-inner backdrop-blur-sm">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
                    <ShieldAlert className="w-12 h-12 mb-4 opacity-50" />
                    <span className="font-mono font-bold text-2xl mb-1 text-gray-400">SLOT 0{i + 1}</span>
                    <span className="text-sm uppercase tracking-widest font-black text-gray-600">NO ASSET</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Infrastructure Module */}
        <div className="retro-panel p-8 rounded-2xl flex flex-col justify-between bg-black border-4 border-gray-700 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-full pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-4 flex items-center gap-3 border-b-4 border-gray-800 pb-4">
              <Settings className="text-gray-400 w-8 h-8" /> INFRASTRUCTURE
            </h2>
            
            <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-5 mb-8 shadow-inner relative">
              <div className="absolute top-2 right-2 flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
              </div>
              <p className="text-sm font-mono text-gray-300 leading-relaxed uppercase">
                Upgrading stadium modules expands ROAR capacity and unlocks high-tier Fever match output boosts.
              </p>
            </div>
            
            <div className="flex items-center justify-between mb-4 bg-black p-4 border-2 border-gray-800 rounded">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">CURRENT LVL</span>
              <span className="font-mono text-2xl font-bold text-white">{stadiumLevel}</span>
            </div>
            <div className="flex items-center justify-between mb-8 bg-black p-4 border-2 border-gray-800 rounded">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">NEXT LVL</span>
              <span className="font-mono text-2xl font-bold text-primary">+{stadiumLevel + 1}</span>
            </div>
          </div>
          
          <Button 
            onClick={handleUpgrade} 
            className="w-full btn-arcade bg-gray-800 text-white border-gray-600 hover:bg-gray-700 py-8 flex-col gap-2 h-auto relative z-10 shadow-lg"
          >
            <div className="flex items-center text-2xl font-black">
              <ArrowUpCircle className="w-8 h-8 mr-3 text-accent" /> INSTALL UPGRADE
            </div>
            <div className="font-mono text-accent bg-black px-6 py-2 rounded border-2 border-accent/50 text-base mt-2 shadow-inner">
              REQUIRED: 500 PP
            </div>
          </Button>
        </div>

      </div>
    </div>
  );
}
