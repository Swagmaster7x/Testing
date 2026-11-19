package com.personal.aide.domain

import com.personal.aide.data.db.ChatMessageEntity
import com.personal.aide.data.db.InsightEntity
import com.personal.aide.data.db.InsightKind
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingSource
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.QuestionEntity
import com.personal.aide.data.db.QuestionStatus
import com.personal.aide.data.db.TaskOrigin
import com.personal.aide.data.db.TaskStatus
import com.personal.aide.data.db.UsageEntity
import com.personal.aide.testing.Fixed
import com.personal.aide.testing.task
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test
import java.time.ZoneId

class MetricsTest {
    private val zone = Fixed.zone
    private val today = Fixed.today
    private val monday = Fixed.monday
    private val tuesday = monday + 1
    private val sunday = Fixed.sunday

    private fun at(day: Long, hour: Int, minute: Int = 0) = Fixed.at(day, hour, minute, zone)

    private fun meeting(id: Long, start: Long, end: Long?, status: MeetingStatus = MeetingStatus.READY, rating: Int = 0) =
        MeetingEntity(id = id, title = "Meeting $id", startedAt = start, endedAt = end, status = status, rating = rating)

    // -------------------------------------------------------------------------------------------
    // The user's week

    private val weekTasks = listOf(
        // Created and finished this week, on its due date.
        task(1, createdAt = at(monday, 10), status = TaskStatus.DONE, completedAt = at(tuesday, 15), due = tuesday),
        // From last week, finished two days after it was due.
        task(2, createdAt = at(monday - 6, 10), status = TaskStatus.DONE, completedAt = at(today, 9), due = monday),
        // No due date: finished, but nothing to judge its timing by.
        task(3, createdAt = at(tuesday, 9), status = TaskStatus.DONE, completedAt = at(tuesday, 21)),
        // Open and already late.
        task(4, createdAt = at(monday, 11), due = monday),
        // Open, due later in the week, taken on before the week began.
        task(5, createdAt = at(monday - 11, 9), due = today + 2),
        // Finished the week before.
        task(6, createdAt = at(monday - 7, 9), status = TaskStatus.DONE, completedAt = at(monday - 4, 12), due = monday - 4),
        // Other people's.
        task(7, ownership = Ownership.OTHERS, owner = "Dana", createdAt = at(today - 10, 12)),
        task(8, ownership = Ownership.OTHERS, owner = "Marcus", createdAt = at(tuesday, 12), due = monday),
        task(9, ownership = Ownership.OTHERS, owner = "Lee", createdAt = at(monday, 12), status = TaskStatus.DONE, completedAt = at(tuesday, 12)),
        // Thrown out as not a task, and one nobody owns yet: neither is the user's work.
        task(10, createdAt = at(tuesday, 9), status = TaskStatus.DISMISSED, due = monday),
        task(11, ownership = Ownership.UNCLEAR, createdAt = at(tuesday, 9), due = monday),
    )

    private val weekMeetings = listOf(
        meeting(1, at(monday, 10), at(monday, 10, 45), MeetingStatus.TRANSCRIBED),
        meeting(2, at(today, 9), at(today, 9, 30), MeetingStatus.READY),
        // Still being recorded: not a meeting that has happened yet.
        meeting(3, at(today, 13), null, MeetingStatus.RECORDING),
        // Last week.
        meeting(4, at(monday - 4, 10), at(monday - 4, 11), MeetingStatus.READY),
        // Never closed properly: counts as a meeting, with no length.
        meeting(5, at(tuesday, 16), null, MeetingStatus.FAILED),
    )

    @Test
    fun `counts a week of work`() {
        val stats = workStats(weekTasks, weekMeetings, monday, sunday, today, zone)

        assertEquals(monday, stats.firstDay)
        assertEquals(sunday, stats.lastDay)
        assertEquals("tasks 1, 3 and 4 appeared this week", 3, stats.created)
        assertEquals("tasks 1, 2 and 3 were finished this week", 3, stats.completed)
        assertEquals(1, stats.completedOnTime)
        assertEquals(1, stats.completedLate)
        assertEquals(0.5, stats.onTimeRate!!, 1e-9)
        assertEquals(1.0, stats.throughput!!, 1e-9)
        assertEquals(2, stats.openNow)
        assertEquals(1, stats.overdueNow)
        assertEquals(2, stats.waitingNow)
        assertEquals(10L, stats.oldestWaitingDays)
        // 29 hours, 7 days 23 hours, and 12 hours.
        assertEquals((29.0 + 191.0 + 12.0) / 24.0 / 3.0, stats.averageDaysToClose!!, 1e-9)
        assertEquals(3, stats.meetings)
        assertEquals(75L, stats.meetingMinutes)
    }

