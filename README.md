# YUMY Ocean 0.7.4

Cross-platform Web/PWA + Android Capacitor source.

## Changes in 0.7.4
- Predator attack trigger works when a predator is clearly larger than the player.
- Rear/tail contact starts a visible turn before the lunge.
- Predator jaw opens wider during turn and lunge; bite collision is tested at the mouth after movement.
- Corrected source-facing metadata for lionfish and shark sprites.
- Replaced PWA and Android launcher icons with the bright red YUMY logo.

## Web
Open `www/index.html` through a local web server or deploy `www/` to HTTPS hosting.

## Android
Run `npm install`, `npx cap add android` (first setup), `npx cap sync android`, then open Android Studio or use the GitHub Actions workflow.


## YUMY Ocean 0.7.6
- Replaced moray eel with a dedicated transparent seahorse sprite and gentler non-predator behavior.
- Added six manta ray wing-flap frames; animation cycles while the ray swims, with a subtle body bob.
- Updated PWA cache to `yumy-076`.


## YUMY Ocean 0.7.7
- Removed the separate pause control. The single MENU button opens an in-game menu with Resume and Choose Mode/Stage actions.
- Choosing a mode or stage returns to the start flow; starting it calls reset() so the run begins from the beginning.
- Predator jaw rendering now uses species-specific curved mouth cavities and lower-jaw shapes with a smoothed open/close envelope. The shark retains its authored toothy open-mouth sprite.
- Web and Capacitor Android share the same game code.
