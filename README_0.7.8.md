# YUMY Ocean 0.7.8 – UI Recovery

## Fixed
- Restored the complete foundational stylesheet from 0.7.6; the 0.7.7 package had only appended override rules and omitted the base layout styles.
- Home menu is again a centered full-viewport overlay above the game canvas.
- Restored brand typography, colors, panel backgrounds, responsive sizing, and overlay behavior.
- Kept the single MENU control flow from 0.7.7; no separate Pause button is shown.
- PWA cache updated to `yumy-078`.

## Platforms
- Web/PWA: serve the `www/` folder over HTTPS or localhost.
- Android: Capacitor wrapper is included in the full source. Run `npm install`, `npx cap add android`, `npx cap sync android`, then open Android Studio.

## Validation
- JavaScript syntax checked with Node.js.
- CSS integrity checked for foundational layout selectors and single-menu overrides.
- ZIP archives integrity-tested.
- No APK was compiled and no physical-device test was performed.
