package com.personal.aide.ai

import android.app.Application
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.aide.calendar.CalendarEvent
import com.personal.aide.data.AideJson
import com.personal.aide.data.DayPlan
import com.personal.aide.data.MeetingAnalysis
import com.personal.aide.data.PlanItem
import com.personal.aide.data.WeekDayPlan
import com.personal.aide.data.WeekPlan
import com.personal.aide.data.WeekReview
import com.personal.aide.data.db.InsightEntity
import com.personal.aide.data.db.InsightKind
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.data.db.TaskStatus
import com.personal.aide.domain.Days
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

@RunWith(AndroidJUnit4::class)
@Config(sdk = [35], application = Application::class)
class AssistantPlansTest : AssistantTestBase() {
    private val monday = Fixed.monday
    private val tuesday = monday + 1
    private val sunday = Fixed.sunday

    private fun at(day: Long, hour: Int, minute: Int = 0) = Fixed.at(day, hour, minute)

    private fun json(plan: DayPlan) = AideJson.encodeToString(DayPlan.serializer(), plan)
    private fun json(plan: WeekPlan) = AideJson.encodeToString(WeekPlan.serializer(), plan)
    private fun json(review: WeekReview) = AideJson.encodeToString(WeekReview.serializer(), review)

    private fun pick(vararg tasks: TaskEntity) = tasks.map { PlanItem(it.id, "because of ${it.title}") }

    private suspend fun mine(title: String, due: Long? = null) = insert(task(title = title, due = due, createdAt = now))

    private suspend fun expectNothingToPlan(block: suspend () -> Unit) {
        try {
            block()
            fail("Expected to be told there is nothing to plan")
        } catch (e: LlmException) {
            assertEquals(LlmException.Kind.OTHER, e.kind)
            assertTrue(e.message.orEmpty(), e.message.orEmpty().contains("no open tasks"))
        }
        assertTrue("nothing to plan must not cost a call", llm.requests.isEmpty())
        assertTrue(db.insights().all().isEmpty())
    }

    // -------------------------------------------------------------------------------------------
    // The day

    @Test
    fun `a day plan keeps only real tasks of the user's, each once`(): Unit = runBlocking {
        val a = mine("Send pricing deck", due = today)
        val b = mine("Draft FAQ")
        val c = mine("Book venue")
        val theirs = insert(task(title = "Send contract", ownership = Ownership.OTHERS, owner = "Marcus Lee"))
        val done = insert(task(title = "Old news", status = TaskStatus.DONE, completedAt = now))
        val dismissed = insert(task(title = "Not a task", status = TaskStatus.DISMISSED))
        val unclear = insert(task(title = "Whose is this", ownership = Ownership.UNCLEAR))

        llm.reply(
            json(
                DayPlan(
                    headline = "Deck first, then the FAQ.",
                    focus = listOf(PlanItem(a.id, "due today"), PlanItem(999_999, "made up"), PlanItem(a.id, "said twice"), PlanItem(theirs.id, "not the user's"), PlanItem(b.id, "unblocks Dana"), PlanItem(unclear.id, "nobody's yet")),
                    ifTime = listOf(PlanItem(b.id, "already in focus"), PlanItem(c.id, "quick"), PlanItem(c.id, "quick again"), PlanItem(123_456, "made up"), PlanItem(done.id, "finished"), PlanItem(dismissed.id, "thrown out")),
                    chase = listOf("Marcus Lee — the contract"),
                    headsUp = listOf("Afternoon is full of meetings"),
                ),
            ),
        )

        val plan = assistant.planDay(today)

        assertEquals(listOf(PlanItem(a.id, "due today"), PlanItem(b.id, "unblocks Dana")), plan.focus)
        assertEquals(listOf(PlanItem(c.id, "quick")), plan.ifTime)
        assertEquals("Deck first, then the FAQ.", plan.headline)
        assertEquals(listOf("Marcus Lee — the contract"), plan.chase)
        assertEquals(listOf("Afternoon is full of meetings"), plan.headsUp)
    }

