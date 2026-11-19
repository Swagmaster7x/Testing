package com.personal.aide

import android.content.Context
import android.content.Intent
import androidx.core.net.toUri
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.SystemBarStyle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.getValue
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.personal.aide.calendar.CalendarEvent
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
            ACTION_OPEN_TASKS -> launch.value = Launch.OpenTasks
            ACTION_OPEN_PREP -> {
                val event = CalendarEvent(
                    id = intent.getLongExtra(EXTRA_EVENT_ID, 0),
                    title = intent.getStringExtra(EXTRA_EVENT_TITLE).orEmpty(),
                    start = intent.getLongExtra(EXTRA_EVENT_START, 0),
                    end = intent.getLongExtra(EXTRA_EVENT_END, 0),
                    attendees = intent.getStringArrayExtra(EXTRA_EVENT_ATTENDEES)?.toList().orEmpty(),
                )
                if (event.title.isNotBlank()) launch.value = Launch.Prep(event, record = intent.getBooleanExtra(EXTRA_RECORD, false))
            }
            ACTION_OPEN_MEETING -> intent.getLongExtra(EXTRA_MEETING_ID, 0L).takeIf { it > 0 }?.let { launch.value = Launch.OpenMeeting(it) }
            Intent.ACTION_SEND -> {
                val file = sharedFile(intent)
                val text = intent.getStringExtra(Intent.EXTRA_TEXT)?.takeIf { it.isNotBlank() }
                when {
                    // A picture or a document, possibly with a caption.
                    file != null -> launch.value = Launch.SharedFiles(listOf(file), text.orEmpty())
                    text != null -> launch.value = Launch.SharedText(text)
                }
            }
            Intent.ACTION_SEND_MULTIPLE -> {
                val files = if (Build.VERSION.SDK_INT >= 33) {
                    intent.getParcelableArrayListExtra(Intent.EXTRA_STREAM, Uri::class.java)
                } else {
                    @Suppress("DEPRECATION")
                    intent.getParcelableArrayListExtra(Intent.EXTRA_STREAM)
                }
                if (!files.isNullOrEmpty()) launch.value = Launch.SharedFiles(files.take(MAX_SHARED_FILES))
            }
        }
    }

    private fun sharedFile(intent: Intent): Uri? =
        if (Build.VERSION.SDK_INT >= 33) {
            intent.getParcelableExtra(Intent.EXTRA_STREAM, Uri::class.java)
        } else {
            @Suppress("DEPRECATION")
            intent.getParcelableExtra(Intent.EXTRA_STREAM)
        }

    companion object {
        /** More pictures than this in one share is a mistake more often than a document. */
        private const val MAX_SHARED_FILES = 40
        const val ACTION_OPEN_RECORDING = "com.personal.aide.action.OPEN_RECORDING"
        const val ACTION_OPEN_MEETING = "com.personal.aide.action.OPEN_MEETING"
        const val EXTRA_MEETING_ID = "meeting_id"
        const val ACTION_OPEN_TASKS = "com.personal.aide.action.OPEN_TASKS"
        const val ACTION_OPEN_PREP = "com.personal.aide.action.OPEN_PREP"
        private const val EXTRA_EVENT_ID = "event_id"
        private const val EXTRA_EVENT_TITLE = "event_title"
        private const val EXTRA_EVENT_START = "event_start"
        private const val EXTRA_EVENT_END = "event_end"
        private const val EXTRA_EVENT_ATTENDEES = "event_attendees"
        private const val EXTRA_RECORD = "record"

        /** Opens the brief for a calendar meeting, or with [record] starts recording it. */
        fun prepIntent(context: Context, event: CalendarEvent, record: Boolean): Intent =
            Intent(context, MainActivity::class.java)
                .setAction(ACTION_OPEN_PREP)
                // Two notifications for two meetings must not share one intent.
                .setData("aide://prep/${event.id}/${event.start}/$record".toUri())
                .putExtra(EXTRA_EVENT_ID, event.id)
                .putExtra(EXTRA_EVENT_TITLE, event.title)
                .putExtra(EXTRA_EVENT_START, event.start)
                .putExtra(EXTRA_EVENT_END, event.end)
                .putExtra(EXTRA_EVENT_ATTENDEES, event.attendees.toTypedArray())
                .putExtra(EXTRA_RECORD, record)
                .addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP)
    }
}
