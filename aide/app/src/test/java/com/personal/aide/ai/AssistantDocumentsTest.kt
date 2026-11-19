package com.personal.aide.ai

import android.app.Application
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.aide.ai.Assistant.SummaryResult
import com.personal.aide.data.ActionItem
import com.personal.aide.data.ClarifyingQuestion
import com.personal.aide.data.EarlierItem
import com.personal.aide.data.KnowledgeNote
import com.personal.aide.data.LoggedWin
import com.personal.aide.data.MeetingAnalysis
import com.personal.aide.data.ProgressUpdate
import com.personal.aide.data.AideJson
import com.personal.aide.data.SeriesGuess
import com.personal.aide.data.db.KnowledgeOrigin
import com.personal.aide.data.db.KnowledgeType
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingSource
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.data.db.SeriesEntity
import com.personal.aide.domain.knowledgeKey
import com.personal.aide.testing.Fixed
import com.personal.aide.testing.assertWellFormedConversation
import com.personal.aide.testing.prompt
import com.personal.aide.testing.systemText
import com.personal.aide.testing.task
import com.personal.aide.data.WeekReview
import com.personal.aide.data.db.TaskStatus
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Assert.fail
import org.junit.Rule
import org.junit.Test
import org.junit.rules.TemporaryFolder
import org.junit.runner.RunWith
import org.robolectric.annotation.Config
import java.io.File
import java.util.Base64

/**
 * Documents and photographs: reading pictures of pages into text, and what the assistant does
 * with reference material as opposed to a meeting.
 */
@RunWith(AndroidJUnit4::class)
@Config(sdk = [35], application = Application::class)
class AssistantDocumentsTest : AssistantTestBase() {
    @get:Rule
    val folder = TemporaryFolder()

    // -------------------------------------------------------------------------------------------
    // Helpers: pages

    /** [count] page pictures, each with contents of its own so one can be told from another. */
    private fun pages(count: Int): List<File> = (1..count).map { number ->
        folder.newFile("page-$number.jpg").apply { writeBytes("the picture of page $number".toByteArray()) }
    }

    /** What the picture sent was a picture of. */
    private fun LlmImage.contents(): String = String(Base64.getDecoder().decode(base64))

    private fun picturesIn(request: LlmRequest): List<String> = request.messages.single().images.map { it.contents() }

    private suspend fun refused(block: suspend () -> Unit): LlmException =
        try {
            block()
            throw AssertionError("Expected the reading to fail")
        } catch (e: LlmException) {
            e
        }

    // -------------------------------------------------------------------------------------------
    // Reading pages

    @Test
    fun `one page is sent as one picture, with the task of writing out what is on it`(): Unit = runBlocking {
        settings.setProfile(sam)
        val page = pages(1)
        llm.reply("--- page 1 ---\nThree tiers agreed. Dana to send the deck.")

        val text = assistant.readPages("whiteboard.jpg", page)

        assertEquals("--- page 1 ---\nThree tiers agreed. Dana to send the deck.", text)
        val request = llm.requests.single()
        assertEquals("read_pages", request.feature)
        assertNull("the reply is plain text, not a form to fill in", request.schema)
        assertEquals(Effort.LOW, request.effort)
        request.assertWellFormedConversation()

        val message = request.messages.single()
        assertEquals(LlmMessage.Role.USER, message.role)
        val picture = message.images.single()
        assertEquals("image/jpeg", picture.mediaType)
        assertEquals("the picture is sent whole and unchanged", "the picture of page 1", picture.contents())
        assertEquals(Base64.getEncoder().encodeToString(page.single().readBytes()), picture.base64)
        assertFalse("no line breaks in the encoded picture", picture.base64.contains('\n'))

        assertEquals(Prompts.readPagesTask("whiteboard.jpg", 1, 1, 1), message.text)
        assertTrue(message.text.contains("page 1 of 1 from \"whiteboard.jpg\""))
        // Names from the profile help with handwriting.
        assertTrue(request.systemText.contains("You work for Sam Rivera."))
        assertTrue(request.systemText.contains("Reports to: Priya Nair"))
    }

