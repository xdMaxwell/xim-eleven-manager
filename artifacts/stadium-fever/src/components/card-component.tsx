import { Rarity } from "../lib/constants";
import { getCardFrameAsset } from "../lib/assets";

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
  tilt?: boolean;
}

const RARITY: Record<Rarity, { frame: string; tag: string; glow: string; sheen: string }> = {
  Common: { frame: getCardFrameAsset("Common"), tag: "#a3ff5f", glow: "rgba(57,255,20,0.42)", sheen: "rgba(57,255,20,0.16)" },
  Rare: { frame: getCardFrameAsset("Rare"), tag: "#7dd3fc", glow: "rgba(0,229,255,0.55)", sheen: "rgba(0,229,255,0.2)" },
  Epic: { frame: getCardFrameAsset("Epic"), tag: "#fbbf24", glow: "rgba(255,154,0,0.56)", sheen: "rgba(255,154,0,0.2)" },
  Mythic: { frame: getCardFrameAsset("Mythic"), tag: "#d8b4fe", glow: "rgba(168,85,247,0.68)", sheen: "rgba(168,85,247,0.24)" },
};

const SIZES = {
  sm: { w: "w-36", h: "h-52", crest: 64, name: "text-[11px]", lvl: "text-lg", stat: "text-[11px]" },
  md: { w: "w-44", h: "h-64", crest: 84, name: "text-sm", lvl: "text-xl", stat: "text-xs" },
  lg: { w: "w-60", h: "h-[22rem]", crest: 120, name: "text-lg", lvl: "text-3xl", stat: "text-sm" },
};

function Crest({ color, rarity, size }: { color: string; rarity: Rarity; size: number }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 100 116" className="drop-shadow-[0_6px_14px_rgba(0,0,0,0.5)]">
      <defs>
        <linearGradient id={`g-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.95" />
          <stop offset="1" stopColor="#0b1220" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path d="M50 2 L94 16 V60 C94 88 74 104 50 114 C26 104 6 88 6 60 V16 Z" fill={`url(#g-${color})`} stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" />
      <path d="M50 2 L94 16 V60 C94 88 74 104 50 114 C26 104 6 88 6 60 V16 Z" fill="none" stroke={color} strokeWidth="1" opacity="0.8" />
      {/* vertical accents */}
      <rect x="38" y="14" width="6" height="86" fill="rgba(255,255,255,0.18)" />
      <rect x="56" y="14" width="6" height="86" fill="rgba(0,0,0,0.18)" />
      {/* rarity motif */}
      {rarity === "Common" && <rect x="40" y="48" width="20" height="20" fill="#fff" opacity="0.92" rx="3" />}
      {rarity === "Rare" && <circle cx="50" cy="56" r="13" fill="#fff" opacity="0.92" />}
      {rarity === "Epic" && <path d="M50 40 L62 62 L38 62 Z" fill="#fff" opacity="0.94" />}
      {rarity === "Mythic" && <path d="M50 38 l4 12 13 0 -10 8 4 13 -11 -8 -11 8 4 -13 -10 -8 13 0 z" fill="#fff" opacity="0.96" />}
    </svg>
  );
}

export function CardComponent({ card, selected, onClick, className, size = "md", tilt = true }: CardComponentProps) {
  const { name, color, rarity, level, stats, mutated } = card;
  const r = RARITY[rarity];
  const s = SIZES[size];

  return (
    <div
      onClick={onClick}
      className={`fcard xim-card fcard-shine ${tilt ? "fcard-tilt" : ""} ${s.w} ${s.h} ${onClick ? "cursor-pointer" : ""} ${selected ? "ring-2 ring-white -translate-y-1.5" : ""} ${className || ""}`}
      data-rarity={rarity.toLowerCase()}
      style={{ boxShadow: selected ? `0 0 0 2px #fff, 0 0 52px -4px ${r.glow}` : `0 24px 50px -22px rgba(0,0,0,0.85), 0 0 36px -16px ${r.glow}` }}
    >
      <img className="xim-card-frame-art" src={r.frame} alt="" aria-hidden="true" />
      <div className="xim-card-overlay" style={{ background: `radial-gradient(96% 58% at 50% 23%, ${r.sheen}, transparent 66%)` }} />
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-3/4 h-24 blur-2xl opacity-45" style={{ background: color }} />

      <div className="xim-card-content">
        <div className="xim-card-header">
          <div className="leading-none">
            <div className={`num ${s.lvl} text-white leading-none`}>{level.toString().padStart(2, "0")}</div>
            <div className="text-[9px] uppercase tracking-widest" style={{ color: r.tag }}>{rarity}</div>
          </div>
          <div className="w-6 h-6 rounded-full border border-white/40 grid place-items-center" style={{ background: `${color}33` }}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
          </div>
        </div>

        <div className="xim-card-crest">
          <Crest color={color} rarity={rarity} size={s.crest} />
        </div>

        {mutated && (
          <div className="xim-card-mutated" style={{ background: "linear-gradient(90deg,transparent,rgba(139,92,246,0.95),transparent)" }}>
            Mutated
          </div>
        )}

        <div className="xim-card-nameplate">
          <h3 className={`display ${s.name} text-center uppercase truncate text-white`}>{name}</h3>
        </div>

        <div className="xim-card-stat-grid">
          <Stat label="ROA" value={stats.roar} cls="text-primary" size={s.stat} />
          <Stat label="FRM" value={stats.form} cls="text-secondary" size={s.stat} />
          <Stat label="HET" value={stats.heat} cls="text-destructive" size={s.stat} />
          <Stat label="LCK" value={stats.luck} cls="text-accent" size={s.stat} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, cls, size }: { label: string; value: number; cls: string; size: string }) {
  return (
    <div className="rounded-md bg-white/5 border border-white/10 px-1 py-0.5 text-center">
      <div className="text-[8px] text-white/45 uppercase leading-none">{label}</div>
      <div className={`num ${size} ${cls} leading-tight`}>{value}</div>
    </div>
  );
}
