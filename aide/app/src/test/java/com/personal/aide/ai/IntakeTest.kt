package com.personal.aide.ai

import android.app.Application
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.aide.data.Material
import com.personal.aide.data.MeetingStore
import com.personal.aide.data.db.MeetingDao
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingSource
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.testing.prompt
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withTimeout
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.rules.TemporaryFolder
import org.junit.runner.RunWith
import org.robolectric.annotation.Config
import java.io.File
import java.util.concurrent.CopyOnWriteArrayList

/**
 * [Intake] with a real assistant over the scripted stand-in for Claude and a real meeting store:
 * what the user adds by hand, from the moment they press save to the saved meeting or document.
 */
@RunWith(AndroidJUnit4::class)
@Config(sdk = [35], application = Application::class)
class IntakeTest : AssistantTestBase() {
    @get:Rule
    val folder = TemporaryFolder()

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
    private lateinit var intake: Intake

    /** Every meeting handed on to have its notes written. */
    private val handedOn = CopyOnWriteArrayList<Long>()

    /** Every time the intake said it was done with a set of materials, and whether they had been saved. */
    private val finished = CopyOnWriteArrayList<Pair<List<Material>, Boolean>>()

    /** Set to make what happens after saving (starting the summary) blow up. */
    @Volatile
    private var afterSavingFails = false

    private fun intakeOver(store: MeetingStore) = Intake(
        scope = scope,
        assistant = assistant,
        meetings = store,
        onSaved = { id ->
            handedOn += id
            if (afterSavingFails) throw IllegalStateException("the summary could not be started")
        },
        onFinished = { materials, saved -> finished += materials to saved },
    )

    @Before
    fun setUpIntake() {
        intake = intakeOver(meetings)
    }

    @After
    fun stopBackgroundWork() {
        scope.cancel()
    }

    // -------------------------------------------------------------------------------------------
    // Helpers

    private var made = 0

    /** [count] page pictures on disk, as the document reader would have left them. */
    private fun pictures(count: Int): List<File> = (1..count).map {
        folder.newFile("page-${++made}.jpg").apply { writeBytes("picture $made".toByteArray()) }
    }

    /** Waits until the intake has let go of [count] sets of materials: the last thing it does with each. */
    private suspend fun awaitFinished(count: Int = 1) = withTimeout(20_000) {
        while (finished.size < count) delay(5)
    }

    private suspend fun awaitRequests(count: Int) = withTimeout(20_000) {
        while (llm.requests.size < count) delay(5)
    }

    private val state: IntakeState get() = intake.state.value

    private suspend fun allSaved(): List<MeetingEntity> = db.meetings().all()

    private suspend fun linesOf(meetingId: Long): List<String> = db.meetings().segments(meetingId).map { it.text }

    // -------------------------------------------------------------------------------------------
    // Typed notes and files read on the phone

    @Test
    fun `it starts with nothing to do`() {
        assertEquals(IntakeState.Idle, state)
    }

    @Test
    fun `typed notes are saved as a meeting's notes and handed on to be written up`(): Unit = runBlocking {
        assertTrue(intake.submit("  Vendor call ", "Dana: let's start.\n\nMarcus: pricing first.\n", emptyList(), MeetingSource.IMPORT))
        awaitFinished()

        val meeting = allSaved().single()
        assertEquals(IntakeState.Done(meeting.id), state)
        assertEquals("Vendor call", meeting.title)
        assertFalse(meeting.titleIsAuto)
        assertEquals(MeetingSource.IMPORT, meeting.source)
        assertEquals(MeetingStatus.TRANSCRIBED, meeting.status)
        assertEquals(listOf("Dana: let's start.", "Marcus: pricing first."), linesOf(meeting.id))

        assertEquals(listOf(meeting.id), handedOn.toList())
        assertEquals(listOf(emptyList<Material>() to true), finished.toList())
        assertTrue("typing needs no reading by Claude", llm.requests.isEmpty())
    }

    @Test
    fun `something to know is saved as a document`(): Unit = runBlocking {
        intake.submit("Team handbook", "We ship on Thursdays.", emptyList(), MeetingSource.DOCUMENT)
        awaitFinished()

        val saved = allSaved().single()
        assertEquals(MeetingSource.DOCUMENT, saved.source)
        assertEquals("Team handbook", saved.title)
        assertEquals(IntakeState.Done(saved.id), state)
        assertEquals(listOf(saved.id), handedOn.toList())
    }

