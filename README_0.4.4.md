# YUMY Ocean 0.4.4

## New content
- New large fish: manta ray, moray eel, and shark.
- Unlock pacing: manta from progress 5, moray from progress 6, shark from progress 8.
- New backgrounds: kelp forest, volcanic seafloor, and bioluminescent abyss, in addition to the coral reef.
- Nine Adventure regions and Survival waves use scene-specific background families, color grading, and foreground details.

## Fish size rules
Predators still use the shared `canEatFish()` check. Their size requirement is not bypassed by score or level. Maximum player radius remains 150, so the shark (logical radius 82) is a late-game challenge that can eventually be eaten only after sufficient growth.

## Run
Open `www/index.html` in a local web server or use the Capacitor workflow described in `README.md`. This ZIP is source; it is not a compiled APK.
