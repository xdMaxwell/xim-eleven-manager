import { Lock, Unlock, PlayCircle, Trophy } from "lucide-react";

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
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-start relative">
      
      {/* Side Panel */}
      <div className="w-full md:w-80 retro-panel bg-black p-8 rounded-2xl shrink-0 sticky top-24 z-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center border-4 border-accent mb-6 shadow-[0_0_20px_rgba(234,179,8,0.5)]">
          <Trophy className="w-10 h-10 text-accent" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-widest text-white mb-4 leading-none">
          TOURNAMENT BRACKET
        </h2>
        <p className="text-base font-mono text-gray-300 mb-8 bg-gray-900 p-4 border-2 border-gray-700 rounded-lg shadow-inner">
          Game first. Token later. Every match creates heat. Your stadium captures it.
        </p>

        <div className="border-t-4 border-gray-800 pt-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 bg-gray-900 inline-block px-3 py-1 rounded">LOCKED SYSTEMS</h3>
          <ul className="flex flex-col gap-3 font-mono text-sm text-gray-400">
            {["Marketplace", "Token Claim", "Live API", "Premium Events"].map(f => (
              <li key={f} className="flex items-center gap-3 bg-black px-4 py-3 rounded-lg border-2 border-gray-800">
                <Lock className="w-4 h-4 text-gray-600" /> {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Map */}
      <div className="flex-1 retro-panel bg-blue-950 p-8 md:p-12 relative overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        
        {/* Background visual map connection line */}
        <div className="absolute top-16 bottom-16 left-12 md:left-24 w-8 bg-black border-x-4 border-blue-900 rounded-full shadow-inner" />
        
        <div className="flex flex-col gap-16 relative z-10">
          {PHASES.map((p, i) => (
            <div key={p.id} className="flex items-center gap-6 md:gap-12 group">
              
              {/* Node */}
              <div className="relative shrink-0 flex items-center justify-center z-10">
                <div className={`w-20 h-20 rounded-2xl border-8 flex items-center justify-center transform rotate-45 transition-all duration-300 group-hover:scale-110 ${
                  p.status === "COMPLETED" ? "bg-blue-800 border-blue-400" :
                  p.status === "ACTIVE" ? "bg-primary border-white shadow-[0_0_30px_rgba(34,197,94,0.8)]" :
                  "bg-black border-gray-800"
                }`}>
                  <div className="transform -rotate-45">
                    {p.status === "COMPLETED" ? <Unlock className="w-8 h-8 text-white drop-shadow-md" /> :
                     p.status === "ACTIVE" ? <PlayCircle className="w-10 h-10 text-black animate-pulse" /> :
                     <Lock className="w-8 h-8 text-gray-600" />}
                  </div>
                </div>
                
                {/* Connection line to content */}
                <div className="absolute left-20 right-0 w-8 md:w-16 h-2 bg-white/20 -z-10 translate-x-2 rounded-r" />
              </div>

              {/* Content Panel */}
              <div className={`flex-1 border-4 p-8 rounded-2xl transition-all duration-300 transform group-hover:translate-x-2 ${
                p.status === "ACTIVE" ? "bg-black border-primary shadow-[0_0_20px_rgba(34,197,94,0.3)]" :
                p.status === "COMPLETED" ? "bg-black border-blue-800 opacity-80" :
                "bg-black/50 border-gray-800 opacity-50"
              }`}>
                <span className={`text-xs font-black px-3 py-1 rounded-sm uppercase tracking-widest inline-block mb-3 border-2 ${
                  p.status === "COMPLETED" ? "text-blue-200 border-blue-600 bg-blue-900" :
                  p.status === "ACTIVE" ? "text-black border-primary bg-primary shadow-[0_0_10px_rgba(34,197,94,0.5)]" :
                  "text-gray-500 border-gray-700 bg-black"
                }`}>
                  {p.status}
                </span>
                <h3 className={`text-3xl font-black uppercase tracking-widest mb-2 ${
                  p.status === "ACTIVE" ? "text-white drop-shadow-[0_2px_5px_rgba(255,255,255,0.5)]" : "text-gray-400"
                }`}>
                  {p.title}
                </h3>
                <p className={`text-base font-mono ${p.status === 'ACTIVE' ? 'text-gray-300' : 'text-gray-500'}`}>
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