    @Test
    fun `the day plan is remembered for its day`(): Unit = runBlocking {
        val a = mine("Send pricing deck")
        llm.reply(json(DayPlan(headline = "One thing today.", focus = pick(a))))

        val plan = assistant.planDay(today)

        val stored = db.insights().all().single()
        assertEquals(InsightKind.DAY_PLAN, stored.kind)
        assertEquals(today, stored.periodStart)
        assertEquals(now, stored.createdAt)
        assertEquals(0, stored.rating)
        assertEquals(plan, AideJson.decodeFromString(DayPlan.serializer(), stored.json))
        assertEquals(stored, db.insights().get(InsightKind.DAY_PLAN, today))
    }

    @Test
    fun `what is stored is the cleaned plan, not what Claude sent`(): Unit = runBlocking {
        val a = mine("Send pricing deck")
        llm.reply(json(DayPlan(headline = "h", focus = listOf(PlanItem(a.id, "real"), PlanItem(424_242, "invented")))))
        assistant.planDay(today)

        val stored = AideJson.decodeFromString(DayPlan.serializer(), db.insights().all().single().json)
        assertEquals(listOf(PlanItem(a.id, "real")), stored.focus)
    }

    @Test
    fun `a day plan has at most five things to focus on`(): Unit = runBlocking {
        val all = (1..7).map { mine("Task $it") }
        llm.reply(json(DayPlan(headline = "h", focus = pick(*all.toTypedArray()), ifTime = pick(all[5], all[0]))))

        val plan = assistant.planDay(today)

        assertEquals(all.take(5).map { it.id }, plan.focus.map { it.taskId })
        assertEquals("a task cut from the focus list can still be an if-time one; a focus task can't be both", listOf(all[5].id), plan.ifTime.map { it.taskId })
    }

    @Test
    fun `planning a day again replaces that day's plan and leaves other days alone`(): Unit = runBlocking {
        val a = mine("Send pricing deck")
        val b = mine("Draft FAQ")
        llm.reply(json(DayPlan(headline = "First", focus = pick(a))))
        assistant.planDay(today)
        llm.reply(json(DayPlan(headline = "Tomorrow", focus = pick(b))))
        assistant.planDay(today + 1)
        now += 3_600_000
        llm.reply(json(DayPlan(headline = "Second", focus = pick(b, a))))
        assistant.planDay(today)

        val plans = db.insights().all().filter { it.kind == InsightKind.DAY_PLAN }.associate { it.periodStart to AideJson.decodeFromString(DayPlan.serializer(), it.json).headline }
        assertEquals(mapOf(today to "Second", today + 1 to "Tomorrow"), plans)
    }

