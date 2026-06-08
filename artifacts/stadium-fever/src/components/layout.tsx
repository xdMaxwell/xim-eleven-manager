import { Link, useLocation } from "wouter";
import { useGameState } from "../lib/game-state";
import { 
  Trophy, 
  PackageOpen, 
  SquareAsterisk, 
  Activity, 
  Ticket, 
  Map,
  ShieldAlert,
  BatteryCharging
} from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const state = useGameState();

  return (
    <div className="min-h-[100dvh] flex flex-col relative text-foreground">
      <div className="crt-overlay" />
      
      {/* GLOBAL APP SHELL BORDERS - Denser frame */}
      <div className="fixed inset-0 border-[16px] border-black/80 pointer-events-none z-50 hidden md:block" />
      
      {/* TOP HUD - Denser PS2 Broadcast Style */}
      <header className="w-full bg-blue-950 border-b-8 border-blue-900 shadow-2xl flex flex-col z-40 shrink-0 relative">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.2)_10px,rgba(0,0,0,0.2)_20px)] pointer-events-none" />
        
        {/* Main Status Strip */}
        <div className="flex flex-col xl:flex-row items-center justify-between px-6 py-3 gap-4 relative z-10">
          
          <div className="flex items-center gap-6">
            <h1 className="text-4xl font-black text-white italic tracking-tighter drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
              <span className="text-primary glow-text">STADIUM</span> FEVER
            </h1>
            <div className="hidden md:flex flex-col items-start gap-1">
              <div className="bg-black border-2 border-blue-700 px-4 py-1 rounded text-xs font-black uppercase text-blue-300 shadow-inner flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                {state.phase}
              </div>
              <div className="text-[9px] font-mono text-blue-400 uppercase tracking-widest px-1">Network Online</div>
            </div>
            
            {/* Small status chips */}
            <div className="hidden lg:flex gap-2">
               <div className="bg-destructive/20 border-2 border-destructive px-3 py-1 rounded text-[10px] font-black uppercase text-destructive flex items-center gap-1 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                 <Activity className="w-3 h-3" /> FEVER LIVE
               </div>
               {state.packs.starter > 0 || state.packs.fever > 0 ? (
                 <div className="bg-primary/20 border-2 border-primary px-3 py-1 rounded text-[10px] font-black uppercase text-primary flex items-center gap-1">
                   <PackageOpen className="w-3 h-3" /> PACK READY
                 </div>
               ) : null}
            </div>
          </div>
          
          {/* Resource Bars */}
          <div className="flex items-center gap-4 overflow-x-auto w-full xl:w-auto hide-scrollbar pb-2 xl:pb-0 px-2">
            <ResourceBar label="PP" value={state.pitchPoints} color="bg-primary" textColor="text-primary" icon={<BatteryCharging className="w-4 h-4 text-black" />} />
            <ResourceBar label="ROAR" value={state.roarPower} color="bg-accent" textColor="text-accent" />
            <ResourceBar label="HEAT" value={state.heat} color="bg-destructive" textColor="text-destructive" />
          </div>
        </div>

        {/* Dense Ticker Line */}
        <div className="w-full bg-black border-y-4 border-gray-800 py-1.5 overflow-hidden relative z-10 flex items-center">
          <div className="bg-primary text-black font-black uppercase text-[10px] px-4 py-1 shrink-0 z-20 shadow-[5px_0_10px_rgba(0,0,0,0.8)] border-r-4 border-black">
            SYSTEM FEED
          </div>
          <div className="absolute inset-y-0 left-24 w-16 bg-gradient-to-r from-black to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent z-10" />
          <div className="animate-marquee whitespace-nowrap text-yellow-500 font-bold uppercase tracking-widest text-xs ml-4">
            <span className="text-white mx-4">•</span> NIGHT MATCH FEVER LIVE <span className="text-white mx-4">•</span> UNDERDOG NOISE ACTIVE <span className="text-white mx-4">•</span> PACK DROP IN 02:14 <span className="text-white mx-4">•</span> MORE FEATURES LOCKED <span className="text-white mx-4">•</span> STADIUM OUTPUT MAXIMIZED <span className="text-white mx-4">•</span> DEPLOY SQUADS TO EARN PP <span className="text-white mx-4">•</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto pb-32 md:pb-40 relative z-20">
        <div className="p-4 md:p-8 xl:p-12 w-full max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>

      {/* BOTTOM NAV - Console Sports Menu */}
      <nav className="fixed bottom-0 left-0 right-0 bg-blue-950 border-t-8 border-blue-700 z-50 shadow-[0_-20px_40px_rgba(0,0,0,0.8)]">
        
        {/* Micro status strip above tabs */}
        <div className="h-6 bg-black border-b-2 border-gray-800 flex justify-between items-center px-4">
          <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
            V 1.4.2 [ARCADE BUILD]
          </div>
          <div className="flex items-center gap-4 text-[9px] font-mono text-gray-500 uppercase tracking-widest">
            <span className="flex items-center gap-1"><ShieldAlert className="w-3 h-3 text-primary" /> SECURE</span>
            <span>SERVER: US-WEST</span>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto flex items-end justify-between gap-2 overflow-x-auto hide-scrollbar px-4 pt-4 pb-4">
          <NavTab href="/" icon={<Trophy className="w-8 h-8 md:w-10 md:h-10" />} label="HQ" />
          <NavTab href="/packs" icon={<PackageOpen className="w-8 h-8 md:w-10 md:h-10" />} label="Packs" badge={state.packs.starter + state.packs.fever} />
          <NavTab href="/locker" icon={<SquareAsterisk className="w-8 h-8 md:w-10 md:h-10" />} label="Locker" />
          <NavTab href="/fever" icon={<Activity className="w-8 h-8 md:w-10 md:h-10" />} label="Fever" isLive />
          <NavTab href="/receipts" icon={<Ticket className="w-8 h-8 md:w-10 md:h-10" />} label="Receipts" badge={state.receipts.filter(r=>!r.claimed).length} />
          <NavTab href="/season" icon={<Map className="w-8 h-8 md:w-10 md:h-10" />} label="Season" />
        </div>
      </nav>
    </div>
  );
}