    @Test
    fun `as many pages as fit in one request go together, in order`(): Unit = runBlocking {
        assertEquals(6, Assistant.PAGES_PER_CALL)
        llm.reply("Six pages of text.")

        assistant.readPages("brief.pdf", pages(6))

        val request = llm.requests.single()
        assertEquals((1..6).map { "the picture of page $it" }, picturesIn(request))
        assertTrue(request.prompt, request.prompt.contains("pages 1 to 6 of 6 from \"brief.pdf\""))
    }

    @Test
    fun `one page more than fits makes a second request for it alone`(): Unit = runBlocking {
        llm.reply("First six.")
        llm.reply("The seventh.")

        val text = assistant.readPages("brief.pdf", pages(7))

        assertEquals(2, llm.requests.size)
        assertEquals((1..6).map { "the picture of page $it" }, picturesIn(llm.requests[0]))
        assertEquals(listOf("the picture of page 7"), picturesIn(llm.requests[1]))
        assertTrue(llm.requests[0].prompt.contains("pages 1 to 6 of 7"))
        assertTrue(llm.requests[1].prompt, llm.requests[1].prompt.contains("page 7 of 7"))
        assertEquals("First six.\n\nThe seventh.", text)
    }

    @Test
    fun `a long document is read a batch at a time and its text joined in page order`(): Unit = runBlocking {
        val progress = ArrayList<Pair<Int, Int>>()
        /** How far the caller had been told the reading had got when each request went out. */
        val knownAtEachCall = ArrayList<List<Pair<Int, Int>>>()
        for (reply in listOf("--- page 1 ---\nOne to six.", "--- page 7 ---\nSeven to twelve.", "--- page 13 ---\nThirteen and fourteen.")) {
            llm.answer {
                knownAtEachCall.add(progress.toList())
                reply
            }
        }

        val text = assistant.readPages("Team handbook.pdf", pages(14)) { done, total -> progress += done to total }

        assertEquals(
            "--- page 1 ---\nOne to six.\n\n--- page 7 ---\nSeven to twelve.\n\n--- page 13 ---\nThirteen and fourteen.",
            text,
        )
        assertEquals(3, llm.requests.size)
        assertEquals((1..6).map { "the picture of page $it" }, picturesIn(llm.requests[0]))
        assertEquals((7..12).map { "the picture of page $it" }, picturesIn(llm.requests[1]))
        assertEquals((13..14).map { "the picture of page $it" }, picturesIn(llm.requests[2]))

        // Each request says which pages of the whole it is looking at, so the page markers come out right.
        assertEquals(Prompts.readPagesTask("Team handbook.pdf", 1, 6, 14), llm.requests[0].prompt)
        assertEquals(Prompts.readPagesTask("Team handbook.pdf", 7, 6, 14), llm.requests[1].prompt)
        assertEquals(Prompts.readPagesTask("Team handbook.pdf", 13, 2, 14), llm.requests[2].prompt)
        assertTrue(llm.requests[1].prompt.contains("pages 7 to 12 of 14"))
        assertTrue(llm.requests[2].prompt.contains("pages 13 to 14 of 14"))

        assertEquals("progress is reported after each batch", listOf(6 to 14, 12 to 14, 14 to 14), progress)
        assertEquals(
            "and only once that batch's text is in hand",
            listOf(emptyList(), listOf(6 to 14), listOf(6 to 14, 12 to 14)),
            knownAtEachCall,
        )
        llm.requests.forEach { request ->
            request.assertWellFormedConversation()
            assertEquals("each batch is a fresh request with nothing carried over", 1, request.messages.size)
        }
    }

    @Test
    fun `each batch's text is trimmed before it is joined to the rest`(): Unit = runBlocking {
        llm.reply("\n\n  First batch.  \n")
        llm.reply("Second batch.\n\n\n")

        assertEquals("First batch.\n\nSecond batch.", assistant.readPages("notes", pages(8)))
    }

    @Test
    fun `every request made is counted in the usage log`(): Unit = runBlocking {
        llm.reply("One.")
        llm.reply("Two.")
        assistant.readPages("brief.pdf", pages(9))

        val calls = db.usage().all()
        assertEquals(listOf("read_pages", "read_pages"), calls.map { it.feature })
        assertTrue(calls.all { it.ok })
    }

    @Test
    fun `reading the pages does not remove or change the pictures`(): Unit = runBlocking {
        val files = pages(3)
        llm.reply("Read.")
        assistant.readPages("Photos", files)

        assertEquals((1..3).map { "the picture of page $it" }, files.map { it.readText() })
    }

