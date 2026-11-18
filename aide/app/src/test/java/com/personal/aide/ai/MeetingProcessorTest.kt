package com.personal.aide.ai

import android.app.Application
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.aide.ai.Assistant.SummaryResult
import com.personal.aide.data.MeetingAnalysis
import com.personal.aide.data.MemorySecretStore
import com.personal.aide.data.SecretStore
import com.personal.aide.data.db.MeetingStatus
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withTimeout
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config
import java.util.concurrent.CopyOnWriteArrayList

@RunWith(AndroidJUnit4::class)
@Config(sdk = [35], application = Application::class)
class MeetingProcessorTest : AssistantTestBase() {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
    private val announced = CopyOnWriteArrayList<Pair<Long, SummaryResult>>()

    /** Set to make telling the user fail, as posting a notification can. */
    @Volatile
    private var announcingFails = false

    private fun processor(secrets: SecretStore = MemorySecretStore("sk-ant-test")) =
        MeetingProcessor(scope, assistant, db, settings, secrets) { id, result ->
            announced += id to result
            if (announcingFails) throw IllegalStateException("notifications are blocked")
        }

    @After
    fun stopBackgroundWork() {
        scope.cancel()
    }

    private val notes get() = json(MeetingAnalysis(title = "Pricing review", tldr = "Agreed three tiers."))

    private suspend fun MeetingProcessor.awaitIdle() = withTimeout(20_000) { inProgress.first { it.isEmpty() } }

    // -------------------------------------------------------------------------------------------
    // After a recording

    @Test
    fun `a saved recording is summarized when the user wants that and a key is set`(): Unit = runBlocking {
        val id = recorded()
        llm.reply(notes)
        val processor = processor()

        processor.onRecordingSaved(id)
        processor.awaitIdle()

        assertEquals(MeetingStatus.READY, meeting(id).status)
        assertEquals("Agreed three tiers.", meeting(id).tldr)
        assertEquals(listOf(id to SummaryResult.Done), announced.toList())
    }

    @Test
    fun `a saved recording is left alone when auto-summarize is off`(): Unit = runBlocking {
        settings.setAutoSummarize(false)
        val id = recorded()
        val processor = processor()

        processor.onRecordingSaved(id)
        processor.awaitIdle()

        assertTrue(llm.requests.isEmpty())
        assertEquals(MeetingStatus.TRANSCRIBED, meeting(id).status)
        assertTrue(announced.isEmpty())
    }

    @Test
    fun `a saved recording is left alone when there is no key yet`(): Unit = runBlocking {
        val id = recorded()
        for (secrets in listOf(MemorySecretStore(null), MemorySecretStore("   "))) {
            val processor = processor(secrets)
            processor.onRecordingSaved(id)
            processor.awaitIdle()
        }

        assertTrue(llm.requests.isEmpty())
        assertEquals(MeetingStatus.TRANSCRIBED, meeting(id).status)
        assertEquals("not having a key is not an error to show on the meeting", "", meeting(id).error)
    }

    @Test
    fun `a key saved later is picked up`(): Unit = runBlocking {
        val secrets = MemorySecretStore(null)
        val processor = processor(secrets)
        val id = recorded()
        processor.onRecordingSaved(id)
        processor.awaitIdle()
        assertTrue(llm.requests.isEmpty())

        secrets.setApiKey("sk-ant-test")
        llm.reply(notes)
        processor.onRecordingSaved(id)
        processor.awaitIdle()
        assertEquals(MeetingStatus.READY, meeting(id).status)
    }

    // -------------------------------------------------------------------------------------------
    // Summarizing in the background

    @Test
    fun `a meeting shows as in progress until its summary is done`(): Unit = runBlocking {
        val id = recorded()
        val started = CompletableDeferred<Unit>()
        val release = CompletableDeferred<Unit>()
        llm.answer {
            started.complete(Unit)
            release.await()
            notes
        }
        val processor = processor()

        processor.summarize(id)
        assertEquals("it counts as in progress from the moment it is asked for", setOf(id), processor.inProgress.value)

        withTimeout(20_000) { started.await() }
        assertEquals(setOf(id), processor.inProgress.value)
        assertEquals(MeetingStatus.PROCESSING, meeting(id).status)

        release.complete(Unit)
        processor.awaitIdle()
        assertEquals(MeetingStatus.READY, meeting(id).status)
    }

