# Ocean Frenzy v2.4.3 — MLEM text feedback

- Replaced the eight-point star badge with bold red “MLEM!” text only.
- No star, badge, circle, or background shape; white outline and subtle shadow keep the text readable over gameplay.
- Preserved the existing pop, rise, fade animation and all eat/caught/AI feedback triggers.
- Version remains 2.4.3.

# Ocean Frenzy 2.4.3 — 8-point red-outline MLEM star

- MLEM feedback badge is now an eight-point star (16 alternating vertices).
- Gold fill retained; bold red outer border and a fine pale inner highlight.
- Existing MLEM triggers, timing, gameplay and application version remain unchanged.
- Web and Android web assets synchronized.

# Ocean Frenzy v2.4.3 — Star MLEM feedback

- Replaced the face emoji / rounded speech bubble with a bright arcade star badge.
- The word MLEM! is centered inside the star and appears for both eating prey and being caught.
- Star pops in, floats upward, glows and fades out.
- Kept application version at 2.4.3; this is a visual maintenance update.
- Web and Android www assets are synchronized.

# Ocean Frenzy 2.4.3 — Cetacean direction and size balance patch

- Corrected source-art orientation: blue whale, sperm whale, orca and dolphin sprites face left by default; rendering now mirrors them only when needed to match their actual travel direction.
- Rebalanced body silhouettes: reduced excessive horizontal scale and increased body height for whale, sperm whale, orca and dolphin sprites.
- Added size-based AI cruise speed: larger creatures swim slower, including during flee bursts; flee speed is now a multiplier of their own size-adjusted cruise speed rather than a global minimum.
- Preserved forward-only movement, touch swipe controls, desktop keyboard/mouse, AI hunting/fleeing and all other gameplay.
- App version remains 2.4.3. Service-worker cache key updated to force web clients to receive this maintenance patch.

Validation: `node scripts/check-game.js` and `node scripts/test-flee-ai.js` pass. APK not built in this session.

# Ocean Frenzy 2.4.3 — Forward-only movement for all creatures

## Update
- Applied forward-only movement to every AI-controlled creature, not only the player.
- Horizontal movement direction is locked to the same heading sign used to mirror each creature sprite.
- AI creatures can still swim horizontally, vertically and diagonally, turn smoothly, hunt and flee.
- No reverse swimming: horizontal velocity cannot oppose the direction the creature faces.
- Existing mobile swipe controls and desktop keyboard/mouse controls are preserved.
- Application version remains 2.4.3.

## Validation
- JavaScript/game regression checks and AI flee regression are run in the release workflow.
- This source ZIP is not an APK; build the Android package using the included GitHub Actions workflow.

# Ocean Frenzy v2.4.3 — Mobile swipe controls

## Controls update
- Removed the virtual joystick from mobile and tablet layouts.
- Touch users press and swipe on the game field in the direction they want to swim.
- Holding the finger keeps steering; releasing or cancelling the touch stops directional input.
- Desktop and web mouse aiming plus WASD/arrow-key movement remain unchanged.
- Boost button remains independent and is repositioned beside the mobile hint.
- Map progress indicator remains visible and is no longer nested inside the joystick element.
- Service-worker cache key updated so installed PWA clients fetch the new control implementation.
- Small maintenance update: app/package version remains 2.4.3.

## Validation
- JavaScript syntax and game regression tests pass.
- AI flee regression passes.
- Web and Android `www` assets are synchronized.
- APK has not been built or tested on a physical device in this session.

# Ocean Frenzy v2.4.3 — Straight-tail marine mammal sprites

## Latest artwork update (maintenance; app version unchanged)
- Replaced the blue whale, sperm whale, orca and dolphin artwork with four separately cropped, transparent WebP sprites from the newly approved straight-tail reference sheet.
- The four animals now have straight body axes and naturally horizontal tail flukes in their base images, making the whole-sprite swim animation easier to read.
- Sperm whale now loads its own sprite instead of reusing the blue whale artwork.
- Sprite proportions were adjusted independently so long-bodied whales retain their natural silhouette in-game.
- Removed no gameplay systems; AI, controls, language selection, campaign and Android packaging remain intact.
- Service-worker cache key updated so the new artwork is fetched even though the app version stays at 2.4.3.

## Validation
- Each sprite is a separate transparent WebP asset under `assets/fish/` and `www/assets/fish/`.
- JavaScript, gameplay regression and AI flee checks pass.
- Android `www` assets are synchronized.
- APK not built in this session.

# Ocean Frenzy v2.4.3 — Shark-style whole-sprite swimming

## Change in this maintenance update
- Blue whale, sperm whale, dolphin and orca now use the same whole-sprite rendering and swim motion as the shark.
- Removed detached tail compositing and split-tail assets for these species.
- Each animal keeps its own original image, size, orientation and left/right facing.
- All four use the shark's 4.2 swim beat, subtle body roll and squash/stretch pulse.
- No application version bump: this is a small maintenance change within v2.4.3.

