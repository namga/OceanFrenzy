# YUMY Ocean 0.8.7 — Clownfish Alpha Cleanup

## Changes
- Replaced `www/assets/clownfish.png` with a cleaned transparent PNG.
- Removed the cyan/blue background glow fringe while preserving the clownfish body, stripes, fins, and antialiased silhouette.
- No gameplay, fish sizing, collision, or AI logic changed.
- Updated package and PWA cache version to 0.8.7 (`yumy-087`).

## Web/PWA
Serve the `www/` directory over HTTPS (or localhost). If an older build remains visible, close the old tab and reload after the service worker activates.

## Android
Run `npm install`, `npx cap sync android`, then build from Android Studio or `npm run android:debug` if the Android project is present.

## Validation
The updated PNG is RGBA with transparent background. JavaScript syntax and ZIP integrity should be checked before release. No APK or physical-device test is included.
