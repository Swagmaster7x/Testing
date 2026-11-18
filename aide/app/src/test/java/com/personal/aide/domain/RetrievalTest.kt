package com.personal.aide.domain

import com.personal.aide.domain.Retrieval.Doc
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class RetrievalTest {
    private fun doc(name: String, title: String, body: String) = Doc(name, title, body)

    // -------------------------------------------------------------------------------------------
    // Words

    @Test
    fun `tokens are lowercased words without filler`() {
        assertEquals(
            listOf("q4", "pricing", "review", "dana", "caf\u00e9", "owners"),
            Retrieval.tokens("The Q4 pricing review, with Dana & caf\u00e9-owners!"),
        )
    }

    @Test
    fun `single characters and filler words are dropped`() {
        assertEquals(emptyList<String>(), Retrieval.tokens("I a x 7 ok um, yeah... the of"))
        assertEquals(emptyList<String>(), Retrieval.tokens(""))
        assertEquals(emptyList<String>(), Retrieval.tokens("  \n\t "))
    }

    @Test
    fun `numbers and non-English letters are words too`() {
        assertEquals(
            listOf("2026", "\u00fcber", "na\u00efve", "\u6771\u4eac", "okr"),
            Retrieval.tokens("2026: \u00dcber-na\u00efve \u6771\u4eac OKR"),
        )
    }

    // -------------------------------------------------------------------------------------------
    // Ranking

    private val notes = listOf(
        doc("pricing", "Pricing review", "We agreed the new tiers."),
        doc("hiring", "Hiring plan", "Two engineers join in the first quarter."),
        doc("offsite", "Offsite", "Pricing came up briefly during the offsite dinner conversation among the wider team."),
    )

    @Test
    fun `documents sharing no words with the question are left out`() {
        val hits = Retrieval.rank("pricing", notes)
        assertEquals(setOf("pricing", "offsite"), hits.map { it.item }.toSet())
    }

    @Test
    fun `a word in the title counts for more than the same word in the body`() {
        assertEquals(listOf("pricing", "offsite"), Retrieval.rank("pricing", notes).map { it.item })
    }

    @Test
    fun `title match wins even when the documents are the same length`() {
        val docs = listOf(
            doc("body", "Weekly notes", "atlas migration slipped again"),
            doc("title", "Atlas notes", "weekly migration slipped again"),
        )
        assertEquals(listOf("title", "body"), Retrieval.rank("atlas", docs).map { it.item })
    }

    @Test
    fun `results come best first with positive scores`() {
        val hits = Retrieval.rank("pricing offsite team hiring", notes)
        assertEquals(3, hits.size)
        assertTrue(hits.all { it.score > 0 })
        assertEquals(hits.map { it.score }.sortedDescending(), hits.map { it.score })
    }

    @Test
    fun `a rare word outweighs one every document has`() {
        val docs = listOf(
            doc("budget", "Notes", "launch checklist budget"),
            doc("atlas", "Notes", "launch checklist atlas"),
            doc("hiring", "Notes", "launch checklist hiring"),
            doc("travel", "Notes", "launch checklist travel"),
        )
        val hits = Retrieval.rank("launch atlas", docs)
        assertEquals("atlas", hits.first().item)
        assertEquals("a word they all share still matches them all", 4, hits.size)
        assertTrue(hits[0].score > hits[1].score)
    }

    @Test
    fun `mentioning the word more often ranks higher`() {
        val docs = listOf(
            doc("once", "First", "budget alpha beta gamma delta epsilon"),
            doc("thrice", "Second", "budget budget budget alpha beta gamma"),
        )
        assertEquals(listOf("thrice", "once"), Retrieval.rank("budget", docs).map { it.item })
    }

    @Test
    fun `a short note beats a long one that mentions the word in passing`() {
        val docs = listOf(
            doc("long", "Minutes", "atlas " + (1..80).joinToString(" ") { "filler$it" }),
            doc("short", "Minutes", "atlas status"),
        )
        assertEquals(listOf("short", "long"), Retrieval.rank("atlas", docs).map { it.item })
    }

    @Test
    fun `matching more of the question ranks higher`() {
        val docs = listOf(
            doc("one", "Dana", "leads engineering"),
            doc("both", "Dana", "owns pricing"),
            doc("none", "Marcus", "leads sales"),
        )
        val hits = Retrieval.rank("what does dana think about pricing", docs)
        assertEquals(listOf("both", "one"), hits.map { it.item })
    }

    @Test
    fun `the limit keeps the best`() {
        val all = Retrieval.rank("pricing offsite team hiring", notes)
        val top = Retrieval.rank("pricing offsite team hiring", notes, limit = 2)
        assertEquals(all.take(2), top)
        assertEquals(emptyList<Retrieval.Hit<String>>(), Retrieval.rank("pricing", notes, limit = 0))
    }

    @Test
    fun `case punctuation and repetition in the question make no difference`() {
        val plain = Retrieval.rank("pricing offsite", notes)
        assertEquals(plain, Retrieval.rank("PRICING, offsite?!", notes))
        assertEquals(plain, Retrieval.rank("pricing pricing offsite pricing", notes))
        assertEquals(plain, Retrieval.rank("so what about the pricing at the offsite", notes))
    }

    @Test
    fun `a question with nothing to search for finds nothing`() {
        assertTrue(Retrieval.rank("", notes).isEmpty())
        assertTrue(Retrieval.rank("   ", notes).isEmpty())
        assertTrue(Retrieval.rank("what is it about?", notes).isEmpty())
        assertTrue(Retrieval.rank("pricing", emptyList<Doc<String>>()).isEmpty())
        assertTrue(Retrieval.rank("zebra", notes).isEmpty())
    }

    @Test
    fun `empty documents are skipped without upsetting the rest`() {
        val docs = notes + doc("blank", "", "") + doc("filler", "The", "it is what it is")
        assertEquals(listOf("pricing", "offsite"), Retrieval.rank("pricing", docs).map { it.item })
    }

    @Test
    fun `a single document can be found`() {
        val hits = Retrieval.rank("tiers", listOf(notes[0]))
        assertEquals(listOf("pricing"), hits.map { it.item })
        assertTrue(hits.single().score > 0)
    }

    @Test
    fun `whole words only`() {
        val docs = listOf(doc("price", "Price list", "current price points"), doc("pricing", "Pricing", "pricing strategy"))
        assertEquals(listOf("price"), Retrieval.rank("price", docs).map { it.item })
    }

    // -------------------------------------------------------------------------------------------
    // Mentions in a long text

    private val entries = listOf(
        doc("dana", "Dana Whitfield", "Engineering lead."),
        doc("launch", "Q4 Launch", "Self-serve quoting goes live."),
        doc("atlas", "Atlas", "The data warehouse."),
        doc("marcus", "Marcus Lee", "Head of Sales."),
    )

    @Test
    fun `finds the entries a transcript names`() {
        val transcript = "so dana whitfield said the q4 launch is slipping and we need atlas ready first"
        assertEquals(setOf("dana", "launch", "atlas"), Retrieval.mentionedIn(transcript, entries).toSet())
    }

    @Test
    fun `every word of the title has to appear`() {
        assertEquals(emptyList<String>(), Retrieval.mentionedIn("dana said the launch went fine and marcus agreed", entries))
        assertEquals(listOf("marcus"), Retrieval.mentionedIn("marcus agreed, and Lee from finance did too", entries))
    }

    @Test
    fun `the words need not be next to each other or in the same case`() {
        assertEquals(listOf("launch"), Retrieval.mentionedIn("The LAUNCH moves to the end of Q4.", entries))
    }

    @Test
    fun `most mentioned comes first`() {
        val transcript = "atlas is late. atlas again. dana whitfield will fix atlas before the q4 launch. the launch matters. q4 is close."
        // Atlas three times; the launch twice (both of its words appear twice); Dana Whitfield once.
        assertEquals(listOf("atlas", "launch", "dana"), Retrieval.mentionedIn(transcript, entries))
    }

    @Test
    fun `a title is counted by its least mentioned word`() {
        val transcript = "dana dana dana dana whitfield. atlas atlas."
        assertEquals(listOf("atlas", "dana"), Retrieval.mentionedIn(transcript, entries))
    }

    @Test
    fun `part of a longer word is not a mention`() {
        val docs = listOf(doc("ana", "Ana", "Designer."), doc("atlas", "Atlas", "The data warehouse."))
        assertEquals(emptyList<String>(), Retrieval.mentionedIn("Dana and Diana looked at the atlases", docs))
    }

    @Test
    fun `nothing to search or nothing to find`() {
        assertEquals(emptyList<String>(), Retrieval.mentionedIn("", entries))
        assertEquals(emptyList<String>(), Retrieval.mentionedIn("um yeah okay so", entries))
        assertEquals(emptyList<String>(), Retrieval.mentionedIn("atlas", emptyList<Doc<String>>()))
        assertEquals(emptyList<String>(), Retrieval.mentionedIn("atlas", listOf(doc("blank", "  ", "Atlas notes"))))
    }

    @Test
    fun `only the title decides a mention, not the entry's text`() {
        assertEquals(emptyList<String>(), Retrieval.mentionedIn("the data warehouse is slow", entries))
    }
}
