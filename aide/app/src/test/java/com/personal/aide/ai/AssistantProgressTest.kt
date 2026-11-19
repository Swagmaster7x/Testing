package com.personal.aide.ai

import android.app.Application
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.aide.data.AgendaItem
import com.personal.aide.data.AideJson
import com.personal.aide.data.DayPlan
import com.personal.aide.data.GoalRead
import com.personal.aide.data.LoggedWin
import com.personal.aide.data.MeetingAnalysis
import com.personal.aide.data.PersonAgenda
import com.personal.aide.data.ProgressUpdate
import com.personal.aide.data.SelfReview
import com.personal.aide.data.WeekReview
import com.personal.aide.data.WinStore
import com.personal.aide.data.db.InsightEntity
import com.personal.aide.data.db.InsightKind
import com.personal.aide.data.db.KnowledgeOrigin
import com.personal.aide.data.db.KnowledgeType
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.data.db.TaskStatus
import com.personal.aide.data.db.WinEntity
import com.personal.aide.data.db.WinSource
import com.personal.aide.domain.Days
import com.personal.aide.domain.buildPersonView
import com.personal.aide.testing.Fixed
import com.personal.aide.testing.prompt
import com.personal.aide.testing.systemText
import com.personal.aide.testing.task
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Assert.fail
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config
import java.util.Collections

/** Goals and wins, the self-review, and the agenda for a conversation with one person. */
@RunWith(AndroidJUnit4::class)
@Config(sdk = [35], application = Application::class)
class AssistantProgressTest : AssistantTestBase() {
    private val monday = Fixed.monday

    private val quoting = "Launch self-serve quoting by end of Q1"
    private val turnaround = "Cut quote turnaround to two hours"
    private val hiring = "Hire a second designer"
    private val goals = listOf(quoting, turnaround, hiring)

    private fun at(day: Long, hour: Int, minute: Int = 0) = Fixed.at(day, hour, minute)

    private fun json(update: ProgressUpdate) = AideJson.encodeToString(ProgressUpdate.serializer(), update)
    private fun json(agenda: PersonAgenda) = AideJson.encodeToString(PersonAgenda.serializer(), agenda)
    private fun json(review: WeekReview) = AideJson.encodeToString(WeekReview.serializer(), review)

    private val wins: WinStore get() = WinStore(db.wins()) { now }

    /** A task of the user's finished at four in the afternoon, [daysAgo] days ago. */
    private suspend fun finished(title: String, daysAgo: Long, due: Long? = null, meetingId: Long? = null, details: String = ""): TaskEntity = insert(
        task(
            title = title, status = TaskStatus.DONE, due = due, meetingId = meetingId, details = details,
            createdAt = at(today - daysAgo - 2, 9), completedAt = at(today - daysAgo, 16),
        ),
    )

    private suspend fun logged(): List<WinEntity> = db.wins().all()

    private suspend fun goalsPass(): ProgressUpdate? =
        db.insights().get(InsightKind.GOALS, 0)?.let { AideJson.decodeFromString(ProgressUpdate.serializer(), it.json) }

    /** Runs [block], which must be refused with a message containing [messagePart] before anything is sent. */
    private suspend fun expectRefused(messagePart: String, block: suspend () -> Unit) {
        try {
            block()
            fail("Expected to be told there is nothing to work from")
        } catch (e: LlmException) {
            assertEquals(LlmException.Kind.OTHER, e.kind)
            assertTrue(e.message.orEmpty(), e.message.orEmpty().contains(messagePart))
        }
        assertTrue("having nothing to work from must not cost a call", llm.requests.isEmpty())
        assertTrue(db.usage().all().isEmpty())
    }

    private suspend fun expectFailure(kind: LlmException.Kind, block: suspend () -> Unit) {
        try {
            block()
            fail("Expected the call to fail")
        } catch (e: LlmException) {
            assertEquals(kind, e.kind)
        }
    }

    // -------------------------------------------------------------------------------------------
    // Bringing goals and wins up to date: when there is nothing to do

    @Test
    fun `with nothing finished or recorded there is nothing to update and Claude is not called`(): Unit = runBlocking {
        settings.setProfile(sam.copy(goals = goals))
        insert(task(title = "Still open", createdAt = at(today - 3, 9)))
        insert(task(title = "Someone else's finished thing", ownership = Ownership.OTHERS, owner = "Dana", status = TaskStatus.DONE, completedAt = at(today - 1, 9)))
        insert(task(title = "Nobody's finished thing", ownership = Ownership.UNCLEAR, status = TaskStatus.DONE, completedAt = at(today - 1, 9)))
        insert(task(title = "Thrown out", status = TaskStatus.DISMISSED))
        db.meetings().insert(MeetingEntity(title = "Recorded, never summarized", startedAt = at(today - 1, 10), status = MeetingStatus.TRANSCRIBED))
        db.meetings().insert(MeetingEntity(title = "Summary failed", startedAt = at(today - 1, 11), status = MeetingStatus.FAILED))

        expectRefused("Nothing has been finished or recorded") { assistant.updateProgress() }

        assertTrue(db.insights().all().isEmpty())
        assertTrue(logged().isEmpty())
    }

    @Test
    fun `an empty app has nothing to update either`(): Unit = runBlocking {
        expectRefused("nothing new to add") { assistant.updateProgress() }
    }

    @Test
    fun `the first pass looks back ninety days and no further`(): Unit = runBlocking {
        assertEquals(90L, Assistant.FIRST_PROGRESS_DAYS)
        insert(task(title = "Finished ninety-one days ago", status = TaskStatus.DONE, completedAt = at(today - 91, 23, 30)))
        summarized("Too long ago", at(today - 120, 10))
        expectRefused("Nothing has been finished or recorded") { assistant.updateProgress() }

        val inside = insert(task(title = "Finished ninety days ago", status = TaskStatus.DONE, completedAt = at(today - 90, 0, 30)))
        llm.reply(json(ProgressUpdate()))
        assistant.updateProgress()

        val prompt = llm.last.prompt
        assertTrue(prompt.startsWith("Today is Wednesday, 18 November 2026. This covers everything since Thursday, 20 August 2026.\n\n"))
        assertTrue(prompt.contains("- [task ${inside.id}] Finished ninety days ago | done 2026-08-20"))
        assertFalse(prompt.contains("Finished ninety-one days ago"))
        assertFalse(prompt.contains("Too long ago"))
    }

