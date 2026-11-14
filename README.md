# Ocean Frenzy v1.0.3 — Release Candidate

A self-contained HTML5 arcade fish-eat-fish game for desktop browsers, phones, tablets, and Android via Capacitor. Original canvas-drawn art; no third-party game assets.

## Play locally

```bash
npx serve .
```

Open the local URL. Landscape is recommended. Touch and drag to swim on touch screens; use WASD or arrow keys on desktop. Hold Space or tap the boost button to dash.

## Included in v1.0.3

- Adventure campaign with five launch stages and unlock progress saved locally
- Survival mode and Challenge mode
- Eat smaller fish and plankton to grow; larger predators can eat the player
- Autonomous predator/prey AI, schooling, fleeing, hunting, and ecosystem feeding
- Fish AI settings with defaults: swim 65%, hunting 70%, schooling on, auto-escape on, Normal difficulty
- Pause/resume, restart, game-over, stage-complete flow, local high scores
- Boost meter, responsive touch/keyboard controls, sound effects toggle, graphics quality setting
- Offline PWA cache and Capacitor Android project configuration

## PWA

Serve over HTTPS or localhost. Use the browser's Install/Add to Home Screen action.

## Android debug APK

Push this folder to GitHub. The workflow in `.github/workflows/build-apk.yml` runs on push or manual dispatch and uploads a versioned debug APK artifact. Android SDK command-line tools are pinned to a stable release to avoid failures caused by automatically selecting the newest SDK manager.. The debug APK is for testing, not Play Store distribution.

## Next version

Additional campaign regions, fish species, boss encounters, and new challenge stages are intentionally reserved for v1.1.0 and later.


## Visual & audio upgrade v1.0.3
- Added a high-quality reef background illustration, light rays and layered underwater atmosphere.
- Reworked fish rendering with gradient bodies, animated tail fins, dorsal/pectoral fins, gill and scale highlights, eye glints and player aura.
- Added synthesized underwater ambience and distinct sound effects for feeding, boost, power-ups, victory and defeat. Audio starts after the first user gesture and can be disabled in Settings.
- Added the reef artwork to the offline service-worker cache.


## Android SDK workflow fix v1.0.3
- Fixed `android-actions/setup-android` package input: it requires a comma-separated package list, not a YAML multiline list.
- SDK verification now fails clearly if required packages are missing instead of masking errors.
