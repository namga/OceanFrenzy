# Ocean Frenzy v1.0.7 — Capacitor webDir repair

## Root cause fixed

The previous Capacitor config set `webDir` to `.`. Capacitor rejects the repository root as a web asset directory (`"." is not a valid value for webDir`). Since `cap add android` failed before creating the Android project, the following plugin sync then failed because `android/app/src/main/assets/capacitor.plugins.json` did not exist.

This release:
- Changes Capacitor `webDir` to `www`.
- Copies the complete static game runtime (index, service worker, manifest, icons and assets) into `www/`.
- Adds a workflow preflight that checks `www/index.html` exists before creating the Android project.
- Keeps the Android project generated fresh in CI; do not commit a partially generated Android folder.

## GitHub update

1. Extract this ZIP.
2. Copy the contents of `ocean-frenzy-v1.0.7` into the repository root, replacing existing files.
3. Commit and push to the branch configured in the workflow.
4. Run **Ocean Frenzy Android APK** in Actions.

Expected artifact: `Ocean-Frenzy-v1.0.7-Android-APK`
Expected APK: `Ocean-Frenzy-v1.0.7-Android-debug.apk`

This source/workflow has been statically validated and packaged. It has not been executed on your GitHub repository; APK success must be confirmed by the Actions run.
