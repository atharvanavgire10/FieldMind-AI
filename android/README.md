# FieldMind AI — Android app

The native Android companion to the FieldMind AI web app. Same idea, built for a
phone in a technician's hand: photograph the equipment and its fault code, get a
grounded diagnosis, work through the guided procedure, file the service report.

## Run locally

**Prerequisites:** [Android Studio](https://developer.android.com/studio)

1. Open Android Studio.
2. Select **Open** and choose this `android/` directory.
3. Let Android Studio resolve the Gradle sync and fix any SDK incompatibilities
   as it imports the project.
4. Create a file named `.env` in this directory and set `GEMINI_API_KEY` to your
   model API key (see `.env.example`). This is optional — without a key the app
   runs against its on-device knowledge base, and a key can also be entered at
   runtime under Settings → Enterprise Backend Configuration.
5. Before producing a release build, remove this line from the app's
   `build.gradle.kts`: `signingConfig = signingConfigs.getByName("debugConfig")`
6. Run the app on an emulator or a physical device.

## Notes

Never commit a real API key. `.env` is git-ignored; `.env.example` holds
placeholders only.
