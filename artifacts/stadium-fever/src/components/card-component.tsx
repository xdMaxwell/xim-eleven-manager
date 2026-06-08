import { CountryCard } from "../lib/constants";
import { Zap, Flame, Target, Star, ShieldAlert } from "lucide-react";
import { cn } from "../lib/utils";

interface CardComponentProps {
  card: CountryCard;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

function renderEmblem(color: string, rarity: string) {
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-80 z-0 drop-shadow-2xl mix-blend-screen">
      <div 
        className="absolute w-2/3 h-2/3 rounded-full blur-2xl opacity-60"
        style={{ backgroundColor: color }}
      />
      {rarity === "Common" && (
        <svg viewBox="0 0 100 100" className="w-1/2 h-1/2 relative z-10 opacity-90 drop-shadow-lg">
          <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="8" strokeDasharray="10 5" />
        </svg>
      )}
      {rarity === "Rare" && (
        <svg viewBox="0 0 100 100" className="w-1/2 h-1/2 relative z-10 opacity-90 drop-shadow-lg">
          <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="white" strokeWidth="8" />
        </svg>
      )}
      {rarity === "Epic" && (
        <svg viewBox="0 0 100 100" className="w-1/2 h-1/2 relative z-10 opacity-90 drop-shadow-lg">
          <polygon points="50,10 90,90 10,90" fill="none" stroke="white" strokeWidth="10" strokeLinejoin="round" />
          <circle cx="50" cy="65" r="10" fill="white" />
        </svg>
      )}
      {rarity === "Mythic" && (
        <svg viewBox="0 0 100 100" className="w-2/3 h-2/3 relative z-10 opacity-90 drop-shadow-lg">
          <polygon points="50,5 61,40 98,40 68,62 79,98 50,75 21,98 32,62 2,40 39,40" fill="none" stroke="white" strokeWidth="6" strokeLinejoin="round" />
          <circle cx="50" cy="50" r="8" fill="white" />
        </svg>
      )}
    </div>
  );
}

export function CardComponent({ card, selected, onClick, className, size = "md" }: CardComponentProps) {
  const { name, color, rarity, level, stats, mutated } = card;

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform border-4 group bg-black",
        selected ? "border-primary scale-105 shadow-[0_0_20px_rgba(34,197,94,0.6)] z-10" : "border-gray-800 hover:border-gray-500 hover:scale-[1.02]",
        size === "sm" ? "w-36 h-56" : size === "md" ? "w-48 h-72" : "w-64 h-96",
        className
      )}
    >
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black z-0" />
      <div 
        className="absolute inset-0 opacity-40 z-0" 
        style={{ background: `linear-gradient(135deg, ${color} 0%, transparent 60%)` }} 
      />
      <div className="absolute inset-0 pack-foil opacity-30 mix-blend-color-dodge z-20 pointer-events-none" />

      {/* Top Bar: Rarity Ribbon & Level */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-black/60 border-b-2 border-white/10 z-10 flex justify-between items-center px-2">
        <div className="flex flex-col">
          <span className={cn(
            "text-[9px] font-black uppercase tracking-widest leading-none",
            rarity === "Common" && "text-gray-400",
            rarity === "Rare" && "text-blue-400",
            rarity === "Epic" && "text-purple-400",
            rarity === "Mythic" && "text-yellow-400 glow-text"
          )}>
            {rarity}
          </span>
          <span className="text-[8px] text-white/50 uppercase tracking-widest font-mono">Edition</span>
        </div>
        <div className="bg-white text-black px-2 py-0.5 rounded font-black text-xs border border-white">
          LVL {level}
        </div>
      </div>

      {/* Abstract Emblem Center */}
      <div className="absolute top-10 bottom-24 left-0 right-0 flex items-center justify-center border-b-2 border-white/10 bg-black/20">
        {renderEmblem(color, rarity)}
      </div>

      {/* Mutated Banner */}
      {mutated && (
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 bg-destructive text-destructive-foreground text-xs font-black uppercase tracking-widest py-1 flex justify-center items-center gap-1 z-30 shadow-lg border-y-2 border-black rotate-[-5deg] scale-110">
          <ShieldAlert className="w-4 h-4" /> Mutated
        </div>
      )}

      {/* Bottom Content (Name & Stats) */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/90 p-2 z-10 border-t-2 border-white/20">
        <h3 
          className={cn(
            "font-black uppercase tracking-widest text-center truncate px-1",
            size === "sm" ? "text-sm mb-1.5" : size === "md" ? "text-lg mb-2" : "text-xl mb-3"
          )}
          style={{ color, textShadow: `0 0 5px ${color}` }}
        >
          {name}
        </h3>
        
        {/* Arcade Stats Grid */}
        <div className="grid grid-cols-2 gap-1 gap-y-1.5 bg-black/50 p-1.5 rounded border border-white/5">
          <StatBox icon={<Zap />} label="ROAR" value={stats.roar} color="text-primary" size={size} />
          <StatBox icon={<Flame />} label="HEAT" value={stats.heat} color="text-destructive" size={size} />
          <StatBox icon={<Target />} label="FORM" value={stats.form} color="text-secondary" size={size} />
          <StatBox icon={<Star />} label="LUCK" value={stats.luck} color="text-accent" size={size} />
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value, color, size }: { icon: React.ReactNode, label: string, value: number, color: string, size: string }) {
  return (
    <div className="flex items-center gap-1">
      <div className={cn("shrink-0", color, size === "sm" ? "[&>svg]:w-3 [&>svg]:h-3" : "[&>svg]:w-4 [&>svg]:h-4")}>
        {icon}
      </div>
      <span className={cn("text-muted-foreground uppercase font-black", size === "sm" ? "text-[8px]" : "text-[10px]")}>{label}</span>
      <span className={cn("ml-auto font-mono font-bold text-white", size === "sm" ? "text-[10px]" : "text-xs")}>{value}</span>
    </div>
  );
}
