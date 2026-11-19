package com.personal.aide.domain

import com.personal.aide.data.db.KnowledgeEntity
import com.personal.aide.data.db.KnowledgeType
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingSource
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.data.db.TaskStatus
import com.personal.aide.testing.Fixed
import com.personal.aide.testing.task
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class PeopleTest {
    private val today = Fixed.today

    private fun List<TaskEntity>.ids() = map { it.id }

    // -------------------------------------------------------------------------------------------
    // Who a name means

    @Test
    fun `the same name typed differently is the same person`() {
        assertTrue(People.same("Dana Whitfield", "dana whitfield"))
        assertTrue(People.same("Dana Whitfield", "  DANA   WHITFIELD "))
        assertTrue(People.same("Dana Whitfield", "Dana Whitfield."))
        assertTrue("accents are folded away", People.same("Zoë Müller", "Zoe Muller"))
        assertTrue(People.same("Dana", "dana"))
    }

    @Test
    fun `a first name on its own means the one person who has it`() {
        val everyone = listOf("Dana Whitfield", "Marcus Lee", "Priya Nair")
        assertTrue(People.same("Dana Whitfield", "Dana", everyone))
        assertTrue("whichever way round the two are given", People.same("Dana", "Dana Whitfield", everyone))
        assertTrue(People.same("Dana Whitfield", "dana", everyone))
        assertTrue("and when nobody is known at all", People.same("Dana Whitfield", "Dana"))
    }

    @Test
    fun `Dan is not Dana`() {
        val everyone = listOf("Dana Whitfield", "Dan Brown")
        assertFalse(People.same("Dana Whitfield", "Dan", everyone))
        assertFalse(People.same("Dan", "Dana Whitfield", everyone))
        assertFalse(People.same("Dan Brown", "Dana", everyone))
        assertFalse(People.same("Dan", "Dana"))
        assertFalse(People.same("Dana", "Dan"))
        assertFalse(People.same("Dana Whitfield", "Dan Whitfield"))
        assertTrue("each still answers to their own first name", People.same("Dan Brown", "Dan", everyone))
        assertTrue(People.same("Dana Whitfield", "Dana", everyone))
    }

    @Test
    fun `a bare first name matches nobody when two known people share it`() {
        val everyone = listOf("Chris Evans", "Chris Park", "Dana Whitfield")
        assertFalse(People.same("Chris Evans", "Chris", everyone))
        assertFalse(People.same("Chris Park", "Chris", everyone))
        assertFalse(People.same("Chris", "Chris Evans", everyone))
        assertTrue("a full name is never ambiguous", People.same("Chris Evans", "chris evans", everyone))
        assertTrue("someone whose first name is their own is unaffected", People.same("Dana Whitfield", "Dana", everyone))
    }

    @Test
    fun `one Chris is never another`() {
        assertFalse(People.same("Chris Evans", "Chris Park"))
        assertFalse(People.same("Chris Evans", "Chris Park", listOf("Chris Evans")))
        assertFalse(People.same("Chris Evans", "Chris Park", listOf("Chris Evans", "Chris Park")))
    }

    @Test
    fun `a bare first name is not taken for someone when it belongs to somebody else the app knows`() {
        // The app knows one Chris, and it isn't this one: "Chris" on its own can't safely mean Chris Evans.
        val everyone = listOf("Chris Park", "Dana Whitfield")
        assertFalse("\"Chris\" was taken for Chris Evans although the only Chris the app knows is Chris Park", People.same("Chris Evans", "Chris", everyone))
        assertFalse("the same, with the two names the other way round", People.same("Chris", "Chris Evans", everyone))
    }

    @Test
    fun `the same person listed twice does not make their first name ambiguous`() {
        val everyone = listOf("Dana Whitfield", "dana whitfield", "DANA WHITFIELD.")
        assertTrue(People.same("Dana Whitfield", "Dana", everyone))
    }

    @Test
    fun `a surname on its own is not enough`() {
        assertFalse(People.same("Dana Whitfield", "Whitfield"))
        assertFalse(People.same("Whitfield", "Dana Whitfield"))
        assertFalse(People.same("Mary Jane Watson", "Watson"))
        assertTrue("the first name of a longer name still is", People.same("Mary Jane Watson", "Mary"))
    }

    @Test
    fun `a hyphenated first name on its own still means the one person who has it`() {
        val everyone = listOf("Anne-Marie Dupont", "Wei-Ling Chen", "Marcus Lee")
        assertTrue("\"Anne-Marie\" was not recognised as Anne-Marie Dupont", People.same("Anne-Marie Dupont", "Anne-Marie", everyone))
        assertTrue("\"wei-ling\" was not recognised as Wei-Ling Chen", People.same("Wei-Ling Chen", "wei-ling", everyone))
        assertFalse(People.same("Anne-Marie Dupont", "Wei-Ling", everyone))
    }

    @Test
    fun `no name is nobody`() {
        assertFalse(People.same("", "Dana"))
        assertFalse(People.same("Dana", "   "))
        assertFalse(People.same("", ""))
        assertFalse("punctuation alone is no name", People.same("—", "?"))
    }

    // -------------------------------------------------------------------------------------------
    // Finding a name in a sentence

    @Test
    fun `a full name in the text is a mention whatever its case or the punctuation around it`() {
        assertTrue(People.mentioned("Send the deck to Dana Whitfield by Friday", "Dana Whitfield"))
        assertTrue(People.mentioned("dana whitfield's deck", "Dana Whitfield"))
        assertTrue(People.mentioned("(cc: DANA WHITFIELD)", "dana whitfield"))
        assertTrue(People.mentioned("Dana Whitfield", "Dana Whitfield"))
    }

    @Test
    fun `a first name is a mention when only one known person has it`() {
        val everyone = listOf("Dana Whitfield", "Marcus Lee")
        assertTrue(People.mentioned("Ask Dana about the rate feed", "Dana Whitfield", everyone))
        assertTrue(People.mentioned("ask dana, then marcus", "Marcus Lee", everyone))
        assertTrue(People.mentioned("Ask Dana about the rate feed", "Dana Whitfield"))
        assertFalse(People.mentioned("Ask Priya about the rate feed", "Dana Whitfield", everyone))
    }

    @Test
    fun `a first name shared by two known people is a mention of neither, but a full name still is`() {
        val everyone = listOf("Chris Evans", "Chris Park")
        assertFalse(People.mentioned("Ask Chris about the rate feed", "Chris Evans", everyone))
        assertFalse(People.mentioned("Ask Chris about the rate feed", "Chris Park", everyone))
        assertTrue(People.mentioned("Ask Chris Park about the rate feed", "Chris Park", everyone))
        assertFalse(People.mentioned("Ask Chris Park about the rate feed", "Chris Evans", everyone))
    }

    @Test
    fun `a first name in a sentence is not taken for someone when another known person has it`() {
        assertFalse(
            "\"Ask Chris\" was read as naming Chris Evans although the only Chris the app knows is Chris Park",
            People.mentioned("Ask Chris about the rate feed", "Chris Evans", listOf("Chris Park")),
        )
    }

    @Test
    fun `a name inside a longer word is not a mention`() {
        assertFalse(People.mentioned("Dan will send it", "Dana Whitfield"))
        assertFalse(People.mentioned("Ask Dana", "Dan Brown"))
        assertFalse(People.mentioned("Danas notes", "Dana"))
        assertFalse(People.mentioned("The Whitfields are away", "Dana Whitfield"))
    }

    @Test
    fun `a very short first name that is also an everyday word is not a mention on its own`() {
        assertFalse(People.mentioned("Send an update to the team", "An Nguyen"))
        assertFalse(People.mentioned("Al fresco lunch on Friday", "Al Green"))
        assertTrue("the full name still is", People.mentioned("Ask An Nguyen for the numbers", "An Nguyen"))
    }

    @Test
    fun `someone known by one name is found by that name as a whole word`() {
        assertTrue(People.mentioned("Dana's deck", "Dana"))
        assertTrue(People.mentioned("deck (dana)", "Dana"))
        assertFalse(People.mentioned("Dan's deck", "Dana"))
    }

    @Test
    fun `nothing is mentioned in an empty text and no name is never mentioned`() {
        assertFalse(People.mentioned("", "Dana Whitfield"))
        assertFalse(People.mentioned("   ", "Dana"))
        assertFalse(People.mentioned("Ask Dana", ""))
        assertFalse(People.mentioned("Ask Dana", "  "))
        assertFalse("a text shorter than the name", People.mentioned("Whitfield", "Dana Whitfield"))
    }

    // -------------------------------------------------------------------------------------------
    // Leaving the user out

    @Test
    fun `the user is taken out of a list of names however the calendar spells them`() {
        val invited = listOf("Dana Whitfield", "Sam Rivera", "Marcus Lee", "sam rivera", "SAM RIVERA.")
        assertEquals(listOf("Dana Whitfield", "Marcus Lee"), People.others(invited, "Sam Rivera"))
    }

    @Test
    fun `the user's first name on its own is them too`() {
        assertEquals(listOf("Dana"), People.others(listOf("Sam", "Dana"), "Sam Rivera"))
        assertEquals("a profile with only a first name", listOf("Dana"), People.others(listOf("Sam Rivera", "Dana"), "Sam"))
    }

    @Test
    fun `someone else who shares the user's first name stays`() {
        assertEquals(listOf("Sam Carter", "Samantha Rivera"), People.others(listOf("Sam Carter", "Sam Rivera", "Samantha Rivera"), "Sam Rivera"))
    }

    @Test
    fun `with no name for the user the list is left as it is`() {
        val invited = listOf("Dana Whitfield", "Sam Rivera")
        assertEquals(invited, People.others(invited, ""))
        assertEquals(invited, People.others(invited, "   "))
        assertEquals(emptyList<String>(), People.others(emptyList(), "Sam Rivera"))
    }

    // -------------------------------------------------------------------------------------------
    // A person's page

    private fun person(id: Long, name: String, content: String = "About $name.", type: KnowledgeType = KnowledgeType.PERSON) =
        KnowledgeEntity(id = id, type = type, title = name, key = knowledgeKey(name), content = content, createdAt = 1, updatedAt = 1)

    private fun meeting(
        id: Long,
        title: String,
        day: Long,
        attendees: List<String> = emptyList(),
        status: MeetingStatus = MeetingStatus.READY,
    ) = MeetingEntity(
        id = id,
        title = title,
        titleIsAuto = false,
        startedAt = Fixed.at(day, 10),
        endedAt = Fixed.at(day, 10, 30),
        status = status,
        attendees = attendees,
    )

    private fun owed(id: Long, owner: String, due: Long? = null, status: TaskStatus = TaskStatus.OPEN) =
        task(id, ownership = Ownership.OTHERS, owner = owner, due = due, status = status)

    private val dana = person(11, "Dana Whitfield", "Engineering lead. Owns the quoting API.")
    private val marcus = person(12, "Marcus Lee")

    @Test
    fun `a person's page gathers their entry, what they owe, what is open with them and their meetings`() {
        val view = buildPersonView(
            name = "Dana Whitfield",
            entries = listOf(dana, marcus, person(13, "Atlas", type = KnowledgeType.PROJECT)),
            tasks = listOf(
                owed(1, "Dana Whitfield"),
                owed(2, "Marcus Lee"),
                task(3, title = "Review Dana Whitfield's design doc"),
                task(4, title = "Book the offsite venue"),
            ),
            meetings = listOf(
                meeting(21, "Pricing review", today - 7, attendees = listOf("Dana Whitfield", "Marcus Lee")),
                meeting(22, "Hiring sync", today - 3, attendees = listOf("Marcus Lee")),
            ),
        )

        assertEquals("Dana Whitfield", view.name)
        assertEquals(dana, view.entry)
        assertEquals(listOf(1L), view.theyOwe.ids())
        assertEquals(listOf(3L), view.openWithThem.ids())
        assertEquals(listOf(21L), view.meetings.map { it.id })
        assertEquals(Fixed.at(today - 7, 10), view.lastMet)
    }

    @Test
    fun `the page is found by a first name and takes the spelling the entry has`() {
        val view = buildPersonView("dana", listOf(dana, marcus), listOf(owed(1, "Dana"), owed(2, "dana whitfield")), emptyList())

        assertEquals("Dana Whitfield", view.name)
        assertEquals(dana, view.entry)
        assertEquals(setOf(1L, 2L), view.theyOwe.ids().toSet())
    }

    @Test
    fun `an exact entry is preferred to one that only shares the first name`() {
        val justDana = person(14, "Dana")
        val view = buildPersonView("Dana", listOf(dana, justDana), emptyList(), emptyList())
        assertEquals(justDana, view.entry)
    }

    @Test
    fun `two people who share a first name each keep their own page`() {
        val evans = person(31, "Chris Evans")
        val park = person(32, "Chris Park")
        val tasks = listOf(
            owed(1, "Chris Evans"),
            owed(2, "Chris Park"),
            owed(3, "Chris"),
            task(4, title = "Send Chris Park the contract"),
            task(5, title = "Reply to Chris"),
        )
        val meetings = listOf(
            meeting(21, "Vendor call", today - 5, attendees = listOf("Chris Evans")),
            meeting(22, "Legal review", today - 4, attendees = listOf("Chris Park")),
            meeting(23, "Catch-up", today - 3, attendees = listOf("Chris")),
        )

        val view = buildPersonView("Chris Evans", listOf(evans, park), tasks, meetings)

        assertEquals(evans, view.entry)
        assertEquals("a bare Chris could be either, so it is neither's", listOf(1L), view.theyOwe.ids())
        assertTrue("nor is a task that names the other Chris, or just a Chris", view.openWithThem.isEmpty())
        assertEquals(listOf(21L), view.meetings.map { it.id })
    }

    @Test
    fun `an ambiguous first name finds no entry and claims nobody's work`() {
        val view = buildPersonView("Chris", listOf(person(31, "Chris Evans"), person(32, "Chris Park")), listOf(owed(1, "Chris Evans"), owed(2, "Chris Park")), emptyList())

        assertNull(view.entry)
        assertEquals("Chris", view.name)
        assertTrue(view.theyOwe.isEmpty())
    }

    @Test
    fun `an entry of another kind with the same name is not the person`() {
        val view = buildPersonView("Atlas", listOf(person(13, "Atlas", type = KnowledgeType.PROJECT)), emptyList(), emptyList())
        assertNull(view.entry)
    }

    @Test
    fun `only open tasks are on the page, soonest due first and undated last`() {
        val view = buildPersonView(
            "Dana Whitfield",
            listOf(dana),
            listOf(
                owed(1, "Dana Whitfield"),
                owed(2, "Dana Whitfield", due = today + 5),
                owed(3, "Dana Whitfield", due = today - 2),
                owed(4, "Dana Whitfield", due = today, status = TaskStatus.DONE),
                owed(5, "Dana Whitfield", due = today, status = TaskStatus.DISMISSED),
                task(6, title = "Ask Dana about the feed"),
                task(7, title = "Send Dana the forecast", due = today + 1),
                task(8, title = "Thank Dana", status = TaskStatus.DONE),
                task(9, title = "Whose is this, Dana?", ownership = Ownership.UNCLEAR),
            ),
            emptyList(),
        )

        assertEquals(listOf(3L, 2L, 1L), view.theyOwe.ids())
        assertEquals(listOf(7L, 6L), view.openWithThem.ids())
    }

    @Test
    fun `a task of the user's is with them when it names them in its title, details or evidence`() {
        val view = buildPersonView(
            "Dana Whitfield",
            listOf(dana, marcus),
            listOf(
                task(1, title = "Send Dana the forecast"),
                task(2, title = "Send the forecast", details = "Dana Whitfield needs it for the board pack"),
                task(3, title = "Fix the rate table").copy(evidence = "Dana asked Sam to fix it"),
                task(4, title = "Send Marcus the forecast"),
                task(5, title = "Tidy the backlog"),
            ),
            emptyList(),
        )
        assertEquals(setOf(1L, 2L, 3L), view.openWithThem.ids().toSet())
    }

    @Test
    fun `whatever the user took on in a one-to-one with them is between the two of them`() {
        val oneToOne = meeting(21, "Weekly catch-up", today - 2, attendees = listOf("Dana Whitfield"))
        val group = meeting(22, "Pricing review", today - 1, attendees = listOf("Dana Whitfield", "Marcus Lee"))
        val view = buildPersonView(
            "Dana Whitfield",
            listOf(dana, marcus),
            listOf(
                task(1, title = "Book the offsite venue", meetingId = 21),
                task(2, title = "Draft the pricing FAQ", meetingId = 22),
                owed(3, "Marcus Lee").copy(meetingId = 21),
                task(4, title = "Nobody's yet", ownership = Ownership.UNCLEAR, meetingId = 21),
            ),
            listOf(oneToOne, group),
        )

        assertEquals("a task from a meeting with other people in it has to name them to count", listOf(1L), view.openWithThem.ids())
        assertTrue(view.theyOwe.isEmpty())
    }

    @Test
    fun `their meetings are the ones they attended or that are named for them, newest first`() {
        val view = buildPersonView(
            "Dana Whitfield",
            listOf(dana, marcus),
            emptyList(),
            listOf(
                meeting(21, "Pricing review", today - 9, attendees = listOf("Marcus Lee", "dana whitfield")),
                meeting(22, "1:1 with Dana", today - 2),
                meeting(23, "Roadmap sync", today - 5, attendees = listOf("Dana")),
                meeting(24, "Hiring sync", today - 1, attendees = listOf("Marcus Lee")),
                meeting(25, "Dan's leaving do", today - 1, attendees = listOf("Dan Brown")),
            ),
        )

        assertEquals(listOf(22L, 23L, 21L), view.meetings.map { it.id })
        assertEquals(Fixed.at(today - 2, 10), view.lastMet)
    }

    @Test
    fun `a meeting still being recorded or that never produced a transcript is not one they were in yet`() {
        val view = buildPersonView(
            "Dana Whitfield",
            listOf(dana),
            emptyList(),
            listOf(
                meeting(21, "Summarized", today - 5, attendees = listOf("Dana Whitfield"), status = MeetingStatus.READY),
                meeting(22, "Transcribed", today - 4, attendees = listOf("Dana Whitfield"), status = MeetingStatus.TRANSCRIBED),
                meeting(23, "Recording", today, attendees = listOf("Dana Whitfield"), status = MeetingStatus.RECORDING),
                meeting(24, "Processing", today - 1, attendees = listOf("Dana Whitfield"), status = MeetingStatus.PROCESSING),
                meeting(25, "Failed", today - 2, attendees = listOf("Dana Whitfield"), status = MeetingStatus.FAILED),
            ),
        )
        assertEquals(listOf(22L, 21L), view.meetings.map { it.id })
    }

    @Test
    fun `a document that names them is not a meeting with them`() {
        val handbook = meeting(31, "Dana Whitfield's onboarding brief", today - 1).copy(source = MeetingSource.DOCUMENT)
        val unread = meeting(32, "Notes on Dana Whitfield", today - 2, status = MeetingStatus.TRANSCRIBED).copy(source = MeetingSource.DOCUMENT)
        // Should a document ever carry a list of people, that is still not them attending it.
        val listed = meeting(33, "Org chart", today - 3, attendees = listOf("Dana Whitfield")).copy(source = MeetingSource.DOCUMENT)
        val held = meeting(21, "Pricing review", today - 9, attendees = listOf("Dana Whitfield", "Marcus Lee"))

        val view = buildPersonView("Dana Whitfield", listOf(dana, marcus), emptyList(), listOf(handbook, unread, listed, held))

        assertEquals(listOf(21L), view.meetings.map { it.id })
        assertEquals("they were last met at the meeting, not when the document was added", Fixed.at(today - 9, 10), view.lastMet)

        val onlyDocuments = buildPersonView("Dana Whitfield", listOf(dana), emptyList(), listOf(handbook, unread, listed))
        assertTrue(onlyDocuments.meetings.isEmpty())
        assertNull(onlyDocuments.lastMet)
    }

    @Test
    fun `what a document lists for the user to do is not taken for something agreed with them one to one`() {
        val listed = meeting(33, "Onboarding checklist", today - 3, attendees = listOf("Dana Whitfield")).copy(source = MeetingSource.DOCUMENT)
        val view = buildPersonView(
            "Dana Whitfield",
            listOf(dana),
            listOf(task(1, title = "Order a laptop", meetingId = 33), task(2, title = "Ask Dana Whitfield for API access", meetingId = 33)),
            listOf(listed),
        )

        assertEquals("only the task that names them is with them", listOf(2L), view.openWithThem.ids())
    }

    @Test
    fun `notes the user typed up from a meeting with them still count as that meeting`() {
        val typed = meeting(41, "1:1 with Dana", today - 2).copy(source = MeetingSource.IMPORT)
        val view = buildPersonView("Dana Whitfield", listOf(dana), emptyList(), listOf(typed))
        assertEquals(listOf(41L), view.meetings.map { it.id })
    }

    @Test
    fun `Dan's tasks and meetings do not land on Dana's page`() {
        val view = buildPersonView(
            "Dana Whitfield",
            listOf(dana, person(15, "Dan Brown")),
            listOf(owed(1, "Dan"), owed(2, "Dan Brown"), task(3, title = "Ask Dan about the feed")),
            listOf(meeting(21, "Dan / Sam", today - 1, attendees = listOf("Dan Brown"))),
        )

        assertTrue(view.theyOwe.isEmpty())
        assertTrue(view.openWithThem.isEmpty())
        assertTrue(view.meetings.isEmpty())
        assertNull(view.lastMet)
    }

    @Test
    fun `someone the app has nothing on still gets a page, an empty one`() {
        val view = buildPersonView("  Priya Nair ", listOf(dana), listOf(owed(1, "Dana Whitfield")), emptyList())

        assertEquals("Priya Nair", view.name)
        assertNull(view.entry)
        assertTrue(view.theyOwe.isEmpty())
        assertTrue(view.openWithThem.isEmpty())
        assertTrue(view.meetings.isEmpty())
        assertNull(view.lastMet)
    }

    @Test
    fun `a person with an entry is numbered by it, and one without by their name`() {
        assertEquals(11L, buildPersonView("Dana", listOf(dana), emptyList(), emptyList()).number)

        val priya = buildPersonView("Priya Nair", emptyList(), emptyList(), emptyList()).number
        assertEquals("however the name is typed", priya, buildPersonView("  priya   NAIR ", emptyList(), emptyList(), emptyList()).number)
        assertNotEquals(priya, buildPersonView("Marcus Lee", emptyList(), emptyList(), emptyList()).number)
        assertFalse("a number made from a name must not look like an entry's id", priya in 0L..1_000_000_000L)
    }
}
