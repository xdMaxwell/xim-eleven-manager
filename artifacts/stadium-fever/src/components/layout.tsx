import { Link, useLocation } from "wouter";
import { useGameState } from "../lib/game-state";
import {
  Home,
  PackageOpen,
  LayoutGrid,
  Flame,
  Receipt,
  Map,
  Tv,
} from "lucide-react";

const TICKER_ITEMS = [
  "Night Match Fever live",
  "Deploy your XI",
  "Pack drop ready",
  "Game first. Token later.",
  "No official brands",
  "Capture match-day heat",
];

export function Layout({ children }: { children: React.ReactNode }) {
  const state = useGameState();
  const unclaimed = state.receipts.filter((r) => !r.claimed).length;

  return (
    <div className="min-h-[100dvh] flex flex-col relative text-foreground">
      {/* TOP HUD — broadcast scoreboard */}
      <header className="sticky top-0 z-40 shrink-0">
        <div className="glass-strong rounded-none border-x-0 border-t-0 px-3 md:px-6 py-2.5 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-xl grid place-items-center bg-gradient-to-br from-primary to-emerald-600 glow-primary">
              <span className="display text-base md:text-lg text-[#06210c] leading-none">XI</span>
            </div>
            <div className="leading-none">
              <div className="display text-lg md:text-2xl tracking-tight text-white text-glow-primary">XIM</div>
              <div className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Eleven Manager</div>
            </div>
          </Link>

          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto hide-scrollbar">
            <Stat label="Pitch Points" value={state.pitchPoints} cls="text-primary" />
            <Stat label="Roar" value={state.roarPower} cls="text-secondary" />
            <Stat label="Heat" value={state.heat} cls="text-destructive" />
            <div className="hidden md:flex items-center gap-2 chip border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-blink" />
              <span className="uppercase text-[10px] tracking-widest text-muted-foreground">{state.phase}</span>
            </div>
          </div>
        </div>

        {/* live ticker */}
        <div className="bg-black/60 backdrop-blur border-b border-white/10 flex items-center overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0 bg-destructive text-white px-3 py-1 text-[10px] font-display font-extrabold uppercase tracking-wider anim-live">
            <span className="w-1.5 h-1.5 rounded-full bg-white" /> Live
          </div>
          <div className="overflow-hidden flex-1">
            <div className="animate-marquee whitespace-nowrap flex">
              {[0, 1].map((dup) => (
                <span key={dup} className="flex shrink-0">
                  {TICKER_ITEMS.map((t, i) => (
                    <span key={i} className="num text-xs uppercase tracking-wide text-muted-foreground px-6 py-1">
                      <span className="text-accent mr-6">/</span>{t}
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto pb-28 md:pb-32 relative z-20">
        <div className="w-full max-w-[1440px] mx-auto">{children}</div>
      </main>

      {/* BOTTOM NAV — game mode selector */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pointer-events-none">
        <div className="pointer-events-auto max-w-[820px] mx-auto glass-strong rounded-2xl flex items-stretch justify-between gap-0.5 md:gap-1 p-1.5">
          <NavTab href="/" icon={<Home className="w-5 h-5" />} label="Stadium" />
          <NavTab href="/packs" icon={<PackageOpen className="w-5 h-5" />} label="Packs" badge={state.packs.starter + state.packs.fever} />
          <NavTab href="/locker" icon={<LayoutGrid className="w-5 h-5" />} label="Locker" />
          <NavTab href="/fever" icon={<Flame className="w-5 h-5" />} label="Fever" isLive />
          <NavTab href="/fever-match" icon={<Tv className="w-5 h-5" />} label="Match" />
          <NavTab href="/receipts" icon={<Receipt className="w-5 h-5" />} label="Receipts" badge={unclaimed} />
          <NavTab href="/season" icon={<Map className="w-5 h-5" />} label="Season" />
        </div>
      </nav>
    </div>
  );
}

function Stat({ label, value, cls }: { label: string; value: number; cls: string }) {
  return (
    <div className="shrink-0 px-2.5 md:px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-right min-w-[74px]">
      <div className="text-[8px] uppercase tracking-widest text-muted-foreground leading-none mb-0.5">{label}</div>
      <div className={`num text-base md:text-lg leading-none ${cls}`}>{value.toLocaleString()}</div>
    </div>
  );
}

function NavTab({ href, icon, label, isLive, badge }: { href: string; icon: React.ReactNode; label: string; isLive?: boolean; badge?: number }) {
  const [location] = useLocation();
  const isActive = location === href || (href !== "/" && location.startsWith(href));

  return (
    <Link
      href={href}
      className={`relative flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all duration-200 min-w-0
      ${isActive
        ? "bg-gradient-to-b from-primary to-emerald-600 text-[#06210c] glow-primary -translate-y-0.5"
        : "text-muted-foreground hover:text-white hover:bg-white/5"
      }`}
    >
      {badge ? (
        <span className="absolute top-0.5 right-1/2 translate-x-4 bg-destructive text-white text-[9px] num min-w-4 h-4 px-1 grid place-items-center rounded-full border border-black/30 z-10">
          {badge}
        </span>
      ) : null}
      {isLive && !badge && (
        <span className="absolute top-1 right-1/2 translate-x-3.5 w-1.5 h-1.5 rounded-full bg-destructive anim-live" />
      )}
      {icon}
      <span className="text-[9px] md:text-[10px] font-display font-bold uppercase tracking-wide truncate w-full text-center">{label}</span>
    </Link>
  );
}
