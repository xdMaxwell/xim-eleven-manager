import { Link, useLocation } from "wouter";
import { useGameState } from "../lib/game-state";
import { 
  Trophy, 
  PackageOpen, 
  SquareAsterisk, 
  Activity, 
  Ticket, 
  Calendar 
} from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col relative text-foreground">
      <div className="stadium-bg" />
      
      {/* TOP HUD */}
      <header className="w-full bg-black/80 border-b-2 border-primary/50 flex flex-col md:flex-row items-center justify-between z-20 backdrop-blur-md shrink-0 px-4 py-2">
        <div className="flex items-center justify-between w-full md:w-auto shrink-0 mb-2 md:mb-0">
          <h1 className="text-3xl font-black text-primary uppercase tracking-widest glow-text italic pr-8">
            Stadium Fever
          </h1>
        </div>
        
        {/* Ticker */}
        <div className="flex-1 w-full overflow-hidden border-x border-white/10 mx-4 bg-black/50 py-1 hidden md:block">
          <div className="animate-marquee whitespace-nowrap text-secondary font-bold uppercase tracking-widest text-sm">
            NIGHT MATCH FEVER LIVE • UNDERDOG NOISE ACTIVE • PACK DROP IN 02:14 • FLOODLIGHT RUSH WARMING UP • SEASON SNAPSHOT PENDING • 
          </div>
        </div>

        {/* Resources */}
        <div className="flex items-center gap-4 shrink-0 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 hide-scrollbar">
          <ResourceChip label="PP" value={useGameState().pitchPoints.toLocaleString()} color="text-accent" />
          <ResourceChip label="ROAR" value={useGameState().roarPower.toLocaleString()} color="text-primary" />
          <ResourceChip label="HEAT" value={useGameState().heat.toString()} color="text-destructive" />
          <div className="px-3 py-1 bg-secondary/20 border-2 border-secondary text-secondary font-black uppercase tracking-widest text-sm glow-blue rounded-md whitespace-nowrap">
            {useGameState().phase}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-28">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/90 border-t-4 border-white/10 z-30 p-2 md:p-4 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between overflow-x-auto hide-scrollbar gap-2">
          <NavTab href="/" icon={<Trophy className="w-5 h-5 md:w-6 md:h-6" />} label="Stadium" />
          <NavTab href="/packs" icon={<PackageOpen className="w-5 h-5 md:w-6 md:h-6" />} label="Packs" />
          <NavTab href="/locker" icon={<SquareAsterisk className="w-5 h-5 md:w-6 md:h-6" />} label="Locker" />
          <NavTab href="/fever" icon={<Activity className="w-5 h-5 md:w-6 md:h-6" />} label="Fever" />
          <NavTab href="/receipts" icon={<Ticket className="w-5 h-5 md:w-6 md:h-6" />} label="Receipts" />
          <NavTab href="/season" icon={<Calendar className="w-5 h-5 md:w-6 md:h-6" />} label="Season" />
        </div>
      </nav>
    </div>
  );
}

function ResourceChip({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="flex items-center gap-2 bg-black/60 border border-white/20 px-3 py-1.5 rounded-md shadow-inner">
      <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{label}</span>
      <span className={`hud-numbers text-lg ${color} drop-shadow-md`}>{value}</span>
    </div>
  );
}

function NavTab({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const [location] = useLocation();
  const isActive = location === href || (href !== "/" && location.startsWith(href));
  
  return (
    <Link href={href} className={`flex flex-col items-center justify-center p-2 md:px-6 md:py-3 rounded-xl transition-all border-b-4 active:border-b-0 active:translate-y-1 min-w-[70px] md:min-w-[100px] shrink-0
      ${isActive 
        ? "bg-primary text-primary-foreground border-green-800 glow-box scale-105" 
        : "bg-card border-card-border text-muted-foreground hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon}
      <span className="text-[10px] md:text-sm font-black uppercase tracking-widest mt-1">{label}</span>
    </Link>
  );
}
