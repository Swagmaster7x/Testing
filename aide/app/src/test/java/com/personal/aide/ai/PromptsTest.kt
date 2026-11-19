package com.personal.aide.ai

import com.personal.aide.data.WorkProfile
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/** What the assistant is told when it is handed pictures of pages, a document, or text the user brought in. */
class PromptsTest {
    private val sam = WorkProfile(name = "Sam Rivera", role = "Senior Product Manager")
    private val nobody = WorkProfile()

    // -------------------------------------------------------------------------------------------
    // Reading pages

    @Test
    fun `one page is called by its number, out of how many there are`() {
        val task = Prompts.readPagesTask("whiteboard.jpg", first = 1, count = 1, total = 1)
        assertTrue(task, task.startsWith("These pictures are page 1 of 1 from \"whiteboard.jpg\""))

        val last = Prompts.readPagesTask("Team handbook.pdf", first = 13, count = 1, total = 13)
        assertTrue(last, last.startsWith("These pictures are page 13 of 13 from \"Team handbook.pdf\""))
        assertFalse("a single page is not a range", last.contains("13 to 13"))
    }

    @Test
    fun `several pages are called by the first and last of them`() {
        assertTrue(Prompts.readPagesTask("brief.pdf", 1, 6, 14).startsWith("These pictures are pages 1 to 6 of 14 from \"brief.pdf\""))
        assertTrue(Prompts.readPagesTask("brief.pdf", 7, 6, 14).startsWith("These pictures are pages 7 to 12 of 14 from \"brief.pdf\""))
        assertTrue(Prompts.readPagesTask("brief.pdf", 13, 2, 14).startsWith("These pictures are pages 13 to 14 of 14 from \"brief.pdf\""))
    }

    @Test
    fun `the pages are to be written out faithfully, with each page marked and nothing added`() {
        val task = Prompts.readPagesTask("notes", 1, 3, 3)
        assertTrue(task.contains("Write out exactly what is on them, as plain text"))
        assertTrue("each page is marked, so the text can be matched to its page", task.contains("\"--- page N ---\""))
        assertTrue("a word that can't be read is marked, not guessed", task.contains("[illegible]"))
        assertTrue(task.contains("[?]"))
        assertTrue(task.contains("Add nothing of your own"))
        assertEquals("no stray blank space around it", task.trim(), task)
    }

    // -------------------------------------------------------------------------------------------
    // Documents

    @Test
    fun `a document is described as something to know, not something that happened`() {
        val task = Prompts.documentTask(sam, maxQuestions = 2)
        assertTrue(task.startsWith("Sam Rivera has added this document to what you know about their work."))
        assertTrue(task.contains("not a record of a meeting"))
        assertTrue("the knowledge base is the point of it", task.contains("Your main job here is the knowledge base."))
        assertFalse(task.contains("Write up this meeting"))
        assertEquals(task.trim(), task)
    }

    @Test
    fun `the meeting fields a document has no use for are to be left empty`() {
        val task = Prompts.documentTask(sam, maxQuestions = 2)
        assertTrue(task.contains("- meeting_type: \"document\"."))
        assertTrue(task.contains("- attendees: leave empty. Nobody attended a document."))
        assertTrue(task.contains("- series, since_last_time, earlier_items: leave empty."))
        assertTrue("tasks only where the document assigns them", task.contains("Most documents assign nothing; leave the list empty then."))
    }

    @Test
    fun `a document may be asked about a little, or not at all`() {
        assertTrue(Prompts.documentTask(sam, 2).contains("Ask at most 2 clarifying questions, and only about something the document leaves unclear"))
        for (none in listOf(0, -1)) {
            val task = Prompts.documentTask(sam, none)
            assertTrue(task.contains("Don't ask any clarifying questions this time; leave that list empty."))
            assertFalse(task.contains("Ask at most"))
        }
    }

    @Test
    fun `with no name for the user the document task speaks of the user`() {
        val task = Prompts.documentTask(nobody, 2)
        assertTrue(task.startsWith("the user has added this document"))
        assertTrue(task.contains("you will need to know in the user's meetings"))
        assertTrue(task.contains("where the document plainly assigns the user or someone else something to do"))
    }

    @Test
    fun `text read from photographs may have the odd misread word, and the document task says so`() {
        assertTrue(Prompts.documentTask(sam, 2).contains("Some of it may have been read from photographs or scans, so allow for the odd misread word."))
    }

    // -------------------------------------------------------------------------------------------
    // Text the user brought in as a meeting's notes

    @Test
    fun `text the user brought in may be a transcript, typed notes, or notes read from pictures`() {
        val task = Prompts.meetingTask(sam, imported = true, maxQuestions = 2, learning = false)
        assertTrue(task.contains("About the text: Sam Rivera brought it in themselves."))
        assertTrue(task.contains("a transcript exported from a call tool"))
        assertTrue(task.contains("their own typed notes from the meeting"))
        assertTrue(task.contains("notes read from photographs or a document"))
        assertTrue("the page markers the reading leaves behind are explained", task.contains("\"--- page N ---\" lines marking where each page began"))
        assertTrue(task.contains("Take speaker names at face value where they are given."))

        assertFalse("none of it came from the microphone", task.contains("live speech recognition"))
        assertFalse(task.contains("[NOTE]"))
        assertTrue("it is still written up as a meeting", task.startsWith("Write up this meeting for Sam Rivera."))
    }

    @Test
    fun `a recording is still described as recognized speech, with nothing about pages`() {
        val task = Prompts.meetingTask(sam, imported = false, maxQuestions = 2, learning = false)
        assertTrue(task.contains("it comes from live speech recognition on one phone microphone"))
        assertTrue(task.contains("Lines marked [NOTE] were typed by Sam Rivera during the meeting"))
        assertFalse(task.contains("brought it in themselves"))
        assertFalse(task.contains("--- page N ---"))
        assertFalse(task.contains("photographs"))
    }

    @Test
    fun `the page markers asked for when reading are the ones the meeting task is told to expect`() {
        val marker = "\"--- page N ---\""
        assertTrue(Prompts.readPagesTask("scan.pdf", 1, 1, 1).contains(marker))
        assertTrue(Prompts.meetingTask(sam, imported = true, maxQuestions = 0, learning = false).contains(marker))
    }
}
