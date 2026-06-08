---
name: Tailwind v4 CSS gotchas
description: Two recurring CSS build errors in Tailwind v4 projects (this repo uses tailwindcss@4) that the design subagent keeps reproducing.
---

# Tailwind v4 CSS build gotchas

Two non-obvious build errors that broke the dev server and were not caught by `tsc` typecheck (only surfaced in the vite workflow logs / browser console).

## 1. `@apply` cannot reference a custom (non-utility) class
Tailwind v4 `@apply` only accepts real utility classes, not your own `.glow-box`-style helpers. Doing `@apply ... glow-box;` throws `Cannot apply unknown utility class 'glow-box'`.

**How to apply:** inline the underlying declarations (e.g. the `box-shadow`) directly into the rule instead of `@apply`-ing the custom class name.

## 2. `@import url(...)` for fonts must come before `@import "tailwindcss"`
A Google-Fonts `@import url('https://fonts.googleapis.com/...')` placed *after* `@import "tailwindcss";` throws `@import must precede all other statements`. Tailwind inlines its content at its import site, so any other `@import` after it ends up mid-file.

**How to apply:** put font `@import url(...)` lines as the very FIRST lines of `index.css`, above `@import "tailwindcss";`.

**Why:** these only appear in the vite/postcss build output, not in typecheck — always check the workflow logs after a CSS-heavy build, don't rely on `tsc` passing.