    @Test
    fun `completions are laid out day by day across the whole period`() {
        val stats = workStats(weekTasks, weekMeetings, monday, sunday, today, zone)
        assertEquals(
            listOf(monday to 0, tuesday to 2, today to 1, today + 1 to 0, today + 2 to 0, today + 3 to 0, sunday to 0),
            stats.completedByDay,
        )
        assertEquals(stats.completed, stats.completedByDay.sumOf { it.second })
    }

    @Test
    fun `nothing at all gives zeros and no rates`() {
        val stats = workStats(emptyList(), emptyList(), monday, sunday, today, zone)
        assertEquals(0, stats.created)
        assertEquals(0, stats.completed)
        assertEquals(0, stats.openNow)
        assertEquals(0, stats.overdueNow)
        assertEquals(0, stats.waitingNow)
        assertEquals(0L, stats.oldestWaitingDays)
        assertEquals(0, stats.meetings)
        assertEquals(0L, stats.meetingMinutes)
        assertNull(stats.averageDaysToClose)
        assertNull(stats.onTimeRate)
        assertNull(stats.throughput)
        assertEquals(7, stats.completedByDay.size)
        assertEquals(0, stats.completedByDay.sumOf { it.second })
    }

    @Test
    fun `the period includes its first instant and stops at the next midnight`() {
        val firstInstant = Days.startMillis(monday, zone)
        val nextWeek = Days.startMillis(sunday + 1, zone)
        val tasks = listOf(
            task(1, createdAt = firstInstant, status = TaskStatus.DONE, completedAt = firstInstant),
            task(2, createdAt = nextWeek - 1, status = TaskStatus.DONE, completedAt = nextWeek - 1),
            task(3, createdAt = nextWeek, status = TaskStatus.DONE, completedAt = nextWeek),
            task(4, createdAt = firstInstant - 1, status = TaskStatus.DONE, completedAt = firstInstant - 1),
        )
        val meetings = listOf(
            meeting(1, firstInstant, firstInstant + 60_000),
            meeting(2, nextWeek - 1, nextWeek + 120_000),
            meeting(3, nextWeek, nextWeek + 60_000),
            meeting(4, firstInstant - 1, firstInstant + 60_000),
        )
        val stats = workStats(tasks, meetings, monday, sunday, sunday + 3, zone)
        assertEquals(2, stats.completed)
        assertEquals(2, stats.created)
        assertEquals(2, stats.meetings)
        assertEquals(1, stats.completedByDay.first().second)
        assertEquals(1, stats.completedByDay.last().second)
    }

    @Test
    fun `on time is judged by the date where the user is`() {
        // Finished at 11:30 at night in New York on the day it was due; in UTC that is already the next day.
        val tasks = listOf(task(1, createdAt = at(monday, 9), status = TaskStatus.DONE, completedAt = at(tuesday, 23, 30), due = tuesday))

        val here = workStats(tasks, emptyList(), monday, sunday, today, zone)
        assertEquals(1, here.completedOnTime)
        assertEquals(0, here.completedLate)
        assertEquals(1, here.completedByDay.single { it.first == tuesday }.second)

        val utc = workStats(tasks, emptyList(), monday, sunday, today, ZoneId.of("UTC"))
        assertEquals(0, utc.completedOnTime)
        assertEquals(1, utc.completedLate)
        assertEquals(1, utc.completedByDay.single { it.first == today }.second)
    }

