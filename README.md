# Ocean Frenzy v1.0.5

## Important: replace the old GitHub workflow

The previous run log still showed `android-actions/setup-android@v3`. This release removes that action entirely and uses the Android SDK preinstalled on GitHub's Ubuntu runner.

1. Extract this ZIP.
2. Copy the **contents** of the `ocean-frenzy-v1.0.5` folder into the repository root.
3. In the repository, open `.github/workflows/`.
4. Replace `build-apk.yml` with this release's file.
5. Delete any other workflow YAML that still contains `android-actions/setup-android@v3` or installs Android packages through that action. Do not leave the old workflow active.
6. Commit and push to `main`, then open Actions and run **Ocean Frenzy Android APK**.

The first log step prints the commit SHA and fails early if an old `setup-android@v3` workflow remains. The SDK packages are installed as three separate `sdkmanager --install` commands.

Expected artifact: `Ocean-Frenzy-v1.0.5-Android-APK`
Expected APK filename: `Ocean-Frenzy-v1.0.5-Android-debug.apk`

## Local web run

Run `npm install`, then `npm run start`, or serve this directory as a static site.

## Build status

This ZIP contains a corrected workflow source. It has not been run on the user's GitHub repository, so an APK build is not claimed as successful until GitHub Actions produces the artifact.
