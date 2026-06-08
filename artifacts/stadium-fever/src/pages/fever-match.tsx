import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, Link } from "wouter";
import { useGameState, PendingMatch } from "../lib/game-state";
import { StadiumBackdrop } from "../components/stadium-backdrop";
import {
  MATCH_DURATION,
  MATCH_EVENTS,
  MatchEvent,
  MatchEventType,
  computeMatchSummary,
  interpFrame,
} from "../lib/match";
import { Flame, Radio, SkipForward, Activity, ArrowLeft } from "lucide-react";

const HOME_COLOR = "#f59e0b";
const AWAY_COLOR = "#8b5cf6";

export default function FeverMatch() {
  const { pendingMatch } = useGameState();

  if (!pendingMatch) {
    return (
      <div className="p-3 md:p-5 flex items-center justify-center min-h-[60vh]">
        <div className="glass-strong rounded-3xl p-10 max-w-lg text-center flex flex-col items-center gap-5 anim-reveal">
          <div className="w-16 h-16 rounded-2xl grid place-items-center bg-white/5 border border-white/10">
            <Activity className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="display text-3xl text-white uppercase">No active match</h2>
          <p className="text-sm text-muted-foreground">Deploy a formation in the Fever command center to kick off a live match.</p>
          <Link href="/fever">
            <button className="btn btn-primary text-base px-7 py-3"><ArrowLeft className="w-4 h-4" /> Go to Fever</button>
          </Link>
        </div>
      </div>
    );
  }

  return <MatchViewer match={pendingMatch} />;
}

type FloatText = { id: number; text: string; color: string; x: number; y: number };
type LogEntry = { id: number; label: string; impact?: string; type: MatchEventType };

function eventColor(type: MatchEventType): string {
  switch (type) {
    case "passchain":
      return "#f59e0b";
    case "crowdsurge":
      return "#84cc16";
    case "goal":
      return "#fb7185";
    case "wall":
      return "#38bdf8";
    case "chaos":
    case "mutation":
      return "#a78bfa";
    default:
      return "#ffffff";
  }
}