    @Test
    fun `with no pages there is nothing to read and Claude is not called`(): Unit = runBlocking {
        val progress = ArrayList<Pair<Int, Int>>()

        val error = refused { assistant.readPages("empty.pdf", emptyList()) { done, total -> progress += done to total } }

        assertEquals(LlmException.Kind.OTHER, error.kind)
        assertTrue(error.message.orEmpty(), error.message.orEmpty().contains("no pages"))
        assertTrue(llm.requests.isEmpty())
        assertTrue(db.usage().all().isEmpty())
        assertTrue(progress.isEmpty())
    }

    @Test
    fun `a failure part-way stops the reading and reaches the caller as it is`(): Unit = runBlocking {
        val progress = ArrayList<Pair<Int, Int>>()
        llm.reply("One to six.")
        llm.fail(LlmException.Kind.OVERLOADED, "Claude is busy right now. Try again in a moment.")
        // Nothing is scripted for a third request: making one would fail the test.

        val error = refused { assistant.readPages("Team handbook.pdf", pages(14)) { done, total -> progress += done to total } }

        assertEquals(LlmException.Kind.OVERLOADED, error.kind)
        assertEquals("Claude is busy right now. Try again in a moment.", error.message)
        assertTrue(error.retryable)
        assertEquals(2, llm.requests.size)
        assertEquals("only the batch that was read is reported", listOf(6 to 14), progress)
        assertEquals(listOf(true, false), db.usage().all().map { it.ok })
    }

    @Test
    fun `a refusal on the first batch reaches the caller as a refusal`(): Unit = runBlocking {
        val progress = ArrayList<Pair<Int, Int>>()
        llm.fail(LlmException.Kind.REFUSED, "Claude declined this request.")

        val error = refused { assistant.readPages("scan.pdf", pages(8)) { done, total -> progress += done to total } }

        assertEquals(LlmException.Kind.REFUSED, error.kind)
        assertEquals(1, llm.requests.size)
        assertTrue(progress.isEmpty())
    }

    @Test
    fun `with no key set up the reading fails without counting as a failed call`(): Unit = runBlocking {
        llm.fail(LlmException.Kind.NO_KEY, "Add your Claude API key in Settings first.")

        assertEquals(LlmException.Kind.NO_KEY, refused { assistant.readPages("scan.pdf", pages(2)) }.kind)
        assertTrue(db.usage().all().isEmpty())
    }

    @Test
    fun `a page picture that has gone missing is reported as a problem, not a crash`(): Unit = runBlocking {
        val files = pages(2)
        files[1].delete()

        val error = refused { assistant.readPages("Photos", files) }

        assertEquals(LlmException.Kind.OTHER, error.kind)
        assertTrue(error.message.orEmpty(), error.message.orEmpty().startsWith("Something went wrong inside Aide"))
        assertTrue("half a set of pages must not be sent", llm.requests.isEmpty())
    }

    // -------------------------------------------------------------------------------------------
    // Helpers: documents

    /** Forty-three words of a handbook, a line to a paragraph. */
    private val handbook = listOf(
        "Team handbook for the quoting team at Northwind Logistics",
        "Priya Nair is VP Product and owns the roadmap and the budget",
        "RateStream is the pricing engine and Dana Whitfield is its engineering lead",
        "Releases go out on Thursdays after the weekly quoting standup",
    )

    /** Reference material the user added: saved, not yet read by the assistant. */
    private suspend fun document(title: String? = "Team handbook", lines: List<String> = handbook): Long =
        meetings.importText(title, lines.joinToString("\n"), source = MeetingSource.DOCUMENT)

    private fun filed(
        title: String = "Quoting team handbook",
        tldr: String = "How the quoting team works.",
        meetingType: String = "document",
        attendees: List<String> = emptyList(),
        series: SeriesGuess = SeriesGuess(),
        sinceLastTime: List<String> = emptyList(),
        earlierItems: List<EarlierItem> = emptyList(),
        actionItems: List<ActionItem> = emptyList(),
        knowledge: List<KnowledgeNote> = emptyList(),
        questions: List<ClarifyingQuestion> = emptyList(),
    ) = json(
        MeetingAnalysis(
            title = title, meetingType = meetingType, tldr = tldr, attendees = attendees, series = series,
            sinceLastTime = sinceLastTime, earlierItems = earlierItems, actionItems = actionItems,
            knowledge = knowledge, clarifyingQuestions = questions,
        ),
    )

