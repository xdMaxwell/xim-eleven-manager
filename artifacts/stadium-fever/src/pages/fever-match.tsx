import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, Link } from "wouter";
import { useGameState, PendingMatch } from "../lib/game-state";
import {
  MATCH_DURATION,
  MATCH_EVENTS,
  MatchEvent,
  MatchEventType,
  computeMatchSummary,
  interpFrame,
} from "../lib/match";

const HOME_COLOR = "#f59e0b";
const AWAY_COLOR = "#8b5cf6";

export default function FeverMatch() {
  const { pendingMatch } = useGameState();

  if (!pendingMatch) {
    return (
      <div className="flex flex-col gap-6 w-full pb-10 items-center justify-center min-h-[60vh]">
        <div className="pixel-panel p-10 max-w-lg text-center flex flex-col items-center gap-6">
          <h2 className="font-mono text-3xl text-white uppercase">No Active Match</h2>
          <p className="font-mono text-sm text-gray-400">
            Deploy a formation in Fever Arena to start a match.
          </p>
          <Link href="/fever">
            <button className="pixel-btn pixel-btn-primary text-xl py-4 px-8">GO TO FEVER</button>
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
      return "#22c55e";
    case "goal":
      return "#ef4444";
    case "wall":
      return "#3b82f6";
    case "chaos":
    case "mutation":
      return "#8b5cf6";
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
      setFloats((f) => [...f, { id: idRef.current++, text: "+1 Form", color: "#3b82f6", x: 55, y: 38 }]);
    }
    if (ev.type === "mutation") {
      setFloats((f) => [
        ...f,
        { id: idRef.current++, text: `Mutation: ${summary.mutation}`, color: "#8b5cf6", x: 45, y: 24 },
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
    <div className="relative flex flex-col gap-4 w-full pb-10">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}stadium-bg.png)`, imageRendering: "pixelated" }}
      />

      {/* Scoreboard */}
      <div className="pixel-panel p-4 bg-black flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="font-mono text-[10px] uppercase mb-1" style={{ color: HOME_COLOR }}>Home Fever</div>
            <div className="w-6 h-6 mx-auto border-2 border-white" style={{ backgroundColor: HOME_COLOR, imageRendering: "pixelated" }} />
          </div>
          <div className="bg-[#0a0f1c] border-4 border-white px-6 py-2 font-mono text-4xl text-white tracking-widest">
            {homeScore} <span className="text-gray-600">:</span> 0
          </div>
          <div className="text-center">
            <div className="font-mono text-[10px] uppercase mb-1" style={{ color: AWAY_COLOR }}>Away Chaos</div>
            <div className="w-6 h-6 mx-auto border-2 border-white" style={{ backgroundColor: AWAY_COLOR, imageRendering: "pixelated" }} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-destructive text-white font-mono text-[10px] px-2 py-1 animate-blink">LIVE</div>
          <div className="bg-black border-2 border-white font-mono text-2xl text-secondary px-4 py-1">{minute}'</div>
          <button onClick={finish} className="pixel-btn bg-white text-black py-2 px-4 text-sm">SKIP TO RESULT</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Deployed cards panel */}
        <div className="pixel-panel p-4 bg-[#0a0f1c] flex flex-col gap-3 order-2 lg:order-1">
          <h3 className="font-mono text-sm text-white uppercase border-b-4 border-white pb-2">Deployed</h3>
          {match.formation.map((c) => (
            <div key={c.id} className="bg-black border-2 p-2 flex items-center gap-2" style={{ borderColor: c.color }}>
              <div className="w-5 h-5 border-2 border-white shrink-0" style={{ backgroundColor: c.color, imageRendering: "pixelated" }} />
              <div className="min-w-0">
                <div className="font-mono text-[10px] text-white uppercase truncate">{c.name}</div>
                <div className="font-mono text-[8px] text-gray-400">L{c.level} · ROAR {c.stats.roar}</div>
              </div>
            </div>
          ))}

          <div className="mt-2 bg-black border-2 border-gray-700 p-2 text-center">
            <div className="font-mono text-[8px] text-gray-400 uppercase">Stadium Output</div>
            <div className="font-mono text-xl text-primary">+{liveOutput}</div>
          </div>
        </div>

        {/* Pitch */}
        <div className="lg:col-span-2 order-1 lg:order-2 flex flex-col gap-3">
          <div className="relative w-full aspect-[16/10] bg-green-700 border-4 border-white overflow-hidden" style={{ imageRendering: "pixelated" }}>
            {/* Pitch stripes */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(0,0,0,0.0)_0px,rgba(0,0,0,0.0)_40px,rgba(0,0,0,0.08)_40px,rgba(0,0,0,0.08)_80px)]" />
            {/* Halfway line + center circle */}
            <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-white/70 -translate-x-1/2" />
            <div className="absolute top-1/2 left-1/2 w-24 h-24 border-4 border-white/70 rounded-full -translate-x-1/2 -translate-y-1/2" />
            {/* Goals */}
            <div className="absolute top-1/2 left-0 w-2 h-20 bg-white/80 -translate-y-1/2" />
            <div className="absolute top-1/2 right-0 w-2 h-20 bg-white/80 -translate-y-1/2" />
            <div className="absolute top-1/2 left-0 w-12 h-32 border-4 border-white/50 border-l-0 -translate-y-1/2" />
            <div className="absolute top-1/2 right-0 w-12 h-32 border-4 border-white/50 border-r-0 -translate-y-1/2" />

            {/* Players */}
            {home.map((p, i) => (
              <Dot key={`h${i}`} x={p[0]} y={p[1]} color={HOME_COLOR} />
            ))}
            {away.map((p, i) => (
              <Dot key={`a${i}`} x={p[0]} y={p[1]} color={AWAY_COLOR} />
            ))}

            {/* Ball + shadow */}
            <div className="absolute w-3 h-3 bg-black/40" style={{ left: `${ball[0]}%`, top: `calc(${ball[1]}% + 6px)`, transform: "translate(-50%,-50%)" }} />
            <div className="absolute w-3 h-3 bg-white border border-black" style={{ left: `${ball[0]}%`, top: `${ball[1]}%`, transform: "translate(-50%,-50%)", imageRendering: "pixelated" }} />

            {/* Event popup */}
            {activeEvent && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
                <div
                  className="font-mono text-sm md:text-lg uppercase px-4 py-2 border-4 border-white text-black animate-blink"
                  style={{ backgroundColor: eventColor(activeEvent.type) }}
                >
                  {activeEvent.label}
                </div>
              </div>
            )}

            {/* Floating reward texts */}
            {floats.map((f) => (
              <div
                key={f.id}
                className="absolute z-30 font-mono text-sm md:text-base uppercase pointer-events-none ff-float"
                style={{ left: `${f.x}%`, top: `${f.y}%`, color: f.color, textShadow: "2px 2px 0 #000" }}
              >
                {f.text}
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative h-10 bg-black border-2 border-gray-700">
            <div className="absolute top-0 bottom-0 left-0 bg-secondary/30" style={{ width: `${progress * 100}%` }} />
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
                    className={`w-3 h-3 border-2 border-white ${fired ? "" : "opacity-40"}`}
                    style={{ backgroundColor: fired ? eventColor(ev.type) : "#1f2937", imageRendering: "pixelated" }}
                  />
                </div>
              );
            })}
          </div>

          {/* Meters */}
          <div className="grid grid-cols-2 gap-3">
            <Meter label="Heat" value={liveHeat} suffix="" fill={Math.min(100, (liveHeat / Math.max(1, summary.heatGained)) * 100)} color="bg-destructive" pulse={heatPulse} />
            <Meter label="Roar Combo" value={liveRoar} suffix="%" fill={roarFill} color="bg-primary" pulse={false} />
          </div>
        </div>

        {/* Live impact log */}
        <div className="pixel-panel p-4 bg-black flex flex-col gap-2 order-3 max-h-[420px]">
          <h3 className="font-mono text-sm text-white uppercase border-b-4 border-white pb-2">Impact Log</h3>
          <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-2">
            {log.length === 0 && <div className="font-mono text-[10px] text-gray-500">Awaiting kickoff...</div>}
            {log.map((entry) => (
              <div key={entry.id} className="bg-[#0a0f1c] border-l-4 p-2" style={{ borderColor: eventColor(entry.type) }}>
                <div className="font-mono text-[10px] text-white uppercase">{entry.label}</div>
                {entry.impact && (
                  <div className="font-mono text-[10px]" style={{ color: eventColor(entry.type) }}>{entry.impact}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Dot({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <div
      className="absolute w-4 h-4 border-2 border-black ff-dot"
      style={{ left: `${x}%`, top: `${y}%`, backgroundColor: color, transform: "translate(-50%,-50%)", imageRendering: "pixelated" }}
    />
  );
}

function Meter({ label, value, suffix, fill, color, pulse }: { label: string; value: number; suffix: string; fill: number; color: string; pulse: boolean }) {
  return (
    <div className={`bg-black border-2 border-gray-700 p-2 ${pulse ? "ff-pulse" : ""}`}>
      <div className="flex justify-between font-mono text-[10px] uppercase mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white">{value}{suffix}</span>
      </div>
      <div className="h-3 bg-gray-900 border border-gray-700">
        <div className={`h-full ${color}`} style={{ width: `${fill}%`, transition: "width 0.2s linear" }} />
      </div>
    </div>
  );
}
