import { Lock, Unlock, PlayCircle, Globe } from "lucide-react";

export default function Season() {
  const PHASES = [
    {
      id: "Preseason",
      title: "PRESEASON",
      desc: "Claim stadium, open starter pack, collect first cards.",
      status: "COMPLETED",
    },
    {
      id: "Kickoff",
      title: "KICKOFF",
      desc: "Stadium mining, pack opening, card upgrades.",
      status: "ACTIVE",
    },
    {
      id: "Mining Live",
      title: "MINING LIVE",
      desc: "Daily claims, Roar Power boosts, stadium upgrades.",
      status: "LOCKED",
    },
    {
      id: "Fever Live",
      title: "FEVER LIVE",
      desc: "Fever Board, Fan Formation, Match Receipts, mutation windows.",
      status: "LOCKED",
    },
    {
      id: "Final Run",
      title: "FINAL RUN",
      desc: "Leaderboard, season snapshot, rare cosmetics, token eligibility later.",
      status: "LOCKED",
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-10 items-start relative w-full">
      
      {/* Heavy Side Panel */}
      <div className="w-full lg:w-[400px] retro-panel bg-black p-10 rounded-3xl shrink-0 lg:sticky top-24 z-10 border-8 border-gray-800 shadow-[0_30px_60px_rgba(0,0,0,0.9)]">
        <div className="w-24 h-24 bg-accent/10 rounded-2xl flex items-center justify-center border-4 border-accent mb-8 shadow-[inset_0_0_20px_rgba(234,179,8,0.3),0_0_30px_rgba(234,179,8,0.4)] rotate-3">
          <Globe className="w-12 h-12 text-accent" />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-widest text-white mb-6 leading-tight drop-shadow-md">
          GLOBAL SEASON ZERO
        </h2>
        <p className="text-lg font-mono text-gray-300 mb-10 bg-gray-900 p-6 border-4 border-gray-700 rounded-xl shadow-inner leading-relaxed">
          Game first. Token later. Every match creates heat. Your stadium captures it. Progress through phases to unlock the full ecosystem.
        </p>

        <div className="border-t-8 border-gray-800 pt-8">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-6 bg-gray-900 inline-block px-4 py-2 rounded-lg border-2 border-gray-700 shadow-inner">LOCKED SYSTEMS</h3>
          <ul className="flex flex-col gap-4 font-mono text-base text-gray-400">
            {["Marketplace", "Token Claim", "Live API", "Premium Events"].map(f => (
              <li key={f} className="flex items-center gap-4 bg-gray-950 px-5 py-4 rounded-xl border-4 border-gray-800 shadow-md">
                <Lock className="w-5 h-5 text-gray-600" /> {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Epic Map */}
      <div className="flex-1 retro-panel bg-gradient-to-b from-blue-950 via-gray-900 to-black p-10 md:p-16 relative overflow-hidden rounded-3xl border-8 border-gray-800 shadow-[0_40px_80px_rgba(0,0,0,0.9)] w-full">
        
        <div className="absolute inset-0 bg-stadium-atmosphere opacity-60 pointer-events-none" />
        
        {/* Massive Background visual map connection line */}
        <div className="absolute top-20 bottom-20 left-16 md:left-32 w-12 bg-black border-x-8 border-gray-800 rounded-full shadow-inner z-0" />
        
        <div className="flex flex-col gap-24 relative z-10">
          {PHASES.map((p, i) => (
            <div key={p.id} className="flex items-center gap-8 md:gap-16 group">
              
              {/* Giant Node */}
              <div className="relative shrink-0 flex items-center justify-center z-10">
                <div className="absolute inset-0 bg-white/5 blur-xl rounded-full scale-150" />
                <div className={`w-28 h-28 rounded-3xl border-[12px] flex items-center justify-center transform rotate-45 transition-all duration-500 group-hover:scale-110 shadow-2xl relative ${
                  p.status === "COMPLETED" ? "bg-blue-900 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.4)]" :
                  p.status === "ACTIVE" ? "bg-primary border-white shadow-[0_0_50px_rgba(34,197,94,0.8)]" :
                  "bg-black border-gray-800"
                }`}>
                  <div className="transform -rotate-45">
                    {p.status === "COMPLETED" ? <Unlock className="w-10 h-10 text-white drop-shadow-md" /> :
                     p.status === "ACTIVE" ? <PlayCircle className="w-12 h-12 text-black animate-pulse" /> :
                     <Lock className="w-10 h-10 text-gray-600" />}
                  </div>
                </div>
                
                {/* Thick Connection line to content */}
                <div className="absolute left-28 right-0 w-12 md:w-24 h-4 bg-white/20 -z-10 translate-x-2 rounded-r" />
              </div>

              {/* Massive Content Panel */}
              <div className={`flex-1 border-[6px] p-10 rounded-3xl transition-all duration-500 transform group-hover:translate-x-4 shadow-2xl ${
                p.status === "ACTIVE" ? "bg-black border-primary shadow-[0_0_40px_rgba(34,197,94,0.3)] scale-105" :
                p.status === "COMPLETED" ? "bg-gray-900 border-blue-800 opacity-90" :
                "bg-black/60 border-gray-800 opacity-50 backdrop-blur-sm"
              }`}>
                <span className={`text-sm font-black px-4 py-2 rounded uppercase tracking-widest inline-block mb-4 border-4 shadow-inner ${
                  p.status === "COMPLETED" ? "text-blue-200 border-blue-700 bg-blue-950" :
                  p.status === "ACTIVE" ? "text-black border-primary bg-primary shadow-[0_0_15px_rgba(34,197,94,0.6)]" :
                  "text-gray-500 border-gray-700 bg-black"
                }`}>
                  {p.status}
                </span>
                <h3 className={`text-4xl md:text-5xl font-black uppercase tracking-widest mb-4 leading-none ${
                  p.status === "ACTIVE" ? "text-white drop-shadow-[0_4px_10px_rgba(255,255,255,0.5)]" : "text-gray-400"
                }`}>
                  {p.title}
                </h3>
                <p className={`text-xl font-mono leading-relaxed ${p.status === 'ACTIVE' ? 'text-gray-300' : 'text-gray-500'}`}>
                  {p.desc}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
