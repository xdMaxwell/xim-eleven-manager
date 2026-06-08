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
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background text-foreground">
      <nav className="w-full md:w-64 border-b md:border-r border-border bg-card p-4 flex flex-col gap-6 flex-shrink-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-primary glow-text uppercase tracking-wider mb-1">
            Stadium Fever
          </h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            Project Alpha
          </p>
        </div>

        <div className="flex-1 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          <NavLink href="/" icon={<Trophy className="w-4 h-4" />}>Stadium HQ</NavLink>
          <NavLink href="/packs" icon={<PackageOpen className="w-4 h-4" />}>Packs</NavLink>
          <NavLink href="/locker" icon={<SquareAsterisk className="w-4 h-4" />}>Locker</NavLink>
          <NavLink href="/fever" icon={<Activity className="w-4 h-4" />}>Fever Board</NavLink>
          <NavLink href="/receipts" icon={<Ticket className="w-4 h-4" />}>Receipts</NavLink>
          <NavLink href="/season" icon={<Calendar className="w-4 h-4" />}>Season</NavLink>
        </div>
      </nav>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <ResourceBar />
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  const [location] = useLocation();
  const isActive = location === href;
  
  return (
    <Link href={href} className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all font-bold uppercase tracking-wider text-sm whitespace-nowrap
      ${isActive 
        ? "bg-primary/20 text-primary border border-primary/50 shadow-[0_0_10px_rgba(34,197,94,0.3)]" 
        : "text-muted-foreground hover:bg-card-border hover:text-foreground border border-transparent"
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}

function ResourceBar() {
  const { pitchPoints, roarPower, heat, phase } = useGameState();

  return (
    <div className="w-full bg-card border-b border-border p-3 flex flex-wrap gap-4 items-center justify-between shadow-md z-10 sticky top-0">
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Pitch Points</span>
          <span className="text-xl font-bold text-accent drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">{pitchPoints.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Roar Power</span>
          <span className="text-xl font-bold text-primary drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">{roarPower.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Heat</span>
          <span className="text-xl font-bold text-destructive drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">{heat}</span>
        </div>
      </div>
      
      <div className="px-3 py-1 bg-secondary/20 border border-secondary/50 rounded text-secondary text-sm font-bold uppercase tracking-widest shadow-[0_0_8px_rgba(59,130,246,0.3)]">
        Phase: {phase}
      </div>
    </div>
  );
}