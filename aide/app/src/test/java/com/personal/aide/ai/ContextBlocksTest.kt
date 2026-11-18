package com.personal.aide.ai

import com.personal.aide.calendar.CalendarEvent
import com.personal.aide.data.ActionItem
import com.personal.aide.data.AideJson
import com.personal.aide.data.MeetingAnalysis
import com.personal.aide.data.db.KnowledgeEntity
import com.personal.aide.data.db.KnowledgeType
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.data.db.Ownership
import com.personal.aide.domain.knowledgeKey
import com.personal.aide.testing.Fixed
import com.personal.aide.testing.task
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import java.util.Locale

class ContextBlocksTest {
    private val zone = Fixed.zone
    private val today = Fixed.today
    private lateinit var localeBefore: Locale

    @Before
    fun useAKnownLocale() {
        localeBefore = Locale.getDefault()
        Locale.setDefault(Locale.US)
    }

    @After
    fun restoreLocale() {
        Locale.setDefault(localeBefore)
    }

    private fun entry(
        id: Long,
        title: String,
        content: String,
        type: KnowledgeType = KnowledgeType.FACT,
        updatedAt: Long = id,
        pinned: Boolean = false,
    ) = KnowledgeEntity(
        id = id,
        type = type,
        title = title,
        key = knowledgeKey(title),
        content = content,
        pinned = pinned,
        createdAt = 0,
        updatedAt = updatedAt,
    )

    /** What [ContextBlocks.pickKnowledge] charges an entry against the budget. */
    private fun cost(entry: KnowledgeEntity) = entry.title.length + entry.content.length + 16

    // -------------------------------------------------------------------------------------------
    // The knowledge base block

    @Test
    fun `an empty knowledge base says so`() {
        assertEquals("<knowledge_base>\nEmpty so far.\n</knowledge_base>", ContextBlocks.knowledge(emptyList(), "anything", 1_000, focusIsLongText = true))
    }

    @Test
    fun `a small knowledge base is sent whole`() {
        val entries = listOf(
            entry(1, "Dana Whitfield", "Engineering lead. Owns the quoting API.", KnowledgeType.PERSON),
            entry(2, "Atlas", "The data warehouse.\nMigrating in Q1.", KnowledgeType.PROJECT),
            entry(3, "QBR", "Quarterly business review.", KnowledgeType.TERM),
        )
        val block = ContextBlocks.knowledge(entries, "nothing in particular", 32_000, focusIsLongText = true)

        assertTrue(block.startsWith("<knowledge_base>\n"))
        assertTrue(block.endsWith("</knowledge_base>"))
        assertTrue(block.contains("- person: Dana Whitfield\n- project: Atlas\n- term: QBR\n"))
        assertTrue(block.contains("Full text of every entry:"))
        assertTrue(block.contains("### Dana Whitfield (person)\nEngineering lead. Owns the quoting API.\n"))
        assertTrue(block.contains("### Atlas (project)\nThe data warehouse.\nMigrating in Q1.\n"))
        assertTrue(block.contains("### QBR (term)\nQuarterly business review.\n"))
    }

    @Test
    fun `every title is listed even when the text of only some fits`() {
        val entries = (1L..6L).map { entry(it, "Topic$it", "x".repeat(100)) }
        val block = ContextBlocks.knowledge(entries, "", cost(entries[0]) * 2, focusIsLongText = true)

        for (entry in entries) assertTrue(block.contains("- fact: ${entry.title}\n"))
        assertTrue(block.contains("Full text of the entries that look relevant here:"))
        assertFalse(block.contains("Full text of every entry:"))
        assertEquals(2, Regex("^### ", RegexOption.MULTILINE).findAll(block).count())
    }

    @Test
    fun `with no room for any text only the titles go`() {
        val entries = listOf(entry(1, "Atlas", "The data warehouse."), entry(2, "QBR", "Quarterly business review."))
        val block = ContextBlocks.knowledge(entries, "atlas qbr", 0, focusIsLongText = true)

        assertTrue(block.contains("- fact: Atlas\n- fact: QBR\n"))
        assertFalse(block.contains("Full text"))
        assertFalse(block.contains("The data warehouse."))
        assertTrue(ContextBlocks.pickKnowledge(entries, "atlas qbr", 0, focusIsLongText = true).isEmpty())
    }

