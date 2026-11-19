package com.personal.aide

import android.app.Application
import android.content.Context
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.ProcessLifecycleOwner
import com.personal.aide.ai.AnthropicLlm
import com.personal.aide.ai.Assistant
import com.personal.aide.ai.Llm
import com.personal.aide.ai.MeetingProcessor
import com.personal.aide.calendar.Agenda
import com.personal.aide.calendar.DeviceAgenda
import com.personal.aide.data.Backup
import com.personal.aide.data.KeystoreSecretStore
import com.personal.aide.data.KnowledgeBase
import com.personal.aide.data.MeetingStore
import com.personal.aide.data.QuestionStore
import com.personal.aide.data.SecretStore
import com.personal.aide.data.SettingsStore
import com.personal.aide.data.TaskStore
import com.personal.aide.data.db.AppDatabase
import com.personal.aide.notify.Notifications
import com.personal.aide.transcribe.AndroidSpeechTranscriber
import com.personal.aide.transcribe.Recorder
import com.personal.aide.transcribe.RecordingService
import com.personal.aide.transcribe.Transcriber
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

/**
 * The app's long-lived objects, built once per process. Tests swap the parts that touch the
 * outside world (the database file, Claude, the microphone) through the constructor.
 */
class AppContainer(
    private val app: Application,
    val db: AppDatabase = AppDatabase.create(app),
    val settings: SettingsStore = SettingsStore(app),
    val secrets: SecretStore = KeystoreSecretStore(app),
    llm: Llm? = null,
    agenda: Agenda? = null,
    newTranscriber: (() -> Transcriber)? = null,
    val scope: CoroutineScope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate),
) {
    val appContext: Context get() = app

    val llm: Llm = llm ?: AnthropicLlm(apiKey = { secrets.apiKey() }, model = { settings.current().model })
    val deviceAgenda = DeviceAgenda(app) { settings.current().calendarEnabled }
    val agenda: Agenda = agenda ?: deviceAgenda

    val knowledge = KnowledgeBase(db.knowledge())
    val meetings = MeetingStore(db.meetings())
    val tasks = TaskStore(db.tasks())
    val questions = QuestionStore(db.questions(), knowledge)
    val backup = Backup(db, settings)
    val assistant = Assistant(db, settings, this.llm, knowledge, this.agenda)

    val processor = MeetingProcessor(scope, assistant, db, settings, secrets) { meetingId, result ->
        // Someone looking at the app can see the summary arrive; anyone else gets a notification.
        if (ProcessLifecycleOwner.get().lifecycle.currentState.isAtLeast(Lifecycle.State.STARTED)) return@MeetingProcessor
        val meeting = db.meetings().get(meetingId) ?: return@MeetingProcessor
        when (result) {
            is Assistant.SummaryResult.Done -> Notifications.summaryReady(app, meetingId, meeting.title, meeting.tldr)
            is Assistant.SummaryResult.Failed -> Notifications.summaryFailed(app, meetingId, meeting.title, result.error.message.orEmpty())
            else -> Unit
        }
    }

    val recorder = Recorder(
        scope = scope,
        meetings = meetings,
        settings = settings,
        newTranscriber = newTranscriber ?: { AndroidSpeechTranscriber(app) },
        keepAlive = { on -> if (on) RecordingService.start(app) },
        onFinished = { meetingId -> processor.onRecordingSaved(meetingId) },
        beforeStart = { recovery.join() },
    )

    /** Tidying up after a crash or a kill: closes a recording that was cut off, and frees a summary that never finished. */
    private val recovery: Job = scope.launch(Dispatchers.IO) { runCatching { meetings.recoverAfterRestart() } }
}