    @Test
    fun `a week with a 25-hour day keeps its last hour`() {
        // Clocks in New York go back on Sunday 1 November 2026.
        val weekStart = Fixed.day(2026, 10, 26)
        val weekEnd = Fixed.day(2026, 11, 1)
        val tasks = listOf(
            task(1, createdAt = at(weekStart, 9), status = TaskStatus.DONE, completedAt = at(weekEnd, 23, 30)),
            task(2, createdAt = at(weekEnd + 1, 0, 30), status = TaskStatus.DONE, completedAt = at(weekEnd + 1, 0, 30)),
        )
        val meetings = listOf(meeting(1, at(weekEnd, 23, 15), at(weekEnd, 23, 45)))
        val stats = workStats(tasks, meetings, weekStart, weekEnd, today, zone)

        assertEquals(1, stats.completed)
        assertEquals(1, stats.created)
        assertEquals(1, stats.completedByDay.last().second)
        assertEquals(1, stats.meetings)
        assertEquals(30L, stats.meetingMinutes)
    }

    @Test
    fun `a week with a 23-hour day does not borrow from the next`() {
        // Clocks in New York go forward on Sunday 8 March 2026.
        val weekStart = Fixed.day(2026, 3, 2)
        val weekEnd = Fixed.day(2026, 3, 8)
        val tasks = listOf(
            task(1, createdAt = at(weekStart, 9), status = TaskStatus.DONE, completedAt = at(weekEnd, 23, 30)),
            task(2, createdAt = at(weekStart, 9), status = TaskStatus.DONE, completedAt = at(weekEnd + 1, 0, 30)),
        )
        val stats = workStats(tasks, emptyList(), weekStart, weekEnd, today, zone)
        assertEquals(1, stats.completed)
        assertEquals(listOf(0, 0, 0, 0, 0, 0, 1), stats.completedByDay.map { it.second })
    }

    @Test
    fun `overdue is judged as of the end of a week that is over`() {
        val lastSunday = monday - 1
        val tasks = listOf(
            task(1, createdAt = at(monday - 10, 9), due = lastSunday - 3),
            // Due on the last day of that week: not late within it.
            task(2, createdAt = at(monday - 10, 9), due = lastSunday),
            // Late today, but its deadline fell after the week being reviewed.
            task(3, createdAt = at(monday - 10, 9), due = monday),
        )
        val past = workStats(tasks, emptyList(), monday - 7, lastSunday, today, zone)
        assertEquals(1, past.overdueNow)
        assertEquals(3, past.openNow)

        val current = workStats(tasks, emptyList(), monday, sunday, today, zone)
        assertEquals("for the week in progress, late means late today", 3, current.overdueNow)
    }

    @Test
    fun `something due today is not overdue`() {
        val stats = workStats(listOf(task(1, due = today), task(2, due = today - 1)), emptyList(), monday, sunday, today, zone)
        assertEquals(1, stats.overdueNow)
    }

    @Test
    fun `waiting counts only open commitments of other people`() {
        val tasks = listOf(
            task(1, ownership = Ownership.OTHERS, createdAt = at(today - 3, 9)),
            task(2, ownership = Ownership.OTHERS, createdAt = at(today - 30, 9), status = TaskStatus.DONE, completedAt = at(today - 1, 9)),
            task(3, ownership = Ownership.OTHERS, createdAt = at(today - 40, 9), status = TaskStatus.DISMISSED),
            task(4, ownership = Ownership.UNCLEAR, createdAt = at(today - 50, 9)),
            task(5, createdAt = at(today - 60, 9)),
        )
        val stats = workStats(tasks, emptyList(), monday, sunday, today, zone)
        assertEquals(1, stats.waitingNow)
        assertEquals(3L, stats.oldestWaitingDays)
    }

    @Test
    fun `a meeting whose end is before its start counts for no time rather than negative`() {
        val stats = workStats(emptyList(), listOf(meeting(1, at(today, 10), at(today, 9)), meeting(2, at(today, 11), at(today, 11, 20))), monday, sunday, today, zone)
        assertEquals(2, stats.meetings)
        assertEquals(20L, stats.meetingMinutes)
    }

