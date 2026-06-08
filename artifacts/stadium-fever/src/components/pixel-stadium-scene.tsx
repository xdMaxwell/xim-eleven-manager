const BANNER_COLORS = ["#22d3ee", "#fbbf24", "#ef4444", "#22c55e", "#8b5cf6", "#22d3ee", "#fbbf24", "#ef4444", "#22c55e", "#8b5cf6", "#22d3ee", "#fbbf24"];
const STAR_COUNT = 46;

export function PixelStadiumScene({ level, pulse }: { level: number; pulse: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden select-none" style={{ imageRendering: "pixelated" }}>
      {/* Night sky */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,#06122a 0%,#0c2b54 34%,#123a63 52%,#0a1f3a 72%,#05101e 100%)" }} />

      {/* Stars */}
      {Array.from({ length: STAR_COUNT }).map((_, i) => (
        <div
          key={`s${i}`}
          className="absolute bg-white hq-twinkle"
          style={{
            width: i % 4 === 0 ? 3 : 2,
            height: i % 4 === 0 ? 3 : 2,
            left: `${(i * 37) % 100}%`,
            top: `${(i * 23) % 30}%`,
            animationDelay: `${(i % 6) * 0.3}s`,
          }}
        />
      ))}

      {/* Moon */}
      <div className="absolute right-[13%] top-[4%] w-9 h-9 bg-[#f4f1c9] border-4 border-[#cfc89a]" style={{ boxShadow: "0 0 40px 10px rgba(244,241,201,0.25)" }} />

      {/* Floodlight towers (back pair) */}
      <Floodlight pos="left-[7%] top-[1%]" />
      <Floodlight pos="right-[7%] top-[1%]" />

      {/* Stadium bowl / stands */}
      <div
        className="absolute left-[3%] right-[3%] top-[14%] h-[50%]"
        style={{ clipPath: "polygon(12% 0, 88% 0, 100% 100%, 0% 100%)" }}
      >
        {/* Upper rim */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,#0a1530 0%,#15233f 16%,#1b2c4d 100%)" }} />
        {/* Crowd dot layers */}
        <CrowdLayer color="#67e8f9" pos="6px 4px" delay="0s" opacity={0.55} />
        <CrowdLayer color="#fcd34d" pos="2px 9px" delay="0.15s" opacity={0.5} />
        <CrowdLayer color="#f87171" pos="9px 2px" delay="0.3s" opacity={0.45} />
        <CrowdLayer color="#e5e7eb" pos="4px 7px" delay="0.22s" opacity={0.4} />
        {/* Vertical aisle dividers */}
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={`aisle${i}`} className="absolute top-0 bottom-0 w-[3px] bg-black/30" style={{ left: `${10 + i * 10}%` }} />
        ))}
        {/* Front rail */}
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-[#0a1530] border-t-4 border-[#33508a]" />
      </div>

      {/* Tunnel / gate entrance (far side, set into the rim) */}
      <div className="absolute left-1/2 top-[26%] -translate-x-1/2 z-10">
        <div className="w-12 h-7 bg-black border-4 border-[#33508a]" style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
      </div>

      {/* Banner rail with waving flags */}
      <div className="absolute left-[9%] right-[9%] top-[56%] flex justify-between z-10">
        {BANNER_COLORS.map((c, i) => (
          <div key={`b${i}`} className="flex flex-col items-center">
            <div className="w-[2px] h-3 bg-gray-500" />
            <div className="w-4 h-5 md:w-5 md:h-6 border-2 border-black hq-flag" style={{ backgroundColor: c, animationDelay: `${(i % 4) * 0.2}s` }} />
          </div>
        ))}
      </div>

      {/* Pitch (perspective trapezoid) — the hero */}
      <div
        className={`absolute left-1/2 top-[30%] w-[62%] h-[64%] -translate-x-1/2 border-4 border-white/80 ${pulse ? "hq-pulse-ring" : ""}`}
        style={{
          clipPath: "polygon(20% 0, 80% 0, 100% 100%, 0% 100%)",
          background: "repeating-linear-gradient(to bottom,#1fa83f 0px,#1fa83f 18px,#178a33 18px,#178a33 36px)",
        }}
      >
        {/* Far goal */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[24%] h-[9%] border-4 border-white/80 border-t-0" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-white" />
        {/* Near goal */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[14%] border-4 border-white/80 border-b-0" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-white" />
        {/* Halfway line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/70" />
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[24%] aspect-square border-4 border-white/70 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white" />
      </div>

      {/* Ball on pitch */}
      <div className="absolute left-[47%] top-[66%] z-10 hq-bob">
        <div className="w-3 h-3 bg-white border-2 border-black" />
        <div className="w-3 h-1 bg-black/40 mt-px" />
      </div>

      {/* Cones */}
      <Cone pos="left-[30%] top-[84%]" />
      <Cone pos="right-[30%] top-[84%]" />
      <Cone pos="left-[42%] top-[90%]" />

      {/* Dugout bench prop on the touchline */}
      <div className="absolute right-[8%] top-[84%] z-10">
        <div className="w-16 h-2 bg-[#7c4a21] border-2 border-black" />
        <div className="flex justify-between w-16">
          <div className="w-2 h-3 bg-[#5a3517] border-2 border-black" />
          <div className="w-2 h-3 bg-[#5a3517] border-2 border-black" />
        </div>
      </div>

      {/* Crate prop */}
      <div className="absolute left-[8%] top-[85%] w-6 h-6 bg-[#a16207] border-4 border-black z-10" style={{ backgroundImage: "linear-gradient(45deg,transparent 45%,rgba(0,0,0,0.4) 45%,rgba(0,0,0,0.4) 55%,transparent 55%)" }} />

      {/* Scoreboard sign */}
      <div className="absolute left-1/2 top-[2%] -translate-x-1/2 z-20">
        <div className="bg-[#08111f] border-4 border-white px-3 py-2 text-center" style={{ boxShadow: "4px 4px 0 #000" }}>
          <div className="font-mono text-[8px] text-secondary mb-1">NIGHT MATCH</div>
          <div className="flex items-center justify-center gap-2 font-mono text-lg text-accent">
            <span>00</span>
            <span className="hq-colon text-white">:</span>
            <span>00</span>
          </div>
          <div className="font-mono text-[7px] text-destructive mt-1">STADIUM LVL {level}</div>
        </div>
        <div className="w-1 h-4 bg-gray-600 mx-auto" />
      </div>

      {/* Floodlight towers (front pair, taller) */}
      <Floodlight pos="left-[1%] bottom-[2%]" front />
      <Floodlight pos="right-[1%] bottom-[2%]" front />

      {/* Ground / grass foreground texture */}
      <div className="absolute bottom-0 left-0 right-0 h-[7%]" style={{ background: "repeating-linear-gradient(90deg,#0f3d1c 0px,#0f3d1c 6px,#0c3318 6px,#0c3318 12px)" }} />
    </div>
  );
}

function CrowdLayer({ color, pos, delay, opacity }: { color: string; pos: string; delay: string; opacity: number }) {
  return (
    <div
      className="absolute inset-0 hq-flicker"
      style={{
        opacity,
        backgroundImage: `radial-gradient(${color} 38%, transparent 42%)`,
        backgroundSize: "8px 8px",
        backgroundPosition: pos,
        animationDelay: delay,
      }}
    />
  );
}

function Floodlight({ pos, front }: { pos: string; front?: boolean }) {
  const poleH = front ? "h-24 md:h-32" : "h-12 md:h-16";
  return (
    <div className={`absolute ${pos} z-10 flex flex-col items-center`}>
      {/* Light box */}
      <div className="relative bg-[#1b2535] border-4 border-black p-1 grid grid-cols-3 gap-px">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-2 h-2 bg-[#ffe066] hq-light" style={{ animationDelay: `${(i % 3) * 0.2}s` }} />
        ))}
        {/* Beam */}
        <div
          className="absolute left-1/2 top-full -translate-x-1/2 hq-beam"
          style={{
            width: 0,
            height: 0,
            borderLeft: "26px solid transparent",
            borderRight: "26px solid transparent",
            borderTop: "64px solid rgba(255,224,102,0.35)",
          }}
        />
      </div>
      {/* Pole */}
      <div className={`w-2 ${poleH} bg-[#2a3850] border-x-2 border-black`} />
      <div className="w-6 h-2 bg-[#1b2535] border-2 border-black" />
    </div>
  );
}

function Cone({ pos }: { pos: string }) {
  return (
    <div className={`absolute ${pos} z-10 flex flex-col items-center`}>
      <div className="w-0 h-0" style={{ borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderBottom: "8px solid #f97316" }} />
      <div className="w-3 h-1 bg-[#c2410c] border border-black" />
    </div>
  );
}
