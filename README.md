# YUMY Ocean 1.0.0

Cross-platform HTML5 Canvas arcade game with a Capacitor Android wrapper and offline PWA.

## Controls
- **Web / PC:** move the mouse over the game canvas; the fish follows the cursor continuously. No click or mouse hold is required.
- **Android:** touch and drag on the game canvas.

## Release 1.0.0
- 50 adventure stages and 50 individually generated background images; each stage has its own color treatment and reef composition.
- Increasing score goals, predator counts and predator chase speed in later stages. Sharks and orcas remain late-game threats.
- Three original transparent vector fish added: pufferfish, butterflyfish and angelfish.
- Existing fish, shark, manta, turtle, whale and orca animation systems retained; large ambient creatures continue to use frame-based swimming animation.
- Bundled Lato font files for a consistent, offline-friendly interface.
- Existing six-language interface retained.

## Web / PWA
Serve the `www` folder over HTTPS or localhost. The service worker precaches all 50 stage backgrounds and local assets for offline play.

## Android
Run `npm install`, `npx cap add android` (first time only), `npx cap sync android`, then `bash scripts/set-android-version.sh` and open Android Studio with `npx cap open android`. The GitHub Actions workflow builds a debug APK with version name 1.0.0 / version code 100. This archive contains source and build workflow, not a precompiled APK.

## Validation
- JavaScript syntax checks passed for game and service worker.
- 50 stage background files were verified present and unique by SHA-256.
- All 62 creature PNG sprites were audited for alpha transparency and transparent corners; the eight shark swim frames had their baked light checkerboard removed. The three added SVG fish have transparent canvases.
- Browser gameplay, real Android device testing and final APK compilation still need to be run in the target environment.


### Mobile controls (1.0.0)
- Choose Joystick or Swipe in Settings.
- Tap the ⚡ button at the lower-right to trigger the 5-second speed boost.
- The button shows when boost is ready, active, or cooling down.
- In landscape, the Settings/Menu button is positioned at the right side of the HUD.