    @Test
    fun `entries the transcript names come first, then pinned ones, then the most recently updated`() {
        val entries = (1L..5L).map { entry(it, "Topic$it", "x".repeat(100), updatedAt = it * 100, pinned = it == 3L) }
        val one = cost(entries[0])
        val transcript = "so we spent most of the hour on topic2 and what to do next"

        assertEquals(listOf(2L), ContextBlocks.pickKnowledge(entries, transcript, one, focusIsLongText = true).map { it.id })
        assertEquals(listOf(2L, 3L), ContextBlocks.pickKnowledge(entries, transcript, one * 2, focusIsLongText = true).map { it.id })
        assertEquals(listOf(2L, 3L, 5L), ContextBlocks.pickKnowledge(entries, transcript, one * 3, focusIsLongText = true).map { it.id })
        assertEquals(listOf(2L, 3L, 5L, 4L), ContextBlocks.pickKnowledge(entries, transcript, one * 4, focusIsLongText = true).map { it.id })
        assertEquals(listOf(2L, 3L, 5L, 4L, 1L), ContextBlocks.pickKnowledge(entries, transcript, one * 5, focusIsLongText = true).map { it.id })
    }

    @Test
    fun `a budget one character short of an entry leaves it out`() {
        val entries = listOf(entry(1, "Atlas", "The data warehouse."))
        assertEquals(1, ContextBlocks.pickKnowledge(entries, "", cost(entries[0]), focusIsLongText = true).size)
        assertEquals(0, ContextBlocks.pickKnowledge(entries, "", cost(entries[0]) - 1, focusIsLongText = true).size)
    }

    @Test
    fun `an entry too big for what is left is skipped and smaller ones still go`() {
        val big = entry(1, "Handbook", "x".repeat(5_000), updatedAt = 900)
        val small = entry(2, "QBR", "Quarterly business review.", updatedAt = 800)
        val smaller = entry(3, "Atlas", "The data warehouse.", updatedAt = 700)
        val picked = ContextBlocks.pickKnowledge(listOf(big, small, smaller), "", 200, focusIsLongText = true)
        assertEquals(listOf(2L, 3L), picked.map { it.id })
    }

    @Test
    fun `what is picked never costs more than the budget and holds nothing twice`() {
        val entries = (1L..40L).map { entry(it, "Topic$it", "y".repeat((it * 37 % 400).toInt() + 1), updatedAt = it * 13 % 17, pinned = it % 7 == 0L) }
        val transcript = entries.filter { it.id % 5 == 0L }.joinToString(" ") { it.title }
        for (budget in listOf(0, 50, 500, 2_000, 5_000, 1_000_000)) {
            val picked = ContextBlocks.pickKnowledge(entries, transcript, budget, focusIsLongText = true)
            assertTrue("budget $budget", picked.sumOf { cost(it) } <= budget)
            assertEquals(picked.size, picked.map { it.id }.toSet().size)
        }
        assertEquals(40, ContextBlocks.pickKnowledge(entries, transcript, 1_000_000, focusIsLongText = true).size)
    }

    @Test
    fun `for a question the entries that answer it come first`() {
        val entries = listOf(
            entry(1, "Atlas", "The data warehouse, moving to the new cluster.", updatedAt = 900),
            entry(2, "Dana Whitfield", "Engineering lead. Owns the quoting API.", KnowledgeType.PERSON, updatedAt = 100),
            entry(3, "QBR", "Quarterly business review.", updatedAt = 800),
        )
        val picked = ContextBlocks.pickKnowledge(entries, "who owns the quoting api?", cost(entries[1]), focusIsLongText = false)
        assertEquals(listOf(2L), picked.map { it.id })

        // The same question read as a transcript names no entry, so recency decides instead.
        val asTranscript = ContextBlocks.pickKnowledge(entries, "who owns the quoting api?", cost(entries[0]), focusIsLongText = true)
        assertEquals(listOf(1L), asTranscript.map { it.id })
    }

    @Test
    fun `a very large knowledge base lists the first four hundred titles and counts the rest`() {
        val entries = (1L..405L).map { entry(it, "Topic$it", "note") }
        val block = ContextBlocks.knowledge(entries, "", 0, focusIsLongText = false)
        assertTrue(block.contains("- fact: Topic400\n"))
        assertFalse(block.contains("- fact: Topic401\n"))
        assertTrue(block.contains("- ...and 5 more\n"))
    }

