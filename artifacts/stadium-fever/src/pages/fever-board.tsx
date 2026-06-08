import { useState } from "react";
import { useGameState } from "../lib/game-state";
import { EVENTS, CountryCard } from "../lib/constants";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { CardComponent } from "../components/card-component";
import { useLocation } from "wouter";
import { AlertCircle, Lock, PlayCircle, ShieldCheck } from "lucide-react";
import { cn } from "../lib/utils";

export default function FeverBoard() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black uppercase tracking-widest text-foreground flex items-center gap-3">
          <AlertCircle className="text-destructive w-8 h-8" /> Fever Board
        </h1>
        <p className="text-muted-foreground font-mono text-sm">Deploy formations to capture stadium output.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EVENTS.map(event => (
          <div 
            key={event.id}
            className={cn(
              "border rounded-xl p-6 flex flex-col justify-between relative overflow-hidden transition-all",
              event.status === "LIVE" ? "bg-card border-secondary/50 hover:border-secondary" : "bg-black/40 border-border opacity-70 grayscale"
            )}
          >
            {event.status === "LIVE" && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary opacity-10 blur-3xl rounded-full" />
            )}
            
            <div className="flex justify-between items-start mb-6 z-10">
              <h2 className="text-xl font-black uppercase tracking-widest text-white pr-4">
                {event.name}
              </h2>
              <span className={cn(
                "text-[10px] font-black px-2 py-1 rounded border uppercase tracking-widest",
                event.status === "LIVE" ? "text-secondary border-secondary/50 bg-secondary/10 glow-text animate-pulse" : "text-muted-foreground border-border bg-black/40"
              )}>
                {event.status}
              </span>
            </div>

            <p className="text-sm text-gray-400 font-mono mb-8 z-10 leading-relaxed min-h-[3rem]">
              {event.rule}
            </p>

            <Button 
              disabled={event.status !== "LIVE"}
              onClick={() => setSelectedEvent(event.id)}
              className={cn(
                "w-full font-black uppercase tracking-widest py-6 z-10",
                event.status === "LIVE" ? "bg-secondary hover:bg-secondary/80 text-secondary-foreground glow-box" : "bg-muted text-muted-foreground"
              )}
            >
              {event.status === "LIVE" ? <><PlayCircle className="w-4 h-4 mr-2" /> Enter Fever</> : <><Lock className="w-4 h-4 mr-2" /> Locked</>}
            </Button>
          </div>
        ))}
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
    }, 1500);
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl bg-card border-border p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0 border-b border-white/5 bg-black/40">
          <DialogTitle className="text-2xl font-black uppercase tracking-widest text-secondary flex items-center gap-2">
            <ShieldCheck className="w-6 h-6" /> Formation Builder
          </DialogTitle>
          <p className="text-xs text-muted-foreground font-mono mt-2 uppercase tracking-wider pb-4">Event: {event.name}</p>
        </DialogHeader>

        <div className="p-6 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzA4MWMyYSIvPgo8cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iNDAiIGZpbGw9IiMwZDIzM2MiLz4KPC9zdmc+')] bg-cover bg-center border-y border-white/10 relative">
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />
          
          <div className="relative z-10 flex flex-col items-center">
            
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-4 flex gap-8 mb-8 text-center min-w-[300px] justify-center">
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Total Roar</div>
                <div className="text-2xl font-black text-primary drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">{roarPower}</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Assets</div>
                <div className="text-2xl font-black text-white">{activeCards.length} / 4</div>
              </div>
            </div>

            <div className="flex gap-4 items-center justify-center min-h-[200px]">
              {equipped.map((card, i) => (
                <div key={i} className="flex-shrink-0">
                  {card ? (
                    <CardComponent card={card} size="sm" className="shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform -translate-y-4" />
                  ) : (
                    <div className="w-32 h-48 rounded-xl border-2 border-dashed border-white/20 bg-black/40 flex items-center justify-center">
                      <span className="text-white/20 font-mono text-xs">SLOT {i + 1}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
          </div>
        </div>

        <div className="p-6 bg-black/40 flex justify-between items-center">
          <div className="flex gap-4 text-xs font-mono text-muted-foreground">
            <span className="text-primary">+ Pitch Points</span>
            <span className="text-destructive">+ Heat</span>
            <span className="text-secondary">+ Form</span>
            <span className="text-gray-500">- Fatigue</span>
          </div>

          <Button 
            onClick={handleDeploy} 
            disabled={activeCards.length < 2 || deploying}
            size="lg"
            className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-black uppercase tracking-widest px-8"
          >
            {deploying ? "Deploying..." : "Deploy Formation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
