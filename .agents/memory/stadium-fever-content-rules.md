---
name: Stadium Fever content rules
description: Banned vocabulary/IP rules for the Project Stadium Fever football-crypto game prototype
---

# Stadium Fever content rules

The "Project Stadium Fever" prototype (artifacts/stadium-fever) must obey strict content rules. These are easy to violate accidentally in flavor/UI copy and are NOT caught by typecheck.

- **No betting language** anywhere in UI copy: `bet`, `odds`, `wager`, `prediction`, `payout`, `multiplier`. "multiplier" in particular slips into upgrade/stat descriptions — use "output boosts" / "bonus effects" instead.
- **No official football IP**: no FIFA / World Cup branding, real players, official crests, real jerseys. Use invented nations (Verde/Azul/Golden/Crimson/Nordic/Shadow) and abstract emblems only.
- **No emojis** in the UI. This also catches dingbat/symbol glyphs that render as emoji on some platforms — e.g. `🎫` and `✓` (U+2713) have both slipped into empty-states / status markers. Replace with lucide-react icons (`Ticket`, `Check`) styled `imageRendering: "pixelated"`, or plain ASCII (`!`, `X`).

**How to apply:** Before finishing any copy/UI change, run BOTH scans:
- Betting: `rg -in "multiplier|wager|\bodds\b|\bbet\b|payout|prediction" artifacts/stadium-fever/src`
- Emoji/dingbat: `rg -n "[\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}]" artifacts/stadium-fever/src`
Also: the architect code_review repeatedly flags stray unused lucide-react imports — clean every page/layout/card after a visual rewrite.

**Public-dir background images:** generated pixel-art bgs live in `artifacts/stadium-fever/public/` and must be referenced base-path-safe via `url(${import.meta.env.BASE_URL}<file>.png)` (NOT a root-relative `/foo.png`, which breaks under the artifact's base path). Wire them as a `pointer-events-none absolute inset-0 -z-10 ... opacity-20` child of a `relative` page-root div so atmosphere bleeds through panel gaps without hurting readability.