    // -------------------------------------------------------------------------------------------
    // Task lines

    @Test
    fun `a task line carries everything needed to weigh it`() {
        val line = ContextBlocks.tasks(
            listOf(
                task(
                    7, title = "Send deck", owner = "Dana", ownership = Ownership.OTHERS, due = today - 2, planned = today + 1, priority = 2,
                    createdAt = Fixed.at(today - 3, 9), meetingId = 4, details = "  Version 3 with the new tiers ",
                ),
            ),
            today,
            mapOf(4L to "Pricing review"),
            zone,
        )
        assertEquals(
            "- [id 7] Send deck (owner: Dana) | due 2026-11-16 (2 days late) | planned for 2026-11-19 | high priority | added 3 days ago | from \"Pricing review\" | Version 3 with the new tiers",
            line,
        )
    }

    @Test
    fun `task lines say today, a future date, or no date`() {
        val lines = ContextBlocks.tasks(
            listOf(
                task(8, title = "Book venue", due = today, createdAt = Fixed.at(today, 8)),
                task(9, title = "Tidy backlog", priority = 0, createdAt = Fixed.at(today - 40, 8)),
                task(10, title = "Draft FAQ", due = today + 2, createdAt = Fixed.at(today - 1, 23, 30)),
            ),
            today,
            emptyMap(),
            zone,
        ).lines()
        assertEquals(
            listOf(
                "- [id 8] Book venue | due 2026-11-18 (today) | normal priority | added 0 days ago",
                "- [id 9] Tidy backlog | no due date | low priority | added 40 days ago",
                "- [id 10] Draft FAQ | due 2026-11-20 | normal priority | added 1 days ago",
            ),
            lines,
        )
    }

    @Test
    fun `task lines survive odd data`() {
        val lines = ContextBlocks.tasks(
            listOf(
                // Created "tomorrow" (a clock that was wrong), from a meeting that has since been deleted.
                task(11, title = "Call Marcus", createdAt = Fixed.at(today + 1, 9), meetingId = 99),
                task(12, title = "Long one", details = "d".repeat(400)),
            ),
            today,
            mapOf(4L to "Pricing review"),
            zone,
        ).lines()
        assertEquals("- [id 11] Call Marcus | no due date | normal priority | added 0 days ago", lines[0])
        assertTrue(lines[1].endsWith(" | " + "d".repeat(160)))
        assertEquals(2, lines.size)
    }

    @Test
    fun `no tasks`() {
        assertEquals("None.", ContextBlocks.tasks(emptyList(), today, emptyMap(), zone))
    }

    // -------------------------------------------------------------------------------------------
    // The calendar

    @Test
    fun `no events`() {
        assertEquals("Nothing on the calendar (or the calendar isn't connected).", ContextBlocks.calendar(emptyList(), zone))
    }

    @Test
    fun `calendar lines give the weekday, the times and who is there`() {
        val events = listOf(
            CalendarEvent(1, "Roadmap sync", Fixed.at(today, 9, 30), Fixed.at(today, 10, 0), attendees = listOf("Dana", "Marcus")),
            CalendarEvent(2, "Company holiday", Fixed.at(today + 2, 0, 0), Fixed.at(today + 3, 0, 0), allDay = true),
            CalendarEvent(3, "Quoting standup", Fixed.at(today + 1, 14, 0), Fixed.at(today + 1, 14, 15)),
        )
        assertEquals(
            listOf(
                "- Wednesday 9:30 AM–10:00 AM: Roadmap sync (with Dana, Marcus)",
                "- Friday all day: Company holiday",
                "- Thursday 2:00 PM–2:15 PM: Quoting standup",
            ),
            ContextBlocks.calendar(events, zone).lines(),
        )
    }

    @Test
    fun `a crowded meeting names its first eight people`() {
        val people = (1..12).map { "Person$it" }
        val line = ContextBlocks.calendar(listOf(CalendarEvent(1, "All hands", Fixed.at(today, 16), Fixed.at(today, 17), attendees = people)), zone)
        assertTrue(line.contains("(with " + people.take(8).joinToString(", ") + ")"))
        assertFalse(line.contains("Person9"))
    }

