# YUMY Ocean 0.7.9 – Predator Mouth Cleanup

Cross-platform source for Web/PWA and Android (Capacitor).

## 0.7.9 changes
- Removed the synthetic Canvas jaw overlay that caused detached dark mouth shapes and dangling strokes.
- Fish are rendered from their authored sprite artwork without extra mouth geometry.
- Predator turn/lunge/hit logic remains; the fake jaw overlay is not used.
- PWA cache version: `yumy-079`.

**Known limitation:** species-specific closed/open mouth sprite pairs are not yet included, so this version does not provide a true open-then-close jaw animation.

## Web / PWA
Serve the `www/` directory through HTTPS or localhost.

## Android
Run `npm install`, then `npx cap add android` on first setup, followed by `npx cap sync android`. Open the Android project in Android Studio to build an APK.

## Validation
JavaScript syntax and ZIP integrity were checked. No APK compilation or physical-device gameplay test is claimed for this package.
