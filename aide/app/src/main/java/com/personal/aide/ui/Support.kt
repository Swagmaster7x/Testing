package com.personal.aide.ui

import android.Manifest
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalContext
import androidx.core.content.ContextCompat
import androidx.core.net.toUri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewmodel.compose.viewModel
import com.personal.aide.AideApp
import com.personal.aide.AppContainer
import com.personal.aide.calendar.CalendarEvent

/** A view model built from the app's container, so screens don't each need a factory class. */
@Composable
inline fun <reified VM : ViewModel> aideViewModel(key: String? = null, crossinline create: (AppContainer) -> VM): VM {
    val container = (LocalContext.current.applicationContext as AideApp).container
    return viewModel(
        key = key,
        factory = object : ViewModelProvider.Factory {
            @Suppress("UNCHECKED_CAST")
            override fun <T : ViewModel> create(modelClass: Class<T>): T = create(container) as T
        },
    )
}

@Composable
fun container(): AppContainer = (LocalContext.current.applicationContext as AideApp).container

fun Context.copyToClipboard(label: String, text: String) {
    (getSystemService(Context.CLIPBOARD_SERVICE) as? ClipboardManager)?.setPrimaryClip(ClipData.newPlainText(label, text))
}

fun Context.shareText(subject: String, text: String) {
    val send = Intent(Intent.ACTION_SEND)
        .setType("text/plain")
        .putExtra(Intent.EXTRA_SUBJECT, subject)
        .putExtra(Intent.EXTRA_TEXT, text)
    runCatching { startActivity(Intent.createChooser(send, null).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)) }
}

fun Context.openUrl(url: String) {
    runCatching { startActivity(Intent(Intent.ACTION_VIEW, url.toUri()).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)) }
}

fun Context.openAppSettings() {
    runCatching {
        startActivity(
            Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.fromParts("package", packageName, null))
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK),
        )
    }
}

fun Context.hasPermission(permission: String): Boolean =
    ContextCompat.checkSelfPermission(this, permission) == PackageManager.PERMISSION_GRANTED

/**
 * Returns a function that starts a recording, asking for the microphone first if it has to.
 * [onStarted] runs once the recording is under way. An event from the calendar names the meeting.
 */
@Composable
fun rememberRecordingStarter(onStarted: () -> Unit): (CalendarEvent?) -> Unit {
    val context = LocalContext.current
    val recorder = container().recorder
    var pendingEvent by remember { mutableStateOf<CalendarEvent?>(null) }
    var showDenied by remember { mutableStateOf(false) }

    fun begin(event: CalendarEvent?) {
        recorder.clearError()
        recorder.start(title = event?.title, attendees = event?.attendees.orEmpty(), calendarEventId = event?.id)
        onStarted()
    }

    val launcher = rememberLauncherForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { granted ->
        if (granted[Manifest.permission.RECORD_AUDIO] == true || context.hasPermission(Manifest.permission.RECORD_AUDIO)) {
            begin(pendingEvent)
        } else {
            showDenied = true
        }
        pendingEvent = null
    }

    if (showDenied) {
        AlertDialog(
            onDismissRequest = { showDenied = false },
            title = { Text("Microphone needed") },
            text = { Text("Aide can't transcribe without the microphone. You can allow it in the phone's settings for this app.") },
            confirmButton = {
                TextButton(onClick = {
                    showDenied = false
                    context.openAppSettings()
                }) { Text("Open settings") }
            },
            dismissButton = { TextButton(onClick = { showDenied = false }) { Text("Not now") } },
        )
    }

    return remember(recorder) {
        { event ->
            if (recorder.state.value.active) {
                onStarted()
            } else {
                val needed = buildList {
                    if (!context.hasPermission(Manifest.permission.RECORD_AUDIO)) add(Manifest.permission.RECORD_AUDIO)
                    // The notification is how a recording is stopped from outside the app; ask for it alongside.
                    if (Build.VERSION.SDK_INT >= 33 && !context.hasPermission(Manifest.permission.POST_NOTIFICATIONS)) {
                        add(Manifest.permission.POST_NOTIFICATIONS)
                    }
                }
                if (Manifest.permission.RECORD_AUDIO in needed) {
                    pendingEvent = event
                    launcher.launch(needed.toTypedArray())
                } else {
                    begin(event)
                }
            }
        }
    }
}
