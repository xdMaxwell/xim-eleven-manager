import { Rarity } from "../lib/constants";
import { Zap, Flame, Target, Star, ShieldAlert } from "lucide-react";

interface CardComponentProps {
  card: {
    name: string;
    color: string;
    rarity: Rarity;
    level: number;
    stats: { roar: number; form: number; heat: number; luck: number };
    mutated?: boolean;
  };
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

function renderEmblem(color: string, rarity: string) {
  // Using pure CSS/SVG shapes for low-poly/emblem feel
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-90 z-0">
      <div 
        className="absolute w-3/4 h-3/4 rounded-full blur-3xl opacity-40"
        style={{ backgroundColor: color }}
      />
      {rarity === "Common" && (
        <svg viewBox="0 0 100 100" className="w-1/2 h-1/2 drop-shadow-xl">
          <rect x="25" y="25" width="50" height="50" fill="none" stroke="white" strokeWidth="8" transform="rotate(45 50 50)" />
        </svg>
      )}
      {rarity === "Rare" && (
        <svg viewBox="0 0 100 100" className="w-1/2 h-1/2 drop-shadow-xl">
          <polygon points="50,10 90,50 50,90 10,50" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="6" />
          <circle cx="50" cy="50" r="15" fill="white" />
        </svg>
      )}
      {rarity === "Epic" && (
        <svg viewBox="0 0 100 100" className="w-2/3 h-2/3 drop-shadow-xl">
          <polygon points="50,5 95,30 95,70 50,95 5,70 5,30" fill="none" stroke="white" strokeWidth="8" />
          <polygon points="50,25 75,40 75,60 50,75 25,60 25,40" fill="white" />
        </svg>
      )}
      {rarity === "Mythic" && (
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 drop-shadow-xl">
          <path d="M50 0 L60 35 L95 35 L65 55 L75 90 L50 70 L25 90 L35 55 L5 35 L40 35 Z" fill="white" fillOpacity="0.8" stroke="white" strokeWidth="4" />
        </svg>
      )}
    </div>
  );
}

export function CardComponent({ card, selected, onClick, className, size = "md" }: CardComponentProps) {
  const { name, color, rarity, level, stats, mutated } = card;

  let sizeClasses = "w-48 h-72";
  if (size === "sm") sizeClasses = "w-40 h-60";
  if (size === "lg") sizeClasses = "w-64 h-96";

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl overflow-hidden cursor-pointer bg-black border-4 ${
        selected ? "border-white shadow-[0_0_30px_rgba(255,255,255,0.5)] z-10" : "border-gray-800"
      } ${sizeClasses} ${className || ""}`}
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 opacity-80" style={{ background: `linear-gradient(160deg, ${color} 0%, black 80%)` }} />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.2)_2px,rgba(0,0,0,0.2)_4px)] z-0" />
      
      {/* Foil overlay for Rare+ */}
      {rarity !== "Common" && (
        <div className="absolute inset-0 card-foil opacity-40 mix-blend-color-dodge z-20 pointer-events-none" />
      )}

      {/* Header */}
      <div className="absolute top-0 inset-x-0 h-12 bg-black/60 border-b-4 border-black/50 z-10 flex justify-between items-center px-3 backdrop-blur-sm">
        <div className="flex flex-col">
          <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${
            rarity === "Common" ? "text-gray-400" :
            rarity === "Rare" ? "text-blue-400" :
            rarity === "Epic" ? "text-purple-400" : "text-yellow-400 glow-text"
          }`}>
            {rarity}
          </span>
          <span className="text-[8px] text-white/50 uppercase tracking-widest font-mono">EDITION</span>
        </div>
        <div className="bg-white text-black px-2 py-1 rounded-sm font-black text-xs border-2 border-black shadow-sm">
          LVL {level}
        </div>
      </div>

      {/* Graphic Center */}
      <div className="absolute inset-y-12 inset-x-0 flex items-center justify-center">
        {renderEmblem(color, rarity)}
      </div>

      {/* Mutation Ribbon */}
      {mutated && (
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 bg-purple-600 text-white text-xs font-black uppercase tracking-widest py-1.5 flex justify-center items-center gap-1 z-30 shadow-lg border-y-4 border-black rotate-[-10deg] scale-110">
          <ShieldAlert className="w-4 h-4" /> MUTATED
        </div>
      )}

      {/* Footer / Stats */}
      <div className="absolute bottom-0 inset-x-0 bg-black p-3 z-10 border-t-4 border-white/20 shadow-[0_-10px_20px_rgba(0,0,0,0.8)]">
        <h3 className="font-black uppercase tracking-widest text-center truncate mb-3 text-white drop-shadow-md text-lg" style={{ color }}>
          {name}
        </h3>
        
        <div className="grid grid-cols-2 gap-2">
          <StatBox icon={<Zap />} label="ROAR" value={stats.roar} color="text-primary" />
          <StatBox icon={<Flame />} label="HEAT" value={stats.heat} color="text-destructive" />
          <StatBox icon={<Target />} label="FORM" value={stats.form} color="text-secondary" />
          <StatBox icon={<Star />} label="LUCK" value={stats.luck} color="text-accent" />
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-gray-900 border-2 border-gray-800 p-1.5 rounded">
      <div className={`shrink-0 [&>svg]:w-3 [&>svg]:h-3 ${color}`}>
        {icon}
      </div>
      <span className="text-[9px] text-gray-400 uppercase font-black">{label}</span>
      <span className="ml-auto font-mono font-bold text-white text-xs">{value}</span>
    </div>
  );
}
