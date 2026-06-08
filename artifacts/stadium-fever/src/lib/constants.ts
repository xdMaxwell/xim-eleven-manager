export type Rarity = "Common" | "Rare" | "Epic" | "Mythic";

export type ScoutStats = {
  attack: number;
  defense: number;
  tempo: number;
  stamina: number;
  spirit: number;
  chaos: number;
};

export type CountryCard = {
  id: string;
  name: string;
  color: string; // valid tailwind color or hex
  rarity: Rarity;
  level: number;
  stats: {
    roar: number;
    form: number;
    heat: number;
    luck: number;
  };
  scout?: ScoutStats;
  mutated?: boolean;
};

export const INITIAL_CARDS: CountryCard[] = [
  {
    id: "c1",
    name: "Verde Nation",
    color: "#22c55e",
    rarity: "Common",
    level: 1,
    stats: { roar: 10, form: 5, heat: 2, luck: 1 },
    scout: { attack: 6, defense: 4, tempo: 7, stamina: 8, spirit: 5, chaos: 3 },
  },
  {
    id: "c2",
    name: "Azul Nation",
    color: "#3b82f6",
    rarity: "Rare",
    level: 2,
    stats: { roar: 15, form: 7, heat: 4, luck: 2 },
    scout: { attack: 7, defense: 8, tempo: 6, stamina: 7, spirit: 6, chaos: 4 },
  },
  {
    id: "c3",
    name: "Golden Nation",
    color: "#eab308",
    rarity: "Epic",
    level: 1,
    stats: { roar: 25, form: 8, heat: 5, luck: 5 },
    scout: { attack: 9, defense: 6, tempo: 8, stamina: 6, spirit: 8, chaos: 6 },
  },
  {
    id: "c4",
    name: "Crimson Nation",
    color: "#ef4444",
    rarity: "Rare",
    level: 1,
    stats: { roar: 18, form: 6, heat: 8, luck: 1 },
    scout: { attack: 8, defense: 5, tempo: 7, stamina: 6, spirit: 7, chaos: 7 },
  },
  {
    id: "c5",
    name: "Nordic Nation",
    color: "#0ea5e9",
    rarity: "Common",
    level: 3,
    stats: { roar: 12, form: 9, heat: 1, luck: 2 },
    scout: { attack: 5, defense: 9, tempo: 5, stamina: 9, spirit: 6, chaos: 2 },
  },
  {
    id: "c6",
    name: "Shadow Nation",
    color: "#8b5cf6",
    rarity: "Mythic",
    level: 1,
    stats: { roar: 40, form: 10, heat: 10, luck: 8 },
    scout: { attack: 10, defense: 8, tempo: 9, stamina: 8, spirit: 10, chaos: 9 },
  },
];

export const EVENTS = [
  {
    id: "e1",
    name: "Night Match Fever",
    status: "LIVE",
    rule: "Deploy 2–4 assets. Stadium output may gain Pitch Points, Heat, Form, Fatigue, or Mutation.",
  },
  {
    id: "e2",
    name: "Underdog Noise",
    status: "LIVE",
    rule: "Low-level cards get extra mutation chance.",
  },
  {
    id: "e3",
    name: "Floodlight Rush",
    status: "LOCKED",
    rule: "Stadiums with upgraded lights gain bonus output.",
  },
  {
    id: "e4",
    name: "Final Run Preview",
    status: "LOCKED",
    rule: "Season leaderboard event.",
  },
];

export type LeaderboardEntry = {
  id: string;
  label: string;
  holder: string;
  value: string;
  color: string;
};

// Fake static season stats for the leaderboard preview widgets.
export const SEASON_LEADERBOARD: LeaderboardEntry[] = [
  { id: "l1", label: "Top Stadium Output", holder: "Golden Nation", value: "+4,820 PP", color: "#eab308" },
  { id: "l2", label: "Top Fever Run", holder: "Shadow Nation", value: "9 Matches", color: "#8b5cf6" },
  { id: "l3", label: "Top Country Heat", holder: "Crimson Nation", value: "48 Heat", color: "#ef4444" },
  { id: "l4", label: "Top Mutation", holder: "Azul Nation", value: "3 Mutated", color: "#3b82f6" },
  { id: "l5", label: "Top Roar Card", holder: "Verde Nation", value: "+62 Roar", color: "#22c55e" },
];