    @Test
    fun `the day plan request shows the day, the calendar and the tasks with their ids`(): Unit = runBlocking {
        settings.setProfile(sam)
        events = listOf(CalendarEvent(1, "Roadmap sync", at(today, 16), at(today, 17), attendees = listOf("Priya Nair")))
        val meetingId = summarized("Pricing review", at(monday, 10), MeetingAnalysis(title = "Pricing review", tldr = "Agreed three tiers."))
        val deck = insert(task(title = "Send pricing deck", due = today - 1, priority = 2, meetingId = meetingId, createdAt = at(monday, 11)))
        val faq = insert(task(title = "Draft FAQ", createdAt = at(tuesday, 9)))
        val contract = insert(task(title = "Send contract", ownership = Ownership.OTHERS, owner = "Marcus Lee", due = today, createdAt = at(monday, 11)))
        insert(task(title = "Finished already", status = TaskStatus.DONE, completedAt = now))
        llm.reply(json(DayPlan(headline = "h", focus = pick(deck))))

        assistant.planDay(today)

        val request = llm.requests.single()
        assertEquals("day_plan", request.feature)
        assertEquals(Schemas.dayPlan, request.schema)
        assertEquals(listOf(LlmMessage.Role.USER), request.messages.map { it.role })
        assertTrue(request.systemText.contains("Name: Sam Rivera\n"))

        val prompt = request.prompt
        assertTrue(prompt.startsWith("The day to plan: Wednesday, 18 November 2026.\n\n"))
        assertTrue(prompt.contains("<calendar>\n- Wednesday 4:00 PM–5:00 PM: Roadmap sync (with Priya Nair)\n</calendar>"))
        assertTrue(prompt.contains("- [id ${deck.id}] Send pricing deck | due 2026-11-17 (1 days late) | high priority | added 2 days ago | from \"Pricing review\""))
        assertTrue(prompt.contains("- [id ${faq.id}] Draft FAQ | no due date | normal priority | added 1 days ago"))
        assertTrue(prompt.contains("<waiting_on_others>\n- [id ${contract.id}] Send contract (owner: Marcus Lee) | due 2026-11-18 (today)"))
        assertFalse(prompt.contains("Finished already"))
        assertTrue(prompt.contains("<recent_meetings>\n- 2026-11-16 \"Pricing review\": Agreed three tiers.\n</recent_meetings>"))
        assertTrue(prompt.contains("Plan Sam Rivera's day from the material above."))
        assertEquals(
            "the calendar is asked for that day and no more",
            listOf(Days.startMillis(today, Fixed.zone) to Days.startMillis(today + 1, Fixed.zone)),
            agendaQueries,
        )
    }

    @Test
    fun `other people's tasks are shown as waiting, not as the user's to plan`(): Unit = runBlocking {
        val a = mine("Send pricing deck")
        val theirs = insert(task(title = "Send contract", ownership = Ownership.OTHERS, owner = "Marcus Lee"))
        llm.reply(json(DayPlan(headline = "h", focus = pick(a))))
        assistant.planDay(today)

        val prompt = llm.last.prompt
        val openTasks = prompt.substringAfter("<open_tasks>\n").substringBefore("\n</open_tasks>")
        assertTrue(openTasks.contains("[id ${a.id}]"))
        assertFalse(openTasks.contains("[id ${theirs.id}]"))
    }

    @Test
    fun `with nothing open there is nothing to plan and Claude is not called`(): Unit = runBlocking {
        insert(task(title = "Send contract", ownership = Ownership.OTHERS, owner = "Marcus Lee"))
        insert(task(title = "Old news", status = TaskStatus.DONE, completedAt = now))
        insert(task(title = "Whose is this", ownership = Ownership.UNCLEAR))

        expectNothingToPlan { assistant.planDay(today) }
        expectNothingToPlan { assistant.planWeek(today) }
    }

    @Test
    fun `a plan that fails is not stored and the failure is passed on`(): Unit = runBlocking {
        mine("Send pricing deck")
        llm.fail(LlmException.Kind.OVERLOADED)
        try {
            assistant.planDay(today)
            fail("Expected the plan to fail")
        } catch (e: LlmException) {
            assertEquals(LlmException.Kind.OVERLOADED, e.kind)
        }
        assertTrue(db.insights().all().isEmpty())
        assertFalse(db.usage().all().single().ok)
    }

    // -------------------------------------------------------------------------------------------
    // The week

