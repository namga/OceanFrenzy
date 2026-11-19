# YUMY Ocean 0.8.3 — Portrait HUD Redesign

## What's included
- Cross-platform HTML5 Canvas game for Web/PWA and Android through Capacitor.
- Portrait HUD rebuilt into distinct Score, Combo, Growth, Lives and Prey panels.
- Score label and score value are separated vertically to prevent overlap on narrow screens.
- Single in-game MENU button remains at the top-right safe area.
- Audio settings remain inside MENU, with independent music and SFX toggles/volume.
- Existing Survival/Adventure modes, fish rules, predator AI and game assets are retained.

## Web / PWA
Serve the `www/` directory from a static HTTPS host. The service worker cache is `yumy-083`.

## Android
Run `npm install`, `npx cap add android` (first setup only), `npx cap sync android`, then open with Android Studio. The GitHub Actions workflow can build a debug APK.

The ZIP contains source and assets; it is not a prebuilt APK.

## Android launcher resources
The build workflow copies only `mipmap-*` launcher resources. Do not copy an additional `values/ic_launcher_background` resource into the Android project; Capacitor already provides it and duplicate resource definitions break `mergeDebugResources`.


## 0.8.3 Navigation update
- Pause menu and audio settings are now separate screens.
- Audio settings has a dedicated Back button.
- Swipe from the left screen edge to the right returns to the previous screen (audio settings → pause menu → gameplay; map → home).
