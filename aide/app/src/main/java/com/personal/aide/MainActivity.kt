package com.personal.aide

import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.SystemBarStyle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.getValue
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.personal.aide.ui.AideRoot
import com.personal.aide.ui.Launch
import kotlinx.coroutines.flow.MutableStateFlow

class MainActivity : ComponentActivity() {
    /** Where an intent from outside (a notification, a share) wants the app to go. */
    private val launch = MutableStateFlow<Launch?>(null)

    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
        if (savedInstanceState == null) route(intent)
        setContent {
            val request by launch.collectAsStateWithLifecycle()
            AideRoot(
                launch = request,
                onLaunchHandled = { launch.value = null },
                // The app can be dark while the phone is light, or the other way round; keep the system bars legible.
                onDarkTheme = { dark ->
                    val style = if (dark) SystemBarStyle.dark(Color.TRANSPARENT) else SystemBarStyle.light(Color.TRANSPARENT, Color.TRANSPARENT)
                    enableEdgeToEdge(statusBarStyle = style, navigationBarStyle = style)
                },
            )
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        route(intent)
    }

    private fun route(intent: Intent?) {
        when (intent?.action) {
            ACTION_OPEN_RECORDING -> launch.value = Launch.OpenRecording
            ACTION_OPEN_MEETING -> intent.getLongExtra(EXTRA_MEETING_ID, 0L).takeIf { it > 0 }?.let { launch.value = Launch.OpenMeeting(it) }
            Intent.ACTION_SEND -> if (intent.type?.startsWith("text/") == true) {
                intent.getStringExtra(Intent.EXTRA_TEXT)?.takeIf { it.isNotBlank() }?.let { launch.value = Launch.SharedText(it) }
            }
        }
    }

    companion object {
        const val ACTION_OPEN_RECORDING = "com.personal.aide.action.OPEN_RECORDING"
        const val ACTION_OPEN_MEETING = "com.personal.aide.action.OPEN_MEETING"
        const val EXTRA_MEETING_ID = "meeting_id"
    }
}
