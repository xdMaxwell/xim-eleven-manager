import { CountryCard } from "./constants";

// Total scripted match length in seconds.
export const MATCH_DURATION = 30;

export type Vec2 = [number, number]; // [x%, y%] across the pitch

// Position keyframes: ball + both side player dots are interpolated between these.
export type MatchPositionFrame = {
  t: number;
  ball: Vec2;
  home: Vec2[];
  away: Vec2[];
};

export type MatchEventType =
  | "kickoff"
  | "passchain"
  | "crowdsurge"
  | "shot"
  | "goal"
  | "wall"
  | "chaos"
  | "mutation"
  | "fulltime";

export type MatchEvent = {
  t: number;
  label: string;
  type: MatchEventType;
  impact?: string;
};

// Five position keyframes; the viewer interpolates ball + dots between them.
export const MATCH_POSITION_FRAMES: MatchPositionFrame[] = [
  {
    t: 0,
    ball: [50, 50],
    home: [
      [14, 50],
      [30, 30],
      [30, 70],
      [44, 42],
      [44, 60],
    ],
    away: [
      [86, 50],
      [70, 30],
      [70, 70],
      [56, 42],
      [56, 60],
    ],
  },
  {
    t: 8,
    ball: [38, 42],
    home: [
      [18, 50],
      [34, 28],
      [40, 66],
      [48, 40],
      [50, 58],
    ],
    away: [
      [82, 48],
      [66, 34],
      [64, 68],
      [54, 44],
      [52, 60],
    ],
  },
  {
    t: 16,
    ball: [82, 46],
    home: [
      [40, 50],
      [56, 30],
      [60, 68],
      [70, 42],
      [74, 56],
    ],
    away: [
      [88, 50],
      [80, 34],
      [80, 66],
      [72, 46],
      [68, 58],
    ],
  },
  {
    t: 24,
    ball: [22, 56],
    home: [
      [16, 52],
      [28, 36],
      [30, 64],
      [42, 48],
      [40, 62],
    ],
    away: [
      [60, 50],
      [46, 32],
      [44, 70],
      [34, 50],
      [30, 58],
    ],
  },
  {
    t: 30,
    ball: [50, 50],
    home: [
      [14, 50],
      [30, 30],
      [30, 70],
      [44, 42],
      [44, 60],
    ],
    away: [
      [86, 50],
      [70, 30],
      [70, 70],
      [56, 42],
      [56, 60],
    ],
  },
];

// Scripted impact events. Times line up with the bottom timeline markers.
export const MATCH_EVENTS: MatchEvent[] = [
  { t: 0, label: "Kickoff", type: "kickoff" },
  { t: 4, label: "Pass Chain", type: "passchain", impact: "+40 Roar Combo" },
  { t: 8, label: "Crowd Surge", type: "crowdsurge", impact: "+120 Pitch Points" },
  { t: 12, label: "Shot Attempt", type: "shot", impact: "Pressure Building" },
  { t: 16, label: "Goal Heat Spike", type: "goal", impact: "+2 Heat" },
  { t: 20, label: "Defensive Wall", type: "wall", impact: "-1 Fatigue" },
  { t: 24, label: "Chaos Moment", type: "chaos", impact: "Mutation Chance" },
  { t: 27, label: "Mutation Roll", type: "mutation", impact: "Rolling..." },
  { t: 30, label: "Full Time Impact", type: "fulltime", impact: "Match Complete" },
];

export type MutationResult = "Miss" | "Spark" | "Mutated";

export type MatchSummary = {
  stadiumOutput: number; // pitch points
  roarCombo: number; // percent
  heatGained: number;
  fatigue: number; // negative number
  mutation: MutationResult;
  matchImpactGrade: string;
};

function grade(score: number): string {
  if (score >= 95) return "S";
  if (score >= 88) return "A";
  if (score >= 80) return "A-";
  if (score >= 72) return "B+";
  if (score >= 64) return "B";
  if (score >= 55) return "C+";
  return "C";
}

// Deterministic-ish summary derived from the deployed formation, with light randomness.
export function computeMatchSummary(formation: CountryCard[]): MatchSummary {
  const roarSum = formation.reduce((a, c) => a + c.stats.roar, 0);
  const formSum = formation.reduce((a, c) => a + c.stats.form, 0);
  const heatSum = formation.reduce((a, c) => a + c.stats.heat, 0);
  const luckSum = formation.reduce((a, c) => a + c.stats.luck, 0);
  const chaosSum = formation.reduce((a, c) => a + (c.scout?.chaos ?? 4), 0);

  const wobble = Math.floor(Math.random() * 140);
  const stadiumOutput = 300 + roarSum * 9 + formSum * 6 + wobble;
  const roarCombo = Math.min(45, Math.round(formation.length * 3 + formSum * 0.6 + Math.random() * 4));
  const heatGained = Math.max(1, Math.round(heatSum / 6) + 1);
  const fatigue = -1;

  const roll = Math.random() * 100;
  const mutationChance = 10 + luckSum * 2 + chaosSum;
  const sparkChance = mutationChance + 25;
  let mutation: MutationResult = "Miss";
  if (roll < mutationChance) mutation = "Mutated";
  else if (roll < sparkChance) mutation = "Spark";

  const score =
    50 +
    Math.min(25, roarSum / 3) +
    roarCombo / 2 +
    (mutation === "Mutated" ? 12 : mutation === "Spark" ? 6 : 0) +
    Math.min(8, formation.length * 2);

  return {
    stadiumOutput,
    roarCombo,
    heatGained,
    fatigue,
    mutation,
    matchImpactGrade: grade(score),
  };
}

// Linear interpolation helpers used by the viewer.
export function lerp(a: number, b: number, f: number): number {
  return a + (b - a) * f;
}

export function lerpVec(a: Vec2, b: Vec2, f: number): Vec2 {
  return [lerp(a[0], b[0], f), lerp(a[1], b[1], f)];
}

export function interpFrame(time: number): { ball: Vec2; home: Vec2[]; away: Vec2[] } {
  const frames = MATCH_POSITION_FRAMES;
  if (time <= frames[0].t) return { ball: frames[0].ball, home: frames[0].home, away: frames[0].away };
  const last = frames[frames.length - 1];
  if (time >= last.t) return { ball: last.ball, home: last.home, away: last.away };

  let i = 0;
  while (i < frames.length - 1 && frames[i + 1].t <= time) i++;
  const a = frames[i];
  const b = frames[i + 1];
  const f = (time - a.t) / (b.t - a.t);

  return {
    ball: lerpVec(a.ball, b.ball, f),
    home: a.home.map((p, idx) => lerpVec(p, b.home[idx] ?? p, f)),
    away: a.away.map((p, idx) => lerpVec(p, b.away[idx] ?? p, f)),
  };
}
