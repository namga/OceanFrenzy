# Ocean Frenzy v2.0.0 — Full Campaign Remake

## Chosen direction
Full remake inspired by the classic Feeding Frenzy arcade loop; Android phones, Android tablets and Web/PWA; glossy 3D cartoon-realistic art direction; Vietnamese-first interface. Game code and assets are original.

## Implemented in this source release
- 16 new high-detail 3D-rendered fish sprites, individually cropped with transparent backgrounds.
- Player fish visually evolves as it grows: clownfish → blue tang → angelfish → parrotfish.
- 30 named campaign stages with saved unlock progression and themed stage color treatments.
- Boss shark encounters every fifth campaign stage.
- Survival and Challenge modes.
- Three difficulty tiers with different life counts: Easy 5, Normal 3, Hard 2.
- Respawn and temporary invulnerability while lives remain.
- Fish collection gallery with all 16 species.
- Predator hunting, prey escape, schooling, power-ups, growth and stage completion.
- Touch, keyboard and boost controls; responsive portrait/landscape layout.
- Web assets mirrored into Capacitor `www/`; service worker cache versioned for v2.0.0.
- GitHub Actions workflow names the APK `Ocean-Frenzy-v2.0.0-Android-debug.apk`.

## Run the Web version
Run `npm install`, then `npm run start` from this folder. Open the local HTTP URL shown by the server. Do not open `index.html` directly as a `file://` URL; service workers and PWA features require HTTP/HTTPS.

## Build Android
Push the folder contents to the GitHub repository and run the included `build-apk.yml` workflow. The generated APK is uploaded as a workflow artifact.

## Rendering note
Gameplay uses a 2D Canvas engine with high-detail 3D-rendered sprite artwork and layered 2.5D effects, not a real-time polygonal 3D engine. This keeps the game lightweight and compatible with mobile browsers and Android WebView.

## Validation
`npm run check` validates JavaScript parsing, core UI, 30-stage campaign, boss/lives systems, and all 16 sprite assets in both Web and Android folders. Workflow YAML, manifest, asset mirroring and ZIP integrity were also checked. The Android GitHub Actions build and physical-device gameplay have not been run from this environment.