    @Test
    fun `a week plan keeps real tasks once, on days left in this week, in date order`(): Unit = runBlocking {
        val a = mine("A")
        val b = mine("B")
        val c = mine("C")
        val d = mine("D")
        val theirs = insert(task(title = "Theirs", ownership = Ownership.OTHERS, owner = "Marcus Lee"))
        val done = insert(task(title = "Done", status = TaskStatus.DONE, completedAt = now))

        llm.reply(
            json(
                WeekPlan(
                    headline = "Tight but doable.",
                    days = listOf(
                        WeekDayPlan("2026-11-20", listOf(a.id, 999_999, b.id), "deep work"),
                        WeekDayPlan("2026-11-19", listOf(b.id, c.id, c.id), "between meetings"),
                        WeekDayPlan("2026-11-17", listOf(d.id), "yesterday"),
                        WeekDayPlan("2026-11-23", listOf(d.id), "next week"),
                        WeekDayPlan("soon", listOf(d.id), "not a date"),
                        WeekDayPlan("2026-11-21", listOf(999_999, theirs.id, done.id), "nothing real"),
                        WeekDayPlan("2026-11-18T09:00", listOf(d.id), "today"),
                    ),
                    warnings = listOf("Friday is overloaded"),
                ),
            ),
        )

        val plan = assistant.planWeek(today)

        assertEquals(
            listOf(
                WeekDayPlan("2026-11-18", listOf(d.id), "today"),
                WeekDayPlan("2026-11-19", listOf(c.id), "between meetings"),
                WeekDayPlan("2026-11-20", listOf(a.id, b.id), "deep work"),
            ),
            plan.days,
        )
        assertEquals("Tight but doable.", plan.headline)
        assertEquals(listOf("Friday is overloaded"), plan.warnings)
    }

    @Test
    fun `a task may be planned on the last day of the week but not the day after`(): Unit = runBlocking {
        val a = mine("A")
        val b = mine("B")
        llm.reply(json(WeekPlan(headline = "h", days = listOf(WeekDayPlan(Days.iso(sunday), listOf(a.id), ""), WeekDayPlan(Days.iso(sunday + 1), listOf(b.id), "")))))

        val plan = assistant.planWeek(today)

        assertEquals(listOf(WeekDayPlan(Days.iso(sunday), listOf(a.id), "")), plan.days)
    }

    @Test
    fun `the week plan is remembered for its week and moves nothing until applied`(): Unit = runBlocking {
        val a = mine("A")
        val b = mine("B")
        llm.reply(json(WeekPlan(headline = "h", days = listOf(WeekDayPlan("2026-11-19", listOf(a.id), ""), WeekDayPlan("2026-11-20", listOf(b.id), "")))))

        val plan = assistant.planWeek(today)

        val stored = db.insights().all().single()
        assertEquals(InsightKind.WEEK_PLAN, stored.kind)
        assertEquals("a week is filed under its Monday", monday, stored.periodStart)
        assertEquals(plan, AideJson.decodeFromString(WeekPlan.serializer(), stored.json))
        assertNull(db.tasks().get(a.id)!!.plannedDay)
        assertNull(db.tasks().get(b.id)!!.plannedDay)

        tasks.applyWeekPlan(plan)
        assertEquals(Fixed.day(2026, 11, 19), db.tasks().get(a.id)!!.plannedDay)
        assertEquals(Fixed.day(2026, 11, 20), db.tasks().get(b.id)!!.plannedDay)
    }

    @Test
    fun `the week plan request covers today to Sunday`(): Unit = runBlocking {
        events = listOf(CalendarEvent(1, "Quoting standup", at(today + 1, 14), at(today + 1, 14, 15)))
        val a = mine("Send pricing deck", due = today + 2)
        val theirs = insert(task(title = "Send contract", ownership = Ownership.OTHERS, owner = "Marcus Lee"))
        llm.reply(json(WeekPlan(headline = "h", days = listOf(WeekDayPlan("2026-11-19", listOf(a.id), "")))))

        assistant.planWeek(today)

        val request = llm.requests.single()
        assertEquals("week_plan", request.feature)
        assertEquals(Schemas.weekPlan, request.schema)
        val prompt = request.prompt
        assertTrue(prompt.startsWith("Today is Wednesday, 18 November 2026. The week runs to Sunday, 22 November 2026.\n\n"))
        assertTrue(prompt.contains("<calendar>\n- Thursday 2:00 PM–2:15 PM: Quoting standup\n</calendar>"))
        assertTrue(prompt.contains("<open_tasks>\n- [id ${a.id}] Send pricing deck | due 2026-11-20 | normal priority"))
        assertTrue(prompt.contains("<waiting_on_others>\n- [id ${theirs.id}] Send contract (owner: Marcus Lee)"))
        assertEquals(listOf(Days.startMillis(today, Fixed.zone) to Days.startMillis(sunday + 1, Fixed.zone)), agendaQueries)
    }