    private suspend fun series(name: String): Long =
        db.series().insert(SeriesEntity(name = name, key = knowledgeKey(name), createdAt = 1))

    private fun fourQuestions() = (1..4).map { ClarifyingQuestion(question = "Question $it?", why = "why $it", topic = "Topic $it", topicType = "term") }

    // -------------------------------------------------------------------------------------------
    // What is sent for a document

    @Test
    fun `a document is sent as a document, with the task of filing what it says`(): Unit = runBlocking {
        settings.setProfile(sam)
        val id = document()
        llm.reply(filed())

        assertEquals(SummaryResult.Done, assistant.summarizeMeeting(id))

        val request = llm.requests.single()
        assertEquals("meeting_summary", request.feature)
        assertEquals("the reply has the same shape as a meeting's, so everything downstream treats the two alike", Schemas.meetingAnalysis, request.schema)
        request.assertWellFormedConversation()

        val prompt = request.prompt
        assertTrue(
            prompt,
            prompt.contains(
                "<document>\n" +
                    "[00:00] Team handbook for the quoting team at Northwind Logistics\n" +
                    "[00:00] Priya Nair is VP Product and owns the roadmap and the budget\n" +
                    "[00:00] RateStream is the pricing engine and Dana Whitfield is its engineering lead\n" +
                    "[00:00] Releases go out on Thursdays after the weekly quoting standup\n" +
                    "</document>",
            ),
        )
        assertFalse("it is not called a transcript", prompt.contains("<transcript>"))
        assertTrue(prompt.contains("<about_the_document>\nTitle: Team handbook\nAdded on: Wednesday, 18 November 2026\n</about_the_document>"))
        assertFalse("there was no meeting to describe", prompt.contains("<meeting>"))

        assertTrue(prompt.endsWith(Prompts.documentTask(sam, 2)))
        assertTrue(prompt.contains("Sam Rivera has added this document to what you know about their work."))
        assertFalse(prompt.contains("Write up this meeting"))
        assertFalse(prompt.contains("live speech recognition"))

        assertTrue("what is already known comes first", prompt.indexOf("<knowledge_base>") in 0 until prompt.indexOf("<about_the_document>"))
        assertTrue("and the instructions come after the material", prompt.indexOf("has added this document") > prompt.indexOf("</document>"))
    }

    @Test
    fun `a document nobody has named is sent as not named yet`(): Unit = runBlocking {
        val id = document(title = null)
        llm.reply(filed())
        assistant.summarizeMeeting(id)

        assertTrue(llm.last.prompt.contains("<about_the_document>\nTitle: (not named yet)\nAdded on: "))
    }

    @Test
    fun `no recurring meetings are offered for a document to belong to`(): Unit = runBlocking {
        val standup = series("Quoting standup")
        val earlier = summarized("Quoting standup", Fixed.at(today - 7, 10), MeetingAnalysis(title = "Quoting standup", tldr = "Last week's standup."))
        db.meetings().setSeries(earlier, standup)
        insert(task(title = "Send the release notes", meetingId = earlier))
        // The handbook even mentions the standup by name.
        val id = document()
        llm.reply(filed())
        assistant.summarizeMeeting(id)

        val prompt = llm.last.prompt
        assertFalse(prompt, prompt.contains("<recurring_meetings>"))
        assertFalse(prompt.contains("[series "))
        assertFalse(prompt.contains("Last week's standup."))
        assertFalse(prompt.contains("Send the release notes"))
    }

    @Test
    fun `what the user already knows is sent with a document so entries can be added to or corrected`(): Unit = runBlocking {
        knowledge.save(KnowledgeType.PERSON, "Dana Whitfield", "Engineering lead.", KnowledgeOrigin.ONBOARDING)
        val id = document()
        llm.reply(filed())
        assistant.summarizeMeeting(id)

        assertTrue(llm.last.prompt.contains("### Dana Whitfield (person)\nEngineering lead.\n"))
    }

