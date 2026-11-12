import java.util.Properties

plugins {
    id("com.android.application")
}

// Analytics and crash reports are optional. Put the google-services.json from your Firebase project
// in this folder and they switch on; without it the app builds exactly as before, with no Firebase code.
val firebase = file("google-services.json").exists()
if (firebase) {
    apply(plugin = "com.google.gms.google-services")
    apply(plugin = "com.google.firebase.crashlytics")
}

android {
    namespace = "com.personal.creatureworkshop"
    compileSdk = 37

    defaultConfig {
        applicationId = "com.personal.creatureworkshop"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"
    }

    // A fixed key kept in the repo, so a build from any computer installs over the last one
    // and saved creatures survive updates. Only for this personal, sideloaded app.
    signingConfigs {
        getByName("debug") {
            storeFile = file("signing/debug.keystore")
            storePassword = "android"
            keyAlias = "androiddebugkey"
            keyPassword = "android"
        }
    }

    // Release builds for Google Play are signed with your own upload key, which is NOT kept in this repo.
    // Put its details in keystore.properties next to this file (see README) and run ./gradlew bundleRelease.
    val keyProps = Properties().apply {
        val f = rootProject.file("keystore.properties")
        if (f.exists()) f.inputStream().use { load(it) }
    }
    if (keyProps.containsKey("storeFile")) {
        signingConfigs.create("release") {
            storeFile = rootProject.file(keyProps.getProperty("storeFile"))
            storePassword = keyProps.getProperty("storePassword")
            keyAlias = keyProps.getProperty("keyAlias")
            keyPassword = keyProps.getProperty("keyPassword")
        }
    }
    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfigs.findByName("release")?.let { signingConfig = it }
        }
    }

    sourceSets.getByName("main").java.srcDir(if (firebase) "src/firebase/java" else "src/plain/java")

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    implementation("com.google.android.gms:play-services-ads:25.5.0")           // rewarded ads (AdMob)
    implementation("com.google.android.ump:user-messaging-platform:4.0.0")     // the consent prompt Google requires in Europe
    implementation("com.google.android.play:review:2.0.2")                     // the in-app "rate this app" card
    implementation("com.android.billingclient:billing:9.1.0")                  // Google Play purchases
    if (firebase) {
        implementation(platform("com.google.firebase:firebase-bom:35.2.0"))
        implementation("com.google.firebase:firebase-analytics")
        implementation("com.google.firebase:firebase-crashlytics")
    }
}