    @Test
    fun `planning the week from a Sunday plans that one day`(): Unit = runBlocking {
        now = at(sunday, 9)
        val a = mine("A")
        val b = mine("B")
        llm.reply(json(WeekPlan(headline = "h", days = listOf(WeekDayPlan(Days.iso(sunday), listOf(a.id), ""), WeekDayPlan(Days.iso(sunday - 1), listOf(b.id), "")))))

        val plan = assistant.planWeek(sunday)

        assertEquals(listOf(WeekDayPlan(Days.iso(sunday), listOf(a.id), "")), plan.days)
        assertEquals(monday, db.insights().all().single().periodStart)
    }

    // -------------------------------------------------------------------------------------------
    // The review

    /** The week from MetricsTest: three finished, two open (one late), two things waited on. */
    private suspend fun seedWeek() {
        db.meetings().insert(MeetingEntity(id = 1, title = "Roadmap sync", startedAt = at(monday, 10), endedAt = at(monday, 10, 45), status = MeetingStatus.TRANSCRIBED))
        db.meetings().insert(
            MeetingEntity(
                id = 2, title = "Pricing review", titleIsAuto = false, startedAt = at(today, 9), endedAt = at(today, 9, 30), status = MeetingStatus.READY,
                tldr = "Agreed three tiers.",
                analysisJson = AideJson.encodeToString(MeetingAnalysis.serializer(), MeetingAnalysis(title = "Pricing review", tldr = "Agreed three tiers.", decisions = listOf("Ship in Q1"))),
            ),
        )
        db.meetings().insert(MeetingEntity(id = 3, title = "Still going", startedAt = at(today, 13), status = MeetingStatus.RECORDING))
        db.meetings().insert(MeetingEntity(id = 4, title = "Last week's sync", titleIsAuto = false, startedAt = at(monday - 4, 10), endedAt = at(monday - 4, 11), status = MeetingStatus.READY, tldr = "Old."))
        db.meetings().insert(MeetingEntity(id = 5, title = "Vendor call", startedAt = at(tuesday, 16), status = MeetingStatus.FAILED))
        db.tasks().insertAll(
            listOf(
                task(1, title = "Write launch plan", createdAt = at(monday, 10), status = TaskStatus.DONE, completedAt = at(tuesday, 15), due = tuesday),
                task(2, title = "Reply to legal", createdAt = at(monday - 6, 10), status = TaskStatus.DONE, completedAt = at(today, 9), due = monday),
                task(3, title = "Tidy backlog", createdAt = at(tuesday, 9), status = TaskStatus.DONE, completedAt = at(tuesday, 21)),
                task(4, title = "Send pricing deck", createdAt = at(monday, 11), due = monday),
                task(5, title = "Book offsite venue", createdAt = at(monday - 11, 9), due = today + 2),
                task(6, title = "Last week's win", createdAt = at(monday - 7, 9), status = TaskStatus.DONE, completedAt = at(monday - 4, 12), due = monday - 4),
                task(7, title = "Send contract", ownership = Ownership.OTHERS, owner = "Dana", createdAt = at(today - 10, 12)),
                task(8, title = "Share forecast", ownership = Ownership.OTHERS, owner = "Marcus", createdAt = at(tuesday, 12), due = monday),
                task(9, title = "Their finished thing", ownership = Ownership.OTHERS, owner = "Lee", createdAt = at(monday, 12), status = TaskStatus.DONE, completedAt = at(tuesday, 12)),
                task(10, title = "Not a task after all", createdAt = at(tuesday, 9), status = TaskStatus.DISMISSED, due = monday),
                task(11, title = "Nobody's yet", ownership = Ownership.UNCLEAR, createdAt = at(tuesday, 9), due = monday),
            ),
        )
    }

