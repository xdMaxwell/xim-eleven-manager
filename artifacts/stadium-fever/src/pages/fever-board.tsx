import { useState } from "react";
import { useGameState } from "../lib/game-state";
import { EVENTS, CountryCard } from "../lib/constants";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { CardComponent } from "../components/card-component";
import { useLocation } from "wouter";
import { AlertTriangle, Lock, Play, ShieldAlert } from "lucide-react";

export default function FeverBoard() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const { heat } = useGameState();

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      
      {/* Scoreboard Header */}
      <div className="retro-panel bg-black rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-destructive rounded-full flex items-center justify-center border-4 border-white shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-pulse">
            <AlertTriangle className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-white drop-shadow-[0_5px_0_rgba(239,68,68,0.8)] leading-none mb-1">
              FEVER BOARD
            </h1>
            <div className="text-destructive font-black uppercase tracking-widest text-sm bg-destructive/20 inline-block px-2 py-0.5 rounded border border-destructive">LIVE MATCH SELECTOR</div>
          </div>
        </div>
        
        <div className="bg-gray-900 border-4 border-gray-700 p-4 rounded-xl flex items-center gap-6 shadow-inner">
          <div>
            <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">GLOBAL HEAT</div>
            <div className="hud-numbers text-4xl text-destructive text-flash">{heat}</div>
          </div>
          <div className="h-12 w-1 bg-gray-700" />
          <div className="flex flex-col justify-center">
            <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">NEXT REFRESH</div>
            <div className="hud-numbers text-2xl text-white">02:14:59</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Featured Live Event (Takes up 2 cols on LG) */}
        {EVENTS.filter(e => e.status === "LIVE").slice(0, 1).map(event => (
          <div key={event.id} className="lg:col-span-2 retro-panel p-2 rounded-xl bg-blue-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)]" />
            <div className="border-4 border-blue-500 rounded-lg p-6 h-full flex flex-col relative z-10 bg-black/80">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-4xl font-black uppercase tracking-widest text-secondary drop-shadow-[0_2px_10px_rgba(59,130,246,0.8)]">{event.name}</h2>
                <span className="bg-destructive text-white px-3 py-1 rounded font-black text-sm uppercase tracking-widest animate-pulse border-2 border-white">
                  {event.status}
                </span>
              </div>
              
              <div className="flex-1 bg-gray-900 p-6 rounded-lg border-4 border-gray-700 mb-6 shadow-inner">
                <p className="text-lg font-mono text-white mb-6">
                  {event.rule}
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Chip label="+ PITCH POINTS" color="bg-primary text-black" />
                  <Chip label="+ HEAT" color="bg-destructive text-white" />
                  <Chip label="+ FORM" color="bg-secondary text-black" />
                  <Chip label="? MUTATION" color="bg-purple-600 text-white" />
                </div>
              </div>

              <Button 
                onClick={() => setSelectedEvent(event.id)}
                className="btn-arcade btn-secondary-arcade w-full py-8 text-3xl shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
              >
                <Play className="mr-4 w-8 h-8 fill-current" /> ENTER FEVER
              </Button>
            </div>
          </div>
        ))}

        {/* Smaller Events Stack */}
        <div className="flex flex-col gap-4">
          {EVENTS.filter(e => e.status === "LIVE").slice(1).map(event => (
            <SmallEventCard key={event.id} event={event} onSelect={() => setSelectedEvent(event.id)} />
          ))}
          {EVENTS.filter(e => e.status !== "LIVE").map(event => (
            <SmallEventCard key={event.id} event={event} locked />
          ))}
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

