# YUMY Ocean 0.7.5

Cross-platform Web/PWA + Android Capacitor source.

## 0.7.5 fixes
- Pause dialog is viewport-centered with equal-width action buttons.
- Pause control is fixed to the upper-right; Web Menu is fixed to the upper-left.
- Corrected source facing metadata for lionfish and shark sprites (both face right in their PNGs).
- Predator attack uses a visible jaw wind-up, then a mouth-led lunge.
- Predator jaw overlay is anchored per species and mirrored with the sprite.
- Fish facing follows horizontal velocity after steering.

## Web
Serve the `www` directory over HTTPS or localhost.

## Android
Run `npm install`, `npx cap add android` (first setup), `npx cap sync android`, then open Android Studio or run the included GitHub Actions workflow.

The source has been syntax-checked. Real-device gameplay and APK compilation have not been performed in this package.
