import { useGameState } from "../lib/game-state";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { Receipt } from "../lib/game-state";
import { Ticket, Share2, Coins, TrendingDown } from "lucide-react";
import { cn } from "../lib/utils";

export default function Receipts() {
  const { receipts, claimReceipt } = useGameState();
  const { toast } = useToast();

  const handleClaim = (id: string) => {
    claimReceipt(id);
    toast({
      title: "Reward Claimed",
      description: "Pitch Points added to balance.",
    });
  };

  const handleShare = () => {
    toast({
      title: "Receipt Shared",
      description: "Link copied to clipboard.",
    });
  };

  if (receipts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
        <Ticket className="w-16 h-16 mb-4 opacity-20" />
        <h2 className="text-xl font-bold uppercase tracking-widest mb-2">No Receipts Yet</h2>
        <p className="font-mono text-sm">Enter Fever events to generate match receipts.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black uppercase tracking-widest text-foreground flex items-center gap-3">
          <Ticket className="text-accent w-8 h-8" /> Match Receipts
        </h1>
        <p className="text-muted-foreground font-mono text-sm">Results from your latest formations.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {receipts.map(receipt => (
          <ReceiptCard 
            key={receipt.id} 
            receipt={receipt} 
            onClaim={() => handleClaim(receipt.id)}
            onShare={handleShare}
          />
        ))}
      </div>
    </div>
  );
}

function ReceiptCard({ receipt, onClaim, onShare }: { receipt: Receipt, onClaim: () => void, onShare: () => void }) {
  return (
    <div className="bg-[#111] border border-border p-0 rounded-xl overflow-hidden flex flex-col md:flex-row relative">
      {/* Ticket perforations effect */}
      <div className="hidden md:flex flex-col justify-between absolute left-64 top-0 bottom-0 z-10 w-4 translate-x-[-50%] py-2">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="w-4 h-4 rounded-full bg-background border border-border" />
        ))}
      </div>
      <div className="hidden md:block absolute left-64 top-0 bottom-0 w-px border-l-2 border-dashed border-border z-0" />

      {/* Left side - stub */}
      <div className="p-6 bg-black/60 md:w-64 flex flex-col justify-between border-b md:border-b-0 md:border-r border-dashed border-border shrink-0">
        <div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Event</div>
          <h3 className="font-black text-lg text-white uppercase leading-tight mb-4">{receipt.event}</h3>
          
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 mt-4">Receipt ID</div>
          <p className="font-mono text-xs text-gray-500 truncate">{receipt.id}</p>
        </div>
        
        <div className="mt-6">
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Status</div>
          <span className={cn(
            "text-xs font-black px-2 py-1 rounded uppercase tracking-wider inline-block",
            receipt.claimed ? "text-gray-400 bg-gray-800" : "text-accent bg-accent/10 border border-accent/30"
          )}>
            {receipt.claimed ? "Settled" : "Pending Claim"}
          </span>
        </div>
      </div>

      {/* Right side - details */}
      <div className="p-6 flex-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDEwaDQwdjFINHoiIGZpbGw9IiMzMzMiIGZpbGwtb3BhY2l0eT0iMC4xIi8+Cjwvc3ZnPg==')]">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Rewards */}
          <div>
            <h4 className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 border-b border-border pb-2">Stadium Output</h4>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-primary glow-text">+{receipt.rewards.pitchPoints}</div>
                <div className="text-xs font-mono text-muted-foreground">Pitch Points</div>
              </div>
            </div>
            {receipt.rewards.mutation && (
              <div className="mt-3 text-xs font-bold text-destructive uppercase tracking-widest px-2 py-1 bg-destructive/10 border border-destructive/20 inline-block rounded">
                Mutation: {receipt.rewards.mutation}
              </div>
            )}
          </div>

          {/* Impact */}
          <div>
            <h4 className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 border-b border-border pb-2">Card Impact</h4>
            <div className="flex flex-col gap-2">
              {Object.entries(receipt.cardImpact).map(([cardId, impact]) => {
                const card = receipt.formation.find(c => c.id === cardId);
                if (!card) return null;
                return (
                  <div key={cardId} className="flex items-center justify-between font-mono text-sm bg-black/40 px-3 py-1.5 rounded border border-white/5">
                    <span className="text-white truncate pr-4" style={{ color: card.color }}>{card.name}</span>
                    <span className="flex items-center gap-1 shrink-0">
                      {impact.stat === "Fatigue" && <TrendingDown className="w-3 h-3 text-gray-500" />}
                      <span className={impact.change < 0 ? "text-gray-400" : "text-green-400"}>
                        {impact.change > 0 ? '+' : ''}{impact.change} {impact.stat}
                      </span>
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 border-t border-border pt-4">
          <Button 
            variant="outline"
            onClick={onShare}
            className="text-xs font-bold uppercase tracking-widest border-border text-foreground hover:bg-white/5"
          >
            <Share2 className="w-3 h-3 mr-2" /> Share
          </Button>
          {!receipt.claimed && (
            <Button 
              onClick={onClaim}
              className="bg-accent hover:bg-accent/80 text-accent-foreground font-black uppercase tracking-widest text-xs px-6"
            >
              Claim Reward
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
