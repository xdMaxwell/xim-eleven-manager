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
      {/* TOP HUD - Pixel Style */}
      <header className="w-full bg-[#0a1128] border-b-4 border-white flex flex-col z-40 shrink-0 pixel-border-sm">
        
        {/* Main Status Strip */}
        <div className="flex flex-col xl:flex-row items-center justify-between px-4 py-3 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl md:text-2xl font-mono text-white pixel-text-shadow">
              <span className="text-primary">STADIUM</span> FEVER
            </h1>
            <div className="hidden md:flex flex-col gap-1">
              <div className="bg-black border-2 border-white px-2 py-1 text-[8px] font-mono uppercase text-secondary flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary animate-blink" />
                PHASE: {state.phase}
              </div>
            </div>
          </div>
          
          {/* Resource Bars */}
          <div className="flex items-center gap-3 overflow-x-auto w-full xl:w-auto hide-scrollbar">
            <ResourceBar label="PP" value={state.pitchPoints} color="bg-primary" textColor="text-primary" />
            <ResourceBar label="ROAR" value={state.roarPower} color="bg-accent" textColor="text-accent" />
            <ResourceBar label="HEAT" value={state.heat} color="bg-destructive" textColor="text-destructive" />
          </div>
        </div>

        {/* Ticker */}
        <div className="w-full bg-black border-t-2 border-gray-800 py-1 overflow-hidden flex items-center">
          <div className="bg-primary text-black font-mono text-[8px] px-2 py-1 shrink-0 z-20 border-r-2 border-white">
            TICKER
          </div>
          <div className="animate-marquee text-accent font-mono text-[10px] uppercase ml-4">
            <span className="text-white mx-4">+++</span> NIGHT MATCH FEVER LIVE <span className="text-white mx-4">+++</span> DEPLOY SQUADS <span className="text-white mx-4">+++</span> UPGRADE STADIUM FOR MORE ROAR <span className="text-white mx-4">+++</span> NO OFFICIAL BRANDS <span className="text-white mx-4">+++</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto pb-32 md:pb-40 relative z-20">
        <div className="p-4 md:p-6 xl:p-10 w-full max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>

      {/* BOTTOM NAV - Pixel Console Style */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0a1128] border-t-4 border-white z-50">
        <div className="max-w-[1200px] mx-auto flex items-end justify-between gap-1 overflow-x-auto hide-scrollbar px-2 pt-2 pb-2">
          <NavTab href="/" icon={<Trophy className="w-6 h-6 md:w-8 md:h-8" />} label="HQ" />
          <NavTab href="/packs" icon={<PackageOpen className="w-6 h-6 md:w-8 md:h-8" />} label="PACKS" badge={state.packs.starter + state.packs.fever} />
          <NavTab href="/locker" icon={<SquareAsterisk className="w-6 h-6 md:w-8 md:h-8" />} label="LOCKER" />
          <NavTab href="/fever" icon={<Activity className="w-6 h-6 md:w-8 md:h-8" />} label="FEVER" isLive />
          <NavTab href="/receipts" icon={<Ticket className="w-6 h-6 md:w-8 md:h-8" />} label="RECEIPTS" badge={state.receipts.filter(r=>!r.claimed).length} />
          <NavTab href="/season" icon={<Map className="w-6 h-6 md:w-8 md:h-8" />} label="SEASON" />
        </div>
      </nav>
    </div>
  );
}

function ResourceBar({ label, value, color, textColor }: { label: string, value: number, color: string, textColor: string }) {
  return (
    <div className="flex items-center bg-black border-2 border-white p-1 shrink-0 min-w-[100px]">
      <div className={`px-1.5 py-0.5 ${color} text-black font-mono text-[8px] uppercase mr-2 border border-black`}>
        {label}
      </div>
      <div className={`font-mono text-sm ${textColor} ml-auto`}>
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
      className={`relative flex flex-col items-center justify-center p-2 md:px-4 md:py-3 transition-all min-w-[70px] md:min-w-[100px] shrink-0 border-2 active:translate-y-1
      ${isActive 
        ? "bg-secondary text-black border-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)] -translate-y-2" 
        : "bg-black text-gray-400 border-gray-700 hover:bg-gray-900"
      }`}
    >
      {badge ? (
        <div className="absolute -top-2 -right-2 bg-destructive text-white text-[10px] font-mono w-5 h-5 flex items-center justify-center border-2 border-white z-20">
          {badge}
        </div>
      ) : null}
      
      {isLive && !badge && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-destructive text-white text-[8px] font-mono px-1 py-0.5 border border-white animate-blink">
          LIVE
        </div>
      )}

      <div className={`${isActive ? "animate-float" : ""}`}>
        {icon}
      </div>
      <span className="text-[8px] md:text-[10px] font-mono uppercase mt-1">
        {label}
      </span>
    </Link>
  );
}
