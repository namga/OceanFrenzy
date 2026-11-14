# Ocean Frenzy v2.0.5 — Web Input Compatibility

## v2.0.5 changes
- Keeps the translucent mobile joystick for touch-screen phones and tablets.
- Restores mouse/trackpad dragging on the game canvas on every platform, including hybrid touchscreen laptops/tablets.
- Touch pointer events do not take over the fish; they remain dedicated to the joystick.
- Keyboard movement (WASD / arrow keys) remains enabled on web and desktop.
- Keeps the single Fish Library button and boost button.
- Bumped service-worker cache and Android APK artifact to v2.0.5.

## Run Web/PWA
`npm install`
`npm run check`
`npm run start`
Open the local HTTP URL; do not use `file://`.

## Android
Push to GitHub and run `.github/workflows/build-apk.yml`.
Artifact: `Ocean-Frenzy-v2.0.5-Android-debug.apk`.

## Validation
`npm run check` validates syntax, gameplay, AI and control wiring. Android CI and physical-device input testing have not yet been executed here.
