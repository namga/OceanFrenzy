# YUMY Ocean 0.8.1 — Predator Feeding AI

## Highlights
- Predatory fish (grouper, lionfish, manta, shark) now hunt smaller AI fish.
- Predators turn toward prey, open their mouth, lunge, consume prey at the mouth point, then close their mouth and return to swimming.
- Added closed-mouth idle sprites and uses the existing open-mouth species art only during the bite phase.
- Preserves player drag controls, player feeding rules, Survival/Adventure, PWA and Capacitor setup.

## Web
Serve the `www/` folder from a static HTTPS host.

## Android
Run `npm install`, `npx cap add android` (first time), `npx cap sync android`, then open with Android Studio.

The ZIP contains source and assets; it is not a prebuilt APK.


Android launcher icon build note: the GitHub Actions workflow copies only mipmap-* launcher resources. Capacitor generates values/ic_launcher_background.xml; do not copy a second ic_launcher_background color definition into res/values, or Android resource merging will fail with duplicate resources.


## 0.8.1 UI update
- Portrait HUD reflowed to prevent overlap with the in-game MENU control.
- Removed floating sound button from gameplay.
- Added menu audio settings for music/SFX toggles and independent volume sliders.
