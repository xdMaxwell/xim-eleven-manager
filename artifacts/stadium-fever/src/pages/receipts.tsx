import { useGameState } from "../lib/game-state";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { Receipt } from "../lib/game-state";
import { Ticket, Share2, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

export default function Receipts() {
  const { receipts, claimReceipt } = useGameState();
  const { toast } = useToast();

  const handleClaim = (id: string) => {
    claimReceipt(id);
    toast({
      title: "FUNDS SECURED",
      description: "Pitch Points added to HUD.",
    });
  };

  const handleShare = () => {
    toast({
      title: "COPIED TO CLIPBOARD",
      description: "Receipt ID copied.",
    });
  };

  if (receipts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-24 h-24 bg-black border-4 border-dashed border-gray-700 rounded-xl flex items-center justify-center mb-6">
          <Ticket className="w-10 h-10 text-gray-600" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-widest text-gray-500 mb-2">NO RECORDS FOUND</h2>
        <p className="font-mono text-gray-600 text-sm">Deploy formations in Fever Board to generate match receipts.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8">
      <div className="bg-black/80 border-b-4 border-white/20 p-6 flex items-center gap-4 shrink-0 rounded-t-xl">
        <Ticket className="text-white w-8 h-8" />
        <h1 className="text-3xl font-black uppercase tracking-widest text-white m-0 leading-none">
          Match Receipts
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {receipts.map((receipt, index) => (
          <ReceiptCard 
            key={receipt.id} 
            receipt={receipt} 
            isNew={index === 0 && !receipt.claimed}
            onClaim={() => handleClaim(receipt.id)}
            onShare={handleShare}
          />
        ))}
      </div>
    </div>
  );
}

function ReceiptCard({ receipt, isNew, onClaim, onShare }: { receipt: Receipt, isNew: boolean, onClaim: () => void, onShare: () => void }) {
  return (
    <div className={cn(
      "flex flex-col md:flex-row relative bg-white text-black font-mono shadow-2xl transform transition-transform",
      isNew ? "animate-in slide-in-from-top-4 fade-in duration-500" : "opacity-90"
    )}>
      
      {/* Decorative stub edge (Left) */}
      <div className="hidden md:flex flex-col justify-between w-6 bg-gray-200 border-r-2 border-dashed border-gray-400 overflow-hidden relative">
         {[...Array(20)].map((_, i) => (
           <div key={i} className="w-4 h-4 rounded-full bg-background absolute -left-2" style={{ top: `${i * 5}%` }} />
         ))}
      </div>

      {/* Main Ticket Body */}
      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between border-b-2 md:border-b-0 md:border-r-2 border-dashed border-gray-300">
        
        <div className="flex justify-between items-start border-b-4 border-black pb-4 mb-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">EVENT LOG</div>
            <h3 className="font-black font-sans text-3xl uppercase leading-none mt-1">{receipt.event}</h3>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">ID</div>
            <div className="font-bold">{receipt.id.substring(2, 10).toUpperCase()}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest bg-black text-white inline-block px-2 py-0.5 mb-2">Formation Used</div>
            <div className="flex flex-col gap-1">
              {receipt.formation.map(c => (
                <div key={c.id} className="text-sm font-bold flex items-center justify-between border-b border-gray-200 pb-1">
                  <span>{c.name}</span>
                  <span className="text-xs text-gray-500">LVL {c.level}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
             <div className="text-[10px] font-black uppercase tracking-widest bg-black text-white inline-block px-2 py-0.5 mb-2">Card Impact</div>
             <div className="flex flex-col gap-1">
              {Object.entries(receipt.cardImpact).map(([cardId, impact]) => {
                const card = receipt.formation.find(c => c.id === cardId);
                if (!card) return null;
                return (
                  <div key={cardId} className="text-sm font-bold flex items-center justify-between border-b border-gray-200 pb-1">
                    <span className="truncate pr-2">{card.name}</span>
                    <span className={impact.change < 0 ? "text-red-600" : "text-green-600"}>
                      {impact.change > 0 ? '+' : ''}{impact.change} {impact.stat}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <Barcode />
      </div>

      {/* Claim/Result Stub (Right) */}
      <div className="w-full md:w-64 bg-gray-100 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="text-center border-b-2 border-gray-300 pb-4 mb-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">STADIUM OUTPUT</div>
            <div className="text-4xl font-black font-sans text-green-600">+{receipt.rewards.pitchPoints}</div>
            <div className="text-xs font-bold mt-1">PITCH POINTS</div>
          </div>
          
          {receipt.rewards.mutation && (
             <div className="text-center text-purple-600 border-2 border-purple-600 p-2 font-bold text-xs uppercase bg-purple-100 mb-4 flex items-center justify-center gap-1">
               <Sparkles className="w-3 h-3" /> {receipt.rewards.mutation}
             </div>
          )}

          <div className="text-center mb-6">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">STATUS</div>
            {receipt.claimed ? (
               <div className="font-bold text-gray-400 border-2 border-gray-400 py-1 rounded">SETTLED</div>
            ) : (
               <div className="font-bold text-blue-600 border-2 border-blue-600 py-1 rounded animate-pulse">PENDING CLAIM</div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {!receipt.claimed && (
            <Button 
              onClick={onClaim}
              className="btn-arcade bg-green-600 text-white border-green-800 hover:bg-green-500 rounded-none h-12 w-full font-black text-lg"
            >
               CLAIM REWARD
            </Button>
          )}
          <Button 
            variant="outline"
            onClick={onShare}
            className="rounded-none border-2 border-black text-black font-black uppercase hover:bg-gray-200"
          >
            <Share2 className="w-4 h-4 mr-2" /> Share Result
          </Button>
        </div>
      </div>

    </div>
  );
}

function Barcode() {
  return (
    <div className="flex h-8 w-full bg-white opacity-80 mix-blend-multiply">
      {[...Array(40)].map((_, i) => (
        <div key={i} className="h-full bg-black" style={{ width: `${Math.random() * 4 + 1}px`, marginRight: `${Math.random() * 3 + 1}px` }} />
      ))}
    </div>
  );
}
