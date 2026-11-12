package com.personal.mealgym.ui

import android.graphics.Color
import androidx.activity.ComponentActivity
import androidx.activity.SystemBarStyle
import androidx.activity.compose.LocalActivity
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect

/**
 * Status and navigation bar icons dark on light looks and light on dark ones. Looks that are
 * always dark (or always light) can disagree with the phone's own setting, so this follows the
 * look on screen rather than the phone.
 */
@Composable
fun SystemBars(dark: Boolean) {
    val activity = LocalActivity.current as? ComponentActivity ?: return
    DisposableEffect(activity, dark) {
        // The same scrims Android draws behind three-button navigation by default.
        val lightScrim = Color.argb(0xE6, 0xFF, 0xFF, 0xFF)
        val darkScrim = Color.argb(0x80, 0x1B, 0x1B, 0x1B)
        activity.enableEdgeToEdge(
            statusBarStyle = if (dark) SystemBarStyle.dark(Color.TRANSPARENT) else SystemBarStyle.light(Color.TRANSPARENT, Color.TRANSPARENT),
            navigationBarStyle = if (dark) SystemBarStyle.dark(darkScrim) else SystemBarStyle.light(lightScrim, darkScrim),
        )
        onDispose { }
    }
}