    // -------------------------------------------------------------------------------------------
    // What is kept from a document

    @Test
    fun `a document is filed with its notes, and what it says goes into the knowledge base`(): Unit = runBlocking {
        val id = document(title = null)
        llm.reply(
            filed(
                knowledge = listOf(
                    KnowledgeNote("person", "Priya Nair", "VP Product. Owns the roadmap and the budget."),
                    KnowledgeNote("project", "RateStream", "The pricing engine. Dana Whitfield is its engineering lead."),
                    KnowledgeNote("process", "Releases", "Go out on Thursdays after the weekly quoting standup."),
                ),
                actionItems = listOf(ActionItem(title = "Read the release checklist", ownership = "mine")),
            ),
        )

        assertEquals(SummaryResult.Done, assistant.summarizeMeeting(id))

        val saved = meeting(id)
        assertEquals(MeetingStatus.READY, saved.status)
        assertEquals(MeetingSource.DOCUMENT, saved.source)
        assertEquals("Quoting team handbook", saved.title)
        assertFalse(saved.titleIsAuto)
        assertEquals("How the quoting team works.", saved.tldr)
        assertEquals("document", saved.meetingType)
        assertEquals(now, saved.summarizedAt)
        assertEquals("", saved.error)

        val entries = db.knowledge().all().associateBy { it.title }
        assertEquals(setOf("Priya Nair", "RateStream", "Releases"), entries.keys)
        assertEquals(KnowledgeType.PROCESS, entries.getValue("Releases").type)
        assertTrue("each entry remembers the document it came from", entries.values.all { it.sourceMeetingIds == listOf(id) })

        // The rare document that does assign something.
        assertEquals(listOf("Read the release checklist"), tasksOf(id).map { it.title })
    }

    @Test
    fun `a name the user gave a document is kept over the one Claude would give it`(): Unit = runBlocking {
        val id = document(title = "Handbook v3")
        llm.reply(filed(title = "Quoting team handbook"))
        assistant.summarizeMeeting(id)

        assertEquals("Handbook v3", meeting(id).title)
    }

    @Test
    fun `a document never joins a recurring meeting the reply points at`(): Unit = runBlocking {
        val standup = series("Quoting standup")
        val id = document()
        llm.reply(filed(series = SeriesGuess(existingId = standup)))

        assistant.summarizeMeeting(id)

        assertNull("the document was filed under the standup", meeting(id).seriesId)
        assertTrue(db.meetings().inSeries(standup).isEmpty())
    }

    @Test
    fun `a document never starts a recurring meeting the reply names`(): Unit = runBlocking {
        series("Quoting standup")
        val id = document()
        llm.reply(filed(series = SeriesGuess(newName = "Handbook reviews")))

        assistant.summarizeMeeting(id)

        assertNull(meeting(id).seriesId)
        assertEquals("no recurring meeting may be made out of a document", listOf("Quoting standup"), db.series().all().map { it.name })
    }

    @Test
    fun `a document stays out of every series however often it is read again`(): Unit = runBlocking {
        val standup = series("Quoting standup")
        val id = document()
        repeat(2) {
            llm.reply(filed(series = SeriesGuess(existingId = standup, newName = "Quoting standup")))
            assistant.summarizeMeeting(id)
            assertNull(meeting(id).seriesId)
        }
        assertEquals(1, db.series().all().size)
    }

    @Test
    fun `talk of last time in a reply about a document is thrown away`(): Unit = runBlocking {
        val standup = series("Quoting standup")
        val earlier = summarized("Quoting standup", Fixed.at(today - 7, 10))
        db.meetings().setSeries(earlier, standup)
        val open = insert(task(title = "Send the release notes", meetingId = earlier))
        val id = document()
        llm.reply(
            filed(
                series = SeriesGuess(existingId = standup),
                sinceLastTime = listOf("The release moved to Thursday"),
                earlierItems = listOf(EarlierItem(taskId = open.id, status = "done", note = "Sent")),
            ),
        )

        assistant.summarizeMeeting(id)

        val stored = ContextBlocks.analysisOf(meeting(id))!!
        assertTrue(stored.sinceLastTime.isEmpty())
        assertTrue(stored.earlierItems.isEmpty())
    }