    @Test
    fun `with no name given it is saved under the dated placeholder for the assistant to name`(): Unit = runBlocking {
        intake.submit("   ", "Some notes.", emptyList(), MeetingSource.IMPORT)
        awaitFinished()

        val saved = allSaved().single()
        assertTrue(saved.titleIsAuto)
        assertEquals(MeetingStore.defaultTitle(now), saved.title)
    }

    @Test
    fun `a file read on the phone is taken as it is, under a line naming it`(): Unit = runBlocking {
        val materials = listOf(Material.Words("Handbook.docx", "We ship on Thursdays.\nAsk Priya about budgets."))
        intake.submit("Handbook", "", materials, MeetingSource.DOCUMENT)
        awaitFinished()

        assertEquals(
            listOf("=== Handbook.docx ===", "We ship on Thursdays.", "Ask Priya about budgets."),
            linesOf(allSaved().single().id),
        )
        assertTrue(llm.requests.isEmpty())
        assertEquals(listOf(materials to true), finished.toList())
    }

    // -------------------------------------------------------------------------------------------
    // Pictures, read by Claude

    @Test
    fun `what was typed, the files and the pictures are put together in the order they were added`(): Unit = runBlocking {
        val whiteboard = Material.Pages("Photos", pictures(1), photos = true)
        val handbook = Material.Words("Handbook.docx", "We ship on Thursdays.")
        val scan = Material.Pages("scan.pdf", pictures(7))
        llm.reply("--- page 1 ---\nThree tiers agreed")
        llm.reply("--- page 1 ---\nPages one to six")
        llm.reply("--- page 7 ---\nPage seven")

        assertTrue(intake.submit("Pricing sync", "Met with Dana about pricing.", listOf(whiteboard, handbook, scan), MeetingSource.IMPORT))
        awaitFinished()

        val saved = allSaved().single()
        assertEquals(IntakeState.Done(saved.id), state)
        assertEquals(
            listOf(
                "Met with Dana about pricing.",
                "=== Photos ===", "--- page 1 ---", "Three tiers agreed",
                "=== Handbook.docx ===", "We ship on Thursdays.",
                "=== scan.pdf ===", "--- page 1 ---", "Pages one to six", "--- page 7 ---", "Page seven",
            ),
            linesOf(saved.id),
        )

        // The pictures went to Claude a file at a time; the Word document did not go at all.
        assertEquals(listOf(1, 6, 1), llm.requests.map { it.messages.single().images.size })
        assertTrue(llm.requests[0].prompt.contains("page 1 of 1 from \"Photos\""))
        assertTrue(llm.requests[1].prompt.contains("pages 1 to 6 of 7 from \"scan.pdf\""))
        assertTrue(llm.requests[2].prompt.contains("page 7 of 7 from \"scan.pdf\""))
        assertTrue(llm.requests.none { it.prompt.contains("We ship on Thursdays.") })

        assertEquals(listOf(saved.id), handedOn.toList())
        assertEquals(listOf(listOf(whiteboard, handbook, scan) to true), finished.toList())
    }

    @Test
    fun `progress counts pages read out of all the pages there are, across files`(): Unit = runBlocking {
        val first = Material.Pages("first.pdf", pictures(7))
        val words = Material.Words("notes.txt", "Read on the phone, so not a page to wait for.")
        val second = Material.Pages("Photos", pictures(2), photos = true)
        val startReading = CompletableDeferred<Unit>()
        /** What the screen was showing as each request went out. */
        val shown = CopyOnWriteArrayList<IntakeState>()
        repeat(3) { call ->
            llm.answer {
                if (call == 0) startReading.await()
                shown += state
                "Text of batch $call"
            }
        }

        intake.submit("Two files", "", listOf(first, words, second), MeetingSource.IMPORT)
        assertEquals("working from the moment it is submitted, with every page still to read", IntakeState.Working(0, 9), state)
        startReading.complete(Unit)
        awaitFinished()

        assertEquals(
            listOf<IntakeState>(IntakeState.Working(0, 9), IntakeState.Working(6, 9), IntakeState.Working(7, 9)),
            shown.toList(),
        )
        assertEquals(IntakeState.Done(allSaved().single().id), state)
    }

