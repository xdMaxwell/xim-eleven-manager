import { Rarity } from "../lib/constants";

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

function renderPixelEmblem(color: string, rarity: string) {
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-90 z-0">
      <div 
        className="w-16 h-16 md:w-20 md:h-20 border-4 border-white shadow-[4px_4px_0px_#000]"
        style={{ backgroundColor: color }}
      >
        <div className="w-full h-full flex flex-col">
          {rarity === "Common" && <div className="m-auto w-8 h-8 bg-white border-2 border-black" />}
          {rarity === "Rare" && <div className="m-auto w-10 h-10 bg-white border-2 border-black rounded-full" />}
          {rarity === "Epic" && <div className="m-auto w-0 h-0 border-l-[15px] border-l-transparent border-b-[25px] border-b-white border-r-[15px] border-r-transparent" />}
          {rarity === "Mythic" && <div className="m-auto w-10 h-10 bg-white border-4 border-black rotate-45" />}
        </div>
      </div>
    </div>
  );
}

export function CardComponent({ card, selected, onClick, className, size = "md" }: CardComponentProps) {
  const { name, color, rarity, level, stats, mutated } = card;

  let sizeClasses = "w-40 h-64";
  if (size === "sm") sizeClasses = "w-32 h-48";
  if (size === "lg") sizeClasses = "w-56 h-80";

  return (
    <div
      onClick={onClick}
      className={`relative bg-black cursor-pointer pixel-panel ${
        selected ? "border-secondary translate-y-[-4px] shadow-[4px_8px_0px_rgba(0,0,0,1)] z-10" : ""
      } ${sizeClasses} ${className || ""}`}
    >
      {/* Pixel Art Background */}
      <div className="absolute inset-0 z-0 opacity-80" style={{ backgroundColor: color }} />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.2)_0px,rgba(0,0,0,0.2)_4px,transparent_4px,transparent_8px)] z-0" />
      
      {/* Header */}
      <div className="absolute top-0 inset-x-0 h-10 bg-black border-b-4 border-white z-10 flex justify-between items-center px-2">
        <span className={`text-[10px] font-mono uppercase ${
          rarity === "Common" ? "text-gray-400" :
          rarity === "Rare" ? "text-blue-400" :
          rarity === "Epic" ? "text-purple-400" : "text-yellow-400"
        }`}>
          {rarity}
        </span>
        <div className="bg-white text-black px-1 py-0.5 font-mono text-[8px] border-2 border-black">
          LVL {level}
        </div>
      </div>

      {/* Graphic Center */}
      <div className="absolute inset-y-10 inset-x-0 flex items-center justify-center">
        {renderPixelEmblem(color, rarity)}
      </div>

      {/* Mutation Ribbon */}
      {mutated && (
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 bg-purple-600 text-white text-[10px] font-mono uppercase py-1 text-center z-30 border-y-4 border-white shadow-[4px_4px_0px_#000]">
          MUTATED
        </div>
      )}

      {/* Footer / Stats */}
      <div className="absolute bottom-0 inset-x-0 bg-black p-2 z-10 border-t-4 border-white">
        <h3 className="font-mono uppercase text-center truncate mb-2 text-white text-xs" style={{ color }}>
          {name}
        </h3>
        
        <div className="grid grid-cols-2 gap-1">
          <StatBox label="ROAR" value={stats.roar} color="text-primary" />
          <StatBox label="HEAT" value={stats.heat} color="text-destructive" />
          <StatBox label="FORM" value={stats.form} color="text-secondary" />
          <StatBox label="LUCK" value={stats.luck} color="text-accent" />
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="flex items-center gap-1 bg-gray-900 border-2 border-gray-700 p-0.5">
      <span className="text-[8px] text-gray-400 uppercase font-mono">{label.substring(0,1)}</span>
      <span className={`ml-auto font-mono text-[10px] ${color}`}>{value}</span>
    </div>
  );
}
