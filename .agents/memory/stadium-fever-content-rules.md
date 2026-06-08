---
name: Stadium Fever content rules
description: Banned vocabulary/IP rules for the Project Stadium Fever football-crypto game prototype
---

# Stadium Fever content rules

The "Project Stadium Fever" prototype (artifacts/stadium-fever) must obey strict content rules. These are easy to violate accidentally in flavor/UI copy and are NOT caught by typecheck.

- **No betting language** anywhere in UI copy: `bet`, `odds`, `wager`, `prediction`, `payout`, `multiplier`. "multiplier" in particular slips into upgrade/stat descriptions — use "output boosts" / "bonus effects" instead.
- **No official football IP**: no FIFA / World Cup branding, real players, official crests, real jerseys. Use invented nations (Verde/Azul/Golden/Crimson/Nordic/Shadow) and abstract emblems only.
- **No emojis** in the UI.

**How to apply:** Before finishing any copy/UI change, run a lexical scan:
`rg -in "multiplier|wager|\bodds\b|\bbet\b|payout|prediction" artifacts/stadium-fever/src`
