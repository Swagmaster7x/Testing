package com.personal.aide.domain

import com.personal.aide.data.db.KnowledgeType
import com.personal.aide.data.db.SegmentEntity
import com.personal.aide.data.db.SegmentKind
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class TextTest {

    // -------------------------------------------------------------------------------------------
    // Folding titles

    @Test
    fun `titles that differ only in case and punctuation are one entry`() {
        assertEquals("q4 launch phase 2", knowledgeKey("Q4 Launch — Phase 2"))
        assertEquals(knowledgeKey("q4 launch phase 2"), knowledgeKey("Q4 Launch — Phase 2"))
        assertEquals(knowledgeKey("Dana Whitfield"), knowledgeKey("  dana   WHITFIELD. "))
        assertEquals(knowledgeKey("Self-serve quoting"), knowledgeKey("self serve quoting"))
        assertEquals(knowledgeKey("O'Brien, Pat"), knowledgeKey("o brien pat"))
    }

    @Test
    fun `accents are folded away`() {
        assertEquals("jose alvarez nunez", knowledgeKey("José Álvarez-Núñez"))
        // The same name typed with combining accents instead of precomposed letters.
        assertEquals(knowledgeKey("José"), knowledgeKey("José"))
        assertEquals("zoe", knowledgeKey("Zoë"))
    }

    @Test
    fun `different names stay different`() {
        assertNotEquals(knowledgeKey("Dana Whitfield"), knowledgeKey("Dana Whitford"))
        assertNotEquals(knowledgeKey("Q4 Launch"), knowledgeKey("Q3 Launch"))
        assertNotEquals(knowledgeKey("Atlas"), knowledgeKey("Atlas 2"))
    }

    @Test
    fun `a title with no letters or digits has no key`() {
        assertEquals("", knowledgeKey(""))
        assertEquals("", knowledgeKey("   "))
        assertEquals("", knowledgeKey("— !? …"))
    }

    @Test
    fun `folding is stable when applied twice`() {
        for (title in listOf("Q4 Launch — Phase 2", "José Álvarez", "  R&D  ", "東京 office", "v2.0-beta")) {
            assertEquals(knowledgeKey(title), knowledgeKey(knowledgeKey(title)))
        }
        assertEquals("東京 office", knowledgeKey("東京 Office"))
    }

    // -------------------------------------------------------------------------------------------
    // Kinds of knowledge

    @Test
    fun `knowledge type words`() {
        assertEquals(KnowledgeType.PERSON, knowledgeTypeOf("person"))
        assertEquals(KnowledgeType.PERSON, knowledgeTypeOf(" People "))
        assertEquals(KnowledgeType.PROJECT, knowledgeTypeOf("Project"))
        assertEquals(KnowledgeType.PROJECT, knowledgeTypeOf("initiative"))
        assertEquals(KnowledgeType.TERM, knowledgeTypeOf("term"))
        assertEquals(KnowledgeType.TERM, knowledgeTypeOf("ACRONYM"))
        assertEquals(KnowledgeType.DECISION, knowledgeTypeOf("decision"))
        assertEquals(KnowledgeType.PROCESS, knowledgeTypeOf("process"))
        assertEquals(KnowledgeType.PROCESS, knowledgeTypeOf("procedure"))
        assertEquals(KnowledgeType.ORG, knowledgeTypeOf("org"))
        assertEquals(KnowledgeType.ORG, knowledgeTypeOf("team"))
        assertEquals(KnowledgeType.ORG, knowledgeTypeOf("customer"))
        assertEquals(KnowledgeType.ORG, knowledgeTypeOf("organisation"))
        assertEquals(KnowledgeType.FACT, knowledgeTypeOf("fact"))
        assertEquals(KnowledgeType.FACT, knowledgeTypeOf(""))
        assertEquals(KnowledgeType.FACT, knowledgeTypeOf("something else"))
    }

    @Test
    fun `each type's own word reads back as that type`() {
        for (type in KnowledgeType.entries) {
            assertEquals(type, knowledgeTypeOf(type.word()))
            assertTrue(type.label().isNotBlank())
            assertTrue(type.plural().isNotBlank())
        }
        assertEquals(KnowledgeType.entries.size, KnowledgeType.entries.map { it.label() }.toSet().size)
        assertEquals(KnowledgeType.entries.size, KnowledgeType.entries.map { it.plural() }.toSet().size)
    }

    // -------------------------------------------------------------------------------------------
    // Counting words

    @Test
    fun `word count`() {
        assertEquals(0, wordCount(""))
        assertEquals(0, wordCount("   \n\t "))
        assertEquals(1, wordCount("one"))
        assertEquals(2, wordCount("  two   words \n"))
        assertEquals(4, wordCount("tabs\tand\nnewlines here"))
        assertEquals(5, wordCount("it's a well-known fact, really."))
    }

    // -------------------------------------------------------------------------------------------
    // The transcript as the assistant reads it

    private fun segment(offsetMs: Long, text: String, kind: SegmentKind = SegmentKind.SPEECH) =
        SegmentEntity(meetingId = 1, offsetMs = offsetMs, kind = kind, text = text)

    @Test
    fun `transcript lines carry a clock and mark notes and flags`() {
        val text = transcriptText(
            listOf(
                segment(0, " good morning everyone "),
                segment(65_000, "Dana owns the deck", SegmentKind.NOTE),
                segment(247_000, "", SegmentKind.FLAG),
                segment(3_847_000, "that's a wrap"),
                segment(3_850_000, "pricing", SegmentKind.FLAG),
            ),
        )
        assertEquals(
            """
            [00:00] good morning everyone
            [01:05] [NOTE] Dana owns the deck
            [04:07] [FLAG] The user marked this moment as important.
            [1:04:07] that's a wrap
            [1:04:10] [FLAG] pricing
            """.trimIndent(),
            text,
        )
    }

    @Test
    fun `empty speech and empty notes are left out but a bare flag is kept`() {
        val text = transcriptText(
            listOf(
                segment(1_000, "   "),
                segment(2_000, "", SegmentKind.NOTE),
                segment(3_000, "", SegmentKind.FLAG),
                segment(4_000, "\n"),
            ),
        )
        assertEquals("[00:03] [FLAG] The user marked this moment as important.", text)
    }

    @Test
    fun `segments are written in the order given`() {
        val text = transcriptText(listOf(segment(9_000, "second"), segment(1_000, "first")))
        assertEquals("[00:09] second\n[00:01] first", text)
    }

    @Test
    fun `an empty meeting has an empty transcript`() {
        assertEquals("", transcriptText(emptyList()))
        assertEquals("", transcriptText(listOf(segment(0, ""), segment(5, "  "))))
    }

    @Test
    fun `transcript has no trailing blank line`() {
        val text = transcriptText(listOf(segment(0, "one"), segment(1_000, "two")))
        assertFalse(text.endsWith("\n"))
        assertEquals(2, text.lines().size)
    }

    // -------------------------------------------------------------------------------------------
    // Pasted text

    @Test
    fun `pasted text splits into its lines`() {
        assertEquals(
            listOf("Dana: let's start.", "Marcus: pricing first.", "Action: Sam to send the deck."),
            splitImportedText("Dana: let's start.\r\n\r\n  Marcus: pricing first.  \n\n\nAction: Sam to send the deck.\n"),
        )
        assertEquals(emptyList<String>(), splitImportedText(""))
        assertEquals(emptyList<String>(), splitImportedText(" \n \r\n\t\n"))
        assertEquals(listOf("one line"), splitImportedText("one line"))
    }

    // -------------------------------------------------------------------------------------------
    // Shortening

    @Test
    fun `text that fits is left alone`() {
        assertEquals("short", "short".ellipsize(10))
        assertEquals("exactly ten", "exactly ten".ellipsize(11))
        assertEquals("", "".ellipsize(5))
    }

    @Test
    fun `long text is cut at a word with an ellipsis`() {
        assertEquals("The quick brown fox…", "The quick brown fox jumps over the lazy dog".ellipsize(20))
        assertEquals("The quick brown…", "The quick brown fox jumps over the lazy dog".ellipsize(18))
    }

    @Test
    fun `punctuation is not left dangling before the ellipsis`() {
        assertEquals("Send the revised pricing deck…", "Send the revised pricing deck, then call Dana".ellipsize(31))
        assertEquals("Done. Next…", "Done. Next: call Dana about the pricing".ellipsize(12))
    }

    @Test
    fun `a word too long to break is cut where it must be`() {
        assertEquals("Supercalif…", "Supercalifragilisticexpialidocious".ellipsize(10))
        assertEquals("A verylongwordwithou…", "A verylongwordwithoutanybreaks here".ellipsize(20))
    }

    @Test
    fun `the result is never longer than the limit plus the ellipsis`() {
        val text = "Lay out the open tasks over the rest of the week so that each lands before it is due"
        for (max in 1..text.length + 2) {
            val short = text.ellipsize(max)
            assertTrue("max $max gave '${short}'", short.length <= max + 1)
            if (max < text.length) {
                assertTrue(short.endsWith("…"))
                assertTrue(text.startsWith(short.dropLast(1)))
            } else {
                assertEquals(text, short)
            }
        }
    }
}