    @Test
    fun `after a pass, nothing new since the day before it means no second call`(): Unit = runBlocking {
        db.insights().upsert(InsightEntity(kind = InsightKind.GOALS, periodStart = 0, json = json(ProgressUpdate()), createdAt = at(today - 10, 12)))
        insert(task(title = "Finished before the last pass", status = TaskStatus.DONE, completedAt = at(today - 12, 16)))
        summarized("Held before the last pass", at(today - 12, 10))

        expectRefused("since the last update") { assistant.updateProgress() }

        assertEquals("the earlier pass is left as it was", at(today - 10, 12), db.insights().get(InsightKind.GOALS, 0)!!.createdAt)
    }

    @Test
    fun `a later pass covers everything from the day before the last one`(): Unit = runBlocking {
        db.insights().upsert(InsightEntity(kind = InsightKind.GOALS, periodStart = 0, json = json(ProgressUpdate()), createdAt = at(today - 10, 12)))
        val before = finished("Finished two days before the last pass", daysAgo = 12)
        val overlap = insert(task(title = "Finished the morning before the last pass", status = TaskStatus.DONE, completedAt = at(today - 11, 0, 15)))
        val since = finished("Finished since", daysAgo = 3)
        val oldMeeting = summarized("Held before the last pass", at(today - 12, 10))
        val newMeeting = summarized("Held since", at(today - 2, 10))
        llm.reply(json(ProgressUpdate()))

        assistant.updateProgress()

        val prompt = llm.last.prompt
        assertTrue(prompt.startsWith("Today is Wednesday, 18 November 2026. This covers everything since ${Days.longDate(today - 11)}.\n\n"))
        assertTrue(prompt.contains("[task ${overlap.id}]"))
        assertTrue(prompt.contains("[task ${since.id}]"))
        assertFalse(prompt.contains("[task ${before.id}]"))
        assertTrue(prompt.contains("[meeting $newMeeting]"))
        assertFalse(prompt.contains("[meeting $oldMeeting]"))
    }

    @Test
    fun `one summarized meeting is enough to go on`(): Unit = runBlocking {
        summarized("Pricing review", at(monday, 10))
        llm.reply(json(ProgressUpdate()))

        assistant.updateProgress()

        assertEquals(1, llm.requests.size)
        assertTrue(llm.last.prompt.contains("<completed_tasks>\nNone.\n</completed_tasks>"))
    }

    // -------------------------------------------------------------------------------------------
    // Bringing goals and wins up to date: what is sent

    @Test
    fun `the request shows the goals, the log so far, and finished tasks and meetings with their ids`(): Unit = runBlocking {
        settings.setProfile(sam.copy(goals = listOf(quoting, turnaround), successMeasures = listOf("Quotes sent per week")))
        val review = summarized(
            "Pricing review", at(monday, 10),
            MeetingAnalysis(title = "Pricing review", tldr = "Agreed three tiers.", decisions = listOf("Ship in Q1", "Enterprise stays custom")),
        )
        val deck = insert(
            task(title = "Send pricing deck", status = TaskStatus.DONE, due = today - 1, meetingId = review, details = "Include the enterprise tier", createdAt = at(monday, 11), completedAt = at(today - 1, 16)),
        )
        val tidy = insert(task(title = "Tidy backlog", status = TaskStatus.DONE, createdAt = at(monday, 9), completedAt = at(today - 1, 21)))
        val legal = insert(task(title = "Reply to legal", status = TaskStatus.DONE, due = monday, createdAt = at(monday - 6, 10), completedAt = at(today, 9)))
        val faq = insert(task(title = "Draft FAQ", createdAt = at(today - 1, 9)))
        insert(task(title = "Their finished thing", ownership = Ownership.OTHERS, owner = "Lee", status = TaskStatus.DONE, completedAt = at(today - 1, 12)))
        insert(task(title = "Their open thing", ownership = Ownership.OTHERS, owner = "Lee"))
        db.meetings().insert(MeetingEntity(title = "Never summarized", startedAt = at(today - 1, 10), status = MeetingStatus.TRANSCRIBED))
        wins.add("Hired a designer", today - 8, goal = hiring)
        wins.add("Fixed the build", today - 9)
        llm.reply(json(ProgressUpdate()))

        assistant.updateProgress()

        val request = llm.requests.single()
        assertEquals("progress", request.feature)
        assertEquals(Schemas.progressUpdate, request.schema)
        assertEquals(listOf(LlmMessage.Role.USER), request.messages.map { it.role })
        assertTrue(request.systemText.contains("Name: Sam Rivera\n"))

        val prompt = request.prompt
        assertTrue(
            prompt,
            prompt.startsWith(
                "Today is Wednesday, 18 November 2026. This covers everything since Thursday, 20 August 2026.\n\n" +
                    "<goals>\n- $quoting\n- $turnaround\n</goals>\n\n" +
                    "<judged_on>\n- Quotes sent per week\n</judged_on>\n\n" +
                    "<already_logged>\n- 2026-11-10: Hired a designer [$hiring]\n- 2026-11-09: Fixed the build\n</already_logged>\n\n" +
                    "<completed_tasks>\n",
            ),
        )
        assertEquals(
            listOf(
                "- [task ${deck.id}] Send pricing deck | done 2026-11-17 | on time | from \"Pricing review\" | Include the enterprise tier",
                "- [task ${tidy.id}] Tidy backlog | done 2026-11-17",
                "- [task ${legal.id}] Reply to legal | done 2026-11-18 | 2 days after its date",
            ),
            prompt.substringAfter("<completed_tasks>\n").substringBefore("\n</completed_tasks>").lines(),
        )
        assertEquals(
            "- [meeting $review] 2026-11-16 \"Pricing review\": Agreed three tiers. Decided: Ship in Q1; Enterprise stays custom",
            prompt.substringAfter("<meetings>\n").substringBefore("\n</meetings>"),
        )
        val open = prompt.substringAfter("<still_open>\n").substringBefore("\n</still_open>")
        assertTrue(open, open.startsWith("- [id ${faq.id}] Draft FAQ | no due date | normal priority | added 1 days ago"))
        assertEquals("only the user's own open work", 1, open.lines().size)
        assertFalse(prompt.contains("Their finished thing"))
        assertFalse(prompt.contains("Never summarized"))
        assertTrue("the instructions come last", prompt.trimEnd().endsWith("don't infer progress from silence."))
        assertTrue(prompt.contains("Bring Sam Rivera's record of their own work up to date from the material above."))
    }