    // -------------------------------------------------------------------------------------------
    // Meetings

    private val analysis = MeetingAnalysis(
        title = "Pricing review",
        tldr = "Agreed three tiers.",
        keyPoints = listOf("Three tiers", "Enterprise stays custom"),
        decisions = listOf("Ship in Q1"),
        actionItems = listOf(
            ActionItem(title = "Send deck", owner = "Dana", ownership = "others", dueDate = "2026-11-20"),
            ActionItem(title = "Draft FAQ", ownership = "mine"),
            ActionItem(title = "Book room", ownership = "unclear"),
        ),
        openQuestions = listOf("Who signs off?"),
        risks = listOf("Legal review"),
    )

    private val meeting = MeetingEntity(
        id = 4,
        title = "Pricing review",
        titleIsAuto = false,
        startedAt = Fixed.at(Fixed.monday, 10),
        endedAt = Fixed.at(Fixed.monday, 11),
        status = MeetingStatus.READY,
        attendees = listOf("Dana", "Marcus"),
        tldr = "Agreed three tiers.",
        analysisJson = AideJson.encodeToString(MeetingAnalysis.serializer(), analysis),
    )

    @Test
    fun `a meeting line is its date, name and summary`() {
        assertEquals("- 2026-11-16 \"Pricing review\": Agreed three tiers.", ContextBlocks.meetingLine(meeting, zone))
        assertEquals("- 2026-11-16 \"Pricing review\": (not summarized)", ContextBlocks.meetingLine(meeting.copy(tldr = " "), zone))
    }

    @Test
    fun `a meeting's date is the date where the user is`() {
        // 9 in the evening in New York is already the next day in UTC.
        val late = meeting.copy(startedAt = Fixed.at(Fixed.monday, 21))
        assertTrue(ContextBlocks.meetingLine(late, zone).startsWith("- 2026-11-16 "))
        assertTrue(ContextBlocks.meetingNotes(late, zone).startsWith("## \"Pricing review\" on Monday, 16 November 2026\n"))
    }

    @Test
    fun `meeting notes lay out the saved summary`() {
        assertEquals(
            """
            ## "Pricing review" on Monday, 16 November 2026
            With: Dana, Marcus
            Agreed three tiers.
            Key points:
            - Three tiers
            - Enterprise stays custom
            Decisions:
            - Ship in Q1
            Action items:
            - Send deck (Dana, due 2026-11-20)
            - Draft FAQ (the user)
            - Book room (unassigned)
            Open questions:
            - Who signs off?
            Risks:
            - Legal review
            """.trimIndent(),
            ContextBlocks.meetingNotes(meeting, zone),
        )
    }

    @Test
    fun `meeting notes for a meeting never summarized are just its heading`() {
        val bare = meeting.copy(attendees = emptyList(), tldr = "", analysisJson = "")
        assertEquals("## \"Pricing review\" on Monday, 16 November 2026", ContextBlocks.meetingNotes(bare, zone))
    }

    @Test
    fun `empty sections are left out of meeting notes`() {
        val thin = meeting.copy(analysisJson = AideJson.encodeToString(MeetingAnalysis.serializer(), MeetingAnalysis(decisions = listOf("Ship in Q1"))))
        val notes = ContextBlocks.meetingNotes(thin, zone)
        assertTrue(notes.contains("Decisions:\n- Ship in Q1"))
        for (heading in listOf("Key points:", "Action items:", "Open questions:", "Risks:")) assertFalse(notes.contains(heading))
    }

    @Test
    fun `a stored analysis is read back, and a damaged one is no analysis`() {
        assertEquals(analysis, ContextBlocks.analysisOf(meeting))
        assertNull(ContextBlocks.analysisOf(meeting.copy(analysisJson = "")))
        assertNull(ContextBlocks.analysisOf(meeting.copy(analysisJson = "   ")))
        assertNull(ContextBlocks.analysisOf(meeting.copy(analysisJson = "not json at all")))
        assertNull(ContextBlocks.analysisOf(meeting.copy(analysisJson = "[1,2,3]")))
        assertNotNull(ContextBlocks.analysisOf(meeting.copy(analysisJson = "{}")))
    }
}
