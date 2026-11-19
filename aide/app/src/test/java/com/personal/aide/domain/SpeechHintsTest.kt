package com.personal.aide.domain

import com.personal.aide.data.WorkProfile
import com.personal.aide.data.db.KnowledgeEntity
import com.personal.aide.data.db.KnowledgeType
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class SpeechHintsTest {
    private val nobody = WorkProfile()

    private fun entry(id: Long, type: KnowledgeType, title: String) =
        KnowledgeEntity(id = id, type = type, title = title, key = knowledgeKey(title), content = "About $title.", createdAt = 1, updatedAt = 1)

    private fun hints(
        attendees: List<String> = emptyList(),
        profile: WorkProfile = nobody,
        entries: List<KnowledgeEntity> = emptyList(),
        limit: Int = 100,
    ) = speechHints(attendees, profile, entries, limit)

    // -------------------------------------------------------------------------------------------
    // Where the words come from, and in what order

    @Test
    fun `with nothing known there is nothing to listen out for`() {
        assertEquals(emptyList<String>(), hints())
    }

    @Test
    fun `the people in the meeting come first, then the profile, then the knowledge base`() {
        val profile = WorkProfile(
            name = "Sam Rivera",
            role = "Senior Product Manager",
            company = "Northwind Logistics",
            manager = "Priya Nair",
            stakeholders = listOf("Dana Whitfield", "Marcus Lee"),
            projects = listOf("RateStream", "Atlas"),
            tools = listOf("Jira", "Looker"),
        )
        val entries = listOf(
            entry(1, KnowledgeType.TERM, "QBR"),
            entry(2, KnowledgeType.PERSON, "Tomasz Kowalczyk"),
            entry(3, KnowledgeType.ORG, "Halvorsen Freight"),
            entry(4, KnowledgeType.PROJECT, "Self-serve quoting"),
        )

        assertEquals(
            listOf(
                "Aoife Byrne", "Wei Zhang",
                "Sam Rivera", "Priya Nair", "Northwind Logistics",
                "Dana Whitfield", "Marcus Lee",
                "RateStream", "Atlas",
                "Jira", "Looker",
                "QBR", "Tomasz Kowalczyk", "Halvorsen Freight", "Self-serve quoting",
            ),
            hints(listOf("Aoife Byrne", "Wei Zhang"), profile, entries),
        )
    }

    @Test
    fun `only the parts of the profile that are said aloud are used`() {
        val profile = WorkProfile(
            name = "Sam Rivera",
            role = "Senior Product Manager",
            industry = "Freight",
            department = "Product",
            team = "Quoting",
            seniority = "Senior",
            workingHours = "Nine to five",
            workingStyle = "Brief",
            responsibilities = listOf("Pricing"),
            goals = listOf("Launch quoting"),
            recurringMeetings = listOf("Standup"),
            successMeasures = listOf("Revenue"),
            challenges = listOf("Hiring"),
            notes = listOf("Vegetarian"),
        )
        assertEquals(listOf("Sam Rivera"), hints(profile = profile))
    }

    @Test
    fun `only the kinds of entry that are names or terms are used, in the order given`() {
        val entries = listOf(
            entry(1, KnowledgeType.DECISION, "Three tiers"),
            entry(2, KnowledgeType.TERM, "RateStream"),
            entry(3, KnowledgeType.PROCESS, "Discount approval"),
            entry(4, KnowledgeType.PERSON, "Dana Whitfield"),
            entry(5, KnowledgeType.FACT, "Fiscal year"),
            entry(6, KnowledgeType.ORG, "Halvorsen"),
            entry(7, KnowledgeType.PROJECT, "Atlas"),
        )
        assertEquals(listOf("RateStream", "Dana Whitfield", "Halvorsen", "Atlas"), hints(entries = entries))
    }

    // -------------------------------------------------------------------------------------------
    // The same thing twice

    @Test
    fun `the same name is listed once, whatever its capitals and wherever it came from`() {
        val profile = WorkProfile(name = "sam rivera", manager = "PRIYA NAIR", stakeholders = listOf("Dana Whitfield", "dana whitfield", "Priya Nair"))
        val entries = listOf(entry(1, KnowledgeType.PERSON, "Dana WHITFIELD"), entry(2, KnowledgeType.PERSON, "Sam Rivera"))

        assertEquals(
            "the first spelling met is the one kept",
            listOf("Priya Nair", "sam rivera", "Dana Whitfield"),
            hints(listOf("Priya Nair", "priya nair"), profile, entries),
        )
    }

    @Test
    fun `a name with a note and the bare name are one name`() {
        val profile = WorkProfile(stakeholders = listOf("Priya Nair — VP Product", "Dana Whitfield (engineering lead)"))
        assertEquals(listOf("Priya Nair", "Dana Whitfield"), hints(listOf("Priya Nair"), profile, listOf(entry(1, KnowledgeType.PERSON, "Dana Whitfield"))))
    }

    @Test
    fun `spaces around a name do not make it a different name`() {
        assertEquals(listOf("Priya Nair"), hints(listOf("  Priya Nair ", "Priya Nair\t")))
    }

    // -------------------------------------------------------------------------------------------
    // Names with notes attached

    @Test
    fun `a note after a dash, a comma, a bracket or a colon is trimmed off the name`() {
        val profile = WorkProfile(
            manager = "Priya Nair — VP Product",
            stakeholders = listOf(
                "Dana Whitfield - engineering lead",
                "Marcus Lee (Sales, joined in May)",
                "Tomasz Kowalczyk, finance",
                "Aoife Byrne: legal",
            ),
            projects = listOf("RateStream — the pricing engine"),
        )
        assertEquals(
            listOf("Priya Nair", "Dana Whitfield", "Marcus Lee", "Tomasz Kowalczyk", "Aoife Byrne", "RateStream"),
            hints(profile = profile),
        )
    }

    @Test
    fun `a note after an en dash is trimmed off like any other dash`() {
        // The dash a phone keyboard or a word processor makes of " - ".
        assertEquals(listOf("Priya Nair"), hints(listOf("Priya Nair – VP Product")))
    }

    @Test
    fun `a hyphen inside a name is part of the name`() {
        assertEquals(
            listOf("Anne-Marie Dubois", "Jean-Luc", "Self-serve quoting", "O'Brien"),
            hints(listOf("Anne-Marie Dubois", "Jean-Luc", "Self-serve quoting", "O'Brien")),
        )
    }

    // -------------------------------------------------------------------------------------------
    // What isn't worth listening for

    @Test
    fun `blanks, single letters, bare numbers and whole sentences are left out`() {
        val long = "The quarterly business review with the regional leads"
        assertTrue(long.length > 40)
        val heard = hints(
            listOf("", "   ", "X", "2026", "42", "—", "(TBC)", long, "Q4", "Ng"),
            WorkProfile(name = "", manager = " ", company = ""),
        )
        assertEquals(listOf("Q4", "Ng"), heard)
    }

    @Test
    fun `a name of forty characters is kept and one of forty-one is not`() {
        val forty = "A".repeat(40)
        assertEquals(listOf(forty), hints(listOf(forty, "B".repeat(41))))
    }

    @Test
    fun `a long entry is judged by the name left once its note is trimmed off`() {
        assertEquals(listOf("Priya Nair"), hints(listOf("Priya Nair — VP Product, runs the quarterly business review")))
    }

    // -------------------------------------------------------------------------------------------
    // The limit

    @Test
    fun `no more than the limit are returned, and the people in the meeting are the last to be cut`() {
        val profile = WorkProfile(name = "Sam Rivera", manager = "Priya Nair", projects = (1..50).map { "Project $it" })
        val entries = (1..200).map { entry(it.toLong(), KnowledgeType.TERM, "Term $it") }
        val attendees = listOf("Dana Whitfield", "Marcus Lee", "Aoife Byrne")

        val five = hints(attendees, profile, entries, limit = 5)
        assertEquals(listOf("Dana Whitfield", "Marcus Lee", "Aoife Byrne", "Sam Rivera", "Priya Nair"), five)
        assertEquals(listOf("Dana Whitfield", "Marcus Lee"), hints(attendees, profile, entries, limit = 2))
        assertEquals(emptyList<String>(), hints(attendees, profile, entries, limit = 0))

        val all = speechHints(attendees, profile, entries)
        assertEquals("a hundred unless told otherwise", 100, all.size)
        assertEquals(attendees, all.take(3))
        assertEquals("the knowledge base fills what room is left, in the order given", (1..45).map { "Term $it" }, all.drop(55))
    }

    @Test
    fun `the limit counts names, not the repeats and blanks that were dropped`() {
        val attendees = listOf("Dana Whitfield", "dana whitfield", "", "Dana Whitfield (host)", "Marcus Lee", "x", "Aoife Byrne")
        assertEquals(listOf("Dana Whitfield", "Marcus Lee", "Aoife Byrne"), hints(attendees, limit = 3))
    }

    @Test
    fun `fewer than the limit are returned when that is all there is`() {
        val heard = hints(listOf("Dana Whitfield"), WorkProfile(name = "Sam Rivera"), limit = 100)
        assertEquals(listOf("Dana Whitfield", "Sam Rivera"), heard)
        assertFalse(heard.any { it.isBlank() })
    }
}
