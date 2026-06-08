import { useState } from "react";
import { useGameState } from "../lib/game-state";
import { EVENTS, CountryCard } from "../lib/constants";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { CardComponent } from "../components/card-component";
import { useLocation } from "wouter";
import { AlertTriangle, Lock, Play, ShieldAlert } from "lucide-react";
import { cn } from "../lib/utils";

export default function FeverBoard() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const { heat } = useGameState();

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      
      {/* Scoreboard Header */}
      <div className="bg-black/90 border-4 border-destructive/50 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
        <div className="flex items-center gap-4">
          <AlertTriangle className="text-destructive w-12 h-12 animate-pulse" />
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-white glow-text leading-none">
              Fever Board
            </h1>
            <div className="text-destructive font-black uppercase tracking-widest text-sm mt-1">Live Broadcast Network</div>
          </div>
        </div>
        
        <div className="bg-black border-2 border-destructive/30 p-3 rounded-lg flex items-center gap-4 min-w-[200px]">
          <div>
            <div className="text-[10px] text-destructive uppercase font-black tracking-widest">Global Heat</div>
            <div className="hud-numbers text-3xl text-white">{heat}</div>
          </div>
          <div className="flex-1 h-full border-l-2 border-destructive/20 pl-4 flex flex-col justify-center">
            <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Next Refresh</div>
            <div className="hud-numbers text-xl text-gray-300">02:14:59</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Featured Live Event (Takes up 2 cols on LG) */}
        {EVENTS.filter(e => e.status === "LIVE").slice(0, 1).map(event => (
          <div key={event.id} className="lg:col-span-2 bg-black/60 border-2 border-secondary rounded-xl p-1 relative overflow-hidden group">
            <div className="absolute inset-0 bg-secondary opacity-10 animate-pulse z-0 pointer-events-none" />
            <div className="border-2 border-dashed border-secondary/50 rounded-lg p-6 h-full flex flex-col relative z-10 bg-black/40 backdrop-blur-sm">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl font-black uppercase tracking-widest text-white glow-text">{event.name}</h2>
                <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded font-black text-xs uppercase tracking-widest animate-pulse">
                  {event.status}
                </span>
              </div>
              
              <p className="text-sm font-mono text-gray-300 mb-6 flex-1 bg-black/50 p-4 rounded border border-white/10">
                {event.rule}
              </p>
              
              <div className="flex gap-2 mb-6 flex-wrap">
                <Chip label="+ Pitch Points" color="bg-primary/20 text-primary border-primary/50" />
                <Chip label="+ Heat" color="bg-destructive/20 text-destructive border-destructive/50" />
                <Chip label="+ Form" color="bg-secondary/20 text-secondary border-secondary/50" />
                <Chip label="? Mutation" color="bg-purple-500/20 text-purple-400 border-purple-500/50" />
              </div>

              <Button 
                onClick={() => setSelectedEvent(event.id)}
                className="btn-arcade w-full bg-secondary text-secondary-foreground border-blue-900 hover:bg-blue-400 py-8 text-2xl glow-blue"
              >
                <Play className="mr-2 w-6 h-6 fill-current" /> ENTER FEVER
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
  return <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border", color)}>{label}</span>;
}

function SmallEventCard({ event, locked, onSelect }: { event: any, locked?: boolean, onSelect?: () => void }) {
  return (
    <div className={cn(
      "border-2 rounded-xl p-4 flex flex-col bg-black/80 backdrop-blur-sm",
      locked ? "border-gray-800 opacity-60 grayscale" : "border-white/20 hover:border-white/50 cursor-pointer"
    )} onClick={!locked ? onSelect : undefined}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-black uppercase tracking-widest text-white text-lg truncate pr-2">{event.name}</h3>
        {locked ? <Lock className="w-4 h-4 text-gray-500 shrink-0" /> : <div className="w-2 h-2 rounded-full bg-secondary animate-pulse shrink-0" />}
      </div>
      <p className="text-xs font-mono text-gray-400 line-clamp-2 mb-3">{event.rule}</p>
      {locked && <div className="mt-auto text-[10px] font-black text-gray-500 uppercase tracking-widest">LOCKED</div>}
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
      <DialogContent className="max-w-4xl bg-black border-4 border-white/20 p-0 overflow-hidden sm:rounded-2xl">
        <DialogHeader className="p-4 bg-gray-900 border-b-2 border-white/10 flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-black uppercase tracking-widest text-white flex items-center gap-2">
            <ShieldAlert className="text-secondary" /> DEPLOY FORMATION
          </DialogTitle>
          <div className="bg-black px-3 py-1 rounded border border-white/20 text-xs font-mono text-gray-400 uppercase">
            TARGET: {event.name}
          </div>
        </DialogHeader>

        {/* Green Pitch Area */}
        <div className="relative p-8 min-h-[400px] flex flex-col items-center justify-center border-b-2 border-white/10"
             style={{ background: "repeating-linear-gradient(0deg, #166534 0%, #166534 10%, #15803d 10%, #15803d 20%)" }}>
          
          <div className="absolute inset-x-0 top-1/2 h-1 bg-white/30 -translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full border-4 border-white/30 -translate-x-1/2 -translate-y-1/2" />

          {/* Cards on Pitch */}
          <div className="relative z-10 flex flex-wrap justify-center gap-4 md:gap-6 mt-8">
            {equipped.map((card, i) => (
              <div key={i} className="transform transition-transform hover:-translate-y-2">
                {card ? (
                  <CardComponent card={card} size="md" className="shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-2 border-white/50" />
                ) : (
                  <div className="w-48 h-72 rounded-xl border-4 border-dashed border-white/30 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/50 font-black uppercase tracking-widest">
                    EMPTY SLOT
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="absolute top-4 left-4 bg-black/80 border-2 border-primary/50 px-4 py-2 rounded-lg backdrop-blur-md">
            <div className="text-[10px] text-primary uppercase font-black tracking-widest">Formation Roar</div>
            <div className="hud-numbers text-3xl text-white">{roarPower}</div>
          </div>
        </div>

        <div className="p-4 bg-gray-900 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-[10px] font-mono text-gray-500 uppercase">Requires minimum 2 assets to deploy.</div>
          <Button 
            onClick={handleDeploy} 
            disabled={activeCards.length < 2 || deploying}
            className={`btn-arcade py-6 px-12 text-xl ${deploying ? "bg-gray-700" : "btn-primary-arcade"}`}
          >
            {deploying ? "SIMULATING MATCH..." : "EXECUTE DEPLOYMENT"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