    private val review = WeekReview(
        headline = "Solid, with one thing slipping.",
        overall = "steady",
        summary = "Three done, the pricing deck is late.",
        wins = listOf("Launch plan landed on time"),
        slipped = listOf("Pricing deck, due Monday"),
        patterns = listOf("Deadlines early in the week slip"),
        suggestions = listOf("Send the deck first thing Thursday"),
        nextFocus = listOf("Pricing deck"),
        statusUpdate = "Launch plan done; pricing deck in progress.",
    )

    @Test
    fun `the review is sent the numbers the app counted`(): Unit = runBlocking {
        seedWeek()
        llm.reply(json(review))

        assistant.reviewWeek(monday)

        val prompt = llm.last.prompt
        assertTrue(
            prompt,
            prompt.contains(
                "<numbers>\n" +
                    "Tasks completed: 3\n" +
                    "New tasks taken on: 3\n" +
                    "Of the completed tasks that had a due date: 1 on time, 1 late (50% on time)\n" +
                    "Open tasks now: 2, of which overdue: 1\n" +
                    "Average days from taking a task on to finishing it: 3.2\n" +
                    "Waiting on other people for: 2 things (the oldest for 10 days)\n" +
                    "Meetings recorded: 3, totalling 75 minutes\n" +
                    "</numbers>",
            ),
        )
    }

    @Test
    fun `the review is sent what was finished, what is open, and the week's meetings`(): Unit = runBlocking {
        seedWeek()
        llm.reply(json(review))

        assistant.reviewWeek(monday)

        val request = llm.requests.single()
        assertEquals("week_review", request.feature)
        assertEquals(Schemas.weekReview, request.schema)
        val prompt = request.prompt
        assertTrue(prompt.startsWith("The week under review: Monday, 16 November 2026 to Sunday, 22 November 2026. It is still in progress; today is Wednesday, 18 November 2026.\n\n"))

        val finished = prompt.substringAfter("<completed_this_week>\n").substringBefore("\n</completed_this_week>").lines().toSet()
        assertEquals(
            setOf(
                "- Write launch plan (done 2026-11-17, on time)",
                "- Reply to legal (done 2026-11-18, 2 days after its due date)",
                "- Tidy backlog (done 2026-11-17)",
            ),
            finished,
        )

        val open = prompt.substringAfter("<still_open>\n").substringBefore("\n</still_open>")
        assertTrue(open.contains("- [id 4] Send pricing deck | due 2026-11-16 (2 days late)"))
        assertTrue(open.contains("- [id 5] Book offsite venue | due 2026-11-20 |"))
        assertEquals("only the user's open tasks", 2, open.lines().size)

        val waiting = prompt.substringAfter("<waiting_on_others>\n").substringBefore("\n</waiting_on_others>")
        assertTrue(waiting.contains("- [id 7] Send contract (owner: Dana)"))
        assertTrue(waiting.contains("- [id 8] Share forecast (owner: Marcus) | due 2026-11-16 (2 days late)"))
        assertEquals(2, waiting.lines().size)

        val weekMeetings = prompt.substringAfter("<meetings_this_week>\n").substringBefore("\n</meetings_this_week>")
        assertTrue(weekMeetings.startsWith("## \"Pricing review\" on Wednesday, 18 November 2026\nAgreed three tiers.\nDecisions:\n- Ship in Q1"))
        assertFalse("last week's meeting is not this week's", prompt.contains("Last week's sync"))
        assertFalse(prompt.contains("<last_weeks_review>"))
        assertTrue(prompt.contains("Review the user's week from the material above"))
    }

    @Test
    fun `the review is returned and remembered for its week`(): Unit = runBlocking {
        seedWeek()
        llm.reply(json(review))

        val result = assistant.reviewWeek(monday)

        assertEquals(review, result)
        val stored = db.insights().all().single()
        assertEquals(InsightKind.WEEK_REVIEW, stored.kind)
        assertEquals(monday, stored.periodStart)
        assertEquals(review, AideJson.decodeFromString(WeekReview.serializer(), stored.json))
        assertEquals("week_review", db.usage().all().single().feature)
    }