function MatchViewer({ match }: { match: PendingMatch }) {
  const { deployFormation } = useGameState();
  const [, setLocation] = useLocation();

  const [summary] = useState(() => computeMatchSummary(match.formation));
  const [time, setTime] = useState(0);
  const [floats, setFloats] = useState<FloatText[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [activeEvent, setActiveEvent] = useState<MatchEvent | null>(null);
  const [heatPulse, setHeatPulse] = useState(false);

  const firedRef = useRef<Set<number>>(new Set());
  const finishedRef = useRef(false);
  const mountedRef = useRef(true);
  const finishTimeoutRef = useRef<number | null>(null);
  const idRef = useRef(0);
  const rafRef = useRef<number>(0);

  const finish = useCallback(() => {
    if (finishedRef.current || !mountedRef.current) return;
    finishedRef.current = true;
    deployFormation(match.event, match.formation, summary);
    setLocation("/receipts");
  }, [deployFormation, match.event, match.formation, summary, setLocation]);

  const fireEvent = useCallback((idx: number) => {
    const ev = MATCH_EVENTS[idx];
    const color = eventColor(ev.type);
    setActiveEvent(ev);
    setLog((l) => [{ id: idRef.current++, label: ev.label, impact: ev.impact, type: ev.type }, ...l]);

    if (ev.impact && ev.type !== "shot" && ev.type !== "kickoff" && ev.type !== "fulltime") {
      const fx = 30 + Math.random() * 40;
      setFloats((f) => [
        ...f,
        { id: idRef.current++, text: ev.impact!, color, x: fx, y: 28 },
      ]);
    }

    if (ev.type === "goal") {
      setFloats((f) => [...f, { id: idRef.current++, text: "+1 Form", color: "#38bdf8", x: 55, y: 38 }]);
    }
    if (ev.type === "mutation") {
      setFloats((f) => [
        ...f,
        { id: idRef.current++, text: `Mutation: ${summary.mutation}`, color: "#a78bfa", x: 45, y: 24 },
      ]);
    }

    if (ev.type === "goal" || ev.type === "crowdsurge" || ev.type === "chaos") {
      setHeatPulse(true);
      window.setTimeout(() => setHeatPulse(false), 600);
    }

    window.setTimeout(() => {
      setActiveEvent((cur) => (cur === ev ? null : cur));
    }, 2200);
  }, [summary.mutation]);

  // Drop floating texts after they finish animating.
  useEffect(() => {
    if (floats.length === 0) return;
    const latest = floats[floats.length - 1];
    const t = window.setTimeout(() => {
      setFloats((f) => f.filter((x) => x.id !== latest.id));
    }, 1800);
    return () => window.clearTimeout(t);
  }, [floats]);

  // Master clock.
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      setTime(elapsed);

      MATCH_EVENTS.forEach((ev, idx) => {
        if (elapsed >= ev.t && !firedRef.current.has(idx)) {
          firedRef.current.add(idx);
          fireEvent(idx);
        }
      });

      if (elapsed >= MATCH_DURATION) {
        finishTimeoutRef.current = window.setTimeout(finish, 1200);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(rafRef.current);
      if (finishTimeoutRef.current) window.clearTimeout(finishTimeoutRef.current);
    };
  }, [fireEvent, finish]);

  const progress = Math.min(1, time / MATCH_DURATION);
  const { ball, home, away } = interpFrame(time);
  const liveOutput = Math.floor(summary.stadiumOutput * progress);
  const liveRoar = Math.floor(summary.roarCombo * Math.min(1, progress * 1.1));
  const heatProgress = Math.max(0, Math.min(1, (time - 16) / (MATCH_DURATION - 16)));
  const liveHeat = Math.round(summary.heatGained * heatProgress);
  const homeScore = time >= 16 ? 1 : 0;
  const minute = Math.floor(progress * 90);
  const roarFill = Math.min(100, (liveRoar / 45) * 100);

  return (
    <div className="p-3 md:p-5 flex flex-col gap-4">
      {/* Scoreboard */}
      <div className="glass-strong rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <TeamBadge label="Home Fever" color={HOME_COLOR} align="right" />
          <div className="flex items-center gap-3 px-5 py-2 rounded-xl bg-black/50 border border-white/10">
            <span className="num text-4xl md:text-5xl" style={{ color: HOME_COLOR }}>{homeScore}</span>
            <span className="num text-2xl text-white/30">:</span>
            <span className="num text-4xl md:text-5xl" style={{ color: AWAY_COLOR }}>0</span>
          </div>
          <TeamBadge label="Away Chaos" color={AWAY_COLOR} align="left" />
        </div>

        <div className="flex items-center gap-3">
          <span className="chip bg-destructive/20 border-destructive/40 text-destructive anim-live">
            <Radio className="w-3.5 h-3.5" /> Live
          </span>
          <div className="px-4 py-1.5 rounded-xl bg-black/50 border border-white/10 num text-xl text-secondary">{minute}'</div>
          <button onClick={finish} className="btn btn-ghost text-xs py-2 px-3"><SkipForward className="w-4 h-4" /> Skip to result</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Deployed cards panel */}
        <div className="glass rounded-2xl p-4 flex flex-col gap-3 order-2 lg:order-1">
          <h3 className="display text-sm text-white uppercase tracking-wide">Deployed Squad</h3>
          {match.formation.map((c) => (
            <div key={c.id} className="rounded-xl bg-white/[0.03] border border-white/10 p-2.5 flex items-center gap-3">
              <span className="w-3 h-9 rounded-full shrink-0" style={{ background: c.color, boxShadow: `0 0 12px ${c.color}` }} />
              <div className="min-w-0">
                <div className="display text-[13px] text-white uppercase truncate">{c.name}</div>
                <div className="num text-[11px] text-muted-foreground">L{c.level} · Roar {c.stats.roar}</div>
              </div>
            </div>
          ))}

          <div className="mt-1 rounded-xl bg-primary/10 border border-primary/30 p-3 text-center">
            <div className="text-[10px] text-primary/80 uppercase tracking-widest">Stadium Output</div>
            <div className="num text-2xl text-primary text-glow-primary">+{liveOutput}</div>
          </div>
        </div>

        {/* Pitch */}
        <div className="lg:col-span-2 order-1 lg:order-2 flex flex-col gap-3">
          <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 glow-primary">
            <StadiumBackdrop intensity={0.5} className="opacity-60" />
            {/* tactical pitch overlay (top-down) */}
            <div className="absolute inset-0 pitch-stripes opacity-90" />
            <div className="absolute inset-0" style={{ background: "radial-gradient(120% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.45))" }} />
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/50 -translate-x-1/2" />
            <div className="absolute top-1/2 left-1/2 w-28 h-28 border-2 border-white/50 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute top-1/2 left-0 w-12 h-32 border-2 border-white/40 border-l-0 -translate-y-1/2 rounded-r-md" />
            <div className="absolute top-1/2 right-0 w-12 h-32 border-2 border-white/40 border-r-0 -translate-y-1/2 rounded-l-md" />

            {home.map((p, i) => (
              <Dot key={`h${i}`} x={p[0]} y={p[1]} color={HOME_COLOR} />
            ))}
            {away.map((p, i) => (
              <Dot key={`a${i}`} x={p[0]} y={p[1]} color={AWAY_COLOR} />
            ))}

            {/* ball + shadow */}
            <div className="absolute w-2.5 h-2.5 rounded-full bg-black/40 blur-[1px]" style={{ left: `${ball[0]}%`, top: `calc(${ball[1]}% + 5px)`, transform: "translate(-50%,-50%)" }} />
            <div className="absolute w-2.5 h-2.5 rounded-full bg-white" style={{ left: `${ball[0]}%`, top: `${ball[1]}%`, transform: "translate(-50%,-50%)", boxShadow: "0 0 8px rgba(255,255,255,0.9)" }} />

            {activeEvent && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 anim-reveal">
                <div className="display text-sm md:text-base uppercase px-4 py-2 rounded-xl text-white glass-strong" style={{ boxShadow: `0 0 30px -6px ${eventColor(activeEvent.type)}`, borderColor: eventColor(activeEvent.type) }}>
                  {activeEvent.label}
                </div>
              </div>
            )}

            {floats.map((f) => (
              <div
                key={f.id}
                className="absolute z-30 num text-sm md:text-base uppercase pointer-events-none anim-reward"
                style={{ left: `${f.x}%`, top: `${f.y}%`, color: f.color, textShadow: `0 0 14px ${f.color}` }}
              >
                {f.text}
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative h-9 rounded-xl bg-black/40 border border-white/10 overflow-hidden">
            <div className="absolute top-0 bottom-0 left-0 bg-secondary/25" style={{ width: `${progress * 100}%` }} />
            {MATCH_EVENTS.map((ev, idx) => {
              const fired = time >= ev.t;
              return (
                <div
                  key={idx}
                  className="absolute top-0 bottom-0 flex items-center"
                  style={{ left: `${(ev.t / MATCH_DURATION) * 100}%`, transform: "translateX(-50%)" }}
                  title={ev.label}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full border border-white/40 transition-all"
                    style={{ backgroundColor: fired ? eventColor(ev.type) : "#1f2937", boxShadow: fired ? `0 0 10px ${eventColor(ev.type)}` : "none", opacity: fired ? 1 : 0.5 }}
                  />
                </div>
              );
            })}
          </div>

          {/* Meters */}
          <div className="grid grid-cols-2 gap-3">
            <Meter label="Heat" value={liveHeat} suffix="" fill={Math.min(100, (liveHeat / Math.max(1, summary.heatGained)) * 100)} from="from-destructive" to="to-orange-400" pulse={heatPulse} />
            <Meter label="Roar Combo" value={liveRoar} suffix="%" fill={roarFill} from="from-primary" to="to-emerald-300" pulse={false} />
          </div>
        </div>

        {/* Live impact log */}
        <div className="glass rounded-2xl p-4 flex flex-col gap-2 order-3 max-h-[460px]">
          <h3 className="display text-sm text-white uppercase tracking-wide flex items-center gap-2"><Flame className="w-4 h-4 text-destructive" /> Impact Log</h3>
          <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-2">
            {log.length === 0 && <div className="text-[11px] text-muted-foreground">Awaiting kickoff...</div>}
            {log.map((entry) => (
              <div key={entry.id} className="rounded-lg bg-white/[0.03] border-l-2 p-2.5 anim-reveal" style={{ borderColor: eventColor(entry.type) }}>
                <div className="display text-[12px] text-white uppercase">{entry.label}</div>
                {entry.impact && (
                  <div className="num text-[11px]" style={{ color: eventColor(entry.type) }}>{entry.impact}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamBadge({ label, color, align }: { label: string; color: string; align: "left" | "right" }) {
  return (
    <div className={`text-center ${align === "right" ? "order-first" : ""}`}>
      <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color }}>{label}</div>
      <div className="w-7 h-7 mx-auto rounded-lg border border-white/30" style={{ background: `linear-gradient(160deg, ${color}, #0b1220)`, boxShadow: `0 0 14px -2px ${color}` }} />
    </div>
  );
}

function Dot({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <div
      className="absolute w-3.5 h-3.5 rounded-full border-2 border-black/60 transition-all duration-100"
      style={{ left: `${x}%`, top: `${y}%`, backgroundColor: color, transform: "translate(-50%,-50%)", boxShadow: `0 0 10px -1px ${color}` }}
    />
  );
}

function Meter({ label, value, suffix, fill, from, to, pulse }: { label: string; value: number; suffix: string; fill: number; from: string; to: string; pulse: boolean }) {
  return (
    <div className={`rounded-xl bg-black/40 border border-white/10 p-3 ${pulse ? "anim-stadium-pulse" : ""}`}>
      <div className="flex justify-between text-[11px] uppercase tracking-wider mb-1.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="num text-white">{value}{suffix}</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${from} ${to}`} style={{ width: `${fill}%`, transition: "width 0.2s linear" }} />
      </div>
    </div>
  );
}
