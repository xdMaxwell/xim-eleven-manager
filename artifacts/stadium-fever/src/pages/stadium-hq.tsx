import { useState } from "react";
import { useGameState } from "../lib/game-state";
import { Button } from "../components/ui/button";
import { CardComponent } from "../components/card-component";
import { EVENTS } from "../lib/constants";
import { Link } from "wouter";
import { Zap, ArrowUpCircle, Target, Activity } from "lucide-react";
import { useToast } from "../hooks/use-toast";

export default function StadiumHQ() {
  const { stadiumLevel, roarPower, pitchPoints, equipped, claimPoints, upgradeStadium, phase } = useGameState();
  const { toast } = useToast();
  
  const [claimAnim, setClaimAnim] = useState(false);

  const handleClaim = () => {
    claimPoints();
    setClaimAnim(true);
    setTimeout(() => setClaimAnim(false), 1000);
    toast({
      title: "+450 Pitch Points Mined",
      description: "Stadium roar converted successfully.",
    });
  };

  const handleUpgrade = () => {
    const success = upgradeStadium();
    if (success) {
      toast({
        title: "Stadium Upgraded!",
        description: `Level ${stadiumLevel + 1} unlocked. Roar Power increased.`,
      });
    } else {
      toast({
        title: "Insufficient Pitch Points",
        description: "You need 500 Pitch Points to upgrade.",
        variant: "destructive",
      });
    }
  };

  const liveEvent = EVENTS.find(e => e.status === "LIVE");

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-12">
      {/* Stadium Hero */}
      <div className="relative w-full h-[40vh] md:h-[50vh] rounded-2xl overflow-hidden border border-border flex items-center justify-center group">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/20 via-background to-background z-0" />
        
        {/* Fake pitch lines */}
        <div className="absolute bottom-0 w-full h-1/2 bg-[linear-gradient(transparent_49%,_rgba(255,255,255,0.05)_50%)] bg-[length:100%_20px] transform perspective-[500px] rotateX-[60deg] origin-bottom z-0" />
        
        {/* Floodlights */}
        <div className="absolute top-0 left-10 w-32 h-32 bg-white rounded-full blur-[100px] opacity-20 z-0 mix-blend-screen" />
        <div className="absolute top-0 right-10 w-32 h-32 bg-white rounded-full blur-[100px] opacity-20 z-0 mix-blend-screen" />

        <div className="relative z-10 flex flex-col items-center text-center p-6 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-widest text-white glow-text mb-2">
            Neon Home Ground
          </h1>
          <div className="flex gap-4 items-center">
            <span className="bg-primary/20 border border-primary/50 text-primary px-3 py-1 rounded font-bold tracking-widest uppercase text-sm">
              Level {stadiumLevel}
            </span>
            <span className="bg-black/60 border border-white/10 text-muted-foreground px-3 py-1 rounded font-mono text-sm">
              Status: Active
            </span>
          </div>
        </div>

        {/* Claim UI Overlay */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
          <div className="relative">
            <Button 
              onClick={handleClaim}
              size="lg" 
              className="bg-primary hover:bg-primary/80 text-primary-foreground font-black uppercase tracking-widest text-lg px-8 py-6 rounded-xl glow-box active:scale-95 transition-transform"
            >
              <Zap className="mr-2" /> Claim Pitch Points
            </Button>
            {claimAnim && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-primary font-black text-2xl drop-shadow-md animate-bounce">
                +450!
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipped Cards */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 relative overflow-hidden">
          <h2 className="text-xl font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-secondary" /> Active Formation
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 items-center justify-center md:justify-start">
            {equipped.map((card, i) => (
              <div key={i} className="flex-shrink-0">
                {card ? (
                  <CardComponent card={card} size="sm" />
                ) : (
                  <div className="w-32 h-48 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground bg-black/20">
                    <span className="font-mono text-xs mb-2">SLOT {i + 1}</span>
                    <span className="text-xs uppercase tracking-widest opacity-50">Empty</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center text-sm font-mono border-t border-border pt-4">
            <span>Total Roar: <span className="text-primary font-bold">{roarPower}</span></span>
            <Link href="/locker" className="text-secondary hover:text-secondary/80 underline decoration-secondary/50 underline-offset-4">
              Manage Locker
            </Link>
          </div>
        </div>

        {/* Action Panel */}
        <div className="flex flex-col gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Infrastructure
            </h2>
            <Button onClick={handleUpgrade} variant="outline" className="w-full justify-between border-primary/30 hover:bg-primary/10 hover:border-primary/50 text-foreground py-6">
              <span className="flex items-center font-bold tracking-widest uppercase">
                <ArrowUpCircle className="w-4 h-4 mr-2 text-primary" /> Upgrade Stadium
              </span>
              <span className="text-primary font-mono font-bold">500 PP</span>
            </Button>
            <p className="text-xs text-muted-foreground mt-3 font-mono">
              Next level: +80 Roar Power capacity.
            </p>
          </div>

          <div className="bg-card border border-secondary/50 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-secondary glow-box" />
            <h2 className="text-lg font-bold uppercase tracking-widest text-secondary mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Live Fever
            </h2>
            <div className="mb-4">
              <h3 className="font-black text-foreground uppercase truncate">{liveEvent?.name || "No Event"}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{liveEvent?.rule}</p>
            </div>
            <Link href="/fever">
              <Button className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-black uppercase tracking-widest">
                Enter Board
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