    @Test
    fun `with only words there are no pages to count`(): Unit = runBlocking {
        val holdSaving = CompletableDeferred<Unit>()
        val slow = object : MeetingDao by db.meetings() {
            override suspend fun insert(meeting: MeetingEntity): Long {
                holdSaving.await()
                return db.meetings().insert(meeting)
            }
        }
        intake = intakeOver(MeetingStore(slow) { now })

        intake.submit("Notes", "Typed.", listOf(Material.Words("a.txt", "Words.")), MeetingSource.IMPORT)
        assertEquals(IntakeState.Working(0, 0), state)
        holdSaving.complete(Unit)
        awaitFinished()
        assertEquals(IntakeState.Done(allSaved().single().id), state)
    }

    // -------------------------------------------------------------------------------------------
    // One at a time

    @Test
    fun `while one thing is being taken in a second is turned away untouched`(): Unit = runBlocking {
        val letItFinish = CompletableDeferred<Unit>()
        llm.answer {
            letItFinish.await()
            "The scan's text."
        }
        val scan = listOf(Material.Pages("scan.pdf", pictures(2)))
        val other = listOf(Material.Pages("other.pdf", pictures(3)))

        assertTrue(intake.submit("First", "", scan, MeetingSource.IMPORT))
        awaitRequests(1)
        assertFalse("a second thing was accepted while the first was still being read", intake.submit("Second", "Typed notes.", other, MeetingSource.DOCUMENT))
        assertEquals("the first one's progress is undisturbed", IntakeState.Working(0, 2), state)

        intake.acknowledge()
        assertEquals("nor can it be waved away while it is working", IntakeState.Working(0, 2), state)

        letItFinish.complete(Unit)
        awaitFinished()

        val saved = allSaved().single()
        assertEquals("First", saved.title)
        assertEquals(IntakeState.Done(saved.id), state)
        assertEquals(1, llm.requests.size)
        assertEquals("the one turned away is the caller's to keep or retry", listOf(scan to true), finished.toList())
        assertTrue(other.single().files.all { it.exists() })
    }

    @Test
    fun `once one thing is done the next is accepted, seen or not`(): Unit = runBlocking {
        assertTrue(intake.submit("First", "One.", emptyList(), MeetingSource.IMPORT))
        awaitFinished(1)
        assertTrue(state is IntakeState.Done)

        assertTrue(intake.submit("Second", "Two.", emptyList(), MeetingSource.DOCUMENT))
        awaitFinished(2)

        assertEquals(setOf("First", "Second"), allSaved().map { it.title }.toSet())
        assertEquals(IntakeState.Done(allSaved().single { it.title == "Second" }.id), state)
        assertEquals(2, handedOn.size)
    }

    @Test
    fun `acknowledging the result returns it to idle`(): Unit = runBlocking {
        intake.acknowledge()
        assertEquals(IntakeState.Idle, state)

        intake.submit("Saved", "Some notes.", emptyList(), MeetingSource.IMPORT)
        awaitFinished(1)
        assertTrue(state is IntakeState.Done)
        intake.acknowledge()
        assertEquals(IntakeState.Idle, state)

        intake.submit("Nothing", "", emptyList(), MeetingSource.IMPORT)
        awaitFinished(2)
        assertTrue(state is IntakeState.Failed)
        intake.acknowledge()
        assertEquals(IntakeState.Idle, state)
    }

    // -------------------------------------------------------------------------------------------
    // When it doesn't work

    @Test
    fun `a failure reading the pages leaves nothing saved and says why`(): Unit = runBlocking {
        val notes = Material.Words("notes.txt", "Typed up earlier.")
        val scan = Material.Pages("scan.pdf", pictures(8))
        llm.reply("Pages one to six.")
        llm.fail(LlmException.Kind.OVERLOADED, "Claude is busy right now. Try again in a moment.")

        assertTrue(intake.submit("Handbook", "My own notes.", listOf(notes, scan), MeetingSource.DOCUMENT))
        awaitFinished()

        assertEquals(IntakeState.Failed("Claude is busy right now. Try again in a moment."), state)
        assertTrue("half a document must not be saved as if it were the whole", allSaved().isEmpty())
        assertTrue(db.meetings().allSegments().isEmpty())
        assertTrue("there is nothing to write notes for", handedOn.isEmpty())
        assertEquals(listOf(listOf(notes, scan) to false), finished.toList())
        assertTrue("the pictures are still there to try again with", scan.files.all { it.exists() })
    }

