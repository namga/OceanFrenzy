# YUMY Ocean 1.0.0 — consolidated release

- Public game version synchronized to 1.0.0 across package metadata, web title, PWA manifest, service-worker cache namespace, and Android build workflow.
- Landscape BOOST status moved directly below the three life hearts, centered beneath the lives indicator and clear of MENU.
- Removed oversized floating ellipse/reef-arch strokes that appeared as unexplained curved lines in open water.
- Preserved mouse-move steering, mouse-hold boost, Android touch-drag controls, and independent ambient creature movement.

This archive contains source code and build configuration. It is not a precompiled APK.


### Mobile HUD alignment fix
- Repositioned the in-game MENU button into a dedicated slot to the right of the LIVES card.
- Scaled button position and dimensions with the canvas viewport to prevent overlap on portrait phones.
- Kept the game version at 1.0.0.

### Audio behavior refinement (still version 1.0.0)
- Player fish retains the chomp and gulp sounds when it successfully eats eligible prey.
- AI predators no longer play bite/chomp/gulp sounds when attacking the player or eating other fish, reducing overlapping sound effects.
- Predator warning, damage, growth, stage, and ambient sounds remain unchanged.
- Updated the service-worker cache namespace to refresh deployed assets without changing the public game version.
