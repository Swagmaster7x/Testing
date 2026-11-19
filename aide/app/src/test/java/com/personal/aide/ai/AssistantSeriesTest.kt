package com.personal.aide.ai

import android.app.Application
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.aide.ai.Assistant.SummaryResult
import com.personal.aide.data.ActionItem
import com.personal.aide.data.EarlierItem
import com.personal.aide.data.MeetingAnalysis
import com.personal.aide.data.SeriesGuess
import com.personal.aide.data.SeriesStore
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.SegmentKind
import com.personal.aide.data.db.SeriesEntity
import com.personal.aide.data.db.TaskOrigin
import com.personal.aide.data.db.TaskStatus
import com.personal.aide.domain.knowledgeKey
import com.personal.aide.testing.Fixed
import com.personal.aide.testing.prompt
import com.personal.aide.testing.task
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config

/** Meeting notes for meetings that happen again and again: which series a meeting joins, and what it is told about last time. */
@RunWith(AndroidJUnit4::class)
@Config(sdk = [35], application = Application::class)
class AssistantSeriesTest : AssistantTestBase() {

    private suspend fun series(name: String, calendarEventId: Long? = null): Long =
        db.series().insert(SeriesEntity(name = name, key = knowledgeKey(name), calendarEventId = calendarEventId, createdAt = 1))

    /** An earlier occurrence of a recurring meeting, held at ten in the morning [daysAgo] days ago and summarized. */
    private suspend fun occurrence(
        seriesId: Long,
        daysAgo: Long,
        title: String = "Occurrence $daysAgo days ago",
        tldr: String = "Notes from $daysAgo days ago.",
        decisions: List<String> = emptyList(),
        attendees: List<String> = emptyList(),
    ): Long {
        val id = summarized(title, Fixed.at(today - daysAgo, 10), MeetingAnalysis(title = title, tldr = tldr, decisions = decisions), attendees)
        db.meetings().setSeries(id, seriesId)
        return id
    }

    /** Today's recording, already filed under [seriesId] by the user or the calendar. */
    private suspend fun recordedIn(seriesId: Long, title: String? = null): Long {
        val id = recorded(title)
        db.meetings().setSeries(id, seriesId)
        return id
    }

    /** A recording started from calendar event [eventId]. */
    private suspend fun recordedFromCalendar(title: String, eventId: Long): Long {
        val id = meetings.startLive(title, calendarEventId = eventId)
        pricingTalk.forEachIndexed { index, line -> meetings.addSegment(id, SegmentKind.SPEECH, line, index * 30_000L) }
        now += 30 * 60_000L
        meetings.finish(id)
        return id
    }

    private fun reply(
        series: SeriesGuess = SeriesGuess(),
        sinceLastTime: List<String> = emptyList(),
        earlierItems: List<EarlierItem> = emptyList(),
        actionItems: List<String> = emptyList(),
        tldr: String = "Today's notes.",
    ) = llm.reply(
        json(
            MeetingAnalysis(
                tldr = tldr,
                series = series,
                sinceLastTime = sinceLastTime,
                earlierItems = earlierItems,
                actionItems = actionItems.map { ActionItem(title = it, ownership = "mine") },
            ),
        ),
    )

    /** What the last request said about recurring meetings. */
    private fun recurring(): String = llm.last.prompt.substringAfter("<recurring_meetings>\n").substringBefore("\n</recurring_meetings>")

    /** The series offered in the last request, in the order they were listed. */
    private fun offered(): List<Long> = Regex("""## \[series (\d+)] """).findAll(recurring()).map { it.groupValues[1].toLong() }.toList()

    /** The earlier action items listed in the last request. */
    private fun listedItems(): List<String> = recurring().lines().filter { it.startsWith("- [id ") }

    private suspend fun stored(meetingId: Long): MeetingAnalysis = ContextBlocks.analysisOf(meeting(meetingId))!!

    private suspend fun seriesNames(): List<String> = db.series().all().map { it.name }

    // -------------------------------------------------------------------------------------------
    // What the request says about recurring meetings

    @Test
    fun `with no recurring meetings on record the request says so`(): Unit = runBlocking {
        settings.setProfile(sam)
        val id = recorded()
        reply()
        assistant.summarizeMeeting(id)

        val prompt = llm.last.prompt
        assertEquals("The user keeps no recurring meetings yet.", recurring())
        assertTrue("after the knowledge base", prompt.indexOf("</knowledge_base>") < prompt.indexOf("<recurring_meetings>"))
        assertTrue("and before the meeting itself", prompt.indexOf("</recurring_meetings>") < prompt.indexOf("<meeting>"))
        assertTrue(prompt.contains("Some of Sam Rivera's meetings are regular fixtures."))
        assertTrue(prompt.contains("don't write an earlier action item up again as a new one"))
    }

