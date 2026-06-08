export type Rarity = "Common" | "Rare" | "Epic" | "Mythic";

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
  },
  {
    id: "c2",
    name: "Azul Nation",
    color: "#3b82f6",
    rarity: "Rare",
    level: 2,
    stats: { roar: 15, form: 7, heat: 4, luck: 2 },
  },
  {
    id: "c3",
    name: "Golden Nation",
    color: "#eab308",
    rarity: "Epic",
    level: 1,
    stats: { roar: 25, form: 8, heat: 5, luck: 5 },
  },
  {
    id: "c4",
    name: "Crimson Nation",
    color: "#ef4444",
    rarity: "Rare",
    level: 1,
    stats: { roar: 18, form: 6, heat: 8, luck: 1 },
  },
  {
    id: "c5",
    name: "Nordic Nation",
    color: "#0ea5e9",
    rarity: "Common",
    level: 3,
    stats: { roar: 12, form: 9, heat: 1, luck: 2 },
  },
  {
    id: "c6",
    name: "Shadow Nation",
    color: "#8b5cf6",
    rarity: "Mythic",
    level: 1,
    stats: { roar: 40, form: 10, heat: 10, luck: 8 },
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
