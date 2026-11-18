# YUMY Ocean 0.7.7

## Changes
- Removed the separate Pause button. The single MENU button opens an in-game menu.
- In-game menu actions: Resume (continue current run) and Choose Mode / Stage (return to the mode selector; starting a mode or stage resets the run).
- Reworked predator mouth visuals with species-specific curved cavities and lower jaws for grouper, lionfish and manta. Jaw opening now eases through turn, lunge and recovery states. Shark retains its authored open-mouth art to avoid drawing a second artificial mouth over its teeth.
- Updated PWA cache to `yumy-077`.
- Same HTML5 Canvas codebase for Web/PWA and Capacitor Android.

## Run Web
From the project root:
```bash
npm install
npm run web
```

## Android
```bash
npm install
npx cap add android
npx cap sync android
npx cap open android
```
Then build a debug APK in Android Studio or run `npm run android:debug` after the Android project has been generated.

## Validation
JavaScript syntax was checked with Node.js. The ZIP packages are checked for integrity. Device gameplay and APK compilation have not been performed in this build environment.