    @Test
    fun `asking again while a summary is under way does not start a second one`(): Unit = runBlocking {
        val id = recorded()
        val started = CompletableDeferred<Unit>()
        val release = CompletableDeferred<Unit>()
        llm.answer {
            started.complete(Unit)
            release.await()
            notes
        }
        val processor = processor()

        processor.summarize(id)
        processor.summarize(id)
        withTimeout(20_000) { started.await() }
        processor.summarize(id, force = true)
        release.complete(Unit)
        processor.awaitIdle()

        assertEquals(1, llm.requests.size)
        assertEquals(1, announced.size)
    }

    @Test
    fun `a meeting can be summarized again once the first summary is done`(): Unit = runBlocking {
        val id = recorded()
        val processor = processor()
        llm.reply(notes)
        processor.summarize(id)
        processor.awaitIdle()
        llm.reply(json(MeetingAnalysis(title = "Pricing review", tldr = "A better summary.")))
        processor.summarize(id)
        processor.awaitIdle()

        assertEquals(2, llm.requests.size)
        assertEquals("A better summary.", meeting(id).tldr)
    }

    @Test
    fun `meetings are summarized one at a time, and all of them get done`(): Unit = runBlocking {
        val first = recorded(title = "First")
        val second = recorded(title = "Second")
        val third = recorded(title = "Third")
        val started = CompletableDeferred<Unit>()
        val release = CompletableDeferred<Unit>()
        llm.answer {
            started.complete(Unit)
            release.await()
            notes
        }
        llm.reply(notes)
        llm.reply(notes)
        val processor = processor()

        processor.summarize(first)
        withTimeout(20_000) { started.await() }
        processor.summarize(second)
        processor.summarize(third)

        assertEquals("the others wait their turn", 1, llm.requests.size)
        assertEquals(setOf(first, second, third), processor.inProgress.value)
        assertEquals(MeetingStatus.TRANSCRIBED, meeting(second).status)

        release.complete(Unit)
        processor.awaitIdle()

        assertEquals(3, llm.requests.size)
        for (id in listOf(first, second, third)) assertEquals(MeetingStatus.READY, meeting(id).status)
        assertEquals(setOf(first, second, third), announced.map { it.first }.toSet())
    }

    @Test
    fun `the user is told when a summary fails`(): Unit = runBlocking {
        val id = recorded()
        llm.fail(LlmException.Kind.OVERLOADED, "Claude is busy right now. Try again in a moment.")
        val processor = processor()

        processor.summarize(id)
        processor.awaitIdle()

        val (meetingId, result) = announced.single()
        assertEquals(id, meetingId)
        assertEquals(LlmException.Kind.OVERLOADED, (result as SummaryResult.Failed).error.kind)
        assertEquals(MeetingStatus.FAILED, meeting(id).status)
    }

    @Test
    fun `a recording too short to summarize is reported as that`(): Unit = runBlocking {
        val id = recorded(lines = listOf("testing one two"))
        val processor = processor()

        processor.summarize(id)
        processor.awaitIdle()
        assertEquals(listOf(id to SummaryResult.TooShort(3)), announced.toList())
        assertTrue(llm.requests.isEmpty())

        llm.reply(notes)
        processor.summarize(id, force = true)
        processor.awaitIdle()
        assertEquals(MeetingStatus.READY, meeting(id).status)
    }

    @Test
    fun `a problem telling the user does not stop the next summary`(): Unit = runBlocking {
        val first = recorded(title = "First")
        val second = recorded(title = "Second")
        val processor = processor()

        announcingFails = true
        llm.reply(notes)
        processor.summarize(first)
        processor.awaitIdle()
        assertEquals(MeetingStatus.READY, meeting(first).status)

        announcingFails = false
        llm.reply(notes)
        processor.summarize(second)
        processor.awaitIdle()
        assertEquals(MeetingStatus.READY, meeting(second).status)
        assertEquals(listOf(first, second), announced.map { it.first })
    }

    @Test
    fun `a meeting that has gone is reported missing and leaves nothing in progress`(): Unit = runBlocking {
        val processor = processor()
        processor.summarize(404)
        processor.awaitIdle()

        assertEquals(listOf(404L to SummaryResult.Missing), announced.toList())
        assertTrue(processor.inProgress.value.isEmpty())
    }
}
