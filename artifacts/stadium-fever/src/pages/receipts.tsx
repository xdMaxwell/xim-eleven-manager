import { useGameState } from "../lib/game-state";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { Receipt } from "../lib/game-state";
import { Ticket, Share2, Sparkles, CheckCircle2 } from "lucide-react";

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
      title: "COPIED",
      description: "Receipt ID copied to clipboard.",
    });
  };

  if (receipts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto">
        <div className="w-32 h-32 retro-panel bg-black rounded-2xl flex items-center justify-center mb-8 rotate-12">
          <Ticket className="w-16 h-16 text-gray-600" />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-widest text-white mb-4">NO RECORDS</h2>
        <p className="font-mono text-gray-400 text-lg bg-black p-4 rounded border-2 border-gray-800">
          Deploy formations in the Fever Board to generate post-match receipts and claim rewards.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8">
      <div className="retro-panel bg-black p-6 rounded-xl flex items-center gap-4">
        <Ticket className="text-accent w-10 h-10" />
        <h1 className="text-4xl font-black uppercase tracking-widest text-white m-0 leading-none">
          MATCH RECEIPTS
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-10">
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
    <div className={`flex flex-col md:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform transition-all hover:scale-[1.01] ${isNew ? 'animate-in slide-in-from-top-8 fade-in duration-500' : ''}`}>
      
      {/* Main Ticket Body */}
      <div className="flex-1 bg-white text-black p-8 flex flex-col justify-between border-4 border-gray-300 relative rounded-t-xl md:rounded-tr-none md:rounded-l-xl">
        <div className="absolute top-0 left-0 w-full h-4 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,#e5e7eb_10px,#e5e7eb_20px)]" />
        
        <div className="flex justify-between items-start border-b-8 border-black pb-6 mb-6 mt-4">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">OFFICIAL MATCH RECORD</div>
            <h3 className="font-black font-sans text-5xl uppercase leading-none">{receipt.event}</h3>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">RECEIPT ID</div>
            <div className="font-mono text-2xl font-bold bg-gray-200 px-3 py-1 border-2 border-gray-400">{receipt.id.substring(2, 10).toUpperCase()}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="text-xs font-black uppercase tracking-widest bg-black text-white inline-block px-3 py-1 mb-4">DEPLOYED ASSETS</div>
            <div className="flex flex-col gap-2 font-mono">
              {receipt.formation.map(c => (
                <div key={c.id} className="text-lg font-bold flex items-center justify-between border-b-2 border-dashed border-gray-300 pb-2">
                  <span>{c.name}</span>
                  <span className="text-sm bg-gray-200 px-2 py-0.5">LVL {c.level}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-black uppercase tracking-widest bg-black text-white inline-block px-3 py-1 mb-4">ASSET IMPACT</div>
            <div className="flex flex-col gap-2 font-mono">
              {Object.entries(receipt.cardImpact).map(([cardId, impact]) => {
                const card = receipt.formation.find(c => c.id === cardId);
                if (!card) return null;
                return (
                  <div key={cardId} className="text-lg font-bold flex items-center justify-between border-b-2 border-dashed border-gray-300 pb-2">
                    <span className="truncate pr-2">{card.name}</span>
                    <span className={`px-2 py-0.5 text-sm ${impact.change < 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                      {impact.change > 0 ? '+' : ''}{impact.change} {impact.stat}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex h-12 w-full bg-black mt-auto opacity-80 mix-blend-multiply rounded-sm">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="h-full bg-white" style={{ width: `${Math.random() * 4 + 1}px`, marginLeft: `${Math.random() * 3 + 1}px` }} />
          ))}
        </div>
      </div>

      {/* Claim/Result Stub (Right) */}
      <div className="w-full md:w-80 bg-gray-200 p-8 flex flex-col justify-between border-y-4 border-r-4 border-gray-300 md:border-l-4 md:border-l-dashed border-dashed rounded-b-xl md:rounded-bl-none md:rounded-r-xl">
        <div>
          <div className="text-center border-b-4 border-gray-400 pb-6 mb-6">
            <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">STADIUM OUTPUT</div>
            <div className="text-6xl font-black font-mono text-primary drop-shadow-md">+{receipt.rewards.pitchPoints}</div>
            <div className="text-sm font-black mt-2 bg-white inline-block px-3 py-1 border-2 border-gray-300">PITCH POINTS</div>
          </div>
          
          {receipt.rewards.mutation && (
             <div className="text-center text-purple-700 border-4 border-purple-700 p-3 font-black text-sm uppercase bg-purple-100 mb-6 flex items-center justify-center gap-2 shadow-inner">
               <Sparkles className="w-5 h-5" /> {receipt.rewards.mutation}
             </div>
          )}

          <div className="text-center mb-8">
            <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">STATUS</div>
            {receipt.claimed ? (
               <div className="font-black text-gray-500 border-4 border-gray-400 py-2 bg-gray-300 flex items-center justify-center gap-2">
                 <CheckCircle2 className="w-5 h-5" /> SETTLED
               </div>
            ) : (
               <div className="font-black text-secondary border-4 border-secondary py-2 bg-blue-100 animate-pulse">
                 PENDING CLAIM
               </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {!receipt.claimed && (
            <Button 
              onClick={onClaim}
              className="btn-arcade btn-primary-arcade h-16 text-2xl w-full"
            >
               CLAIM REWARD
            </Button>
          )}
          <Button 
            variant="outline"
            onClick={onShare}
            className="btn-arcade bg-white border-gray-400 text-black hover:bg-gray-100 h-12 text-lg w-full"
          >
            <Share2 className="w-5 h-5 mr-2" /> SHARE
          </Button>
        </div>
      </div>

    </div>
  );
}
