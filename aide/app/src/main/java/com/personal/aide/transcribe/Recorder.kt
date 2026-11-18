package com.personal.aide.transcribe

import com.personal.aide.data.MeetingStore
import com.personal.aide.data.SettingsStore
import com.personal.aide.data.db.SegmentKind
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class RecorderState(
    val phase: Phase = Phase.IDLE,
    val meetingId: Long? = null,
    val title: String = "",
    /** When listening began, on the same clock as [Recorder.clock]. */
    val startedAt: Long = 0,
    /** Time spent paused so far, not counting a pause in progress. */
    val pausedTotalMs: Long = 0,
    val pausedAt: Long? = null,
    /** Words heard in the sentence being spoken, not yet final. */
    val partial: String = "",
    val level: Float = 0f,
    /** Something the user should know while recording continues, such as "Retrying…". */
    val notice: String? = null,
    /** Why the last recording ended by itself, until the next one starts or it is dismissed. */
    val error: String? = null,
    val finalCount: Int = 0,
) {
    enum class Phase { IDLE, LISTENING, PAUSED }

    val active: Boolean get() = phase != Phase.IDLE

    /** Recording time so far, leaving out pauses. */
    fun elapsed(now: Long): Long =
        if (!active) 0 else ((pausedAt ?: now) - startedAt - pausedTotalMs).coerceAtLeast(0)
}

/**
 * The one live recording the app can have. Owns the transcriber, writes what it hears into the
 * meeting as it arrives (so nothing is lost if the app dies), and reports its state for the
 * screen and the notification. All methods are called on the main thread.
 */
class Recorder(
    private val scope: CoroutineScope,
    private val meetings: MeetingStore,
    private val settings: SettingsStore,
    private val newTranscriber: () -> Transcriber,
    /** Brings the foreground service up or down with the recording. */
    private val keepAlive: (Boolean) -> Unit = {},
    /** Called once a recording has been closed and saved. */
    private val onFinished: suspend (meetingId: Long) -> Unit = {},
    val clock: () -> Long = System::currentTimeMillis,
) {
    private val _state = MutableStateFlow(RecorderState())
    val state: StateFlow<RecorderState> = _state.asStateFlow()

    private var transcriber: Transcriber? = null
    private var config = Transcriber.Config()
    private var limit: Job? = null

    /** Database writes in the order they were asked for, so the transcript keeps its order. */
    private val writes = Channel<suspend () -> Unit>(Channel.UNLIMITED)

    init {
        scope.launch {
            for (write in writes) runCatching { write() }
        }
    }

    private val listener = object : Transcriber.Listener {
        override fun onPartial(text: String) = _state.update { if (it.phase == RecorderState.Phase.LISTENING) it.copy(partial = text) else it }

        override fun onFinal(text: String) {
            val current = _state.value
            val meetingId = current.meetingId ?: return
            val offset = current.elapsed(clock())
            _state.update { it.copy(partial = "", finalCount = it.finalCount + 1) }
            writes.trySend { meetings.addSegment(meetingId, SegmentKind.SPEECH, text, offset) }
        }

        override fun onLevel(level: Float) = _state.update { if (it.active) it.copy(level = level) else it }

        override fun onNotice(notice: String?) = _state.update { if (it.active) it.copy(notice = notice) else it }

        override fun onFatal(message: String) = finish(error = message)
    }

    /** Starts a new recording. Does nothing if one is already running. */
    fun start(title: String? = null, attendees: List<String> = emptyList(), calendarEventId: Long? = null) {
        if (_state.value.active) return
        val startedAt = clock()
        // Shown as recording straight away; the meeting row follows a moment later.
        _state.value = RecorderState(phase = RecorderState.Phase.LISTENING, title = title.orEmpty(), startedAt = startedAt)
        scope.launch {
            val prefs = settings.current()
            val meetingId = meetings.startLive(title, attendees, calendarEventId)
            if (!_state.value.active) {
                // Stopped before the meeting existed; close the empty meeting off.
                meetings.finish(meetingId)
                return@launch
            }
            config = Transcriber.Config(language = prefs.language, preferOnDevice = prefs.preferOnDevice, muteChimes = prefs.muteChimes)
            _state.update { it.copy(meetingId = meetingId) }
            keepAlive(true)
            if (_state.value.phase == RecorderState.Phase.LISTENING) startTranscriber()
            limit = launch {
                delay(MAX_LENGTH_MS)
                finish(error = "The recording reached its four-hour limit and was saved.")
            }
        }
    }

    private fun startTranscriber() {
        transcriber = newTranscriber().also { it.start(config, listener) }
    }

    fun pause() {
        val current = _state.value
        if (current.phase != RecorderState.Phase.LISTENING) return
        transcriber?.stop()
        transcriber = null
        _state.update { it.copy(phase = RecorderState.Phase.PAUSED, pausedAt = clock(), partial = "", level = 0f, notice = null) }
    }

    fun resume() {
        val current = _state.value
        if (current.phase != RecorderState.Phase.PAUSED) return
        val pausedFor = clock() - (current.pausedAt ?: clock())
        _state.update { it.copy(phase = RecorderState.Phase.LISTENING, pausedAt = null, pausedTotalMs = it.pausedTotalMs + pausedFor) }
        if (_state.value.meetingId != null) startTranscriber()
    }

    /** Adds a line the user typed during the meeting. */
    fun addNote(text: String) {
        val current = _state.value
        val meetingId = current.meetingId ?: return
        val clean = text.trim()
        if (clean.isEmpty()) return
        val offset = current.elapsed(clock())
        writes.trySend { meetings.addSegment(meetingId, SegmentKind.NOTE, clean, offset) }
    }

    /** Marks this moment as important. */
    fun flag() {
        val current = _state.value
        val meetingId = current.meetingId ?: return
        val offset = current.elapsed(clock())
        writes.trySend { meetings.addSegment(meetingId, SegmentKind.FLAG, "", offset) }
    }

    fun stop() = finish(error = null)

    fun clearError() = _state.update { it.copy(error = null) }

    private fun finish(error: String?) {
        val current = _state.value
        if (!current.active) return
        limit?.cancel()
        limit = null
        // Stopping the transcriber delivers any last words through onFinal while the state is still active.
        transcriber?.stop()
        transcriber = null
        val meetingId = current.meetingId
        _state.value = RecorderState(error = error)
        keepAlive(false)
        if (meetingId != null) {
            writes.trySend {
                meetings.finish(meetingId)
                onFinished(meetingId)
            }
        }
    }

    companion object {
        const val MAX_LENGTH_MS = 4 * 60 * 60 * 1000L
    }
}
