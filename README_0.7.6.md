# YUMY Ocean 0.7.6

## Changes
- Removed the moray eel species and its legacy asset.
- Added a dedicated transparent seahorse sprite. It is a non-predator species with slower, gentle swimming and vertical drift.
- Added six manta-ray wing-flex frames and a swimming animation that cycles through them with a subtle body bob.
- Corrected the manta jaw overlay anchor to the head-facing side.
- Updated PWA cache to `yumy-076`.

## Platforms
- Web/PWA: serve the `www/` directory over HTTPS (or localhost during development).
- Android: use the Capacitor project configuration in this source package; generate/sync the Android project and build with Android Studio or Gradle.

## Validation
- `node --check www/game.js` passed.
- PNG assets are RGBA with transparency.
- APK compilation and real-device animation testing have not been performed in this package.
