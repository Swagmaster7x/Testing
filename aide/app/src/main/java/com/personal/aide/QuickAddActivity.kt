package com.personal.aide

import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import com.personal.aide.data.NoteCollector
import kotlinx.coroutines.launch

/**
 * Takes text from another app straight into the meeting being collected, without opening Aide.
 * It has no screen of its own: it does its one job, says what it did in a line at the bottom of
 * the screen, and is gone, leaving the user where they were.
 *
 * Text reaches it four ways: shared to "Add to Aide notes", chosen from the menu that appears
 * over selected text, the "Add copied text" button on Aide's collecting notification (which
 * takes whatever was last copied), and that notification's "Finish" button.
 */
class QuickAddActivity : ComponentActivity() {
    /** Android lets an app read what was copied only while its window has focus. */
    private var readClipboardOnFocus = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        handle(intent)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        handle(intent)
    }

    private fun handle(intent: Intent?) {
        when (intent?.action) {
            Intent.ACTION_PROCESS_TEXT -> add(intent.getCharSequenceExtra(Intent.EXTRA_PROCESS_TEXT)?.toString())
            Intent.ACTION_SEND -> add(intent.getStringExtra(Intent.EXTRA_TEXT))
            ACTION_ADD_COPIED -> {
                readClipboardOnFocus = true
                // An invisible window that never got focus must not sit in front of whatever the user is doing.
                window.decorView.postDelayed({
                    if (readClipboardOnFocus) {
                        readClipboardOnFocus = false
                        say("Aide couldn't get at what was copied. Open Aide and paste it in.")
                        finish()
                    }
                }, FOCUS_WAIT_MS)
            }
            ACTION_FINISH -> finishCollecting()
            else -> finish()
        }
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (!hasFocus || !readClipboardOnFocus) return
        readClipboardOnFocus = false
        val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as? ClipboardManager
        val copied = runCatching { clipboard?.primaryClip?.takeIf { it.itemCount > 0 }?.getItemAt(0)?.coerceToText(this)?.toString() }.getOrNull()
        if (copied.isNullOrBlank()) {
            say("Nothing has been copied yet. Copy what you dictated first.")
            finish()
        } else {
            add(copied)
        }
    }

    private fun add(text: String?) {
        val container = (application as? AideApp)?.container
        if (container == null) {
            finish()
            return
        }
        container.scope.launch {
            val message = try {
                when (val result = container.collector.add(text.orEmpty())) {
                    is NoteCollector.Added.Part -> {
                        val words = if (result.words == 1) "1 word" else "%,d words".format(result.words)
                        if (result.started) "Aide started collecting notes: $words added." else "Added to Aide: $words (part ${result.collecting.parts})."
                    }
                    is NoteCollector.Added.NothingNew -> "Aide already has that. Nothing new was added."
                    NoteCollector.Added.Empty -> "There was no text to add."
                }
            } catch (_: Exception) {
                "Aide couldn't add that. Open Aide and try again."
            }
            say(message)
        }
        finish()
    }

    private fun finishCollecting() {
        val container = (application as? AideApp)?.container
        if (container == null) {
            finish()
            return
        }
        container.scope.launch {
            val meetingId = runCatching { container.finishCollecting() }.getOrNull()
            if (meetingId == null) {
                say("Nothing was collected, so there is nothing to write up.")
            } else {
                // Show what was collected, and the notes as they are written.
                startActivity(
                    Intent(this@QuickAddActivity.applicationContext, MainActivity::class.java)
                        .setAction(MainActivity.ACTION_OPEN_MEETING)
                        .putExtra(MainActivity.EXTRA_MEETING_ID, meetingId)
                        .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP),
                )
            }
        }
        finish()
    }

    private fun say(message: String) {
        Toast.makeText(applicationContext, message, Toast.LENGTH_LONG).show()
    }

    companion object {
        const val ACTION_ADD_COPIED = "com.personal.aide.action.ADD_COPIED"
        const val ACTION_FINISH = "com.personal.aide.action.FINISH_COLLECTING"
        private const val FOCUS_WAIT_MS = 4_000L
    }
}