    @Test
    fun `a meeting already in a series is sent that series' last notes and what is still open from it`(): Unit = runBlocking {
        val standup = series("Quoting standup")
        series("Pricing review")
        val last = occurrence(standup, daysAgo = 7, title = "Quoting standup", tldr = "Rate feed is two weeks late.", decisions = listOf("Ship behind a flag"), attendees = listOf("Dana Whitfield"))
        val deck = insert(task(title = "Send the deck", due = today - 2, meetingId = last))
        val contract = insert(task(title = "Send contract", ownership = Ownership.OTHERS, owner = "Dana Whitfield", due = today + 2, meetingId = last))
        val faq = insert(task(title = "Draft the FAQ", meetingId = last))
        val legal = insert(task(title = "Chase legal", ownership = Ownership.OTHERS, owner = "", meetingId = last))
        val venue = insert(task(title = "Book the venue", status = TaskStatus.DONE, completedAt = Fixed.at(today - 1, 9), meetingId = last))
        val id = recordedIn(standup)
        reply()

        assistant.summarizeMeeting(id)

        val block = recurring()
        val head = "This meeting is an occurrence of the recurring meeting below.\n\n" +
            "## [series $standup] \"Quoting standup\"\n" +
            "Its previous occurrence:\n" +
            "## \"Quoting standup\" on Wednesday, 11 November 2026\n" +
            "With: Dana Whitfield\n" +
            "Rate feed is two weeks late.\n" +
            "Decisions:\n" +
            "- Ship behind a flag\n" +
            "Action items from its earlier occurrences, as they stand today:\n"
        assertTrue(block, block.startsWith(head))
        assertEquals(
            setOf(
                "- [id ${deck.id}] Send the deck | the user's | still open, 2 days past its date",
                "- [id ${contract.id}] Send contract | Dana Whitfield's | still open, due 2026-11-20",
                "- [id ${faq.id}] Draft the FAQ | the user's | still open",
                "- [id ${legal.id}] Chase legal | someone else's | still open",
                "- [id ${venue.id}] Book the venue | the user's | marked done 2026-11-17",
            ),
            block.removePrefix(head).lines().toSet(),
        )
        assertEquals("only the series it belongs to is shown", listOf(standup), offered())
    }

    /** Five recurring meetings, of which the pricing talk plainly matches one, loosely matches three, and has nothing in common with one. */
    private class Kept(val pricing: Long, val offsite: Long, val dana: Long, val finance: Long, val hiring: Long)

    private suspend fun fiveSeries(): Kept {
        val pricing = series("Pricing review")
        val offsite = series("Offsite venue hunt")
        val dana = series("1:1 with Dana Whitfield")
        val finance = series("Finance close")
        val hiring = series("Hiring sync")
        occurrence(pricing, daysAgo = 7, tldr = "Agreed three tiers.")
        occurrence(offsite, daysAgo = 6, tldr = "Shortlisted two hotels.")
        // Shares one ordinary word with the transcript, and only in its notes.
        occurrence(finance, daysAgo = 5, tldr = "Covered the first numbers.")
        occurrence(hiring, daysAgo = 4, tldr = "Two engineers join in January.")
        return Kept(pricing, offsite, dana, finance, hiring)
    }

    @Test
    fun `a meeting of unknown series is shown the recurring meetings it might be, best match first, three at most`(): Unit = runBlocking {
        val kept = fiveSeries()
        val id = recorded()
        reply()

        assistant.summarizeMeeting(id)

        assertEquals(3, Assistant.MAX_SERIES_CANDIDATES)
        val block = recurring()
        assertTrue(block, block.startsWith("The user's recurring meetings that this one might be an occurrence of:\n\n## [series ${kept.pricing}] \"Pricing review\"\nIts previous occurrence:\n"))
        assertEquals("the plain match leads", kept.pricing, offered().first())
        assertEquals(setOf(kept.pricing, kept.offsite, kept.dana), offered().toSet())
        assertEquals(3, offered().size)
        assertTrue(block.contains("Agreed three tiers."))
        assertFalse("one with nothing in common is not offered", block.contains("Hiring sync"))
        assertFalse(block.contains("Two engineers join in January."))
    }

    @Test
    fun `a series with no earlier notes is still offered by name`(): Unit = runBlocking {
        val kept = fiveSeries()
        val id = recorded()
        reply(series = SeriesGuess(existingId = kept.dana))

        assistant.summarizeMeeting(id)

        assertTrue(recurring().contains("## [series ${kept.dana}] \"1:1 with Dana Whitfield\"\nNo earlier notes on record."))
        assertEquals("and can be picked", kept.dana, meeting(id).seriesId)
    }

