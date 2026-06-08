import { useGameState } from "../lib/game-state";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { Receipt } from "../lib/game-state";
import { Ticket, Share2, Sparkles, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

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
      <div className="flex flex-col items-center justify-center min-h-[75vh] w-full relative">
        <div className="absolute inset-0 bg-gray-950 rounded-3xl border-8 border-gray-800 shadow-[inset_0_0_100px_rgba(0,0,0,1)] -z-20 overflow-hidden" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_40px,rgba(255,255,255,0.02)_40px,rgba(255,255,255,0.02)_80px)] -z-10" />
        
        {/* Decorated Ticket Wall Empty State */}
        <div className="absolute top-20 flex gap-8 opacity-20 grayscale blur-sm pointer-events-none -z-10">
           <div className="w-64 h-96 border-4 border-dashed border-white rounded-xl rotate-[-15deg] translate-y-10" />
           <div className="w-64 h-96 border-4 border-dashed border-white rounded-xl rotate-[5deg] -translate-y-5" />
           <div className="w-64 h-96 border-4 border-dashed border-white rounded-xl rotate-[20deg] translate-y-20" />
        </div>

        <div className="text-center max-w-2xl mx-auto bg-black/80 backdrop-blur-md p-16 rounded-3xl border-8 border-gray-800 shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-10 relative">
          <div className="w-40 h-40 retro-panel bg-gray-900 rounded-full flex items-center justify-center mb-10 mx-auto border-4 border-gray-700 shadow-inner">
            <Ticket className="w-20 h-20 text-gray-600" />
          </div>
          <h2 className="text-5xl font-black uppercase tracking-widest text-white mb-6">TICKET WALL EMPTY</h2>
          <p className="font-mono text-gray-400 text-xl mb-10 leading-relaxed bg-black p-6 rounded-xl border-2 border-gray-800">
            Deploy formations in the Fever Board to generate official match receipts and claim rewards.
          </p>
          <Link href="/fever">
             <Button className="btn-arcade btn-primary-arcade text-2xl py-8 px-12 rounded-xl w-full">
                GO TO FEVER BOARD
             </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-10 w-full relative">
      {/* Background atmosphere */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)]" />

      <div className="retro-panel bg-black p-8 rounded-2xl flex items-center gap-6 border-4 border-gray-700 shadow-xl">
        <div className="bg-gray-900 p-4 rounded-xl border-2 border-gray-800">
          <Ticket className="text-accent w-12 h-12" />
        </div>
        <div>
          <h1 className="text-5xl font-black uppercase tracking-widest text-white m-0 leading-none mb-2">
            MATCH RECEIPTS
          </h1>
          <div className="text-sm font-mono text-gray-400 uppercase tracking-widest">
            {receipts.length} Official Records
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
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
    <div className={`flex flex-col lg:flex-row shadow-[0_30px_60px_rgba(0,0,0,0.6)] transform transition-all hover:scale-[1.02] ${isNew ? 'animate-in slide-in-from-top-12 fade-in duration-700' : ''}`}>
      
      {/* Main Giant Ticket Body */}
      <div className="flex-1 bg-white text-black p-10 lg:p-12 flex flex-col justify-between border-[12px] border-gray-300 relative rounded-t-3xl lg:rounded-tr-none lg:rounded-l-3xl overflow-hidden">
        {/* Ticket Perforations / Pattern */}
        <div className="absolute top-0 left-0 w-full h-6 bg-[repeating-linear-gradient(90deg,transparent,transparent_15px,#e5e7eb_15px,#e5e7eb_30px)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNSkiLz48L3N2Zz4=')] pointer-events-none" />
        
        <div className="flex justify-between items-start border-b-[12px] border-black pb-8 mb-8 mt-6 relative z-10">
          <div>
            <div className="text-sm font-black uppercase tracking-widest text-gray-500 mb-2">OFFICIAL MATCH RECORD</div>
            <h3 className="font-black font-sans text-6xl uppercase leading-none tracking-tight">{receipt.event}</h3>
          </div>
          <div className="text-right">
            <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">RECEIPT ID</div>
            <div className="font-mono text-3xl font-bold bg-gray-200 px-4 py-2 border-4 border-gray-400 rounded">{receipt.id.substring(2, 10).toUpperCase()}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10 relative z-10">
          <div>
            <div className="text-sm font-black uppercase tracking-widest bg-black text-white inline-block px-4 py-2 mb-6 rounded-sm">DEPLOYED ASSETS</div>
            <div className="flex flex-col gap-4 font-mono">
              {receipt.formation.map(c => (
                <div key={c.id} className="text-xl font-bold flex items-center justify-between border-b-4 border-dashed border-gray-300 pb-3">
                  <span className="uppercase">{c.name}</span>
                  <span className="text-sm bg-gray-200 px-3 py-1 font-black border-2 border-gray-400 rounded">LVL {c.level}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-black uppercase tracking-widest bg-black text-white inline-block px-4 py-2 mb-6 rounded-sm">ASSET IMPACT</div>
            <div className="flex flex-col gap-4 font-mono">
              {Object.entries(receipt.cardImpact).map(([cardId, impact]) => {
                const card = receipt.formation.find(c => c.id === cardId);
                if (!card) return null;
                return (
                  <div key={cardId} className="text-xl font-bold flex items-center justify-between border-b-4 border-dashed border-gray-300 pb-3">
                    <span className="truncate pr-4 uppercase">{card.name}</span>
                    <span className={`px-3 py-1 text-sm font-black border-2 rounded ${impact.change < 0 ? "bg-red-100 text-red-700 border-red-300" : "bg-green-100 text-green-700 border-green-300"}`}>
                      {impact.change > 0 ? '+' : ''}{impact.change} {impact.stat}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Barcode / Footer design */}
        <div className="flex h-20 w-full bg-black mt-auto opacity-90 rounded-md p-2">
          {[...Array(60)].map((_, i) => (
            <div key={i} className="h-full bg-white" style={{ width: `${Math.random() * 6 + 2}px`, marginLeft: `${Math.random() * 4 + 1}px` }} />
          ))}
        </div>
      </div>

      {/* Claim/Result Stub (Right) */}
      <div className="w-full lg:w-[400px] bg-gray-200 p-10 flex flex-col justify-between border-y-[12px] border-r-[12px] border-gray-300 lg:border-l-[12px] lg:border-l-dashed border-dashed rounded-b-3xl lg:rounded-bl-none lg:rounded-r-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNSkiLz48L3N2Zz4=')] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="text-center border-b-8 border-gray-400 pb-8 mb-8">
            <div className="text-sm font-black uppercase tracking-widest text-gray-500 mb-3">STADIUM OUTPUT</div>
            <div className="text-8xl font-black font-mono text-primary drop-shadow-lg mb-2">+{receipt.rewards.pitchPoints}</div>
            <div className="text-lg font-black bg-white inline-block px-4 py-2 border-4 border-gray-300 rounded">PITCH POINTS</div>
          </div>
          
          {receipt.rewards.mutation && (
             <div className="text-center text-purple-700 border-4 border-purple-700 p-4 font-black text-lg uppercase bg-purple-100 mb-8 flex items-center justify-center gap-3 shadow-inner rounded-xl">
               <Sparkles className="w-6 h-6" /> {receipt.rewards.mutation}
             </div>
          )}

          <div className="text-center mb-10">
            <div className="text-sm font-black uppercase tracking-widest text-gray-500 mb-3">CLAIM STATUS</div>
            {receipt.claimed ? (
               <div className="font-black text-xl text-gray-500 border-4 border-gray-400 py-4 bg-gray-300 flex items-center justify-center gap-3 rounded-xl">
                 <CheckCircle2 className="w-6 h-6" /> SETTLED
               </div>
            ) : (
               <div className="font-black text-xl text-secondary border-4 border-secondary py-4 bg-blue-100 animate-pulse rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                 PENDING CLAIM
               </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 relative z-10">
          {!receipt.claimed && (
            <Button 
              onClick={onClaim}
              className="btn-arcade btn-primary-arcade h-20 text-3xl w-full rounded-xl"
            >
               CLAIM REWARD
            </Button>
          )}
          <Button 
            variant="outline"
            onClick={onShare}
            className="btn-arcade bg-white border-gray-400 text-black hover:bg-gray-100 h-16 text-xl w-full rounded-xl"
          >
            <Share2 className="w-6 h-6 mr-3" /> SHARE TICKET
          </Button>
        </div>
      </div>

    </div>
  );
}
