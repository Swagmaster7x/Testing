plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "com.personal.skateescape"
    compileSdk = 37

    defaultConfig {
        applicationId = "com.personal.skateescape"
        minSdk = 26
        targetSdk = 37
        versionCode = 1
        versionName = "1.0"
    }

    // The same fixed key as the Meal & Gym app, so a build from any computer installs over the last one.
    signingConfigs {
        getByName("debug") {
            storeFile = rootProject.file("app/signing/debug.keystore")
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

dependencies {
    testImplementation(libs.junit)
}
