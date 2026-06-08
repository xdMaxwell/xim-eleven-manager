import { useState } from "react";
import { useGameState } from "../lib/game-state";
import { Button } from "../components/ui/button";
import { CardComponent } from "../components/card-component";
import { EVENTS } from "../lib/constants";
import { Link } from "wouter";
import { Zap, ArrowUpCircle, Target, Activity, Settings } from "lucide-react";
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
      title: "+450 PP MINED",
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
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      
      {/* Fake 3D Stadium Scene */}
      <div className="relative w-full h-[50vh] md:h-[65vh] retro-panel rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-b from-blue-900 to-black">
        
        {/* Sky / Atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.1)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-20" />

        {/* Isometric Stadium Object */}
        <div className="isometric-world absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-10">
          <div className={`iso-stadium ${stadiumPulse ? 'scale-110 drop-shadow-[0_0_50px_rgba(34,197,94,0.8)]' : ''}`}>
            <div className="stadium-base">
              <div className="stadium-pitch">
                {/* Players/Dots */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_5px_red]" />
                <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_5px_blue]" />
              </div>
              {/* Floodlights */}
              <div className="floodlight fl-1"><div className="absolute -top-10 -left-10 w-32 h-32 bg-white rounded-full blur-3xl opacity-20 pointer-events-none" /></div>
              <div className="floodlight fl-2"><div className="absolute -top-10 -right-10 w-32 h-32 bg-white rounded-full blur-3xl opacity-20 pointer-events-none" /></div>
              <div className="floodlight fl-3"><div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white rounded-full blur-3xl opacity-20 pointer-events-none" /></div>
              <div className="floodlight fl-4"><div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white rounded-full blur-3xl opacity-20 pointer-events-none" /></div>
            </div>
          </div>
        </div>

        {/* Top-left Info Panel */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          <div className="bg-black/80 border-2 border-white/20 p-3 rounded shadow-lg">
            <h1 className="text-xl font-black uppercase tracking-widest text-white mb-1">
              Arcade Ground
            </h1>
            <div className="flex items-center gap-2">
              <span className="bg-primary text-black px-2 py-0.5 rounded font-black text-xs uppercase tracking-widest shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                LVL {stadiumLevel}
              </span>
              <span className="text-secondary font-mono font-bold text-xs animate-pulse">
                ONLINE
              </span>
            </div>
          </div>
          
          <div className="bg-black/80 border-2 border-white/20 p-3 rounded shadow-lg w-48">
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1 block">Roar Output</span>
            <div className="w-full h-4 bg-gray-900 border-2 border-gray-700 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-accent absolute top-0 left-0 transition-all duration-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]" 
                style={{ width: `${Math.min(100, (roarPower / 1000) * 100)}%` }}
              />
            </div>
            <div className="text-right text-xs font-mono font-bold text-accent mt-1">{roarPower} / 1000</div>
          </div>
        </div>

        {/* Live Fever Broadcast Panel (Top Right) */}
        <div className="absolute top-4 right-4 z-20 hidden md:flex flex-col w-64">
          <div className="bg-blue-950 border-4 border-blue-500 rounded p-4 shadow-[0_0_20px_rgba(59,130,246,0.5)] relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-destructive text-white text-[9px] font-black px-2 py-0.5 animate-pulse">
              LIVE
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-secondary" />
              <span className="text-secondary font-black uppercase tracking-widest text-sm">Fever Network</span>
            </div>
            <h3 className="font-black text-white uppercase tracking-wider mb-3 leading-tight">
              {liveEvent?.name}
            </h3>
            <Link href="/fever" className="block">
              <Button size="sm" className="w-full btn-arcade btn-secondary-arcade text-xs py-2">
                ENTER BOARD
              </Button>
            </Link>
          </div>
        </div>

        {/* Center CTA */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
          <div className="relative">
            <Button 
              onClick={handleClaim}
              size="lg" 
              className="btn-arcade btn-primary-arcade text-2xl px-10 py-6 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-b-8 active:border-b-2 hover:scale-105"
            >
              <Zap className="mr-3 w-8 h-8" /> CLAIM POINTS
            </Button>
            {claimAnim && (
              <div className="absolute left-1/2 -translate-x-1/2 top-0 text-white font-black text-5xl drop-shadow-[0_0_20px_rgba(34,197,94,1)] animate-float-up pointer-events-none z-50 whitespace-nowrap">
                +450 PP!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section - Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Formation Bench */}
        <div className="lg:col-span-2 retro-panel p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4 border-b-4 border-gray-800 pb-2">
            <h2 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-2">
              <Target className="text-accent w-6 h-6" /> ACTIVE FORMATION
            </h2>
            <Link href="/locker" className="text-xs font-black bg-blue-900 text-blue-200 px-3 py-1 rounded uppercase tracking-widest hover:bg-blue-800 border-2 border-blue-700">
              MANAGE LOCKER
            </Link>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {equipped.map((card, i) => (
              <div key={i} className="flex-shrink-0">
                {card ? (
                  <CardComponent card={card} size="sm" />
                ) : (
                  <div className="w-36 h-56 rounded-lg border-4 border-dashed border-gray-700 bg-gray-900 flex flex-col items-center justify-center text-gray-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
                    <span className="font-mono font-bold text-lg mb-1">SLOT {i + 1}</span>
                    <span className="text-xs uppercase tracking-widest font-black">EMPTY</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Infrastructure */}
        <div className="retro-panel p-6 rounded-xl flex flex-col justify-between bg-gray-900">
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white mb-2 flex items-center gap-2 border-b-4 border-gray-800 pb-2">
              <Settings className="text-gray-400 w-5 h-5" /> INFRASTRUCTURE
            </h2>
            <p className="text-sm font-mono text-gray-400 mb-6 bg-black p-3 border-2 border-gray-800 rounded">
              Upgrade stadium to increase Roar capacity and output boosts.
            </p>
          </div>
          
          <Button 
            onClick={handleUpgrade} 
            className="w-full btn-arcade bg-gray-800 text-white border-gray-600 hover:bg-gray-700 py-6 flex-col gap-2 h-auto"
          >
            <div className="flex items-center text-xl font-black">
              <ArrowUpCircle className="w-6 h-6 mr-2 text-accent" /> UPGRADE
            </div>
            <div className="font-mono text-accent bg-black px-4 py-1 rounded border-2 border-accent/50 text-sm">
              COST: 500 PP
            </div>
          </Button>
        </div>

      </div>
    </div>
  );
}