    @Test
    fun `with no goals and nothing logged the request says so instead of leaving holes`(): Unit = runBlocking {
        finished("Send pricing deck", daysAgo = 1)
        llm.reply(json(ProgressUpdate()))

        assistant.updateProgress()

        val prompt = llm.last.prompt
        assertTrue(prompt.contains("<goals>\nNone set.\n</goals>"))
        assertFalse(prompt.contains("<judged_on>"))
        assertTrue(prompt.contains("<already_logged>\nNothing yet.\n</already_logged>"))
        assertTrue(prompt.contains("<meetings>\nNone.\n</meetings>"))
        assertTrue(prompt.contains("<still_open>\nNone.\n</still_open>"))
        assertTrue(prompt.contains("Bring the user's record of their own work up to date"))
    }

    @Test
    fun `a long backlog is cut to the most recent eighty finished tasks, and only those can be cited`(): Unit = runBlocking {
        val done = (1..85).map { insert(task(title = "Finished task number $it", status = TaskStatus.DONE, completedAt = at(today - 30, 9) + it * 3_600_000L)) }
        llm.reply(
            json(
                ProgressUpdate(
                    wins = listOf(
                        LoggedWin(title = "Cites the oldest, which was cut", day = "2026-11-01", taskId = done.first().id),
                        LoggedWin(title = "Cites the newest", day = "2026-11-01", taskId = done.last().id),
                    ),
                ),
            ),
        )

        assistant.updateProgress()

        val listed = llm.last.prompt.substringAfter("<completed_tasks>\n").substringBefore("\n</completed_tasks>").lines()
        assertEquals(80, listed.size)
        assertTrue(listed.first(), listed.first().startsWith("- [task ${done[5].id}] Finished task number 6 "))
        assertTrue(listed.last(), listed.last().startsWith("- [task ${done.last().id}] Finished task number 85 "))
        assertNull(logged().single { it.title == "Cites the oldest, which was cut" }.taskId)
        assertEquals(done.last().id, logged().single { it.title == "Cites the newest" }.taskId)
    }

    // -------------------------------------------------------------------------------------------
    // Bringing goals and wins up to date: what is kept

    @Test
    fun `a win is logged with its goal, its day and where it came from`(): Unit = runBlocking {
        settings.setProfile(sam.copy(goals = goals))
        val review = summarized("Pricing review", at(monday, 10))
        val deck = finished("Send pricing deck", daysAgo = 1, meetingId = review)
        val sent = LoggedWin(
            title = "  Got Sales and Product to agree on three tiers ",
            detail = " Unblocked the Q1 launch. ",
            goal = "launch self-serve quoting by END of q1",
            day = "2026-11-16",
            taskId = deck.id,
            meetingId = review,
        )
        llm.reply(json(ProgressUpdate(wins = listOf(sent))))

        val update = assistant.updateProgress()

        val win = logged().single()
        assertEquals("Got Sales and Product to agree on three tiers", win.title)
        assertEquals("Unblocked the Q1 launch.", win.detail)
        assertEquals("filed under the goal as the user words it", quoting, win.goal)
        assertEquals(monday, win.day)
        assertEquals(WinSource.ASSISTANT, win.source)
        assertEquals(deck.id, win.taskId)
        assertEquals(review, win.meetingId)
        assertEquals(now, win.createdAt)
        assertEquals(listOf(sent.copy(goal = quoting)), update.wins)
    }

    @Test
    fun `a win cannot be filed under a goal the user does not have`(): Unit = runBlocking {
        settings.setProfile(sam.copy(goals = goals))
        finished("Send pricing deck", daysAgo = 1)
        llm.reply(
            json(
                ProgressUpdate(
                    wins = listOf(
                        LoggedWin(title = "Shipped the pricing page", goal = "Become VP of Product", day = "2026-11-17"),
                        LoggedWin(title = "Closed the Acme renewal", goal = "Launch self-serve quoting", day = "2026-11-17"),
                        LoggedWin(title = "Hired a contractor", goal = hiring, day = "2026-11-17"),
                    ),
                ),
            ),
        )

        val update = assistant.updateProgress()

        assertEquals(
            mapOf("Shipped the pricing page" to "", "Closed the Acme renewal" to "", "Hired a contractor" to hiring),
            logged().associate { it.title to it.goal },
        )
        assertEquals("the win itself is still worth keeping", 3, update.wins.size)
        assertEquals(listOf("", "", hiring), update.wins.map { it.goal })
    }

    @Test
    fun `a win cannot point at a task or meeting it was not shown`(): Unit = runBlocking {
        val shownMeeting = summarized("Pricing review", at(monday, 10))
        val shownTask = finished("Send pricing deck", daysAgo = 1)
        val open = insert(task(title = "Draft FAQ"))
        val theirs = insert(task(title = "Their finished thing", ownership = Ownership.OTHERS, owner = "Lee", status = TaskStatus.DONE, completedAt = at(today - 1, 12)))
        val longAgo = insert(task(title = "Finished last winter", status = TaskStatus.DONE, completedAt = at(today - 200, 12)))
        val unsummarized = db.meetings().insert(MeetingEntity(title = "Never summarized", startedAt = at(today - 1, 10), status = MeetingStatus.TRANSCRIBED))
        val oldMeeting = summarized("Held last winter", at(today - 200, 10))
        llm.reply(
            json(
                ProgressUpdate(
                    wins = listOf(
                        LoggedWin(title = "Real on both counts", day = "2026-11-17", taskId = shownTask.id, meetingId = shownMeeting),
                        LoggedWin(title = "From a task still open", day = "2026-11-17", taskId = open.id, meetingId = unsummarized),
                        LoggedWin(title = "From someone else's task", day = "2026-11-17", taskId = theirs.id, meetingId = oldMeeting),
                        LoggedWin(title = "From a task too old to have been shown", day = "2026-11-17", taskId = longAgo.id, meetingId = 999_999),
                        LoggedWin(title = "From a task that does not exist", day = "2026-11-17", taskId = 999_999, meetingId = -4),
                    ),
                ),
            ),
        )

        assistant.updateProgress()

        val byTitle = logged().associateBy { it.title }
        assertEquals(5, byTitle.size)
        assertEquals(shownTask.id, byTitle.getValue("Real on both counts").taskId)
        assertEquals(shownMeeting, byTitle.getValue("Real on both counts").meetingId)
        for (title in byTitle.keys - "Real on both counts") {
            assertNull("$title: task", byTitle.getValue(title).taskId)
            assertNull("$title: meeting", byTitle.getValue(title).meetingId)
        }
    }

