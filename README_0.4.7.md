# YUMY Ocean 0.4.7

This patch fixes the HUD shifting left after the first food popup. The cause was the particle renderer setting `ctx.textAlign = "center"` without restoring Canvas state. The renderer now wraps particle drawing in `ctx.save()` / `ctx.restore()`. No camera, player-size, or HUD-layout changes were made.

Run `npm install`, then `npm run web` for the web build. Android packaging uses the existing Capacitor configuration. This ZIP contains source only, not a compiled APK.
