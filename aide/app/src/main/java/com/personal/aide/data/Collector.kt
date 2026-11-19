package com.personal.aide.data

import android.content.Context
import androidx.core.content.edit
import com.personal.aide.data.db.MeetingDao
import com.personal.aide.data.db.MeetingSource
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.domain.freshPart
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock

/** The meeting being put together from parts, and how far it has got. */
data class Collecting(val meetingId: Long, val title: String, val parts: Int, val words: Int)

/**
 * Collects one meeting's notes a part at a time from text the user brings over from another
 * app: dictated somewhere with better speech recognition, copied, and added here. The parts
 * go into one meeting in the order they arrive, and nothing is written up until the user says
 * the meeting is over.
 *
 * What is being collected is remembered across restarts of the app. It closes by itself after
 * [OPEN_FOR_MS] without a new part, or as soon as the meeting has notes written some other way.
 */
class NoteCollector(
    context: Context,
    private val meetings: MeetingStore,
    private val dao: MeetingDao,
    private val now: () -> Long = System::currentTimeMillis,
) {
    private val prefs = context.applicationContext.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
    private val lock = Mutex()
    private val _state = MutableStateFlow<Collecting?>(null)

    /** What is being collected, or null. Call [refresh] once to load it after the app starts. */
    val state: StateFlow<Collecting?> = _state.asStateFlow()

    sealed interface Added {
        /** New text went in. [started] says this part also began the collecting. */
        data class Part(val collecting: Collecting, val words: Int, val started: Boolean) : Added

        /** The same text as last time: nothing to add. */
        data class NothingNew(val collecting: Collecting) : Added

        /** There was no text at all. */
        data object Empty : Added
    }

    /** Brings [state] into line with what is stored, closing a collection that has gone stale. */
    suspend fun refresh(): Collecting? = lock.withLock { current() }

    /** Begins collecting, or returns what is already being collected. */
    suspend fun start(): Collecting = lock.withLock { current() ?: begin() }

    /** Adds what is new in [text] to the meeting being collected, starting one if there is none. */
    suspend fun add(text: String): Added = lock.withLock {
        if (text.isBlank()) return@withLock Added.Empty
        val open = current()
        val started = open == null
        val into = open ?: begin()
        val fresh = freshPart(prefs.getString(KEY_LAST, "").orEmpty(), text)
        if (fresh.isBlank()) return@withLock Added.NothingNew(into)
        if (!meetings.appendText(into.meetingId, fresh)) return@withLock Added.Empty
        prefs.edit {
            putString(KEY_LAST, text)
            putInt(KEY_PARTS, into.parts + 1)
            putLong(KEY_AT, now())
        }
        val after = current() ?: into
        Added.Part(after, words = after.words - into.words, started = started)
    }

    /**
     * Ends the collecting. Returns the meeting to write up, or null when nothing was ever added,
     * in which case the empty meeting is removed.
     */
    suspend fun finish(): Long? = lock.withLock {
        val open = current() ?: return@withLock null
        close()
        if (open.parts == 0) {
            meetings.delete(open.meetingId)
            null
        } else {
            open.meetingId
        }
    }

    private suspend fun begin(): Collecting {
        val id = meetings.importText(title = null, text = "", source = MeetingSource.IMPORT)
        prefs.edit {
            putLong(KEY_MEETING, id)
            putString(KEY_LAST, "")
            putInt(KEY_PARTS, 0)
            putLong(KEY_AT, now())
        }
        return current() ?: Collecting(id, "", 0, 0)
    }

    /** The collection in progress if it still stands, read from storage. */
    private suspend fun current(): Collecting? {
        val id = prefs.getLong(KEY_MEETING, 0)
        if (id == 0L) {
            _state.value = null
            return null
        }
        val meeting = dao.get(id)
        val stale = now() - prefs.getLong(KEY_AT, 0) > OPEN_FOR_MS
        // Deleted, written up from its own screen, or left for hours: it is no longer being collected.
        if (meeting == null || meeting.status != MeetingStatus.TRANSCRIBED || stale) {
            val parts = prefs.getInt(KEY_PARTS, 0)
            close()
            if (meeting != null && parts == 0 && meeting.status == MeetingStatus.TRANSCRIBED) meetings.delete(id)
            return null
        }
        return Collecting(id, meeting.title, prefs.getInt(KEY_PARTS, 0), meeting.wordCount).also { _state.value = it }
    }

    private fun close() {
        prefs.edit { clear() }
        _state.value = null
    }

    companion object {
        /** How long a collection waits for its next part before it is taken to be over. */
        const val OPEN_FOR_MS = 6 * 60 * 60_000L
        private const val PREFS = "aide_collecting"
        private const val KEY_MEETING = "meeting"
        private const val KEY_LAST = "last"
        private const val KEY_PARTS = "parts"
        private const val KEY_AT = "at"
    }
}