    @Test
    fun `a win is dated no later than today, and today when the date can't be read`(): Unit = runBlocking {
        finished("Send pricing deck", daysAgo = 1)
        llm.reply(
            json(
                ProgressUpdate(
                    wins = listOf(
                        LoggedWin(title = "Dated properly", day = "2026-11-10"),
                        LoggedWin(title = "Dated with a time", day = "2026-11-12T09:30:00"),
                        LoggedWin(title = "Dated next year", day = "2027-01-15"),
                        LoggedWin(title = "Not dated", day = ""),
                        LoggedWin(title = "Dated in words", day = "last Tuesday"),
                        LoggedWin(title = "Dated today", day = "2026-11-18"),
                    ),
                ),
            ),
        )

        val update = assistant.updateProgress()

        assertEquals(
            mapOf(
                "Dated properly" to Fixed.day(2026, 11, 10),
                "Dated with a time" to Fixed.day(2026, 11, 12),
                "Dated next year" to today,
                "Not dated" to today,
                "Dated in words" to today,
                "Dated today" to today,
            ),
            logged().associate { it.title to it.day },
        )
        assertEquals("what is reported back carries the day it was logged under", "2026-11-18", update.wins.single { it.title == "Dated next year" }.day)
    }

    @Test
    fun `a win already in the log is not logged twice`(): Unit = runBlocking {
        finished("Send pricing deck", daysAgo = 1)
        wins.add("Shipped the pricing page", today - 3, detail = "As the user wrote it")
        llm.reply(
            json(
                ProgressUpdate(
                    wins = listOf(
                        LoggedWin(title = "shipped the PRICING page.", detail = "As the assistant would put it", day = "2026-11-17"),
                        LoggedWin(title = "Closed the Acme renewal", day = "2026-11-17"),
                        LoggedWin(title = "  closed the acme renewal ", day = "2026-11-16"),
                        LoggedWin(title = "   ", detail = "No title at all", day = "2026-11-17"),
                    ),
                ),
            ),
        )

        val update = assistant.updateProgress()

        assertEquals(setOf("Shipped the pricing page", "Closed the Acme renewal"), logged().map { it.title }.toSet())
        assertEquals("the user's own entry is untouched", "As the user wrote it", logged().single { it.title == "Shipped the pricing page" }.detail)
        assertEquals(WinSource.MANUAL, logged().single { it.title == "Shipped the pricing page" }.source)
        assertEquals("only what was actually added is reported", listOf("Closed the Acme renewal"), update.wins.map { it.title })
    }

    @Test
    fun `the same finished task reworded on the next pass is still one win`(): Unit = runBlocking {
        val deck = finished("Send pricing deck", daysAgo = 1)
        llm.reply(json(ProgressUpdate(wins = listOf(LoggedWin(title = "Shipped the pricing deck on time", day = "2026-11-17", taskId = deck.id)))))
        assistant.updateProgress()

        // The next morning the same task is still inside the day of overlap, and Claude words it differently.
        now += 20 * 3_600_000L
        llm.reply(json(ProgressUpdate(wins = listOf(LoggedWin(title = "Delivered the revised pricing deck to Sales", day = "2026-11-17", taskId = deck.id)))))
        val second = assistant.updateProgress()

        assertTrue("this test needs the task to have been shown again", llm.last.prompt.contains("[task ${deck.id}]"))
        assertTrue(llm.last.prompt.contains("<already_logged>\n- 2026-11-17: Shipped the pricing deck on time\n</already_logged>"))
        assertEquals(listOf("Shipped the pricing deck on time"), logged().map { it.title })
        assertTrue(second.wins.isEmpty())
    }

    @Test
    fun `every goal gets a read, in the user's wording and order`(): Unit = runBlocking {
        settings.setProfile(sam.copy(goals = goals))
        finished("Send pricing deck", daysAgo = 1)
        llm.reply(
            json(
                ProgressUpdate(
                    goals = listOf(
                        GoalRead(goal = "cut quote turnaround to TWO hours.", status = "at_risk", note = "Nothing has moved.", nextStep = "Time the current flow"),
                        GoalRead(goal = "Become VP of Product", status = "on_track", note = "Not a goal the user has."),
                        GoalRead(goal = quoting, status = "on_track", note = "Pricing is agreed.", nextStep = "Book the pilot"),
                    ),
                ),
            ),
        )

        val update = assistant.updateProgress()

        assertEquals(
            listOf(
                GoalRead(goal = quoting, status = "on_track", note = "Pricing is agreed.", nextStep = "Book the pilot"),
                GoalRead(goal = turnaround, status = "at_risk", note = "Nothing has moved.", nextStep = "Time the current flow"),
                // Claude said nothing about this one, which is not the same as saying it is fine.
                GoalRead(goal = hiring, status = "no_evidence"),
            ),
            update.goals,
        )
    }

