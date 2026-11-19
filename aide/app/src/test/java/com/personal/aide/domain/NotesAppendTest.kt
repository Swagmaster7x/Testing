package com.personal.aide.domain

import org.junit.Assert.assertEquals
import org.junit.Test

/** Working out what is new in text copied across in parts. */
class NotesAppendTest {
    @Test
    fun `the first part is taken whole`() {
        assertEquals("Dana said the fix is in review.", freshPart("", "  Dana said the fix is in review.  "))
    }

    @Test
    fun `copying the same text again adds nothing`() {
        val part = "Dana said the fix is in review."
        assertEquals("", freshPart(part, part))
        assertEquals("", freshPart(part, "  $part\n"))
    }

    @Test
    fun `when the whole box is copied again only what was added since is new`() {
        val first = "Dana said the fix is in review."
        val second = "$first Marcus wants a two-week override window."
        assertEquals("Marcus wants a two-week override window.", freshPart(first, second))
    }

    @Test
    fun `a box that grew by a new paragraph gives just the paragraph`() {
        val first = "Dana said the fix is in review."
        assertEquals("Beta opens on the ninth.\nInvite list is due Tuesday.", freshPart(first, "$first\n\nBeta opens on the ninth.\nInvite list is due Tuesday."))
    }

    @Test
    fun `different spacing between the two copies does not hide that one continues the other`() {
        val first = "Dana said  the fix\nis in review."
        val second = "Dana said the fix is in review.   Marcus agreed."
        assertEquals("Marcus agreed.", freshPart(first, second))
    }

    @Test
    fun `text that starts differently is something else and is taken whole`() {
        val first = "Dana said the fix is in review."
        val second = "Marcus wants a two-week override window."
        assertEquals(second, freshPart(first, second))
    }

    @Test
    fun `text that only begins like the last part but then differs is taken whole`() {
        val first = "Dana said the fix is in review."
        val second = "Dana said the fix is late."
        assertEquals(second, freshPart(first, second))
    }

    @Test
    fun `a word that merely starts with the last word is a different sentence, not a few new letters`() {
        assertEquals("We reviewed the rate feeds today", freshPart("We reviewed the rate feed", "We reviewed the rate feeds today"))
    }

    @Test
    fun `a shorter text than last time is taken whole`() {
        // The box was cleared and something new, and shorter, dictated.
        assertEquals("Dana said", freshPart("Dana said the fix is in review.", "Dana said"))
    }

    @Test
    fun `punctuation straight after the last part is still a continuation`() {
        assertEquals(", and Marcus agreed.", freshPart("Dana said yes", "Dana said yes, and Marcus agreed."))
    }

    @Test
    fun `nothing in gives nothing out`() {
        assertEquals("", freshPart("anything", "   "))
        assertEquals("", freshPart("", ""))
    }
}