    @Test
    fun `a document the user added is not a meeting they held`() {
        val handbook = MeetingEntity(
            id = 21, title = "Team handbook", startedAt = at(today, 11), endedAt = at(today, 11),
            source = MeetingSource.DOCUMENT, status = MeetingStatus.READY,
        )
        val documents = listOf(
            handbook,
            // Not read by the assistant yet.
            handbook.copy(id = 22, title = "Org chart", startedAt = at(tuesday, 9), endedAt = at(tuesday, 9), status = MeetingStatus.TRANSCRIBED),
            // Even one that somehow carries a length adds no meeting time.
            handbook.copy(id = 23, title = "Brief", startedAt = at(monday, 14), endedAt = at(monday, 16)),
        )

        val without = workStats(weekTasks, weekMeetings, monday, sunday, today, zone)
        val with = workStats(weekTasks, weekMeetings + documents, monday, sunday, today, zone)

        assertEquals(3, with.meetings)
        assertEquals(75L, with.meetingMinutes)
        assertEquals("nothing else about the week changes either", without, with)
        assertEquals(0, workStats(emptyList(), documents, monday, sunday, today, zone).meetings)
    }

    @Test
    fun `notes the user typed or pasted from a meeting still count as that meeting`() {
        val pasted = MeetingEntity(
            id = 31, title = "Vendor call", startedAt = at(today, 15), endedAt = at(today, 15),
            source = MeetingSource.IMPORT, status = MeetingStatus.TRANSCRIBED,
        )
        val stats = workStats(emptyList(), listOf(pasted), monday, sunday, today, zone)
        assertEquals(1, stats.meetings)
        assertEquals(0L, stats.meetingMinutes)
    }

    @Test
    fun `throughput compares finished with taken on`() {
        val tasks = listOf(
            task(1, createdAt = at(monday, 9)),
            task(2, createdAt = at(monday, 9)),
            task(3, createdAt = at(monday - 20, 9), status = TaskStatus.DONE, completedAt = at(tuesday, 9)),
            task(4, createdAt = at(monday - 20, 9), status = TaskStatus.DONE, completedAt = at(tuesday, 9)),
            task(5, createdAt = at(monday - 20, 9), status = TaskStatus.DONE, completedAt = at(tuesday, 9)),
        )
        val stats = workStats(tasks, emptyList(), monday, sunday, today, zone)
        assertEquals(1.5, stats.throughput!!, 1e-9)
        assertNull("nothing finished had a due date", stats.onTimeRate)
    }

    // -------------------------------------------------------------------------------------------
    // The assistant's own record

