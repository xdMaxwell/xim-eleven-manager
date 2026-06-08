# XIM — Eleven Manager

A frontend-only, clickable football-crypto management arcade prototype (brand: **XIM — Eleven Manager**, tagline "Build your stadium. Deploy your XI. Capture match-day heat."): own a neon stadium, open nation-card packs, mine Pitch Points, build a formation, deploy your XI into Fever events, watch a tactical match, and collect match receipts.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- All game code lives in `artifacts/stadium-fever/` (frontend-only React+Vite app, no backend).
- Design system / theme: `src/index.css` (single source of truth — fonts, color tokens, `glass`/`btn`/`chip`/`num`/`fcard` utilities, animations).
- Shared components: `src/components/` — `card-component.tsx` (premium 3D nation card), `stadium-backdrop.tsx` (cinematic night-stadium scene), `layout.tsx` (HUD + bottom nav shell).
- Pages (7 screens): `src/pages/` — `stadium-hq`, `packs`, `locker`, `fever-board`, `fever-match`, `receipts`, `season`.
- Game logic & data (source of truth): `src/lib/game-state.tsx` (Context + all state actions), `src/lib/constants.ts` (cards/events/leaderboard data), `src/lib/match.ts` (match engine: keyframes, events, summary).

## Architecture decisions

- Frontend-only prototype: all state is in-memory React Context (`game-state.tsx`); no backend, no persistence, fake data only.
- Routing via `wouter`, base-path-aware through `import.meta.env.BASE_URL` (the artifact is served under a path prefix).
- Visual direction is **modern premium 3D football arcade** (FIFA Ultimate Team / Football Manager HQ energy) — the earlier pixel/retro direction was fully removed.
- The Fever Match Viewer drives a `requestAnimationFrame` master clock; `finish()` calls `deployFormation()` then navigates to `/receipts`. Keep this flow intact when editing.
- Leaf artifacts typecheck without `noUnusedLocals`, so `tsc` will not catch unused imports — verify manually / via code review after visual rewrites.

## Product

A clickable football-crypto arcade prototype where you own a neon night stadium and:
- Claim Pitch Points and upgrade your stadium for more Roar Power (Stadium HQ).
- Open country-card packs to scout new nation cards (Packs).
- Manage, upgrade, and overcharge cards, and set a 3-card formation (Locker).
- Deploy your formation into live Fever events (Fever Board) and watch a broadcast-style match play out (Fever Match Viewer).
- Collect match-result receipts with rewards and impact grades, then claim them (Receipts).
- Track season progression and leaderboards (Season).

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