    @Test
    fun `recurring meetings that share nothing with this one are not offered`(): Unit = runBlocking {
        val hiring = series("Hiring sync")
        occurrence(hiring, daysAgo = 4, tldr = "Two engineers join in January.")
        val id = recorded()
        reply()

        assistant.summarizeMeeting(id)

        assertEquals("None of the user's recurring meetings looks like a match for this one.", recurring())
        assertNull(meeting(id).seriesId)
    }

    @Test
    fun `the people invited help find the series`(): Unit = runBlocking {
        val priya = series("Weekly catch-up")
        occurrence(priya, daysAgo = 7, tldr = "Went over the roadmap.", attendees = listOf("Priya Nair"))
        val id = recorded(attendees = listOf("Priya Nair"))
        reply()

        assistant.summarizeMeeting(id)

        assertEquals(listOf(priya), offered())
    }

    @Test
    fun `the previous occurrence is the latest earlier one that has notes`(): Unit = runBlocking {
        val standup = series("Quoting standup")
        occurrence(standup, daysAgo = 14, tldr = "Older notes.")
        occurrence(standup, daysAgo = 7, tldr = "Newer notes.")
        // Recorded since, but never summarized.
        db.meetings().insert(MeetingEntity(title = "Quoting standup", titleIsAuto = false, startedAt = Fixed.at(today - 2, 10), status = MeetingStatus.TRANSCRIBED, seriesId = standup))
        db.meetings().insert(MeetingEntity(title = "Quoting standup", titleIsAuto = false, startedAt = Fixed.at(today - 1, 10), status = MeetingStatus.FAILED, error = "Claude is busy", seriesId = standup))
        val id = recordedIn(standup)
        reply()

        assistant.summarizeMeeting(id)

        assertTrue(recurring().contains("Newer notes."))
        assertFalse(recurring().contains("Older notes."))
    }

    @Test
    fun `a later occurrence is not shown as the previous one`(): Unit = runBlocking {
        val standup = series("Quoting standup")
        occurrence(standup, daysAgo = 14, tldr = "The one before.")
        // The meeting being written up was held a week ago; another has been held and summarized since.
        now = Fixed.at(today - 7, 10)
        val id = recordedIn(standup)
        now = Fixed.now
        occurrence(standup, daysAgo = 1, tldr = "The one after.")
        val after = insert(task(title = "Taken on afterwards", meetingId = db.meetings().inSeries(standup).first().id))
        reply(earlierItems = listOf(EarlierItem(after.id, "done", "can't have been said")))

        assistant.summarizeMeeting(id)

        assertTrue(recurring().contains("The one before."))
        assertFalse(recurring().contains("The one after."))
        assertFalse(recurring().contains("Taken on afterwards"))
        assertTrue(stored(id).earlierItems.isEmpty())
    }

    @Test
    fun `summarizing a meeting again does not show it its own notes as last time`(): Unit = runBlocking {
        val standup = series("Quoting standup")
        occurrence(standup, daysAgo = 7, tldr = "Last week's notes.")
        val id = recordedIn(standup)
        reply(tldr = "First pass at today's notes.", sinceLastTime = listOf("Deck went out"))
        assistant.summarizeMeeting(id)
        insert(task(title = "From today's meeting", meetingId = id))

        reply(tldr = "Second pass.", sinceLastTime = listOf("Deck went out", "Legal signed"))
        assistant.summarizeMeeting(id)

        assertTrue(recurring().contains("Last week's notes."))
        assertFalse(recurring().contains("First pass at today's notes."))
        assertFalse("nor its own tasks as earlier ones", recurring().contains("From today's meeting"))
        assertEquals(standup, meeting(id).seriesId)
        assertEquals(listOf("Deck went out", "Legal signed"), stored(id).sinceLastTime)
    }

    // -------------------------------------------------------------------------------------------
    // Which earlier action items are listed