    @Test
    fun `pages Claude will not or cannot read leave nothing saved either`(): Unit = runBlocking {
        val problems = listOf(
            LlmException.Kind.REFUSED to "Claude declined this request. Rewording it, or picking a different model in Settings, may help.",
            LlmException.Kind.NO_KEY to "Add your Claude API key in Settings first.",
            LlmException.Kind.OFFLINE to "Couldn't reach Claude. Check your internet connection.",
            LlmException.Kind.TRUNCATED to "The reply was cut off before it finished. Try again.",
        )
        for ((index, problem) in problems.withIndex()) {
            llm.fail(problem.first, problem.second)
            intake.submit("Photos", "Typed alongside.", listOf(Material.Pages("Photos", pictures(1), photos = true)), MeetingSource.IMPORT)
            awaitFinished(index + 1)

            assertEquals(IntakeState.Failed(problem.second), state)
            assertTrue("${problem.first}: what was typed must not be saved without the pictures it came with", allSaved().isEmpty())
            assertFalse(finished.last().second)
        }
        assertTrue(handedOn.isEmpty())
    }

    @Test
    fun `after a failure the same thing can be submitted again and saved`(): Unit = runBlocking {
        val scan = listOf(Material.Pages("scan.pdf", pictures(2)))
        llm.fail(LlmException.Kind.OVERLOADED)
        intake.submit("Scan", "", scan, MeetingSource.IMPORT)
        awaitFinished(1)
        assertTrue(state is IntakeState.Failed)

        llm.reply("Read this time.")
        assertTrue(intake.submit("Scan", "", scan, MeetingSource.IMPORT))
        awaitFinished(2)

        val saved = allSaved().single()
        assertEquals(IntakeState.Done(saved.id), state)
        assertEquals(listOf("=== scan.pdf ===", "Read this time."), linesOf(saved.id))
        assertEquals(listOf(scan to false, scan to true), finished.toList())
    }

    @Test
    fun `with nothing typed and nothing in the files there is nothing to save`(): Unit = runBlocking {
        val blank = listOf(Material.Words("blank.txt", "  \n\t"))
        assertTrue(intake.submit("Empty", "   ", blank, MeetingSource.IMPORT))
        awaitFinished()

        assertEquals(IntakeState.Failed("There was nothing to save."), state)
        assertTrue(allSaved().isEmpty())
        assertTrue(handedOn.isEmpty())
        assertEquals(listOf(blank to false), finished.toList())
    }

    @Test
    fun `saving that fails is reported as not saved`(): Unit = runBlocking {
        val broken = object : MeetingDao by db.meetings() {
            override suspend fun insert(meeting: MeetingEntity): Long = throw IllegalStateException("the disk is full")
        }
        intake = intakeOver(MeetingStore(broken) { now })

        intake.submit("Notes", "Typed.", emptyList(), MeetingSource.IMPORT)
        awaitFinished()

        assertEquals(IntakeState.Failed("That couldn't be saved. Try again."), state)
        assertTrue(allSaved().isEmpty())
        assertTrue(handedOn.isEmpty())
        assertEquals(listOf(emptyList<Material>() to false), finished.toList())
    }

    @Test
    fun `a failure in what happens after saving does not unsay that it was saved`(): Unit = runBlocking {
        afterSavingFails = true
        val scan = listOf(Material.Pages("scan.pdf", pictures(1)))
        llm.reply("The page's text.")

        intake.submit("Scan", "", scan, MeetingSource.IMPORT)
        awaitFinished()

        // The text is in the database and the page pictures have been let go of as saved...
        val saved = allSaved().single()
        assertEquals(listOf("=== scan.pdf ===", "The page's text."), linesOf(saved.id))
        assertEquals(listOf(scan to true), finished.toList())
        // ...so the user must not be told it failed and to try again: that would save it twice.
        assertEquals(IntakeState.Done(saved.id), state)
    }

    @Test
    fun `work cut short by the app shutting down saves nothing and leaves it ready for next time`(): Unit = runBlocking {
        val never = CompletableDeferred<Unit>()
        llm.answer {
            never.await()
            "Never read."
        }
        val scan = listOf(Material.Pages("scan.pdf", pictures(2)))
        intake.submit("Scan", "Typed.", scan, MeetingSource.IMPORT)
        awaitRequests(1)

        scope.cancel()
        awaitFinished()

        assertEquals(IntakeState.Idle, state)
        assertTrue(allSaved().isEmpty())
        assertTrue(handedOn.isEmpty())
        assertEquals(listOf(scan to false), finished.toList())
    }
}