function Chip({ label, color }: { label: string, color: string }) {
  return <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded border-2 border-transparent shadow-sm ${color}`}>{label}</span>;
}

function SmallEventCard({ event, locked, onSelect }: { event: any, locked?: boolean, onSelect?: () => void }) {
  return (
    <div className={`retro-panel p-4 rounded-xl flex flex-col ${locked ? "bg-gray-900 opacity-60 grayscale" : "bg-black hover:bg-gray-900 cursor-pointer transition-transform hover:scale-105"}`}
         onClick={!locked ? onSelect : undefined}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-black uppercase tracking-widest text-white text-xl truncate pr-2">{event.name}</h3>
        {locked ? <Lock className="w-5 h-5 text-gray-500 shrink-0" /> : <div className="w-3 h-3 rounded-full bg-destructive animate-pulse shrink-0 shadow-[0_0_10px_red]" />}
      </div>
      <div className="bg-gray-800 p-3 rounded border-2 border-gray-700 flex-1">
        <p className="text-xs font-mono text-gray-300 line-clamp-2">{event.rule}</p>
      </div>
      {locked && <div className="mt-3 text-xs font-black text-gray-500 uppercase tracking-widest text-center border-t-2 border-gray-800 pt-2">LOCKED</div>}
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
    }, 2000);
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl bg-black border-8 border-gray-800 p-0 overflow-hidden sm:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)]">
        <DialogHeader className="p-6 bg-gray-900 border-b-4 border-gray-700 flex flex-row items-center justify-between">
          <DialogTitle className="text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3">
            <ShieldAlert className="text-secondary w-8 h-8" /> TACTICS DEPLOYMENT
          </DialogTitle>
          <div className="bg-black px-4 py-2 rounded border-2 border-gray-600 text-sm font-mono text-secondary uppercase font-bold">
            MISSION: {event.name}
          </div>
        </DialogHeader>

        {/* Isometric Pitch Area */}
        <div className="relative p-12 min-h-[500px] flex flex-col items-center justify-center bg-gray-900 border-b-4 border-gray-700 overflow-hidden">
          
          {/* Pitch background */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#15803d_0%,#15803d_5%,#166534_5%,#166534_10%)] transform perspective-[1000px] rotateX(45deg) scale(1.5) border-8 border-white opacity-80" />
          
          <div className="absolute inset-x-0 top-1/2 h-2 bg-white -translate-y-1/2 opacity-50 shadow-[0_0_10px_white]" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full border-8 border-white -translate-x-1/2 -translate-y-1/2 opacity-50 shadow-[0_0_10px_white]" />

          {/* Cards on Pitch */}
          <div className="relative z-10 flex flex-wrap justify-center gap-6 mt-12 w-full max-w-4xl">
            {equipped.map((card, i) => (
              <div key={i} className="transform transition-transform hover:-translate-y-4">
                {card ? (
                  <CardComponent card={card} size="lg" className="shadow-[0_30px_50px_rgba(0,0,0,0.9)] border-4 border-white" />
                ) : (
                  <div className="w-64 h-96 rounded-2xl border-4 border-dashed border-white/50 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-white/50">
                    <span className="font-mono text-2xl font-bold mb-2">SLOT {i+1}</span>
                    <span className="font-black uppercase tracking-widest text-lg">EMPTY</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="absolute top-6 left-6 retro-panel bg-black p-4 rounded-xl">
            <div className="text-[10px] text-accent uppercase font-black tracking-widest mb-1">TOTAL ROAR POWER</div>
            <div className="hud-numbers text-5xl text-white">{roarPower}</div>
          </div>
        </div>

        <div className="p-6 bg-black flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-sm font-mono text-gray-500 uppercase bg-gray-900 px-4 py-2 rounded border-2 border-gray-800">
            REQUIRES 2+ ASSETS
          </div>
          <Button 
            onClick={handleDeploy} 
            disabled={activeCards.length < 2 || deploying}
            className={`btn-arcade py-8 px-16 text-2xl ${deploying ? "bg-gray-800 text-gray-500 border-gray-700" : "btn-primary-arcade"}`}
          >
            {deploying ? "SIMULATING MATCH..." : "EXECUTE DEPLOYMENT"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
