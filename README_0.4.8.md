# YUMY Ocean 0.4.8 – Visual Asset Repair

This patch fixes the ugly scene artifacts seen in the previous build.

## Changes
- Correct full-body shark, manta ray, and moray eel sprites.
- Correct kelp, volcanic, and abyss environment backgrounds.
- Tropical-bay scene no longer draws tall procedural green lines across the play area.
- No more solid orange oval placeholders while fish images are loading.
- Service worker cache: `yumy-048`.

## Run on Web
Serve the `www` folder over HTTP/HTTPS. For Android, run `npm install`, `npx cap sync android`, then build from Android Studio.

This is source code, not a precompiled APK. JavaScript syntax was checked with `node --check www/game.js`; no physical-device test is claimed.