## Validation
- JavaScript syntax and game regression checks pass.
- AI flee regression passes.
- Web and Android `www` copies are synchronized.
- APK has not been built or tested on a physical device in this session.

# Ocean Frenzy v2.4.3 — Visible photographic tail animation

## Tail animation correction
- The whale and dolphin tail cutouts are rotated independently around their anatomical attachment points every render frame.
- The tail keeps its original photographic texture; no generic cartoon fin is substituted.
- Blue whale: slow, powerful 35-degree tail stroke.
- Sperm whale: slower, slightly smaller stroke.
- Dolphin: faster, wider 47-degree tail stroke.
- Orca: medium-fast 41-degree stroke.
- The torso is redrawn over the tail joint to prevent visible separation.
- Left/right mirroring remains supported.

## Validation
- JavaScript syntax and game regression checks pass.
- AI flee regression passes.
- Web and Capacitor `www` assets are synchronized.
- Android build workflow YAML parses successfully.
- The APK has not been built or tested on a physical phone in this session.

# Ocean Frenzy v2.4.3 — Clearly articulated whale and dolphin tails

## Changes
- Replaced the low-visibility sprite shear with a dedicated animated caudal-fluke drawing rig.
- Each frame now draws a separate two-lobed tail fin that swings around the tail peduncle; the torso overlays the joint.
- Added a narrow tail stalk, shaded two-lobed fin, highlight ridge and soft shadow for visual readability.
- Increased tail excursion so it remains visible on small phone screens.
- Blue whale and sperm whale use slow, powerful beats; dolphins use faster, wider beats; orcas use a medium-heavy beat.
- Tail motion is independently phase-offset per creature and mirrors correctly when swimming left/right.
- Existing gameplay, 11 languages, PWA and Android build workflow remain unchanged.

# Ocean Frenzy v2.4.2 — Visible tail-beat animation

## v2.4.2 changes
- Replaced the nearly imperceptible tail rotation with continuous vertical caudal-fin flex around the tail attachment point.
- Tail tips now travel visibly up and down while the peduncle remains anchored to the torso.
- Blue whale and sperm whale: slower, heavier tail beats.
- Dolphin: faster and wider tail beats; orca: intermediate stroke.
- Added a small secondary harmonic and species-specific fin rotation for less mechanical movement.
- Removed the strip-based renderer to avoid seams and segmented-looking tails.
- Kept horizontal orientation, left/right mirroring, all gameplay systems and 11 languages.

# Ocean Frenzy v2.4.1 — Natural whale & dolphin tail motion

## v2.4.1 changes
- Split blue whale, sperm whale, dolphin and orca artwork into body and caudal-tail layers.
- Added independent tail-fluke animation around the tail peduncle, with anti-aliased layer masks and the torso drawn over the joint to keep it visually connected.
- Blue whale and sperm whale use slow, powerful tail strokes with subtle body counter-flex.
- Dolphins use a quicker, more flexible tail beat; orcas use a medium-fast, heavier stroke.
- Each species has its own stroke amplitude and cadence. Left/right facing still works by mirroring the complete rig.
- Kept the existing horizontal body orientation and all 11 UI languages.

# Ocean Frenzy v2.4.0 — Horizontal swim & global languages

## v2.4.0 changes
- Marine creatures swim horizontally and never roll upside down; artwork flips left/right only.
- Fish, sharks, rays, dolphins and whales spawn beyond the left or right viewport edge and swim into the visible play area.
- The AI still chooses whether to flee or hunt, but its heading is constrained to a natural horizontal swimming axis. Gentle vertical lane drift preserves motion.
- Added 11 selectable UI languages: Vietnamese, English, Simplified Chinese, German, French, Korean, Japanese, Spanish, Portuguese, Russian and Arabic.
- Selecting English now translates the start menu, settings, pause/game-over overlays, HUD labels, score messages, boosts, life notifications, campaign feedback and fish-library categories; English is the fallback for any untranslated label.
- Language selection is saved on the device and shared between the start screen and settings.
- APK versionName and artifact filename continue to derive from package.json.

# Ocean Frenzy v2.3.0 — Maintenance patch

- Fixed a startup blocker: initial language setup no longer tries to update the gameplay HUD before a player exists.
- Kept the package version at 2.3.0 for this small bug-fix release; APK filename and Android versionName are both generated from package.json.
- Added a detailed 3D underwater fish-and-pearl launcher icon for PWA and native Android.
- Android build workflow generates launcher icons for all standard densities and adaptive launcher icons.
- Added randomly spawning open seashells with a glowing pearl on the seabed. Eating one doubles the player's size (up to the game size cap) and doubles the score, with a clear bonus toast and burst effect.


