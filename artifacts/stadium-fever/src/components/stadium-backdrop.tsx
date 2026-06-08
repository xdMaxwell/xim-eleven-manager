interface StadiumBackdropProps {
  className?: string;
  intensity?: number;
  pulse?: boolean;
}

function Floodlight({ side }: { side: "left" | "right" }) {
  const x = side === "left" ? "left-[8%]" : "right-[8%]";
  const beam = side === "left" ? "origin-top-left -rotate-12" : "origin-top-right rotate-12";
  return (
    <div className={`absolute top-0 ${x} z-10`}>
      <div className="relative flex flex-col items-center">
        <div className="grid grid-cols-3 gap-0.5 p-1 rounded-md bg-[#0b1424] border border-white/20 shadow-lg">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-[2px] bg-amber-100 anim-beacon" style={{ animationDelay: `${i * 0.12}s`, boxShadow: "0 0 8px rgba(255,240,200,0.9)" }} />
          ))}
        </div>
        <div className="w-1.5 h-16 bg-gradient-to-b from-[#1a2740] to-[#0a1120]" />
        <div className={`absolute top-6 w-40 h-[60vh] ${beam} anim-sweep`} style={{ background: "linear-gradient(to bottom, rgba(255,244,214,0.22), transparent 70%)", filter: "blur(8px)" }} />
      </div>
    </div>
  );
}

export function StadiumBackdrop({ className, intensity = 1, pulse }: StadiumBackdropProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${pulse ? "anim-stadium-pulse" : ""} ${className || ""}`}>
      {/* night sky */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#04070f 0%,#081226 45%,#0a1830 70%,#05101f 100%)" }} />
      {/* ambient color glows */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[80%] h-72 rounded-full blur-[80px] anim-crowd" style={{ background: "rgba(56,160,255,0.18)", opacity: 0.4 * intensity }} />
      <div className="absolute top-10 left-0 w-1/2 h-64 rounded-full blur-[90px]" style={{ background: "rgba(34,211,120,0.15)", opacity: 0.5 * intensity }} />
      <div className="absolute top-10 right-0 w-1/2 h-64 rounded-full blur-[90px]" style={{ background: "rgba(245,158,11,0.12)", opacity: 0.5 * intensity }} />

      <Floodlight side="left" />
      <Floodlight side="right" />

      {/* upper crowd tiers */}
      <div className="absolute top-[18%] left-0 right-0 h-[34%] anim-crowd" style={{
        background: "repeating-linear-gradient(90deg, rgba(120,140,170,0.10) 0 3px, transparent 3px 7px), repeating-linear-gradient(0deg, rgba(90,110,150,0.12) 0 4px, transparent 4px 12px)",
        maskImage: "linear-gradient(180deg, transparent, #000 30%, #000 70%, transparent)",
        WebkitMaskImage: "linear-gradient(180deg, transparent, #000 30%, #000 70%, transparent)",
      }} />

      {/* pitch */}
      <div className="absolute bottom-0 left-0 right-0 h-[46%]" style={{ perspective: "700px" }}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[160%] h-full pitch-stripes" style={{ transform: "rotateX(62deg)", transformOrigin: "bottom center", boxShadow: "0 -30px 80px rgba(34,211,120,0.25)" }}>
          {/* pitch markings */}
          <div className="absolute inset-x-[18%] inset-y-[10%] border-2 border-white/35 rounded-sm" />
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-white/35" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-white/35" />
        </div>
        {/* pitch fade to crowd */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,18,38,0.85), transparent 40%)" }} />
      </div>

      {/* vignette */}
      <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 180px 40px rgba(0,0,0,0.7)" }} />
    </div>
  );
}
