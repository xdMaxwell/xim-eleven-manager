import { useGameState } from "../lib/game-state";
import { useToast } from "../hooks/use-toast";
import { Receipt } from "../lib/game-state";
import { Link } from "wouter";
import { Ticket } from "lucide-react";

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
      <div className="flex flex-col gap-6 w-full pb-10 items-center justify-center min-h-[60vh]">
        <div className="pixel-panel p-10 max-w-lg text-center flex flex-col items-center">
          <Ticket className="w-16 h-16 text-gray-600 mb-6" style={{ imageRendering: "pixelated" }} />
          <h2 className="font-mono text-3xl text-white uppercase mb-4">Ticket Wall Empty</h2>
          <p className="font-mono text-sm text-gray-400 mb-8">Deploy formations in Fever Arena to generate tickets.</p>
          <Link href="/fever">
             <button className="pixel-btn pixel-btn-primary text-xl py-4 px-8 w-full">GO TO FEVER</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-10 max-w-4xl mx-auto">
      <div className="pixel-panel p-4 flex items-center justify-between">
        <h2 className="font-mono text-2xl text-white uppercase">Receipt Hall</h2>
        <div className="font-mono text-sm text-gray-400">{receipts.length} RECORDS</div>
      </div>

      <div className="flex flex-col gap-8">
        {receipts.map((receipt) => (
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
    <div className="flex flex-col md:flex-row pixel-panel border-0 bg-transparent">
      
      {/* Main Ticket Body */}
      <div className="flex-1 bg-white text-black p-6 border-[6px] border-black border-b-0 md:border-b-[6px] md:border-r-0 relative">
        <div className="absolute top-0 left-0 w-full h-4 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,#ccc_8px,#ccc_16px)]" />
        
        <div className="flex justify-between border-b-4 border-black pb-4 mb-4 mt-4">
          <div>
            <div className="font-mono text-[10px] text-gray-500 mb-1">MATCH RECORD</div>
            <h3 className="font-mono text-2xl uppercase">{receipt.event}</h3>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] text-gray-500 mb-1">ID</div>
            <div className="font-mono text-lg bg-gray-200 px-2 py-1 border-2 border-black">{receipt.id.substring(2, 8)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="font-mono text-[10px] bg-black text-white px-2 py-1 inline-block mb-3">ASSETS</div>
            <div className="flex flex-col gap-2 font-mono text-sm">
              {receipt.formation.map(c => (
                <div key={c.id} className="flex justify-between border-b-2 border-dashed border-gray-300 pb-1">
                  <span className="uppercase">{c.name}</span>
                  <span>L{c.level}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="font-mono text-[10px] bg-black text-white px-2 py-1 inline-block mb-3">IMPACT</div>
            <div className="flex flex-col gap-2 font-mono text-sm">
              {Object.entries(receipt.cardImpact).map(([cardId, impact]) => {
                const card = receipt.formation.find(c => c.id === cardId);
                if (!card) return null;
                return (
                  <div key={cardId} className="flex justify-between border-b-2 border-dashed border-gray-300 pb-1">
                    <span className="uppercase truncate pr-2">{card.name}</span>
                    <span className={impact.change < 0 ? "text-red-600" : "text-green-600"}>
                      {impact.change > 0 ? '+' : ''}{impact.change} {impact.stat.substring(0,1)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stub */}
      <div className="w-full md:w-64 bg-gray-200 p-6 border-[6px] border-black border-t-4 border-dashed md:border-t-[6px] md:border-l-4 flex flex-col justify-between">
        <div className="text-center mb-6">
          <div className="font-mono text-[10px] text-gray-500 mb-2">OUTPUT</div>
          <div className="font-mono text-4xl text-primary text-shadow-sm">+{receipt.rewards.pitchPoints}</div>
          <div className="font-mono text-[10px] uppercase mt-1">PP</div>
        </div>
        
        <div className="flex flex-col gap-3">
          {!receipt.claimed ? (
            <button 
              onClick={onClaim}
              className="pixel-btn pixel-btn-primary py-3 text-lg w-full"
            >
              CLAIM
            </button>
          ) : (
            <div className="bg-black text-white font-mono text-center py-3 text-lg border-2 border-black">
              SETTLED
            </div>
          )}
          <button 
            onClick={onShare}
            className="pixel-btn bg-white text-black py-2 w-full text-sm"
          >
            SHARE
          </button>
        </div>
      </div>
    </div>
  );
}