    @Test
    fun `the reads are remembered as the latest pass, without a second copy of the wins`(): Unit = runBlocking {
        settings.setProfile(sam.copy(goals = listOf(quoting)))
        finished("Send pricing deck", daysAgo = 1)
        llm.reply(
            json(ProgressUpdate(wins = listOf(LoggedWin(title = "Shipped the pricing deck", day = "2026-11-17")), goals = listOf(GoalRead(quoting, "on_track", "Pricing is agreed.", "Book the pilot")))),
        )

        val update = assistant.updateProgress()

        val stored = db.insights().all().single()
        assertEquals(InsightKind.GOALS, stored.kind)
        assertEquals(0L, stored.periodStart)
        assertEquals(now, stored.createdAt)
        assertEquals(ProgressUpdate(wins = emptyList(), goals = update.goals), goalsPass())
        assertEquals("the wins live in the log, where the user can edit them", 1, logged().size)
        assertEquals("progress", db.usage().all().single().feature)
    }

    @Test
    fun `a later pass replaces the earlier reads`(): Unit = runBlocking {
        settings.setProfile(sam.copy(goals = listOf(quoting)))
        finished("Send pricing deck", daysAgo = 1)
        llm.reply(json(ProgressUpdate(goals = listOf(GoalRead(quoting, "stalled", "Nothing yet.")))))
        assistant.updateProgress()
        now += 3_600_000
        llm.reply(json(ProgressUpdate(goals = listOf(GoalRead(quoting, "on_track", "Pricing is agreed.")))))
        assistant.updateProgress()

        assertEquals(1, db.insights().all().size)
        assertEquals(listOf(GoalRead(quoting, "on_track", "Pricing is agreed.")), goalsPass()!!.goals)
        assertEquals(now, db.insights().get(InsightKind.GOALS, 0)!!.createdAt)
    }

    @Test
    fun `with no goals set wins are still logged, unfiled`(): Unit = runBlocking {
        finished("Send pricing deck", daysAgo = 1)
        llm.reply(
            json(ProgressUpdate(wins = listOf(LoggedWin(title = "Shipped the pricing deck", goal = "A goal Claude made up", day = "2026-11-17")), goals = listOf(GoalRead("A goal Claude made up", "on_track", "Invented.")))),
        )

        val update = assistant.updateProgress()

        assertEquals("", logged().single().goal)
        assertTrue(update.goals.isEmpty())
        assertTrue(goalsPass()!!.goals.isEmpty())
    }

    @Test
    fun `a pass that fails logs nothing and is not remembered as a pass`(): Unit = runBlocking {
        settings.setProfile(sam.copy(goals = goals))
        val deck = finished("Send pricing deck", daysAgo = 1)

        llm.fail(LlmException.Kind.OVERLOADED)
        expectFailure(LlmException.Kind.OVERLOADED) { assistant.updateProgress() }
        now += 1_000
        llm.reply("Here is what I found: the user shipped a deck.")
        expectFailure(LlmException.Kind.BAD_REPLY) { assistant.updateProgress() }

        assertTrue(logged().isEmpty())
        assertTrue(db.insights().all().isEmpty())
        assertEquals(listOf(false, true), db.usage().all().map { it.ok })

        // So trying again still covers the same ground.
        llm.reply(json(ProgressUpdate(wins = listOf(LoggedWin(title = "Shipped the pricing deck", day = "2026-11-17", taskId = deck.id)))))
        assistant.updateProgress()
        assertTrue(llm.last.prompt.contains("This covers everything since Thursday, 20 August 2026."))
        assertEquals(deck.id, logged().single().taskId)
    }

    // -------------------------------------------------------------------------------------------
    // The self-review

    /** The period under review in these tests: four weeks, ending yesterday. It starts on a Wednesday. */
    private val fromDay = today - 28
    private val toDay = today - 1

    private suspend fun review(): InsightEntity? = db.insights().all().singleOrNull { it.kind == InsightKind.SELF_REVIEW }

    @Test
    fun `with no wins logged and nothing finished in the period there is nothing to review and Claude is not called`(): Unit = runBlocking {
        settings.setProfile(sam.copy(goals = goals))
        wins.add("Logged the day before the period", fromDay - 1)
        wins.add("Logged the day after the period", toDay + 1)
        insert(task(title = "Finished before the period", status = TaskStatus.DONE, completedAt = at(fromDay - 1, 23, 30)))
        insert(task(title = "Finished after the period", status = TaskStatus.DONE, completedAt = at(toDay + 1, 0, 30)))
        insert(task(title = "Someone else's, finished in the period", ownership = Ownership.OTHERS, owner = "Dana", status = TaskStatus.DONE, completedAt = at(today - 5, 12)))
        insert(task(title = "Still open", createdAt = at(today - 5, 9)))
        summarized("A meeting in the period is not an achievement", at(today - 5, 10))

        expectRefused("nothing on record for that period") { assistant.draftSelfReview(fromDay, toDay) {} }

        assertNull(review())
    }

    @Test
    fun `one finished task is enough to draft from, and so is one win`(): Unit = runBlocking {
        insert(task(title = "Finished on the last day", status = TaskStatus.DONE, completedAt = at(toDay, 23, 30)))
        llm.reply("# Summary\nOne thing done.")
        assistant.draftSelfReview(fromDay, toDay) {}
        assertTrue(llm.last.prompt.contains("<wins_log>\nNothing logged.\n</wins_log>"))
        assertTrue(llm.last.prompt.contains("<tasks_finished>\n- Finished on the last day\n</tasks_finished>"))

        db.tasks().deleteAll()
        wins.add("Logged on the first day", fromDay)
        llm.reply("# Summary\nOne win.")
        assistant.draftSelfReview(fromDay, toDay) {}
        assertTrue(llm.last.prompt.contains("<wins_log>\n- ${Days.iso(fromDay)}: Logged on the first day\n</wins_log>"))
        assertTrue(llm.last.prompt.contains("<tasks_finished>\nNone.\n</tasks_finished>"))
    }