    @Test
    fun `nobody attended a document, whoever the reply lists`(): Unit = runBlocking {
        val id = document()
        llm.reply(filed(attendees = listOf("Priya Nair", "Dana Whitfield")))

        assistant.summarizeMeeting(id)

        assertEquals(emptyList<String>(), meeting(id).attendees)
    }

    @Test
    fun `a document is filed as a document whatever kind of meeting the reply calls it`(): Unit = runBlocking {
        for (called in listOf("review", "", "Document", "1:1")) {
            val id = document()
            llm.reply(filed(meetingType = called))
            assistant.summarizeMeeting(id)
            assertEquals("the reply called it \"$called\"", "document", meeting(id).meetingType)
        }
    }

    @Test
    fun `text brought in as a meeting's notes is still written up as a meeting`(): Unit = runBlocking {
        series("Quoting standup")
        val id = meetings.importText("Vendor call", handbook.joinToString("\n"), source = MeetingSource.IMPORT)
        llm.reply(filed(meetingType = "review", attendees = listOf("Priya Nair"), series = SeriesGuess(newName = "Vendor calls")))

        assistant.summarizeMeeting(id)

        val prompt = llm.last.prompt
        assertTrue(prompt.contains("<transcript>\n"))
        assertFalse(prompt.contains("<document>"))
        assertFalse(prompt.contains("<about_the_document>"))
        assertTrue(prompt.contains("<meeting>\nTitle: Vendor call\n"))
        assertTrue(prompt.contains("<recurring_meetings>"))
        assertTrue(prompt.contains("Write up this meeting"))
        assertFalse(prompt.contains("has added this document"))

        val saved = meeting(id)
        assertEquals("review", saved.meetingType)
        assertEquals(listOf("Priya Nair"), saved.attendees)
        assertEquals("Vendor calls", db.series().get(saved.seriesId!!)!!.name)
    }

    // -------------------------------------------------------------------------------------------
    // Questions about a document

    @Test
    fun `even while still learning, a document is asked about at most twice`(): Unit = runBlocking {
        val id = document()
        llm.reply(filed())
        assistant.summarizeMeeting(id)

        assertTrue(llm.last.prompt.contains("Ask at most 2 clarifying questions"))
        assertFalse(llm.last.prompt.contains("ask up to 4"))
    }

    @Test
    fun `no more questions about a document are kept than were asked for`(): Unit = runBlocking {
        // A new user's first document: the assistant is still in its learning period.
        val id = document()
        llm.reply(filed(questions = fourQuestions()))
        assistant.summarizeMeeting(id)

        assertTrue(llm.last.prompt.contains("Ask at most 2 clarifying questions"))
        assertEquals(listOf("Question 1?", "Question 2?"), db.questions().all().sortedBy { it.id }.map { it.question })
    }

    @Test
    fun `filing documents does not use up the questions kept for the first few meetings`(): Unit = runBlocking {
        // Five documents read before a single meeting has been heard.
        repeat(Assistant.LEARNING_MEETINGS) { number ->
            val id = document(title = "Handbook part $number")
            llm.reply(filed(title = "Handbook part $number"))
            assistant.summarizeMeeting(id)
        }

        val first = recorded("Pricing review")
        llm.reply(json(MeetingAnalysis(title = "Pricing review", tldr = "Three tiers agreed.")))
        assistant.summarizeMeeting(first)

        // The first meeting still gets the fuller set of questions: nothing has been learned from meetings yet.
        assertTrue(llm.last.prompt, llm.last.prompt.contains("ask up to 4 clarifying questions"))
    }

    @Test
    fun `a document with next to nothing in it is refused in words that fit a document`(): Unit = runBlocking {
        val id = document(lines = listOf("Draft. To be written."))

        val result = assistant.summarizeMeeting(id)

        assertTrue(result is SummaryResult.TooShort)
        assertTrue(llm.requests.isEmpty())
        val reason = meeting(id).error
        assertTrue(reason, reason.contains("too little to write up"))
        // Nothing was "captured": that is how a recording is talked about.
        assertFalse(reason, reason.contains("captured"))
    }