    @Test
    fun `earlier items are the open ones and those finished since, from the last three occurrences`(): Unit = runBlocking {
        val standup = series("Quoting standup")
        val fourBack = occurrence(standup, daysAgo = 28)
        val threeBack = occurrence(standup, daysAgo = 21)
        val twoBack = occurrence(standup, daysAgo = 14)
        val last = occurrence(standup, daysAgo = 7)
        val elsewhere = summarized("Hiring sync", Fixed.at(today - 3, 10))

        val tooOld = insert(task(title = "From four occurrences back", meetingId = fourBack))
        val stillOpen = insert(task(title = "Open since three back", meetingId = threeBack))
        val doneBefore = insert(task(title = "Finished before the last one", status = TaskStatus.DONE, completedAt = Fixed.at(today - 10, 9), meetingId = twoBack))
        val doneSince = insert(task(title = "Finished since the last one", status = TaskStatus.DONE, completedAt = Fixed.at(today - 2, 9), meetingId = last))
        val theirs = insert(task(title = "Dana's from last time", ownership = Ownership.OTHERS, owner = "Dana", meetingId = last))
        val unclear = insert(task(title = "Nobody's yet", ownership = Ownership.UNCLEAR, meetingId = last))
        val dismissed = insert(task(title = "Thrown out", status = TaskStatus.DISMISSED, meetingId = last))
        val other = insert(task(title = "From another meeting", meetingId = elsewhere))
        val loose = insert(task(title = "From no meeting"))
        val all = listOf(tooOld, stillOpen, doneBefore, doneSince, theirs, unclear, dismissed, other, loose)

        val id = recordedIn(standup)
        reply(earlierItems = all.map { EarlierItem(it.id, "still_open", "about ${it.title}") })
        assistant.summarizeMeeting(id)

        val shown = setOf(stillOpen, doneSince, theirs)
        assertEquals(shown.map { it.title }.toSet(), listedItems().map { it.substringAfter("] ").substringBefore(" | ") }.toSet())
        assertEquals("only what was listed can be reported on", shown.map { it.id }.toSet(), stored(id).earlierItems.map { it.taskId }.toSet())
    }

    @Test
    fun `at most twenty-five earlier items are listed and only those can be reported on`(): Unit = runBlocking {
        val standup = series("Quoting standup")
        val last = occurrence(standup, daysAgo = 7)
        val many = (1..30).map { insert(task(title = "Earlier item $it", meetingId = last, createdAt = Fixed.at(today - 7, 11) + it)) }
        val id = recordedIn(standup)
        reply(earlierItems = many.map { EarlierItem(it.id, "not_mentioned", "") })

        assistant.summarizeMeeting(id)

        assertEquals(25, Assistant.MAX_EARLIER_ITEMS)
        assertEquals(25, listedItems().size)
        val listedIds = listedItems().map { it.substringAfter("[id ").substringBefore("]").toLong() }.toSet()
        assertEquals(listedIds, stored(id).earlierItems.map { it.taskId }.toSet())
    }

    @Test
    fun `a series whose earlier meetings left nothing open lists no items`(): Unit = runBlocking {
        val standup = series("Quoting standup")
        occurrence(standup, daysAgo = 7, tldr = "Nothing was agreed.")
        val id = recordedIn(standup)
        reply()

        assistant.summarizeMeeting(id)

        assertTrue(recurring().endsWith("Nothing was agreed."))
        assertFalse(recurring().contains("Action items from its earlier occurrences"))
    }

    // -------------------------------------------------------------------------------------------
    // Which series the meeting ends up in

    @Test
    fun `the model's pick among the series it was shown puts the meeting in that series`(): Unit = runBlocking {
        val kept = fiveSeries()
        val id = recorded()
        reply(series = SeriesGuess(existingId = kept.offsite), sinceLastTime = listOf("A venue is booked"))

        assertEquals(SummaryResult.Done, assistant.summarizeMeeting(id))

        assertEquals(kept.offsite, meeting(id).seriesId)
        assertEquals(listOf("A venue is booked"), stored(id).sinceLastTime)
        assertEquals("no series was made or lost", 5, db.series().all().size)
    }

    @Test
    fun `an existing_id for a series that was not shown is ignored`(): Unit = runBlocking {
        val kept = fiveSeries()

        // Real, but nothing like this meeting, so it was never listed.
        val first = recorded()
        reply(series = SeriesGuess(existingId = kept.hiring), sinceLastTime = listOf("Made up"))
        assistant.summarizeMeeting(first)
        assertFalse(kept.hiring in offered())
        assertNull(meeting(first).seriesId)
        assertTrue(stored(first).sinceLastTime.isEmpty())

        // Real and a faint match, but cut from the list of three.
        val second = recorded()
        reply(series = SeriesGuess(existingId = kept.finance))
        assistant.summarizeMeeting(second)
        assertFalse(kept.finance in offered())
        assertNull(meeting(second).seriesId)

        // Not a series at all.
        val third = recorded()
        reply(series = SeriesGuess(existingId = 999_999))
        assistant.summarizeMeeting(third)
        assertNull(meeting(third).seriesId)
        assertEquals(5, db.series().all().size)
    }