    @Test
    fun `last week's review is sent along so its suggestions can be followed up`(): Unit = runBlocking {
        seedWeek()
        db.insights().upsert(
            InsightEntity(
                kind = InsightKind.WEEK_REVIEW,
                periodStart = monday - 7,
                json = json(WeekReview(headline = "A steady week.", suggestions = listOf("Block mornings for deep work", "Chase Dana earlier"))),
                createdAt = at(monday - 1, 18),
            ),
        )
        // A review from two weeks back is too old to compare with.
        db.insights().upsert(InsightEntity(kind = InsightKind.WEEK_REVIEW, periodStart = monday - 14, json = json(WeekReview(headline = "Ancient history.")), createdAt = 1))
        llm.reply(json(review))

        assistant.reviewWeek(monday)

        val prompt = llm.last.prompt
        assertTrue(prompt.contains("<last_weeks_review>\nA steady week.\nSuggested then:\n- Block mornings for deep work\n- Chase Dana earlier\n</last_weeks_review>"))
        assertFalse(prompt.contains("Ancient history."))
    }

    @Test
    fun `a week that is over is reviewed as it stood when it ended`(): Unit = runBlocking {
        seedWeek()
        llm.reply(json(review))

        assistant.reviewWeek(monday - 7)

        val prompt = llm.last.prompt
        assertTrue(prompt.startsWith("The week under review: Monday, 9 November 2026 to Sunday, 15 November 2026. Today is Wednesday, 18 November 2026.\n\n"))
        assertFalse(prompt.contains("still in progress"))
        // Finished that week: "Last week's win", on its due date. Taken on that week: tasks 2 and 6.
        assertTrue(prompt.contains("Tasks completed: 1\nNew tasks taken on: 2\nOf the completed tasks that had a due date: 1 on time, 0 late (100% on time)\n"))
        // Nothing open was already late on that Sunday, though one is late today.
        assertTrue(prompt.contains("Open tasks now: 2, of which overdue: 0\n"))
        assertTrue(prompt.contains("Meetings recorded: 1, totalling 60 minutes"))
        assertTrue(prompt.contains("- Last week's win (done 2026-11-12, on time)"))
        assertTrue(prompt.contains("## \"Last week's sync\" on Thursday, 12 November 2026"))
        assertEquals(monday - 7, db.insights().all().single().periodStart)
    }

    @Test
    fun `an empty week is described as empty rather than left blank`(): Unit = runBlocking {
        llm.reply(json(WeekReview(headline = "Too little to judge.", overall = "steady")))

        assistant.reviewWeek(monday)

        val prompt = llm.last.prompt
        assertTrue(
            prompt.contains(
                "<numbers>\n" +
                    "Tasks completed: 0\n" +
                    "New tasks taken on: 0\n" +
                    "Open tasks now: 0, of which overdue: 0\n" +
                    "Waiting on other people for: 0 things\n" +
                    "Meetings recorded: 0, totalling 0 minutes\n" +
                    "</numbers>",
            ),
        )
        assertTrue(prompt.contains("<completed_this_week>\nNothing.\n</completed_this_week>"))
        assertTrue(prompt.contains("<still_open>\nNone.\n</still_open>"))
        assertTrue(prompt.contains("<waiting_on_others>\nNone.\n</waiting_on_others>"))
        assertTrue(prompt.contains("<meetings_this_week>\nNone recorded.\n</meetings_this_week>"))
    }

    @Test
    fun `a review that fails is not stored`(): Unit = runBlocking {
        seedWeek()
        llm.reply("not json")
        try {
            assistant.reviewWeek(monday)
            fail("Expected the review to fail")
        } catch (e: LlmException) {
            assertEquals(LlmException.Kind.BAD_REPLY, e.kind)
        }
        assertTrue(db.insights().all().isEmpty())
    }
}