    @Test
    fun `the week's review lists the meetings held, not the documents added`(): Unit = runBlocking {
        settings.setProfile(sam)
        val id = document(title = "Carrier onboarding guide")
        llm.reply(filed(title = "Carrier onboarding guide"))
        assistant.summarizeMeeting(id)
        summarized("Pricing review", Fixed.at(today, 9))
        insert(task(title = "Send the deck", status = TaskStatus.DONE, completedAt = now))

        llm.reply(AideJson.encodeToString(WeekReview.serializer(), WeekReview(headline = "A steady week.", overall = "steady")))
        assistant.reviewWeek(Fixed.monday)

        val listed = llm.last.prompt.substringAfter("<meetings_this_week>").substringBefore("</meetings_this_week>")
        assertTrue(listed, listed.contains("Pricing review"))
        assertFalse(listed, listed.contains("Carrier onboarding guide"))
    }

    @Test
    fun `with learning mode off a document asks nothing even if Claude sends questions`(): Unit = runBlocking {
        settings.setLearningMode(false)
        val id = document()
        llm.reply(filed(questions = fourQuestions()))
        assistant.summarizeMeeting(id)

        assertTrue(llm.last.prompt.contains("Don't ask any clarifying questions this time"))
        assertTrue(db.questions().all().isEmpty())
    }

    // -------------------------------------------------------------------------------------------
    // Documents and the record of the user's work

    /** A document that has been read and filed, added at noon [daysAgo] days ago. */
    private suspend fun filedDocument(title: String, daysAgo: Long, tldr: String = "What $title says."): Long = db.meetings().insert(
        MeetingEntity(
            title = title,
            titleIsAuto = false,
            startedAt = Fixed.at(today - daysAgo, 12),
            endedAt = Fixed.at(today - daysAgo, 12),
            source = MeetingSource.DOCUMENT,
            status = MeetingStatus.READY,
            meetingType = "document",
            tldr = tldr,
            analysisJson = AideJson.encodeToString(MeetingAnalysis.serializer(), MeetingAnalysis(title = title, tldr = tldr, decisions = listOf("Ship weekly"))),
            summarizedAt = Fixed.at(today - daysAgo, 12, 5),
        ),
    )

    @Test
    fun `a document is not listed among the meetings the user held`(): Unit = runBlocking {
        val held = summarized("Pricing review", Fixed.at(today - 2, 10))
        val added = filedDocument("Team handbook", daysAgo = 1)
        llm.reply(AideJson.encodeToString(ProgressUpdate.serializer(), ProgressUpdate()))

        assistant.updateProgress()

        val meetingsSent = llm.last.prompt.substringAfter("<meetings>\n").substringBefore("\n</meetings>")
        assertTrue(meetingsSent, meetingsSent.contains("[meeting $held]"))
        assertFalse(meetingsSent, meetingsSent.contains("[meeting $added]"))
        assertFalse(meetingsSent.contains("Team handbook"))
        assertEquals(1, meetingsSent.lines().size)
    }

    @Test
    fun `adding a document is not by itself something to bring the record up to date for`(): Unit = runBlocking {
        filedDocument("Team handbook", daysAgo = 1)
        filedDocument("Org chart", daysAgo = 3)

        try {
            assistant.updateProgress()
            fail("Expected to be told there is nothing new")
        } catch (e: LlmException) {
            assertEquals(LlmException.Kind.OTHER, e.kind)
            assertTrue(e.message.orEmpty(), e.message.orEmpty().contains("Nothing has been finished or recorded"))
        }
        assertTrue("having nothing to work from must not cost a call", llm.requests.isEmpty())
    }

    @Test
    fun `a win cannot be pinned on a document as though it were a meeting`(): Unit = runBlocking {
        val held = summarized("Pricing review", Fixed.at(today - 2, 10))
        val added = filedDocument("Team handbook", daysAgo = 1)
        llm.reply(
            AideJson.encodeToString(
                ProgressUpdate.serializer(),
                ProgressUpdate(
                    wins = listOf(
                        LoggedWin(title = "Got three tiers agreed", day = "2026-11-16", meetingId = held),
                        LoggedWin(title = "Wrote the team handbook", day = "2026-11-17", meetingId = added),
                    ),
                ),
            ),
        )

        assistant.updateProgress()

        val logged = db.wins().all().associateBy { it.title }
        assertEquals(held, logged.getValue("Got three tiers agreed").meetingId)
        assertNull(logged.getValue("Wrote the team handbook").meetingId)
    }
}
