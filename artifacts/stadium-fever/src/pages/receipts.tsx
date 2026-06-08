import { useGameState } from "../lib/game-state";
import { useToast } from "../hooks/use-toast";
import { Receipt } from "../lib/game-state";
import { Link } from "wouter";
import { Receipt as ReceiptIcon, Trophy, Flame, Share2, Check, Lock, Activity, Zap, ShieldAlert } from "lucide-react";
import { CardComponent } from "../components/card-component";

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
      <div className="p-3 md:p-5 flex flex-col items-center justify-center min-h-[70vh] anim-reveal">
        <div className="glass-strong p-10 rounded-3xl max-w-md w-full text-center flex flex-col items-center relative overflow-hidden">
          {/* subtle glow behind icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 rounded-full blur-[60px]" />
          
          <ReceiptIcon className="w-16 h-16 text-muted-foreground mb-6 relative z-10" />
          <h2 className="display text-3xl text-white uppercase mb-3 relative z-10">No Records</h2>
          <p className="text-sm text-muted-foreground mb-8 relative z-10">Deploy formations in Fever Arena to generate match receipts.</p>
          <Link href="/fever" className="relative z-10 w-full block">
             <button className="btn btn-primary w-full text-lg py-4">Enter Fever</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-5 max-w-5xl mx-auto flex flex-col gap-6">
      <div className="glass px-5 py-4 rounded-2xl flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <ReceiptIcon className="w-6 h-6 text-primary" />
          <h2 className="display text-2xl text-white uppercase leading-none mt-1">Receipt Hall</h2>
        </div>
        <div className="chip border-primary/20 text-primary bg-primary/10">
          {receipts.length} Records
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {receipts.map((receipt, i) => (
          <div key={receipt.id} className="anim-reveal" style={{ animationDelay: `${i * 0.1}s` }}>
            <ReceiptCard 
              receipt={receipt} 
              onClaim={() => handleClaim(receipt.id)}
              onShare={handleShare}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ReceiptCard({ receipt, onClaim, onShare }: { receipt: Receipt, onClaim: () => void, onShare: () => void }) {
  const isSettled = receipt.claimed;
  
  return (
    <div className={`glass-strong rounded-3xl overflow-hidden relative flex flex-col lg:flex-row transition-all duration-300 ${isSettled ? 'opacity-70 grayscale-[0.3]' : 'glow-primary'}`}>
      {/* decorative receipt top edge pattern */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(255,255,255,0.1)_8px,rgba(255,255,255,0.1)_16px)]" />

      {/* left: match record details */}
      <div className="flex-1 p-5 md:p-6 lg:p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Match Record</div>
              {isSettled && <div className="chip bg-white/5 border-white/10 text-muted-foreground"><Check className="w-3 h-3" /> Settled</div>}
            </div>
            <h3 className="display text-2xl md:text-3xl uppercase text-white leading-none">{receipt.event}</h3>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">ID</div>
            <div className="num text-base md:text-lg bg-black/40 px-3 py-1 rounded-xl border border-white/5 text-white/80">{receipt.id.substring(2, 8)}</div>
          </div>
        </div>

        {/* Summary Row */}
        {receipt.summary && (
          <div className="rounded-2xl bg-black/20 border border-white/5 p-4 md:p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-primary">
                <Activity className="w-4 h-4" />
                <span>Match Summary</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Impact Grade</span>
                <div className={`display text-xl w-10 h-10 rounded-xl grid place-items-center border-2 ${getGradeColors(receipt.summary.matchImpactGrade)}`}>
                  {receipt.summary.matchImpactGrade}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
              <SummaryStat label="Stadium Output" value={`+${receipt.summary.stadiumOutput}`} suffix="PP" cls="text-primary" />
              <SummaryStat label="Roar Combo" value={`+${receipt.summary.roarCombo}`} suffix="%" cls="text-secondary" />
              <SummaryStat label="Heat Gained" value={`+${receipt.summary.heatGained}`} cls="text-destructive" />
              <SummaryStat label="Fatigue" value={`${receipt.summary.fatigue}`} cls="text-muted-foreground" />
              <SummaryStat
                label="Mutation Roll"
                value={receipt.summary.mutation}
                cls={receipt.summary.mutation === "Mutated" ? "text-purple-400" : receipt.summary.mutation === "Spark" ? "text-accent" : "text-muted-foreground"}
              />
            </div>
          </div>
        )}

        {/* Asset Impact */}
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
            <Trophy className="w-4 h-4" />
            <span>Asset Impact</span>
          </div>
          <div className="flex flex-wrap gap-4 md:gap-6">
            {receipt.formation.map(card => {
              const impact = receipt.cardImpact[card.id];
              return (
                <div key={card.id} className="flex flex-col items-center gap-3">
                  <div className="scale-[0.8] origin-top">
                    <CardComponent card={card} size="sm" tilt={false} />
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/40 rounded-lg px-2.5 py-1.5 border border-white/5 -mt-6 z-10 relative">
                    {impact.stat === "Heat" && <Flame className="w-3.5 h-3.5 text-destructive" />}
                    {impact.stat === "Form" && <Activity className="w-3.5 h-3.5 text-secondary" />}
                    {impact.stat === "Fatigue" && <ShieldAlert className="w-3.5 h-3.5 text-muted-foreground" />}
                    <span className={`num text-xs ${impact.change < 0 ? 'text-muted-foreground' : 'text-primary'}`}>
                      {impact.change > 0 ? '+' : ''}{impact.change}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* right: claim stub */}
      <div className="w-full lg:w-72 bg-gradient-to-br from-black/40 to-black/80 border-t md:border-t-0 md:border-l border-white/10 p-6 md:p-8 flex flex-col justify-center relative">
        <div className="absolute top-1/2 -left-[1px] w-2 h-8 -translate-y-1/2 bg-black border-r border-white/10 rounded-r-full hidden lg:block" />
        
        <div className="text-center mb-8">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">Total Output</div>
          <div className="display text-4xl text-primary text-glow-primary mb-1">+{receipt.rewards.pitchPoints}</div>
          <div className="num text-xs uppercase text-primary/60">Pitch Points</div>
        </div>
        
        <div className="flex flex-col gap-3">
          {!isSettled ? (
            <button onClick={onClaim} className="btn btn-primary py-4 text-lg w-full group relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-2"><Zap className="w-5 h-5" /> Claim</span>
              <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 bg-black/50 text-white/50 num text-sm text-center py-4 rounded-xl border border-white/5 uppercase tracking-widest">
              <Lock className="w-4 h-4" /> Settled
            </div>
          )}
          <button onClick={onShare} className="btn btn-ghost py-3 w-full text-xs">
            <Share2 className="w-4 h-4" /> Share Record
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryStat({ label, value, suffix, cls }: { label: string; value: string; suffix?: string; cls?: string }) {
  return (
    <div className="flex flex-col gap-1 p-2">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground leading-tight">{label}</div>
      <div className={`num text-lg md:text-xl leading-none ${cls || 'text-white'}`}>
        {value}
        {suffix && <span className="text-[10px] ml-0.5 opacity-60">{suffix}</span>}
      </div>
    </div>
  );
}

function getGradeColors(grade: string) {
  if (grade.startsWith("S")) return "border-accent text-accent bg-accent/10 shadow-[0_0_15px_rgba(245,158,11,0.3)]";
  if (grade.startsWith("A")) return "border-primary text-primary bg-primary/10 shadow-[0_0_15px_rgba(132,204,22,0.3)]";
  if (grade.startsWith("B")) return "border-secondary text-secondary bg-secondary/10 shadow-[0_0_15px_rgba(56,189,248,0.3)]";
  return "border-muted-foreground text-muted-foreground bg-white/5";
}