    @Test
    fun `a one-off meeting stays out of every series and says nothing about last time`(): Unit = runBlocking {
        val kept = fiveSeries()
        val open = insert(task(title = "Send the deck", meetingId = db.meetings().inSeries(kept.pricing).single().id))
        val id = recorded()
        reply(sinceLastTime = listOf("Something moved"), earlierItems = listOf(EarlierItem(open.id, "done", "said in passing")))

        assistant.summarizeMeeting(id)

        assertNull(meeting(id).seriesId)
        assertTrue("there is no last time for a one-off", stored(id).sinceLastTime.isEmpty())
        assertTrue(stored(id).earlierItems.isEmpty())
        assertEquals(5, db.series().all().size)
    }

    @Test
    fun `a new name starts a series for a regular meeting that was not listed`(): Unit = runBlocking {
        val id = recorded()
        reply(series = SeriesGuess(newName = "  1:1 with Priya "), sinceLastTime = listOf("Made up: there was no last time"), earlierItems = listOf(EarlierItem(1, "done", "")))

        assistant.summarizeMeeting(id)

        val made = db.series().all().single()
        assertEquals("1:1 with Priya", made.name)
        assertEquals(now, made.createdAt)
        assertNull(made.calendarEventId)
        assertEquals(made.id, meeting(id).seriesId)
        assertTrue("a series that begins today has no last time", stored(id).sinceLastTime.isEmpty())
        assertTrue(stored(id).earlierItems.isEmpty())
    }

    @Test
    fun `the next occurrence is offered the series the assistant started and its first notes`(): Unit = runBlocking {
        now = Fixed.at(today - 7, 10)
        val first = recorded(attendees = listOf("Priya Nair"))
        reply(series = SeriesGuess(newName = "1:1 with Priya"), tldr = "Priya wants the roadmap by Friday.", actionItems = listOf("Send Priya the roadmap"))
        assistant.summarizeMeeting(first)
        val made = db.series().all().single().id
        val roadmap = tasksOf(first).single()

        now = Fixed.now
        val second = recorded(attendees = listOf("Priya Nair"))
        reply(series = SeriesGuess(existingId = made), sinceLastTime = listOf("Roadmap is half done"), earlierItems = listOf(EarlierItem(roadmap.id, "still_open", "half done")))
        assistant.summarizeMeeting(second)

        assertEquals(listOf(made), offered())
        assertTrue(recurring().contains("Its previous occurrence:\n"))
        assertTrue(recurring().contains("Priya wants the roadmap by Friday."))
        assertEquals(listOf("- [id ${roadmap.id}] Send Priya the roadmap | the user's | still open"), listedItems())
        assertEquals(made, meeting(second).seriesId)
        assertEquals(listOf("Roadmap is half done"), stored(second).sinceLastTime)
        assertEquals(listOf(EarlierItem(roadmap.id, "still_open", "half done")), stored(second).earlierItems)
        assertEquals("one series, two meetings", listOf(second, first), db.meetings().inSeries(made).map { it.id })
    }

    @Test
    fun `a new name that is already a series joins it instead of making a second`(): Unit = runBlocking {
        val hiring = series("Hiring sync")
        occurrence(hiring, daysAgo = 4, tldr = "Two engineers join in January.")
        val id = recorded()
        reply(series = SeriesGuess(newName = "hiring SYNC"), sinceLastTime = listOf("Made up: its notes were never shown"))

        assistant.summarizeMeeting(id)

        assertEquals(listOf("Hiring sync"), seriesNames())
        assertEquals(hiring, meeting(id).seriesId)
        assertTrue("it never saw that series' notes, so it can't say what moved", stored(id).sinceLastTime.isEmpty())
    }

    @Test
    fun `a pick from the list wins over a new name sent with it`(): Unit = runBlocking {
        val pricing = series("Pricing review")
        occurrence(pricing, daysAgo = 7, tldr = "Agreed three tiers.")
        val id = recorded()
        reply(series = SeriesGuess(existingId = pricing, newName = "Pricing council"))

        assistant.summarizeMeeting(id)

        assertEquals(pricing, meeting(id).seriesId)
        assertEquals(listOf("Pricing review"), seriesNames())
    }

    @Test
    fun `a blank new name is no series`(): Unit = runBlocking {
        val id = recorded()
        reply(series = SeriesGuess(newName = "   "))

        assistant.summarizeMeeting(id)

        assertNull(meeting(id).seriesId)
        assertTrue(db.series().all().isEmpty())
    }

    // -------------------------------------------------------------------------------------------
    // A series already chosen is not the model's to change

