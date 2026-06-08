import { useState } from "react";
import { useGameState } from "../lib/game-state";
import { Button } from "../components/ui/button";
import { CardComponent } from "../components/card-component";
import { EVENTS } from "../lib/constants";
import { Link } from "wouter";
import { Zap, ArrowUpCircle, Target, Activity } from "lucide-react";
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
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Real CSS Stadium Scene */}
      <div className="relative w-full h-[50vh] md:h-[60vh] border-4 border-white/10 rounded-2xl overflow-hidden bg-black flex items-center justify-center">
        
        {/* Stadium Bowl container for 3D effect */}
        <div className="absolute inset-0 perspective-[1000px] flex items-center justify-center pt-20">
          <div className={`stadium-bowl ${stadiumPulse ? 'animate-pulse bg-primary/40' : ''}`}>
            <div className="stadium-pitch" />
          </div>
        </div>

        {/* Floodlights */}
        <div className="absolute top-0 left-10 w-48 h-48 bg-white rounded-full blur-[80px] opacity-10 mix-blend-screen pointer-events-none" />
        <div className="absolute top-0 right-10 w-48 h-48 bg-white rounded-full blur-[80px] opacity-10 mix-blend-screen pointer-events-none" />
        
        {/* Crowd silhouettes (CSS gradient dots) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_50%,_rgba(0,0,0,0.8)_100%)] pointer-events-none z-10" />

        {/* Top-left Info Panel */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          <div className="bg-black/80 border-2 border-white/20 p-3 rounded-lg backdrop-blur-sm">
            <h1 className="text-2xl font-black uppercase tracking-widest text-white glow-text mb-1">
              Neon Home Ground
            </h1>
            <div className="flex items-center gap-3">
              <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-sm font-black text-xs uppercase tracking-widest">
                LVL {stadiumLevel}
              </span>
              <span className="text-secondary font-mono font-bold text-xs">
                ONLINE
              </span>
            </div>
          </div>
          
          <div className="bg-black/80 border-2 border-white/20 p-3 rounded-lg backdrop-blur-sm flex flex-col w-48">
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Roar Meter</span>
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-600">
              <div 
                className="h-full bg-primary glow-box" 
                style={{ width: `${Math.min(100, (roarPower / 1000) * 100)}%` }}
              />
            </div>
            <div className="text-right text-xs font-mono font-bold text-primary mt-1">{roarPower} / 1000</div>
          </div>
        </div>

        {/* Live Fever Broadcast Panel (Top Right) */}
        <div className="absolute top-4 right-4 z-20 hidden md:flex flex-col w-64">
          <div className="bg-black/90 border-2 border-secondary/50 rounded-lg p-4 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-secondary opacity-20 blur-xl rounded-full" />
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-secondary animate-pulse" />
              <span className="text-secondary font-black uppercase tracking-widest text-xs">Live Broadcast</span>
            </div>
            <h3 className="font-black text-white uppercase tracking-wider mb-2 leading-tight">
              {liveEvent?.name}
            </h3>
            <Link href="/fever">
              <Button size="sm" className="w-full btn-arcade bg-secondary text-secondary-foreground hover:bg-blue-400 glow-blue text-xs py-1">
                Enter Board
              </Button>
            </Link>
          </div>
        </div>

        {/* Center CTA */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
          <div className="relative">
            <Button 
              onClick={handleClaim}
              size="lg" 
              className="btn-arcade btn-primary-arcade text-xl px-12 py-8 rounded-xl shadow-2xl"
            >
              <Zap className="mr-3 w-6 h-6" /> CLAIM PITCH POINTS
            </Button>
            {claimAnim && (
              <div className="absolute left-1/2 -translate-x-1/2 top-0 text-primary font-black text-4xl drop-shadow-[0_0_10px_rgba(34,197,94,1)] animate-float-up pointer-events-none">
                +450 PP!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Formation Bench */}
        <div className="lg:col-span-2 bg-black/60 border-2 border-white/10 rounded-xl p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-2">
              <Target className="text-accent" /> Active Formation
            </h2>
            <Link href="/locker" className="text-xs font-black text-primary uppercase tracking-widest hover:text-green-300">
              Manage Locker &gt;
            </Link>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {equipped.map((card, i) => (
              <div key={i} className="flex-shrink-0">
                {card ? (
                  <CardComponent card={card} size="sm" />
                ) : (
                  <div className="w-36 h-56 rounded-xl border-4 border-dashed border-gray-700 bg-black/40 flex flex-col items-center justify-center text-gray-500">
                    <span className="font-mono font-bold text-sm mb-2">SLOT {i + 1}</span>
                    <span className="text-xs uppercase tracking-widest font-black">Empty</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Infrastructure */}
        <div className="bg-black/60 border-2 border-white/10 rounded-xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white mb-2">
              Infrastructure
            </h2>
            <p className="text-xs text-muted-foreground uppercase font-black tracking-widest mb-6">
              Upgrade stadium to increase Roar capacity.
            </p>
          </div>
          
          <Button 
            onClick={handleUpgrade} 
            className="w-full btn-arcade bg-gray-800 text-white border-gray-900 hover:bg-gray-700 py-8 flex-col gap-2 h-auto"
          >
            <div className="flex items-center text-lg">
              <ArrowUpCircle className="w-5 h-5 mr-2 text-accent" /> UPGRADE STADIUM
            </div>
            <div className="font-mono text-accent bg-accent/20 px-3 py-1 rounded border border-accent/30 text-sm">
              COST: 500 PP
            </div>
          </Button>
        </div>

      </div>
    </div>
  );
}