    @Test
    fun `the request carries the goals as they stand, the wins log, the numbers and what was finished`(): Unit = runBlocking {
        settings.setProfile(sam.copy(goals = goals))
        db.insights().upsert(
            InsightEntity(
                kind = InsightKind.GOALS, periodStart = 0, createdAt = at(today - 1, 18),
                json = json(ProgressUpdate(goals = listOf(GoalRead(quoting, "on_track", "Pricing is agreed.", "Book the pilot"), GoalRead(turnaround, "at_risk", "")))),
            ),
        )
        wins.add("Logged on the first day", fromDay)
        wins.add("Got Sales to agree on tiers", today - 8, detail = "Unblocked the launch", goal = quoting)
        wins.add("Logged on the last day", toDay)
        wins.add("Logged the day before the period", fromDay - 1)
        wins.add("Logged today, after the period", today)
        insert(task(title = "Send pricing deck", status = TaskStatus.DONE, due = today - 9, createdAt = at(today - 12, 9), completedAt = at(today - 9, 16)))
        insert(task(title = "Reply to legal", status = TaskStatus.DONE, due = today - 4, createdAt = at(today - 40, 9), completedAt = at(today - 2, 9)))
        insert(task(title = "Finished today, after the period", status = TaskStatus.DONE, createdAt = at(today - 1, 9), completedAt = at(today, 9)))
        insert(task(title = "Finished long before", status = TaskStatus.DONE, createdAt = at(today - 50, 9), completedAt = at(today - 45, 9)))
        insert(task(title = "Their finished thing", ownership = Ownership.OTHERS, owner = "Lee", status = TaskStatus.DONE, completedAt = at(today - 5, 12)))
        insert(task(title = "Draft FAQ", due = today + 2, createdAt = at(today - 3, 9)))
        llm.reply("# Summary\nA strong month.")

        assistant.draftSelfReview(fromDay, toDay) {}

        val request = llm.requests.single()
        assertEquals("self_review", request.feature)
        assertNull("a self-review is prose, not JSON", request.schema)
        assertEquals(listOf(LlmMessage.Role.USER), request.messages.map { it.role })
        assertTrue(request.systemText.contains("You work for Sam Rivera."))

        val prompt = request.prompt
        assertTrue(
            prompt,
            prompt.startsWith(
                "The period under review: Wednesday, 21 October 2026 to Tuesday, 17 November 2026. Today is Wednesday, 18 November 2026.\n\n" +
                    "<goals>\n" +
                    "- $quoting (as it stands: on track. Pricing is agreed.)\n" +
                    "- $turnaround\n" +
                    "- $hiring\n" +
                    "</goals>\n\n" +
                    "<wins_log>\n" +
                    "- 2026-10-21: Logged on the first day\n" +
                    "- 2026-11-10: Got Sales to agree on tiers — Unblocked the launch [goal: $quoting]\n" +
                    "- 2026-11-17: Logged on the last day\n" +
                    "</wins_log>\n\n" +
                    "<numbers>\n" +
                    "Tasks completed: 2\n" +
                    "New tasks taken on: 3\n" +
                    "Of the completed tasks that had a due date: 1 on time, 1 late (50% on time)\n" +
                    "Open tasks now: 1, of which overdue: 0\n",
            ),
        )
        assertTrue(prompt.contains("<tasks_finished>\n- Send pricing deck\n- Reply to legal\n</tasks_finished>"))
        assertFalse(prompt.contains("after the period"))
        assertFalse(prompt.contains("before the period"))
        assertFalse(prompt.contains("Finished long before"))
        assertFalse(prompt.contains("Their finished thing"))
        assertFalse(prompt.contains("<weekly_reviews>"))
        assertTrue(prompt.contains("Draft the self-review Sam Rivera will hand in for this period, in the first person."))
    }

    @Test
    fun `weekly reviews of weeks that overlap the period are sent along`(): Unit = runBlocking {
        wins.add("Logged in the period", today - 8)
        suspend fun weekReview(weekStart: Long, review: WeekReview) =
            db.insights().upsert(InsightEntity(kind = InsightKind.WEEK_REVIEW, periodStart = weekStart, json = json(review), createdAt = at(weekStart + 6, 18)))
        // The period starts on a Wednesday: the week it starts in began two days earlier.
        weekReview(fromDay - 9, WeekReview(headline = "The week before, too early."))
        weekReview(fromDay - 2, WeekReview(headline = "Started slow.", patterns = listOf("Mondays vanish", "Too many reviews")))
        weekReview(monday - 7, WeekReview(headline = "A steady week."))
        weekReview(monday, WeekReview(headline = "Still going."))
        db.insights().upsert(InsightEntity(kind = InsightKind.DAY_PLAN, periodStart = today - 8, json = AideJson.encodeToString(DayPlan.serializer(), DayPlan(headline = "A day plan is not a review.")), createdAt = 1))
        db.insights().upsert(InsightEntity(kind = InsightKind.WEEK_REVIEW, periodStart = monday - 14, json = "{not json", createdAt = 1))
        llm.reply("# Summary\nA month.")

        assistant.draftSelfReview(fromDay, toDay) {}

        assertEquals(
            listOf(
                "- Week of ${Days.iso(fromDay - 2)}: Started slow. Patterns: Mondays vanish; Too many reviews",
                "- Week of ${Days.iso(monday - 7)}: A steady week.",
                "- Week of ${Days.iso(monday)}: Still going.",
            ),
            llm.last.prompt.substringAfter("<weekly_reviews>\n").substringBefore("\n</weekly_reviews>").lines(),
        )
        assertFalse(llm.last.prompt.contains("A day plan is not a review."))
    }

    @Test
    fun `the draft is streamed, tidied and kept with the days it covers`(): Unit = runBlocking {
        wins.add("Logged in the period", today - 8)
        val pieces = listOf("  # Summary\n", "A strong month.\n", "- Shipped quoting\n\n")
        llm.reply(pieces.joinToString(""), pieces = pieces)
        val heard = Collections.synchronizedList(ArrayList<String>())

        val draft = assistant.draftSelfReview(fromDay, toDay) { heard += it }

        assertEquals("# Summary\nA strong month.\n- Shipped quoting", draft)
        assertEquals(pieces, heard.toList())
        val stored = review()!!
        assertEquals("filed under the first day it covers", fromDay, stored.periodStart)
        assertEquals(now, stored.createdAt)
        assertEquals(SelfReview(fromDay = fromDay, toDay = toDay, text = draft), AideJson.decodeFromString(SelfReview.serializer(), stored.json))
        assertEquals("self_review", db.usage().all().single().feature)
    }