    @Test
    fun `a series the user chose is never overridden by the model's guess`(): Unit = runBlocking {
        val standup = series("Quoting standup")
        val pricing = series("Pricing review")
        occurrence(pricing, daysAgo = 7, tldr = "Agreed three tiers.")
        val id = recordedIn(standup)

        reply(series = SeriesGuess(existingId = pricing))
        assistant.summarizeMeeting(id)
        assertEquals(standup, meeting(id).seriesId)
        assertTrue(recurring().startsWith("This meeting is an occurrence of the recurring meeting below."))
        assertEquals("the model is not even asked to choose", listOf(standup), offered())

        reply(series = SeriesGuess(newName = "Pricing council"))
        assistant.summarizeMeeting(id)
        assertEquals(standup, meeting(id).seriesId)
        assertEquals("and no series is made for a name that was not used", listOf("Pricing review", "Quoting standup"), seriesNames())
    }

    @Test
    fun `a series chosen while the summary was being written stands`(): Unit = runBlocking {
        val standup = series("Quoting standup")
        val pricing = series("Pricing review")
        val lastPricing = occurrence(pricing, daysAgo = 7, tldr = "Agreed three tiers.")
        val open = insert(task(title = "Send the deck", meetingId = lastPricing))
        val id = recorded()
        llm.answer {
            db.meetings().setSeries(id, standup)
            json(
                MeetingAnalysis(
                    tldr = "t",
                    series = SeriesGuess(existingId = pricing, newName = "Pricing council"),
                    sinceLastTime = listOf("Said of the pricing review, not the standup"),
                    earlierItems = listOf(EarlierItem(open.id, "done", "a pricing review item")),
                    actionItems = listOf(ActionItem(title = "Send the deck", ownership = "mine")),
                ),
            )
        }

        assistant.summarizeMeeting(id)

        assertEquals(standup, meeting(id).seriesId)
        assertEquals(listOf("Pricing review", "Quoting standup"), seriesNames())
        assertTrue("what it said was about a different recurring meeting", stored(id).sinceLastTime.isEmpty())
        assertTrue(stored(id).earlierItems.isEmpty())
        assertEquals("and that meeting's open items are not this one's", listOf("Send the deck"), tasksOf(id).map { it.title })
    }

    @Test
    fun `the series the calendar made stands against the model's guess`(): Unit = runBlocking {
        val store = SeriesStore(db.series(), db.meetings()) { now }
        now = Fixed.at(today - 7, 10)
        val first = recordedFromCalendar("Quoting standup", eventId = 77)
        store.linkByCalendar(first)
        reply(tldr = "Rate feed is two weeks late.")
        assistant.summarizeMeeting(first)
        assertNull("one recording of an event is not a series", meeting(first).seriesId)

        now = Fixed.now
        val second = recordedFromCalendar("Quoting standup", eventId = 77)
        store.linkByCalendar(second)
        val fromCalendar = db.series().all().single()
        reply(series = SeriesGuess(newName = "Weekly pricing check-in"), sinceLastTime = listOf("The feed is fixed"))
        assistant.summarizeMeeting(second)

        assertEquals(fromCalendar.id, meeting(second).seriesId)
        assertEquals(fromCalendar.id, meeting(first).seriesId)
        assertEquals(listOf("Quoting standup"), seriesNames())
        assertTrue(recurring().contains("Its previous occurrence:\n## \"Quoting standup\" on Wednesday, 11 November 2026\nRate feed is two weeks late."))
        assertEquals(listOf("The feed is fixed"), stored(second).sinceLastTime)
    }

    @Test
    fun `a series the assistant started for the first recording is the one the second recording joins`(): Unit = runBlocking {
        val store = SeriesStore(db.series(), db.meetings()) { now }
        now = Fixed.at(today - 7, 10)
        val first = recordedFromCalendar("Quoting standup", eventId = 77)
        store.linkByCalendar(first)
        reply(series = SeriesGuess(newName = "Quoting standup"))
        assistant.summarizeMeeting(first)

        now = Fixed.now
        val second = recordedFromCalendar("Quoting standup", eventId = 77)
        store.linkByCalendar(second)

        assertEquals(1, db.series().all().size)
        assertEquals(meeting(first).seriesId, meeting(second).seriesId)
    }

    // -------------------------------------------------------------------------------------------
    // What moved since last time

    @Test
    fun `what moved since last time is kept tidied, for the series the model was shown`(): Unit = runBlocking {
        val standup = series("Quoting standup")
        occurrence(standup, daysAgo = 7)
        val id = recordedIn(standup)
        reply(sinceLastTime = listOf("  The deck went out ", "", "   ", "Legal is still reviewing\n"))

        assistant.summarizeMeeting(id)

        assertEquals(listOf("The deck went out", "Legal is still reviewing"), stored(id).sinceLastTime)
    }