    @Test
    fun `assistant stats count what the user did with its work`() {
        val meetings = listOf(
            meeting(1, at(monday, 9), at(monday, 10), MeetingStatus.READY, rating = 1),
            meeting(2, at(monday, 11), at(monday, 12), MeetingStatus.READY, rating = -1),
            meeting(3, at(tuesday, 9), at(tuesday, 10), MeetingStatus.READY, rating = 0),
            // Never summarized, so there is no summary to have an opinion of.
            meeting(4, at(tuesday, 11), at(tuesday, 12), MeetingStatus.FAILED, rating = 1),
            meeting(5, at(today, 9), at(today, 10), MeetingStatus.TRANSCRIBED),
        )
        val tasks = listOf(
            task(1, origin = TaskOrigin.AI),
            task(2, origin = TaskOrigin.AI, status = TaskStatus.DISMISSED),
            task(3, origin = TaskOrigin.AI, edited = true, status = TaskStatus.DONE, completedAt = 5),
            task(4, origin = TaskOrigin.AI, ownership = Ownership.UNCLEAR),
            task(5, origin = TaskOrigin.AI, ownership = Ownership.UNCLEAR, status = TaskStatus.DONE, completedAt = 5),
            // Corrected and then thrown out anyway: one strike, not two.
            task(6, origin = TaskOrigin.AI, edited = true, status = TaskStatus.DISMISSED),
            // The user's own tasks say nothing about the assistant.
            task(7, origin = TaskOrigin.MANUAL, status = TaskStatus.DISMISSED),
            task(8, origin = TaskOrigin.MANUAL, ownership = Ownership.UNCLEAR),
        )
        val questions = listOf(
            QuestionEntity(id = 1, question = "Who is Dana?", createdAt = 1, status = QuestionStatus.ANSWERED, answer = "Eng lead"),
            QuestionEntity(id = 2, question = "What is QBR?", createdAt = 2, status = QuestionStatus.ANSWERED, answer = "Quarterly business review"),
            QuestionEntity(id = 3, question = "Who owns pricing?", createdAt = 3),
            QuestionEntity(id = 4, question = "What is Atlas?", createdAt = 4, status = QuestionStatus.SKIPPED),
        )
        val chat = listOf(
            ChatMessageEntity(id = 1, threadId = 1, role = "user", text = "q", createdAt = 1, rating = 1),
            ChatMessageEntity(id = 2, threadId = 1, role = "assistant", text = "a", createdAt = 2, rating = 1),
            ChatMessageEntity(id = 3, threadId = 1, role = "assistant", text = "a", createdAt = 3, rating = 1),
            ChatMessageEntity(id = 4, threadId = 1, role = "assistant", text = "a", createdAt = 4, rating = -1),
            ChatMessageEntity(id = 5, threadId = 1, role = "assistant", text = "a", createdAt = 5),
        )
        val insights = listOf(
            InsightEntity(id = 1, kind = InsightKind.DAY_PLAN, periodStart = today, json = "{}", createdAt = 1, rating = 1),
            InsightEntity(id = 2, kind = InsightKind.WEEK_PLAN, periodStart = monday, json = "{}", createdAt = 1, rating = 1),
            InsightEntity(id = 3, kind = InsightKind.WEEK_REVIEW, periodStart = monday, json = "{}", createdAt = 1, rating = -1),
            InsightEntity(id = 4, kind = InsightKind.DAY_PLAN, periodStart = today - 1, json = "{}", createdAt = 1),
        )
        val usage = listOf(
            UsageEntity(at = 1, feature = "meeting_summary", model = "claude-opus-5-5", inputTokens = 1_000, outputTokens = 500, cacheReadTokens = 2_000, cacheWriteTokens = 300),
            UsageEntity(at = 2, feature = "ask", model = "claude-haiku-5-5", ok = false),
            UsageEntity(at = 3, feature = "ask", model = "claude-sonnet-5-5", inputTokens = 10, outputTokens = 20),
        )

        val stats = assistantStats(meetings, tasks, questions, chat, insights, usage, knowledgeEntries = 42)

        assertEquals(3, stats.summaries)
        assertEquals(1, stats.summariesUp)
        assertEquals(1, stats.summariesDown)
        assertEquals(0.5, stats.summaryApproval!!, 1e-9)
        assertEquals(6, stats.tasksSuggested)
        assertEquals(2, stats.tasksDismissed)
        assertEquals(1, stats.tasksEdited)
        assertEquals(1, stats.tasksUnclear)
        assertEquals("three of six were kept as written", 0.5, stats.taskPrecision!!, 1e-9)
        assertEquals(4, stats.questionsAsked)
        assertEquals(2, stats.questionsAnswered)
        assertEquals(2, stats.answersUp)
        assertEquals(1, stats.answersDown)
        assertEquals(2, stats.plansUp)
        assertEquals(1, stats.plansDown)
        assertEquals(8, stats.ratingsGiven)
        assertEquals(42, stats.knowledgeEntries)
        assertEquals(3, stats.calls)
        assertEquals(1, stats.failedCalls)
        assertEquals("input includes what was read from and written to the cache", 3_310L, stats.inputTokens)
        assertEquals(520L, stats.outputTokens)
        assertEquals(0.0159 + 0.00022, stats.estimatedCostUsd, 1e-12)
    }

    @Test
    fun `assistant stats with nothing to judge have no rates`() {
        val stats = assistantStats(emptyList(), emptyList(), emptyList(), emptyList(), emptyList(), emptyList(), knowledgeEntries = 0)
        assertNull(stats.taskPrecision)
        assertNull(stats.summaryApproval)
        assertEquals(0, stats.ratingsGiven)
        assertEquals(0.0, stats.estimatedCostUsd, 0.0)
    }

    @Test
    fun `task precision is one when nothing was corrected and never negative`() {
        val untouched = assistantStats(emptyList(), listOf(task(1, origin = TaskOrigin.AI), task(2, origin = TaskOrigin.AI, status = TaskStatus.DONE, completedAt = 1)), emptyList(), emptyList(), emptyList(), emptyList(), 0)
        assertEquals(1.0, untouched.taskPrecision!!, 1e-9)

        val allWrong = assistantStats(emptyList(), listOf(task(1, origin = TaskOrigin.AI, edited = true), task(2, origin = TaskOrigin.AI, status = TaskStatus.DISMISSED)), emptyList(), emptyList(), emptyList(), emptyList(), 0)
        assertEquals(0.0, allWrong.taskPrecision!!, 1e-9)
    }