    @Test
    fun `drafting again for the same period replaces the draft, and another period is kept beside it`(): Unit = runBlocking {
        wins.add("Logged in the period", today - 8)
        llm.reply("First draft.")
        assistant.draftSelfReview(fromDay, toDay) {}
        now += 3_600_000
        llm.reply("Second draft.")
        assistant.draftSelfReview(fromDay, toDay) {}
        llm.reply("A shorter period.")
        assistant.draftSelfReview(today - 10, today) {}

        val drafts = db.insights().all().filter { it.kind == InsightKind.SELF_REVIEW }.associate { it.periodStart to AideJson.decodeFromString(SelfReview.serializer(), it.json) }
        assertEquals(
            mapOf(fromDay to SelfReview(fromDay, toDay, "Second draft."), today - 10 to SelfReview(today - 10, today, "A shorter period.")),
            drafts,
        )
    }

    @Test
    fun `a draft that fails is not kept, and an earlier draft survives it`(): Unit = runBlocking {
        wins.add("Logged in the period", today - 8)
        llm.reply("The draft from last time.")
        assistant.draftSelfReview(fromDay, toDay) {}

        now += 1_000
        llm.fail(LlmException.Kind.OFFLINE, "Couldn't reach Claude. Check your internet connection.")
        expectFailure(LlmException.Kind.OFFLINE) { assistant.draftSelfReview(fromDay, toDay) {} }

        assertEquals("The draft from last time.", AideJson.decodeFromString(SelfReview.serializer(), review()!!.json).text)
        assertEquals(listOf(true, false), db.usage().all().map { it.ok })
    }

    // -------------------------------------------------------------------------------------------
    // An agenda for a conversation with one person

    private val agenda = PersonAgenda(
        headline = "Settle the contract before Friday.",
        items = listOf(AgendaItem("The contract", "three days overdue"), AgendaItem("Forecast", "you owe it")),
        toAsk = listOf("When will legal sign?"),
        toTell = listOf("The deck went out on Monday"),
    )

    private suspend fun dana(): Long = knowledge.save(KnowledgeType.PERSON, "Dana Whitfield", "Engineering lead. Owns the quoting API.", KnowledgeOrigin.ONBOARDING)!!

    private suspend fun agendas(): Map<Long, PersonAgenda> =
        db.insights().all().filter { it.kind == InsightKind.PERSON_AGENDA }.associate { it.periodStart to AideJson.decodeFromString(PersonAgenda.serializer(), it.json) }

    @Test
    fun `with nothing on record with someone there is no agenda and Claude is not called`(): Unit = runBlocking {
        dana()
        insert(task(title = "Send contract", ownership = Ownership.OTHERS, owner = "Dana Whitfield"))
        insert(task(title = "Send Dana the forecast"))
        summarized("Pricing review", at(today - 7, 10), attendees = listOf("Dana Whitfield"))
        // Priya was in a meeting, but nothing was ever written up from it.
        db.meetings().insert(MeetingEntity(title = "Roadmap sync", titleIsAuto = false, startedAt = at(today - 2, 10), status = MeetingStatus.TRANSCRIBED, attendees = listOf("Priya Nair")))
        insert(task(title = "Thank Priya", status = TaskStatus.DONE, completedAt = at(today - 1, 9)))
        insert(task(title = "Priya's old promise", ownership = Ownership.OTHERS, owner = "Priya Nair", status = TaskStatus.DISMISSED))

        expectRefused("nothing on record with Priya Nair") { assistant.suggestAgenda(" Priya Nair ") }

        assertTrue(agendas().isEmpty())
    }

    @Test
    fun `the request shows what is known about them, what each owes the other, and their recent meetings`(): Unit = runBlocking {
        settings.setProfile(sam)
        dana()
        knowledge.save(KnowledgeType.PERSON, "Marcus Lee", "Head of Sales.", KnowledgeOrigin.ONBOARDING)
        val review = summarized(
            "Pricing review", at(today - 7, 10),
            MeetingAnalysis(title = "Pricing review", tldr = "Agreed three tiers.", decisions = listOf("Ship in Q1")),
            attendees = listOf("Dana Whitfield", "Marcus Lee"),
        )
        summarized("Hiring sync", at(today - 3, 10), attendees = listOf("Marcus Lee"))
        val contract = insert(task(title = "Send contract", ownership = Ownership.OTHERS, owner = "Dana Whitfield", due = today - 3, meetingId = review, createdAt = at(today - 7, 11)))
        val forecast = insert(task(title = "Send Dana the forecast", createdAt = at(today - 2, 9)))
        insert(task(title = "Share numbers", ownership = Ownership.OTHERS, owner = "Marcus Lee"))
        insert(task(title = "Send Marcus the deck"))
        insert(task(title = "Already sent Dana the invite", status = TaskStatus.DONE, completedAt = at(today - 1, 9)))
        llm.reply(json(agenda))

        assistant.suggestAgenda("Dana Whitfield")

        val request = llm.requests.single()
        assertEquals("person_agenda", request.feature)
        assertEquals(Schemas.personAgenda, request.schema)
        assertTrue(request.systemText.contains("Name: Sam Rivera\n"))
        assertEquals(
            "Today is Wednesday, 18 November 2026.\n\n" +
                "<person>\nDana Whitfield\nEngineering lead. Owns the quoting API.\n</person>\n\n" +
                "<they_owe_the_user>\n" +
                "- [id ${contract.id}] Send contract (owner: Dana Whitfield) | due 2026-11-15 (3 days late) | normal priority | added 7 days ago | from \"Pricing review\"\n" +
                "</they_owe_the_user>\n\n" +
                "<the_user_owes_or_has_open_with_them>\n" +
                "- [id ${forecast.id}] Send Dana the forecast | no due date | normal priority | added 2 days ago\n" +
                "</the_user_owes_or_has_open_with_them>\n\n" +
                "<recent_meetings_together>\n" +
                "## \"Pricing review\" on Wednesday, 11 November 2026\n" +
                "With: Dana Whitfield, Marcus Lee\n" +
                "Agreed three tiers.\n" +
                "Decisions:\n" +
                "- Ship in Q1\n" +
                "</recent_meetings_together>\n\n" +
                Prompts.agendaTask(sam, "Dana Whitfield"),
            request.prompt,
        )
        assertTrue(request.prompt.contains("Suggest an agenda for Sam Rivera's next one-to-one conversation with Dana Whitfield, from the material above."))
    }

