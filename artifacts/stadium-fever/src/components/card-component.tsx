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

export function CardComponent({ card, selected, onClick, className, size = "md" }: CardComponentProps) {
  const { name, color, rarity, level, stats, mutated } = card;

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform border-2 group",
        selected ? "border-primary glow-box scale-105" : "border-card-border hover:border-muted-foreground hover:scale-[1.02]",
        size === "sm" ? "w-32 h-48" : size === "md" ? "w-48 h-72" : "w-64 h-96",
        className
      )}
      style={{
        background: `linear-gradient(135deg, hsl(var(--card)), hsl(var(--card) / 0.8)), linear-gradient(to bottom, ${color}33, transparent)`,
      }}
    >
      {/* Background glow based on color */}
      <div 
        className="absolute top-0 left-0 right-0 h-1/2 opacity-30 group-hover:opacity-50 transition-opacity" 
        style={{ background: `radial-gradient(circle at top, ${color}, transparent 70%)` }} 
      />

      {/* Rarity & Level */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
        <span className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider",
          rarity === "Common" && "text-gray-400 border-gray-400/50 bg-gray-400/10",
          rarity === "Rare" && "text-blue-400 border-blue-400/50 bg-blue-400/10",
          rarity === "Epic" && "text-purple-400 border-purple-400/50 bg-purple-400/10",
          rarity === "Mythic" && "text-yellow-400 border-yellow-400/50 bg-yellow-400/10 glow-text"
        )}>
          {rarity}
        </span>
        <span className="text-xs font-black bg-black/60 px-1.5 py-0.5 rounded text-white border border-white/10">
          LVL {level}
        </span>
      </div>

      {/* Mutated Badge */}
      {mutated && (
        <div className="absolute top-8 left-2 z-10 flex items-center gap-1 bg-destructive/20 border border-destructive/50 text-destructive text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
          <ShieldAlert className="w-3 h-3" />
          Mutated
        </div>
      )}

      {/* Center abstract graphic */}
      <div className="absolute inset-0 flex items-center justify-center opacity-80 z-0">
        <div 
          className="w-1/2 h-1/2 rounded-full blur-xl"
          style={{ backgroundColor: color }}
        />
        <svg viewBox="0 0 100 100" className="absolute w-2/3 h-2/3 opacity-50 mix-blend-overlay">
          <polygon points="50,10 90,90 10,90" fill="none" stroke="white" strokeWidth="2" />
          <circle cx="50" cy="65" r="15" fill="none" stroke="white" strokeWidth="2" />
        </svg>
      </div>

      {/* Content wrapper */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent z-10">
        <h3 
          className={cn(
            "font-black uppercase tracking-widest text-center drop-shadow-md",
            size === "sm" ? "text-sm mb-1" : size === "md" ? "text-lg mb-2" : "text-2xl mb-4"
          )}
          style={{ color }}
        >
          {name}
        </h3>
        
        {/* Stats Grid */}
        <div className={cn(
          "grid grid-cols-2 gap-1.5",
          size === "sm" ? "text-[9px]" : size === "md" ? "text-[11px]" : "text-sm gap-2"
        )}>
          <div className="flex items-center gap-1 bg-black/40 px-1.5 py-1 rounded border border-white/5">
            <Zap className={cn("text-primary", size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4")} />
            <span className="text-muted-foreground uppercase">Roar</span>
            <span className="ml-auto font-bold text-white">{stats.roar}</span>
          </div>
          <div className="flex items-center gap-1 bg-black/40 px-1.5 py-1 rounded border border-white/5">
            <Flame className={cn("text-destructive", size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4")} />
            <span className="text-muted-foreground uppercase">Heat</span>
            <span className="ml-auto font-bold text-white">{stats.heat}</span>
          </div>
          <div className="flex items-center gap-1 bg-black/40 px-1.5 py-1 rounded border border-white/5">
            <Target className={cn("text-secondary", size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4")} />
            <span className="text-muted-foreground uppercase">Form</span>
            <span className="ml-auto font-bold text-white">{stats.form}</span>
          </div>
          <div className="flex items-center gap-1 bg-black/40 px-1.5 py-1 rounded border border-white/5">
            <Star className={cn("text-accent", size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4")} />
            <span className="text-muted-foreground uppercase">Luck</span>
            <span className="ml-auto font-bold text-white">{stats.luck}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
