# YUMY Ocean 1.0.2

## Critical startup fix
- Restored the missing `applyLanguage()` initialization function.
- In 1.0.1, the script called `applyLanguage()` before the animation loop was scheduled, but the function was not defined. This raised a `ReferenceError`, stopped JavaScript initialization, and left the screen blank except for the CSS-positioned MENU button.
- The function now applies translations to all `[data-i18n]` elements, updates the document language and menu label, and recalculates responsive layout.
- Updated the PWA cache namespace to `yumy-ocean-1.0.2` so older cached assets are discarded on activation.

## Verification performed
- `node --check www/game.js` passed.
- Executed the game script in a mocked browser environment: boot passed, first render passed, Survival start passed, and the first gameplay frame passed.
- ZIP integrity checked after packaging.
- Not tested on a physical Android device or a public hosting environment.