function ResourceBar({ label, value, color, textColor, icon }: { label: string, value: number, color: string, textColor: string, icon?: React.ReactNode }) {
  return (
    <div className="flex items-center bg-black border-4 border-gray-700 rounded-lg p-1.5 shadow-inner shrink-0 min-w-[140px]">
      <div className={`px-2 py-1 rounded-sm ${color} text-black font-black text-xs uppercase mr-3 flex items-center justify-center gap-1 shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>
        {icon} {label}
      </div>
      <div className={`hud-numbers text-xl ${textColor} ml-auto pr-2 glow-text`}>
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function NavTab({ href, icon, label, isLive, badge }: { href: string; icon: React.ReactNode; label: string; isLive?: boolean; badge?: number }) {
  const [location] = useLocation();
  const isActive = location === href || (href !== "/" && location.startsWith(href));
  
  return (
    <Link 
      href={href} 
      className={`relative flex flex-col items-center justify-center p-3 md:px-8 md:py-4 rounded-t-xl transition-all min-w-[80px] md:min-w-[140px] shrink-0 border-x-4 border-t-4 active:translate-y-2
      ${isActive 
        ? "bg-blue-600 text-white border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.8)] scale-110 z-10 translate-y-2 pb-6" 
        : "bg-black/60 text-blue-300 border-gray-800 hover:bg-gray-800 hover:border-gray-600"
      }`}
    >
      {badge ? (
        <div className="absolute -top-3 -right-3 bg-destructive text-white text-xs font-black w-7 h-7 flex items-center justify-center rounded-full border-2 border-white shadow-lg animate-bounce z-20">
          {badge}
        </div>
      ) : null}
      
      {isLive && !badge && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-destructive text-white text-[9px] font-black px-2 py-0.5 rounded border border-white animate-pulse shadow-[0_0_10px_red]">
          LIVE
        </div>
      )}

      {isActive && (
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-12 h-2 bg-white rounded-full shadow-[0_0_15px_white]" />
      )}
      <div className={`${isActive ? "animate-bounce drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "opacity-70"}`}>
        {icon}
      </div>
      <span className="text-xs md:text-sm font-black uppercase tracking-widest mt-2 drop-shadow-md">
        {label}
      </span>
    </Link>
  );
}
