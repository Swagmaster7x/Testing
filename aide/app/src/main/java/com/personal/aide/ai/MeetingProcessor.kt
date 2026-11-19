package com.personal.aide.ai

import com.personal.aide.data.SecretStore
import com.personal.aide.data.SettingsStore
import com.personal.aide.data.db.AppDatabase
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock

/**
 * Summarizes meetings one at a time in the background of the app, so a summary carries on when
 * the user leaves the screen it was started from.
 */
class MeetingProcessor(
    private val scope: CoroutineScope,
    private val assistant: Assistant,
    private val db: AppDatabase,
    private val settings: SettingsStore,
    private val secrets: SecretStore,
    /** How long to wait before each further try after a failure that may pass by itself: a dropped connection, a busy server. */
    private val retryDelays: List<Long> = listOf(4_000L, 15_000L),
    /** Tells the user about a finished summary when they aren't looking at the app. */
    private val announce: suspend (meetingId: Long, result: Assistant.SummaryResult) -> Unit = { _, _ -> },
) {
    private val oneAtATime = Mutex()

    /** Meetings whose notes failed for want of a connection, to be tried again when the app is next opened. */
    private val interrupted = java.util.concurrent.ConcurrentHashMap.newKeySet<Long>()
    private val _inProgress = MutableStateFlow<Set<Long>>(emptySet())

    /** Meetings waiting for, or in the middle of, a summary. */
    val inProgress: StateFlow<Set<Long>> = _inProgress.asStateFlow()

    /** Called when a recording has been saved: summarizes it if the user wants that and it is possible. */
    suspend fun onRecordingSaved(meetingId: Long) {
        if (settings.current().autoSummarize && secrets.hasKey.first()) summarize(meetingId)
    }

    fun summarize(meetingId: Long, force: Boolean = false) {
        var added = false
        _inProgress.update { current -> if (meetingId in current) current else (current + meetingId).also { added = true } }
        if (!added) return
        interrupted -= meetingId
        scope.launch {
            try {
                var result = oneAtATime.withLock { assistant.summarizeMeeting(meetingId, force) }
                // A connection that dropped, or a server that was busy, is worth another go before the user is troubled with it.
                for (wait in retryDelays) {
                    if (!result.passing()) break
                    delay(wait)
                    result = oneAtATime.withLock { assistant.summarizeMeeting(meetingId, force = true) }
                }
                if (result.passing()) interrupted += meetingId
                // Telling the user is a courtesy; a problem posting the notification must not take the app down.
                runCatching { announce(meetingId, result) }
            } finally {
                _inProgress.update { it - meetingId }
            }
        }
    }

    /** A failure of the kind that may well not happen next time. */
    private fun Assistant.SummaryResult.passing(): Boolean = this is Assistant.SummaryResult.Failed && error.retryable

    /**
     * Tries again for the meetings whose notes were cut off by a lost connection. Called when the
     * user comes back to the app: by then they are usually online again, and the app is no longer
     * at risk of being frozen in the background.
     */
    fun retryInterrupted() {
        for (meetingId in interrupted.toList()) summarize(meetingId, force = true)
    }
}