    @Test
    fun `earlier_items naming tasks that were not shown are dropped, and each task is reported once`(): Unit = runBlocking {
        val standup = series("Quoting standup")
        val last = occurrence(standup, daysAgo = 7)
        val deck = insert(task(title = "Send the deck", meetingId = last))
        val contract = insert(task(title = "Send contract", ownership = Ownership.OTHERS, owner = "Dana", meetingId = last))
        val unrelated = insert(task(title = "Tidy the backlog"))
        val id = recordedIn(standup)
        reply(
            earlierItems = listOf(
                EarlierItem(deck.id, "done", "Sam sent it on Monday"),
                EarlierItem(999_999, "done", "invented"),
                EarlierItem(unrelated.id, "dropped", "a real task, but never listed"),
                EarlierItem(0, "still_open", "no id at all"),
                EarlierItem(deck.id, "still_open", "said twice"),
                EarlierItem(contract.id, "not_mentioned", ""),
            ),
        )

        assistant.summarizeMeeting(id)

        assertEquals(
            listOf(EarlierItem(deck.id, "done", "Sam sent it on Monday"), EarlierItem(contract.id, "not_mentioned", "")),
            stored(id).earlierItems,
        )
        assertEquals("what was said is reported; ticking the task off is the user's call", TaskStatus.OPEN, db.tasks().get(deck.id)!!.status)
        assertEquals(unrelated, db.tasks().get(unrelated.id))
    }

    @Test
    fun `what was said about another candidate's items is dropped once the model picks a series`(): Unit = runBlocking {
        val pricing = series("Pricing review")
        val offsite = series("Offsite venue hunt")
        val lastPricing = occurrence(pricing, daysAgo = 7, tldr = "Agreed three tiers.")
        val lastOffsite = occurrence(offsite, daysAgo = 6, tldr = "Shortlisted two hotels.")
        val deck = insert(task(title = "Send the deck", meetingId = lastPricing))
        val hotel = insert(task(title = "Call the hotel", meetingId = lastOffsite))
        val id = recorded()
        reply(
            series = SeriesGuess(existingId = pricing),
            earlierItems = listOf(EarlierItem(hotel.id, "done", "listed, but under the other series"), EarlierItem(deck.id, "still_open", "by Friday")),
        )

        assistant.summarizeMeeting(id)

        assertEquals("both were listed", 2, listedItems().size)
        assertEquals(listOf(EarlierItem(deck.id, "still_open", "by Friday")), stored(id).earlierItems)
    }

    // -------------------------------------------------------------------------------------------
    // Earlier action items are not written up again

    @Test
    fun `an open action item from an earlier occurrence is not duplicated as a new task`(): Unit = runBlocking {
        val standup = series("Quoting standup")
        val last = occurrence(standup, daysAgo = 7)
        val deck = insert(task(title = "Send the deck", meetingId = last, origin = TaskOrigin.AI))
        val contract = insert(task(title = "Send contract", ownership = Ownership.OTHERS, owner = "Dana", meetingId = last, origin = TaskOrigin.AI))
        val id = recordedIn(standup)
        reply(actionItems = listOf("send the deck.", "Book the venue", "SEND CONTRACT"), earlierItems = listOf(EarlierItem(deck.id, "still_open", "Dana asked again")))

        assistant.summarizeMeeting(id)

        assertEquals(listOf("Book the venue"), tasksOf(id).map { it.title })
        assertEquals("the earlier task is left exactly as it was, with the meeting it came from", deck, db.tasks().get(deck.id))
        assertEquals(contract, db.tasks().get(contract.id))
        assertEquals(3, db.tasks().all().size)
    }

    @Test
    fun `the same holds when it was the model that placed the meeting in the series`(): Unit = runBlocking {
        val pricing = series("Pricing review")
        val last = occurrence(pricing, daysAgo = 7, tldr = "Agreed three tiers.")
        insert(task(title = "Send the deck", meetingId = last))
        val id = recorded()
        reply(series = SeriesGuess(existingId = pricing), actionItems = listOf("Send the deck", "Book the venue"))

        assistant.summarizeMeeting(id)

        assertEquals(listOf("Book the venue"), tasksOf(id).map { it.title })
    }

    @Test
    fun `summarizing again still does not duplicate an earlier open item`(): Unit = runBlocking {
        val standup = series("Quoting standup")
        val last = occurrence(standup, daysAgo = 7)
        insert(task(title = "Send the deck", meetingId = last))
        val id = recordedIn(standup)
        repeat(3) {
            reply(actionItems = listOf("Send the deck", "Book the venue"))
            assistant.summarizeMeeting(id)
        }

        assertEquals(listOf("Book the venue"), tasksOf(id).map { it.title })
        assertEquals(2, db.tasks().all().size)
    }

