---
name: Timed viewer auto-advance lifecycle
description: How a self-advancing animated screen (e.g. Stadium Fever match viewer) must guard deferred navigation/state on unmount.
---

# Self-advancing timed screen lifecycle

A screen that auto-finishes after a timer (requestAnimationFrame loop + a deferred `setTimeout(finish, …)`) and both navigates and mutates global state on finish must protect against firing after the component unmounts.

**Rule:** any deferred callback that calls `setLocation(...)` or a state-mutating action (e.g. `deployFormation`) must:
1. be tracked in a ref and cleared in the effect cleanup (`clearTimeout`), AND
2. be gated by a `mountedRef` + an idempotent `finishedRef` so a late timer cannot navigate/mutate from an unmounted screen.

**Why:** without this, leaving the screen during the final delay window still fires the timer — creating a spurious record and force-redirecting the user away from whatever screen they navigated to. A `finishedRef` alone stops *double* finishes but not the *post-unmount* finish.

**How to apply:** in the RAF effect, store `finishTimeoutRef.current = setTimeout(finish, …)`; cleanup sets `mountedRef.current = false`, cancels the RAF, and clears the timeout. `finish` early-returns when `finishedRef.current || !mountedRef.current`.
