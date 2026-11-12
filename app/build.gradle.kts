import java.util.Properties

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.kotlin.serialization)
    alias(libs.plugins.ksp)
    alias(libs.plugins.room)
    alias(libs.plugins.roborazzi)
}

/** Release signing for the Play Store build: an untracked file next to settings.gradle.kts (see README). */
val releaseKeys = Properties().apply {
    val file = rootProject.file("keystore.properties")
    if (file.exists()) file.inputStream().use { load(it) }
}

/** Store settings that change per release or per account live in gradle.properties or ~/.gradle/gradle.properties. */
fun storeProperty(name: String, fallback: String): String = providers.gradleProperty(name).getOrElse(fallback)

// Google's published AdMob test IDs: they always serve labelled test ads. Replace with your own before release.
val testAdMobAppId = "ca-app-pub-3940256099942544~3347511713"
val testBannerUnitId = "ca-app-pub-3940256099942544/9214589741"

android {
    namespace = "com.personal.mealgym"
    compileSdk = 37

    defaultConfig {
        minSdk = 26
        targetSdk = 37
        versionCode = 1
        versionName = "1.0"
    }

    signingConfigs {
        // A fixed key kept in the repo, so a build from any computer installs over the last one
        // and the app's data survives updates. Only for debug builds and the personal edition.
        getByName("debug") {
            storeFile = file("signing/debug.keystore")
            storePassword = "android"
            keyAlias = "androiddebugkey"
            keyPassword = "android"
        }
        // The Play Store upload key. Never commit it; keystore.properties points at it.
        create("release") {
            if (releaseKeys.isNotEmpty()) {
                storeFile = rootProject.file(releaseKeys.getProperty("storeFile"))
                storePassword = releaseKeys.getProperty("storePassword")
                keyAlias = releaseKeys.getProperty("keyAlias")
                keyPassword = releaseKeys.getProperty("keyPassword")
            }
        }
    }

    flavorDimensions += "edition"
    productFlavors {
        // The app Swag and Ashley use: unchanged, fully offline, sideloaded.
        create("personal") {
            dimension = "edition"
            applicationId = "com.personal.mealgym"
            resValue("string", "app_name", "Meal & Gym")
            buildConfigField("boolean", "STORE", "false")
            buildConfigField("String", "BANNER_AD_UNIT", "\"\"")
            manifestPlaceholders["admobAppId"] = ""
        }
        // The Google Play edition: anyone's profiles, ads with consent, a Remove ads purchase.
        create("store") {
            dimension = "edition"
            applicationId = storeProperty("store.applicationId", "com.mealgym.app")
            versionCode = storeProperty("store.versionCode", "1").toInt()
            versionName = storeProperty("store.versionName", "1.0.0")
            resValue("string", "app_name", storeProperty("store.appName", "Meal & Gym"))
            buildConfigField("boolean", "STORE", "true")
            buildConfigField("String", "BANNER_AD_UNIT", "\"${storeProperty("store.admobBannerId", testBannerUnitId)}\"")
            manifestPlaceholders["admobAppId"] = storeProperty("store.admobAppId", testAdMobAppId)
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            if (releaseKeys.isNotEmpty()) signingConfig = signingConfigs.getByName("release")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    buildFeatures {
        compose = true
        buildConfig = true
        resValues = true
    }

    testOptions {
        unitTests {
            isIncludeAndroidResources = true
            isReturnDefaultValues = true
        }
    }
}

room {
    schemaDirectory("$projectDir/schemas")
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(libs.androidx.lifecycle.runtime.compose)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.lifecycle.service)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.datastore.preferences)
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)
    implementation(libs.kotlinx.serialization.json)
    implementation(libs.kotlinx.coroutines.android)

    implementation(platform(libs.compose.bom))
    implementation(libs.compose.ui)
    implementation(libs.compose.ui.tooling.preview)
    implementation(libs.compose.material3)
    implementation(libs.compose.material.icons.core)
    debugImplementation(libs.compose.ui.tooling)
    debugImplementation(libs.compose.ui.test.manifest)

    testImplementation(libs.junit)
    testImplementation(libs.kotlinx.coroutines.test)
    testImplementation(libs.robolectric)
    testImplementation(libs.roborazzi)
    testImplementation(libs.roborazzi.compose)
    testImplementation(libs.androidx.test.core)
    testImplementation(libs.androidx.test.ext.junit)
    testImplementation(platform(libs.compose.bom))
    testImplementation(libs.compose.ui.test.junit4)
}