    @Test
    fun `an earlier open item the user reworded is not duplicated under the wording the assistant first gave it`(): Unit = runBlocking {
        val standup = series("Quoting standup")
        // Last week's occurrence, written up by the assistant; the user then made its one task more specific.
        now = Fixed.at(today - 7, 10)
        val last = recordedIn(standup)
        reply(actionItems = listOf("Send the deck"))
        assistant.summarizeMeeting(last)
        val suggested = tasksOf(last).single()
        tasks.edit(suggested.copy(title = "Send the revised pricing deck to Marcus and Priya"))

        now = Fixed.now
        val id = recordedIn(standup)
        reply(actionItems = listOf("Send the deck"))
        assistant.summarizeMeeting(id)

        // Last week's notes, as sent, still carry the original wording, so that is the wording Claude is likely to repeat.
        assertTrue(recurring().contains("- Send the deck (the user)"))
        assertTrue(recurring().contains("- [id ${suggested.id}] Send the revised pricing deck to Marcus and Priya | the user's | still open"))
        assertEquals(
            "the open task from last week came back as a second task under its old wording",
            emptyList<String>(),
            tasksOf(id).map { it.title },
        )
        assertEquals(1, db.tasks().all().size)
    }

    @Test
    fun `an earlier item that was finished can be taken on again as a new task`(): Unit = runBlocking {
        val standup = series("Quoting standup")
        val last = occurrence(standup, daysAgo = 7)
        val done = insert(task(title = "Send the deck", status = TaskStatus.DONE, completedAt = Fixed.at(today - 2, 9), meetingId = last))
        val id = recordedIn(standup)
        reply(actionItems = listOf("Send the deck"))

        assistant.summarizeMeeting(id)

        assertEquals("this week's deck is a new commitment", listOf("Send the deck"), tasksOf(id).map { it.title })
        assertEquals(TaskStatus.DONE, db.tasks().get(done.id)!!.status)
    }

    @Test
    fun `open items of a recurring meeting this one does not belong to do not swallow its tasks`(): Unit = runBlocking {
        val pricing = series("Pricing review")
        val last = occurrence(pricing, daysAgo = 7, tldr = "Agreed three tiers.")
        insert(task(title = "Send the deck", meetingId = last))
        val id = recorded()
        // The pricing review was offered, and the model said this is not it.
        reply(actionItems = listOf("Send the deck"))

        assistant.summarizeMeeting(id)

        assertEquals(listOf(pricing), offered())
        assertNull(meeting(id).seriesId)
        assertEquals(listOf("Send the deck"), tasksOf(id).map { it.title })
    }

    @Test
    fun `an unrelated open task of the same name elsewhere does not stop a new one`(): Unit = runBlocking {
        val standup = series("Quoting standup")
        occurrence(standup, daysAgo = 7)
        insert(task(title = "Send the deck"))
        insert(task(title = "Send the deck", meetingId = summarized("Hiring sync", Fixed.at(today - 3, 10))))
        val id = recordedIn(standup)
        reply(actionItems = listOf("Send the deck"))

        assistant.summarizeMeeting(id)

        assertEquals(listOf("Send the deck"), tasksOf(id).map { it.title })
    }

    // -------------------------------------------------------------------------------------------
    // When it goes wrong

    @Test
    fun `a summary that fails makes no series and moves the meeting nowhere`(): Unit = runBlocking {
        val standup = series("Quoting standup")
        val filed = recordedIn(standup)
        val loose = recorded()

        llm.fail(LlmException.Kind.OVERLOADED)
        assistant.summarizeMeeting(filed)
        llm.reply("{\"series\":{\"existing_id\":0,\"new_name\":\"Pricing council\"}, and then it trails off")
        assertTrue(assistant.summarizeMeeting(loose) is SummaryResult.Failed)

        assertEquals(standup, meeting(filed).seriesId)
        assertNull(meeting(loose).seriesId)
        assertEquals(listOf("Quoting standup"), seriesNames())
    }

    @Test
    fun `a meeting deleted while its notes were being written starts no series`(): Unit = runBlocking {
        val id = recorded()
        llm.answer {
            meetings.delete(id)
            json(MeetingAnalysis(tldr = "t", series = SeriesGuess(newName = "1:1 with Priya")))
        }

        assertEquals(SummaryResult.Missing, assistant.summarizeMeeting(id))
        assertTrue(db.series().all().isEmpty())
    }

    @Test
    fun `a meeting whose series has since been forgotten is written up as one of unknown series`(): Unit = runBlocking {
        val standup = series("Quoting standup")
        val id = recordedIn(standup)
        SeriesStore(db.series(), db.meetings()) { now }.delete(standup)
        reply()

        assertEquals(SummaryResult.Done, assistant.summarizeMeeting(id))

        assertEquals("The user keeps no recurring meetings yet.", recurring())
        assertNull(meeting(id).seriesId)
    }
}
