import { useState } from "react";
import { useGameState } from "../lib/game-state";
import { EVENTS, CountryCard } from "../lib/constants";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { CardComponent } from "../components/card-component";
import { useLocation } from "wouter";
import { AlertTriangle, Cpu, Lock, Play, ShieldAlert, ThermometerSun } from "lucide-react";

export default function FeverBoard() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const { heat } = useGameState();

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-8 w-full">
      
      {/* Massive Scoreboard Header */}
      <div className="retro-panel bg-black rounded-3xl p-8 flex flex-col xl:flex-row items-center justify-between gap-8 border-8 border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)] pointer-events-none" />
        
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-24 h-24 bg-destructive rounded-2xl flex items-center justify-center border-4 border-white shadow-[0_0_30px_rgba(239,68,68,0.8)] animate-pulse rotate-12">
            <AlertTriangle className="text-white w-12 h-12" />
          </div>
          <div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-widest text-white drop-shadow-[0_8px_0_rgba(239,68,68,1)] leading-none mb-4">
              FEVER BOARD
            </h1>
            <div className="text-white font-black uppercase tracking-widest text-lg bg-destructive px-4 py-1.5 rounded-sm border-2 border-white inline-block shadow-md">
              LIVE MATCH SELECTOR
            </div>
          </div>
        </div>
        
        {/* Heat & Timer block */}
        <div className="bg-gray-950 border-8 border-gray-700 p-6 rounded-2xl flex items-center gap-10 shadow-[inset_0_0_30px_rgba(0,0,0,1)] relative z-10">
          <div className="flex flex-col items-center">
            <div className="text-xs text-gray-500 uppercase font-black tracking-widest mb-2 flex items-center gap-2">
              <ThermometerSun className="w-4 h-4 text-destructive" /> GLOBAL HEAT
            </div>
            <div className="hud-numbers text-6xl text-destructive text-flash drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">{heat}</div>
          </div>
          <div className="h-20 w-2 bg-gray-800 rounded-full" />
          <div className="flex flex-col justify-center items-center">
            <div className="text-xs text-gray-500 uppercase font-black tracking-widest mb-2">NETWORK REFRESH</div>
            <div className="hud-numbers text-4xl text-white">02:14:59</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Featured Live Event (Massive Centerpiece) */}
        {EVENTS.filter(e => e.status === "LIVE").slice(0, 1).map(event => (
          <div key={event.id} className="lg:col-span-8 retro-panel p-3 rounded-3xl bg-black border-4 border-gray-700 relative overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] h-[600px] flex flex-col">
            
            {/* Event Background & Atmosphere */}
            <div className="absolute inset-0 bg-blue-950 opacity-40 -z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.3)_0%,transparent_60%)] -z-10" />
            <div className="absolute top-1/2 right-10 w-[300px] h-[300px] border-[20px] border-blue-500/20 rounded-full opacity-50 pointer-events-none transform -translate-y-1/2 rotate-45 -z-10" />
            
            <div className="border-4 border-blue-500 rounded-2xl p-8 flex flex-col relative z-10 bg-black/80 h-full justify-between shadow-inner backdrop-blur-sm">
              <div>
                <div className="flex justify-between items-start mb-8">
                  <h2 className="text-5xl font-black uppercase tracking-widest text-secondary drop-shadow-[0_0_20px_rgba(59,130,246,0.8)] max-w-2xl leading-tight">
                    {event.name}
                  </h2>
                  <span className="bg-destructive text-white px-6 py-2 rounded font-black text-xl uppercase tracking-widest animate-pulse border-4 border-white shadow-[0_0_20px_rgba(239,68,68,0.8)]">
                    {event.status}
                  </span>
                </div>
                
                <div className="bg-gray-900/90 p-8 rounded-xl border-4 border-gray-700 shadow-inner mb-8 max-w-3xl backdrop-blur-md">
                  <p className="text-2xl font-mono text-white mb-8 leading-relaxed">
                    {event.rule}
                  </p>
                  <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">EXPECTED YIELD</div>
                  <div className="flex gap-4 flex-wrap">
                    <Chip label="+ PITCH POINTS" color="bg-primary text-black" size="lg" />
                    <Chip label="+ HEAT" color="bg-destructive text-white" size="lg" />
                    <Chip label="+ FORM" color="bg-secondary text-black" size="lg" />
                    <Chip label="? MUTATION" color="bg-purple-600 text-white" size="lg" />
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setSelectedEvent(event.id)}
                className="btn-arcade btn-secondary-arcade w-full py-10 text-4xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] mt-auto"
              >
                <Play className="mr-6 w-10 h-10 fill-current" /> ENTER MISSION
              </Button>
            </div>
          </div>
        ))}

        {/* Mission Stack */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-[600px]">
          <div className="bg-black p-4 rounded-xl border-4 border-gray-800 text-center font-black uppercase tracking-widest text-gray-400">
            SECONDARY MISSIONS
          </div>
          
          <div className="flex-1 overflow-y-auto flex flex-col gap-4 hide-scrollbar pr-2">
            {EVENTS.filter(e => e.status === "LIVE").slice(1).map(event => (
              <SmallEventCard key={event.id} event={event} onSelect={() => setSelectedEvent(event.id)} />
            ))}
            {EVENTS.filter(e => e.status !== "LIVE").map(event => (
              <SmallEventCard key={event.id} event={event} locked />
            ))}
          </div>
        </div>

      </div>

      {selectedEvent && (
        <FormationModal 
          event={EVENTS.find(e => e.id === selectedEvent)!} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </div>
  );
}

function Chip({ label, color, size = "md" }: { label: string, color: string, size?: "md" | "lg" }) {
  const sizeClasses = size === "lg" ? "text-sm px-4 py-2" : "text-xs px-3 py-1.5";
  return <span className={`font-black uppercase tracking-widest rounded border-2 border-transparent shadow-md ${sizeClasses} ${color}`}>{label}</span>;
}

function SmallEventCard({ event, locked, onSelect }: { event: any, locked?: boolean, onSelect?: () => void }) {
  return (
    <div className={`retro-panel p-6 rounded-2xl flex flex-col border-4 ${locked ? "bg-gray-950 border-gray-800 opacity-70 grayscale" : "bg-black border-gray-700 hover:border-gray-500 cursor-pointer transition-transform hover:-translate-y-2 shadow-lg"}`}
         onClick={!locked ? onSelect : undefined}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-black uppercase tracking-widest text-white text-2xl truncate pr-4">{event.name}</h3>
        {locked ? <Lock className="w-6 h-6 text-gray-600 shrink-0" /> : <div className="w-4 h-4 rounded-full bg-destructive animate-pulse shrink-0 shadow-[0_0_15px_red]" />}
      </div>
      <div className="bg-gray-900 p-4 rounded-lg border-2 border-gray-800 flex-1">
        <p className="text-sm font-mono text-gray-400 line-clamp-3 leading-relaxed">{event.rule}</p>
      </div>
      {locked && <div className="mt-4 text-sm font-black text-gray-600 uppercase tracking-widest text-center border-t-4 border-gray-900 pt-4">LOCKED</div>}
    </div>
  );
}

function FormationModal({ event, onClose }: { event: { id: string, name: string }, onClose: () => void }) {
  const { equipped, deployFormation, roarPower } = useGameState();
  const [, setLocation] = useLocation();
  const [deploying, setDeploying] = useState(false);

  const activeCards = equipped.filter((c): c is CountryCard => c !== null);

  const handleDeploy = () => {
    if (activeCards.length < 2) return;
    setDeploying(true);
    setTimeout(() => {
      deployFormation(event.name, activeCards);
      setDeploying(false);
      onClose();
      setLocation("/receipts");
    }, 2500);
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[1200px] w-full bg-black border-[12px] border-gray-800 p-0 overflow-hidden sm:rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,1)]">
        <DialogHeader className="p-8 bg-gray-950 border-b-8 border-gray-800 flex flex-row items-center justify-between z-20 relative">
          <DialogTitle className="text-4xl font-black uppercase tracking-widest text-white flex items-center gap-4">
            <ShieldAlert className="text-secondary w-10 h-10" /> SQUAD DEPLOYMENT
          </DialogTitle>
          <div className="bg-black px-6 py-3 rounded-lg border-4 border-gray-700 text-lg font-mono text-secondary uppercase font-bold shadow-inner">
            MISSION: {event.name}
          </div>
        </DialogHeader>

        {/* Giant Isometric Tactics Pitch */}
        <div className="relative p-16 min-h-[600px] flex flex-col items-center justify-center bg-gray-900 border-b-8 border-gray-800 overflow-hidden">
          
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#15803d_0%,#15803d_5%,#166534_5%,#166534_10%)] transform perspective-[1500px] rotateX(60deg) scale(2) border-[16px] border-white opacity-80" />
          
          <div className="absolute inset-x-0 top-1/2 h-4 bg-white -translate-y-1/2 opacity-60 shadow-[0_0_20px_white]" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full border-[12px] border-white -translate-x-1/2 -translate-y-1/2 opacity-60 shadow-[0_0_20px_white]" />

          {/* Cards on Pitch */}
          <div className="relative z-10 flex justify-center gap-8 mt-16 w-full max-w-5xl">
            {equipped.map((card, i) => (
              <div key={i} className="transform transition-transform hover:-translate-y-6">
                {card ? (
                  <CardComponent card={card} size="lg" className="shadow-[0_40px_80px_rgba(0,0,0,0.9)] border-8 border-white scale-110" />
                ) : (
                  <div className="w-64 h-96 rounded-3xl border-8 border-dashed border-white/40 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center text-white/40 scale-110">
                    <span className="font-mono text-3xl font-bold mb-3">SLOT {i+1}</span>
                    <span className="font-black uppercase tracking-widest text-xl">EMPTY</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* HUD overlay inside pitch */}
          <div className="absolute top-8 left-8 retro-panel bg-black/90 backdrop-blur-md p-6 rounded-2xl border-4 border-gray-700 shadow-xl">
            <div className="text-xs text-accent uppercase font-black tracking-widest mb-2 flex items-center gap-2"><Cpu className="w-4 h-4" /> TOTAL ROAR POWER</div>
            <div className="hud-numbers text-6xl text-white glow-text">{roarPower}</div>
          </div>
        </div>

        <div className="p-8 bg-gray-950 flex flex-col sm:flex-row justify-between items-center gap-8 z-20 relative">
          <div className="text-lg font-mono text-gray-400 uppercase bg-black px-6 py-4 rounded-xl border-4 border-gray-800 shadow-inner">
            REQUIRES 2+ ASSETS TO DEPLOY
          </div>
          <Button 
            onClick={handleDeploy} 
            disabled={activeCards.length < 2 || deploying}
            className={`btn-arcade py-10 px-20 text-3xl rounded-2xl ${deploying ? "bg-gray-800 text-gray-500 border-gray-700" : "btn-primary-arcade shadow-[0_10px_30px_rgba(34,197,94,0.6)] hover:scale-105"}`}
          >
            {deploying ? "SIMULATING MATCH..." : "EXECUTE DEPLOYMENT"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
