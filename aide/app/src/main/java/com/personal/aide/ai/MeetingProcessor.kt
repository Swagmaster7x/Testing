package com.personal.aide.ai

import com.personal.aide.data.SecretStore
import com.personal.aide.data.SettingsStore
import com.personal.aide.data.db.AppDatabase
import kotlinx.coroutines.CoroutineScope
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
    /** Tells the user about a finished summary when they aren't looking at the app. */
    private val announce: suspend (meetingId: Long, result: Assistant.SummaryResult) -> Unit = { _, _ -> },
) {
    private val oneAtATime = Mutex()
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
        scope.launch {
            try {
                val result = oneAtATime.withLock { assistant.summarizeMeeting(meetingId, force) }
                announce(meetingId, result)
            } finally {
                _inProgress.update { it - meetingId }
            }
        }
    }
}