    @Test
    fun `the agenda is returned and kept under that person`(): Unit = runBlocking {
        val entry = dana()
        llm.reply(json(agenda))

        val result = assistant.suggestAgenda("Dana Whitfield")

        assertEquals(agenda, result)
        assertEquals(mapOf(entry to agenda), agendas())
        assertEquals(now, db.insights().all().single().createdAt)
        assertEquals("person_agenda", db.usage().all().single().feature)
    }

    @Test
    fun `a first name finds the person and the agenda is kept under their entry all the same`(): Unit = runBlocking {
        val entry = dana()
        llm.reply(json(agenda))

        assistant.suggestAgenda("dana")

        assertTrue(llm.last.prompt.contains("<person>\nDana Whitfield\nEngineering lead."))
        assertTrue(llm.last.prompt.contains("conversation with Dana Whitfield,"))
        assertEquals(setOf(entry), agendas().keys)
    }

    @Test
    fun `someone with no entry still gets an agenda from what they owe, kept where their page will look for it`(): Unit = runBlocking {
        insert(task(title = "Sign off the budget", ownership = Ownership.OTHERS, owner = "Priya Nair"))
        llm.reply(json(agenda))
        assistant.suggestAgenda("Priya Nair")

        assertTrue(llm.last.prompt.contains("<person>\nPriya Nair\nNothing saved about them yet.\n</person>"))
        assertTrue(llm.last.prompt.contains("<recent_meetings_together>\nNone with notes.\n</recent_meetings_together>"))
        val number = buildPersonView("Priya Nair", db.knowledge().all(), db.tasks().all(), db.meetings().all()).number
        assertEquals(setOf(number), agendas().keys)

        // Asked for again under another spelling, it replaces that agenda rather than sitting beside it.
        val newer = agenda.copy(headline = "Budget first.")
        llm.reply(json(newer))
        assistant.suggestAgenda("  priya NAIR ")
        assertEquals(mapOf(number to newer), agendas())
    }

    @Test
    fun `each person's agenda is kept apart, and asking again replaces only theirs`(): Unit = runBlocking {
        val danaEntry = dana()
        val marcusEntry = knowledge.save(KnowledgeType.PERSON, "Marcus Lee", "Head of Sales.", KnowledgeOrigin.ONBOARDING)!!
        val forMarcus = agenda.copy(headline = "Numbers.")
        val newer = agenda.copy(headline = "Contract is signed; move on.")
        llm.reply(json(agenda))
        assistant.suggestAgenda("Dana Whitfield")
        llm.reply(json(forMarcus))
        assistant.suggestAgenda("Marcus Lee")
        llm.reply(json(newer))
        assistant.suggestAgenda("Dana Whitfield")

        assertEquals(mapOf(danaEntry to newer, marcusEntry to forMarcus), agendas())
    }

    @Test
    fun `only the three most recent meetings with notes are sent`(): Unit = runBlocking {
        dana()
        for (daysAgo in listOf(30L, 20L, 10L, 5L)) summarized("Catch-up $daysAgo days ago", at(today - daysAgo, 10), attendees = listOf("Dana Whitfield"))
        db.meetings().insert(MeetingEntity(title = "Catch-up never summarized", titleIsAuto = false, startedAt = at(today - 1, 10), status = MeetingStatus.TRANSCRIBED, attendees = listOf("Dana Whitfield")))
        llm.reply(json(agenda))

        assistant.suggestAgenda("Dana Whitfield")

        val together = llm.last.prompt.substringAfter("<recent_meetings_together>\n").substringBefore("\n</recent_meetings_together>")
        assertEquals(
            listOf("## \"Catch-up 5 days ago\" on ${Days.longDate(today - 5)}", "## \"Catch-up 10 days ago\" on ${Days.longDate(today - 10)}", "## \"Catch-up 20 days ago\" on ${Days.longDate(today - 20)}"),
            together.lines().filter { it.startsWith("## ") },
        )
        assertFalse(together.contains("never summarized"))
    }

    @Test
    fun `two people who share a first name are not mixed up in an agenda`(): Unit = runBlocking {
        knowledge.save(KnowledgeType.PERSON, "Chris Evans", "Vendor contact.", KnowledgeOrigin.ONBOARDING)
        knowledge.save(KnowledgeType.PERSON, "Chris Park", "Legal counsel.", KnowledgeOrigin.ONBOARDING)
        insert(task(title = "Evans to send the quote", ownership = Ownership.OTHERS, owner = "Chris Evans"))
        insert(task(title = "Park to review the terms", ownership = Ownership.OTHERS, owner = "Chris Park"))
        insert(task(title = "Somebody called Chris owes this", ownership = Ownership.OTHERS, owner = "Chris"))
        summarized("Legal review", at(today - 4, 10), attendees = listOf("Chris Park"))
        llm.reply(json(agenda))

        assistant.suggestAgenda("Chris Evans")

        val prompt = llm.last.prompt
        assertTrue(prompt.contains("<person>\nChris Evans\nVendor contact.\n</person>"))
        assertTrue(prompt.contains("Evans to send the quote"))
        assertFalse(prompt.contains("Park to review the terms"))
        assertFalse(prompt.contains("Somebody called Chris owes this"))
        assertFalse(prompt.contains("Legal review"))
    }

    @Test
    fun `an agenda that fails is not kept`(): Unit = runBlocking {
        dana()
        llm.reply("I'd suggest talking about the contract.")
        expectFailure(LlmException.Kind.BAD_REPLY) { assistant.suggestAgenda("Dana Whitfield") }
        llm.fail(LlmException.Kind.OVERLOADED)
        expectFailure(LlmException.Kind.OVERLOADED) { assistant.suggestAgenda("Dana Whitfield") }

        assertTrue(agendas().isEmpty())
    }
}
