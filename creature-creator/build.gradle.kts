plugins {
    id("com.android.application") version "9.5.1" apply false
    // Only applied when app/google-services.json exists (see app/build.gradle.kts).
    id("com.google.gms.google-services") version "4.6.0" apply false
    id("com.google.firebase.crashlytics") version "3.0.8" apply false
}