    // -------------------------------------------------------------------------------------------
    // Prices

    private fun usage(model: String, input: Long = 0, output: Long = 0, cacheRead: Long = 0, cacheWrite: Long = 0) =
        UsageEntity(at = 0, feature = "test", model = model, inputTokens = input, outputTokens = output, cacheReadTokens = cacheRead, cacheWriteTokens = cacheWrite)

    @Test
    fun `list prices per million tokens`() {
        val million = 1_000_000L
        // Opus 5.5: $4 in, $20 out, cache reads $0.20.
        assertEquals(4.0, Pricing.costUsd(usage("claude-opus-5-5", input = million)), 1e-9)
        assertEquals(20.0, Pricing.costUsd(usage("claude-opus-5-5", output = million)), 1e-9)
        assertEquals(0.20, Pricing.costUsd(usage("claude-opus-5-5", cacheRead = million)), 1e-9)
        // Sonnet 5.5: $2 in, $10 out, cache reads $0.10.
        assertEquals(2.0, Pricing.costUsd(usage("claude-sonnet-5-5", input = million)), 1e-9)
        assertEquals(10.0, Pricing.costUsd(usage("claude-sonnet-5-5", output = million)), 1e-9)
        assertEquals(0.10, Pricing.costUsd(usage("claude-sonnet-5-5", cacheRead = million)), 1e-9)
        // Haiku 5.5: $0.10 in, $0.50 out.
        assertEquals(0.10, Pricing.costUsd(usage("claude-haiku-5-5", input = million)), 1e-9)
        assertEquals(0.50, Pricing.costUsd(usage("claude-haiku-5-5", output = million)), 1e-9)
    }

    @Test
    fun `writing to the cache costs a quarter more than plain input`() {
        val million = 1_000_000L
        assertEquals(5.0, Pricing.costUsd(usage("claude-opus-5-5", cacheWrite = million)), 1e-9)
        assertEquals(2.5, Pricing.costUsd(usage("claude-sonnet-5-5", cacheWrite = million)), 1e-9)
    }

    @Test
    fun `a call's cost adds up its parts`() {
        val cost = Pricing.costUsd(usage("claude-opus-5-5", input = 12_000, output = 3_000, cacheRead = 40_000, cacheWrite = 8_000))
        assertEquals((12_000 * 4.0 + 3_000 * 20.0 + 40_000 * 0.20 + 8_000 * 5.0) / 1_000_000.0, cost, 1e-12)
        assertEquals(0.0, Pricing.costUsd(usage("claude-opus-5-5")), 0.0)
    }

    @Test
    fun `the model a fallback answered with is priced as itself`() {
        val million = 1_000_000L
        assertEquals(5.0, Pricing.costUsd(usage("claude-opus-4-8", input = million)), 1e-9)
        assertEquals(25.0, Pricing.costUsd(usage("claude-opus-4-8", output = million)), 1e-9)
        assertEquals(5.0, Pricing.costUsd(usage("claude-opus-5", input = million)), 1e-9)
        assertEquals(2.0, Pricing.costUsd(usage("claude-sonnet-5", input = million)), 1e-9)
        assertEquals("Opus 5 is not billed at Opus 5.5's rate", false, Pricing.rate("claude-opus-5") == Pricing.rate("claude-opus-5-5"))
    }

    @Test
    fun `a model id with a suffix is priced as the model it names`() {
        assertEquals(Pricing.rate("claude-sonnet-5-5"), Pricing.rate("claude-sonnet-5-5-20260915"))
        assertEquals(Pricing.rate("claude-opus-5-5"), Pricing.rate("claude-opus-5-5-20260801"))
        assertEquals(Pricing.rate("claude-haiku-5-5"), Pricing.rate("claude-haiku-5-5-latest"))
        assertEquals(Pricing.rate("claude-opus-4-8"), Pricing.rate("claude-opus-4-8-20260301"))
    }

    @Test
    fun `an unknown model is priced as the default rather than as free`() {
        assertEquals(Pricing.rate("claude-opus-5-5"), Pricing.rate("something-new"))
        assertEquals(Pricing.rate("claude-opus-5-5"), Pricing.rate(""))
    }
}
