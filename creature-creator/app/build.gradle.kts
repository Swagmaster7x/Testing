plugins {
    id("com.android.application")
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

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
