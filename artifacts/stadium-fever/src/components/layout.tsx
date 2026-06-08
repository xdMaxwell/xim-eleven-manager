import { Link, useLocation } from "wouter";
import { useGameState } from "../lib/game-state";
import { 
  Trophy, 
  PackageOpen, 
  SquareAsterisk, 
  Activity, 
  Ticket, 
  Map 
} from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const state = useGameState();

  return (
    <div className="min-h-[100dvh] flex flex-col relative text-foreground">
      <div className="crt-overlay" />
      
      {/* TOP HUD - PS2 Broadcast Style */}
      <header className="w-full bg-blue-950/90 border-b-4 border-blue-900 shadow-xl flex flex-col z-20 shrink-0">
        <div className="flex flex-col md:flex-row items-center justify-between px-4 py-2 gap-2">
          
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black text-white italic tracking-tighter drop-shadow-md">
              <span className="text-primary">STADIUM</span> FEVER
            </h1>
            <div className="hidden md:flex bg-black/50 border-2 border-blue-900 px-3 py-1 rounded text-xs font-black uppercase text-blue-400">
              {state.phase}
            </div>
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto hide-scrollbar pb-1 md:pb-0">
            <ResourceBar label="PP" value={state.pitchPoints} color="bg-primary" textColor="text-primary" />
            <ResourceBar label="ROAR" value={state.roarPower} color="bg-accent" textColor="text-accent" />
            <ResourceBar label="HEAT" value={state.heat} color="bg-destructive" textColor="text-destructive" />
          </div>
        </div>

        {/* Ticker */}
        <div className="w-full bg-black border-y-2 border-white/10 py-1 overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black to-transparent z-10" />
          <div className="animate-marquee whitespace-nowrap text-yellow-400 font-bold uppercase tracking-widest text-xs">
            NIGHT MATCH FEVER LIVE • UNDERDOG NOISE ACTIVE • PACK DROP IN 02:14 • MORE FEATURES LOCKED • STADIUM OUTPUT MAXIMIZED •
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-32 relative">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* BOTTOM NAV - Chunky Console Tabs */}
      <nav className="fixed bottom-0 left-0 right-0 bg-blue-950 border-t-4 border-blue-400 z-30 p-2 md:p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 overflow-x-auto hide-scrollbar px-2">
          <NavTab href="/" icon={<Trophy className="w-6 h-6 md:w-8 md:h-8" />} label="Stadium" />
          <NavTab href="/packs" icon={<PackageOpen className="w-6 h-6 md:w-8 md:h-8" />} label="Packs" />
          <NavTab href="/locker" icon={<SquareAsterisk className="w-6 h-6 md:w-8 md:h-8" />} label="Locker" />
          <NavTab href="/fever" icon={<Activity className="w-6 h-6 md:w-8 md:h-8" />} label="Fever" />
          <NavTab href="/receipts" icon={<Ticket className="w-6 h-6 md:w-8 md:h-8" />} label="Receipts" />
          <NavTab href="/season" icon={<Map className="w-6 h-6 md:w-8 md:h-8" />} label="Season" />
        </div>
      </nav>
    </div>
  );
}

function ResourceBar({ label, value, color, textColor }: { label: string, value: number, color: string, textColor: string }) {
  return (
    <div className="flex items-center bg-black border-2 border-gray-700 rounded p-1 shadow-inner shrink-0 min-w-[100px]">
      <div className={`px-2 py-0.5 rounded-sm ${color} text-black font-black text-[10px] uppercase mr-2`}>
        {label}
      </div>
      <div className={`hud-numbers text-sm ${textColor} ml-auto`}>
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function NavTab({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const [location] = useLocation();
  const isActive = location === href || (href !== "/" && location.startsWith(href));
  
  return (
    <Link 
      href={href} 
      className={`relative flex flex-col items-center justify-center p-2 md:px-6 md:py-3 rounded-lg transition-all min-w-[70px] md:min-w-[100px] shrink-0 border-b-4 active:border-b-0 active:translate-y-1
      ${isActive 
        ? "bg-blue-600 text-white border-blue-900 shadow-[0_0_15px_rgba(59,130,246,0.8)] scale-110 z-10" 
        : "bg-blue-900/50 text-blue-300 border-blue-900/80 hover:bg-blue-800"
      }`}
    >
      {isActive && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />
      )}
      <div className={isActive ? "animate-bounce" : ""}>
        {icon}
      </div>
      <span className="text-[10px] md:text-xs font-black uppercase tracking-widest mt-1 drop-shadow-md">
        {label}
      </span>
    </Link>
  );
}