## v2.3.0 changes
- Mobile joystick is easier to see: stronger glass ring, brighter thumb control and clearer active state.
- All drop-downs use a consistent ocean-glass appearance with a custom aqua chevron and styled option palette.
- Fish now turn in their actual travel direction, with species-specific swim rhythm, body roll, pitch, soft depth shadows, moving highlights and smoother AI steering.
- Pause screen now centers the three actions in one column with equal width and height.
- Improved landscape orientation layout for HUD, bottom controls, joystick and overlays on short screens.
- Added marine species to the Fish Library and spawn ecosystem: great white shark, hammerhead shark, tiger shark, manta ray, dolphin, blue whale, sperm whale and orca.
- Added dedicated rendered sprites for great white, hammerhead, manta ray, dolphin, blue whale and orca. Tiger shark and sperm whale have separate catalog entries and visual color/brightness treatments based on the closest base sprite; bespoke species-specific artwork can be added in a later art pass.
- Species have different body sizes and swim speeds; whales are large and slow, dolphins are fast, rays glide, and orcas/sharks hunt smaller creatures.
- Expanded world width to exactly 3 times the current viewport width. Camera follows the player; map edges are bounded; the player can explore left/right and a small progress track shows position.
- Fish and pickups spawn in world coordinates; fish continue swimming inside world boundaries.
- Retains mobile joystick, desktop mouse/trackpad drag, WASD and arrow-key movement.

## Run Web/PWA
`npm install`
`npm run check`
`npm run start`
Open the local HTTP URL; do not use `file://`.

## Android
Push to GitHub and run `.github/workflows/build-apk.yml`.
Artifact: `Ocean-Frenzy-v2.3.0-Android-debug.apk`.

## Validation
`npm run check` validates JavaScript syntax, UI, rendering, AI, touch/desktop controls, species assets and world-map logic. Android CI and physical landscape gameplay still need testing.

## Forward-only player movement (maintenance patch, version unchanged)
- The player fish has no reverse-swim input.
- Horizontal input turns the fish to face left or right before forward movement.
- On a horizontal turn, opposite-direction momentum is cleared so the fish cannot slide backwards while facing the other way.
- Vertical and diagonal swimming remain available.
- Swipe controls on touch devices and keyboard/mouse controls on desktop remain enabled.

## MLEM event feedback (maintenance patch, version unchanged)
- Eating a smaller fish displays a floating 😋 MLEM! comic bubble at the prey's position.
- Being eaten displays a floating 😵 OOPS! bubble at the player's position during the slow-motion hit sequence.
- AI predators eating smaller fish also display the MLEM! feedback.
- The icon pops in, floats upward and fades out; it is rendered on the game canvas and follows the world camera.
- MLEM feedback timers continue during the death slow-motion sequence.


### v2.4.3 maintenance update — marine scale and stage environments

- Rebalanced large-creature hitbox sizes and swim speeds: dolphin radius 28, manta ray 36, orca 48, sperm whale 64 and blue whale 80.
- Large species now appear only after the player is at least 15% larger than that species, so newly unlocked creatures are genuinely huntable: dolphin at player radius 33, manta ray 42, orca 56, sperm whale 74 and blue whale 92.
- Eating fish now produces meaningful proportional growth (minimum +0.45 radius or 6% of prey radius); the player growth cap is raised to 110 so the blue whale tier is reachable. Small food and power-ups also use the same growth cap. The HUD growth bar now tracks the full progression range.
- Replaced the single repeated reef backdrop with stage-specific color palettes and landmark scenery across all 30 campaign stages (caves, kelp forests, wrecks, ruins, ice, volcanoes, jellyfish gardens, abyssal zones and more).
- Product version remains 2.4.3; the service-worker cache key is refreshed so PWA clients receive the updated environments.


## v2.4.3 maintenance — realistic creature scale and visibility repair
- Rebalanced the actual collision radii: shark 32, great white 42, hammerhead 37, tiger shark 40, dolphin 34, manta ray 40, orca 58, sperm whale 76 and blue whale 94.
- Player artwork now evolves with growth from small reef fish to shark, great white, orca, sperm whale and blue whale silhouettes instead of stretching a tiny clownfish/parrot sprite into a giant creature.
- Large species unlock only when the player is at least 12% larger than their collision radius: dolphin 39, manta ray 46, orca 66, sperm whale 86 and blue whale 106.
- AI predators can grow to the same 110 radius ceiling as the player.
- Large creatures now use a size-aware vertical safe area; the previous fixed bottom/top margin allowed rays and whales to drift mostly outside the visible playfield.
- Kept app version 2.4.3 and refreshed the service-worker cache key for this maintenance update.
