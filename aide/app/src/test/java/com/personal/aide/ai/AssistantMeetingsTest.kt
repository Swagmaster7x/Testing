package com.personal.aide.ai

import android.app.Application
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.aide.ai.Assistant.SummaryResult
import com.personal.aide.data.ActionItem
import com.personal.aide.data.AideJson
import com.personal.aide.data.ClarifyingQuestion
import com.personal.aide.data.KnowledgeNote
import com.personal.aide.data.MeetingAnalysis
import com.personal.aide.data.db.KnowledgeOrigin
import com.personal.aide.data.db.KnowledgeType
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.QuestionEntity
import com.personal.aide.data.db.QuestionStatus
import com.personal.aide.data.db.SegmentKind
import com.personal.aide.data.db.TaskOrigin
import com.personal.aide.data.db.TaskStatus
import com.personal.aide.testing.Fixed
import com.personal.aide.testing.prompt
import com.personal.aide.testing.systemText
import com.personal.aide.testing.task
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config
import java.util.Collections

@RunWith(AndroidJUnit4::class)
@Config(sdk = [35], application = Application::class)
class AssistantMeetingsTest : AssistantTestBase() {

    /** A reply in the exact shape the schema makes Claude send. */
    private val pricingReply = """
        {"title":"Q4 pricing review","meeting_type":"review",
         "tldr":"The team agreed a three-tier model and will ship it in Q1.",
         "key_points":["Three tiers replace the current plans","Enterprise stays custom"],
         "decisions":["Ship the three-tier model in Q1"],
         "action_items":[
           {"title":"Send revised pricing deck to Marcus","details":"Include the enterprise tier","owner":"Dana Whitfield","ownership":"others","due_date":"2026-11-20","priority":"high","evidence":"Dana said she would send it by Friday"},
           {"title":"Draft the pricing FAQ","details":"","owner":"","ownership":"mine","due_date":"","priority":"normal","evidence":"Asked of Sam by name"},
           {"title":"Book the offsite venue","details":"","owner":"","ownership":"unclear","due_date":"2026-11-30","priority":"low","evidence":"Someone needs to book it"}
         ],
         "open_questions":["Who signs off on discounts?"],
         "risks":["Legal review may slip"],
         "attendees":["Dana Whitfield","Marcus Lee"],
         "knowledge":[
           {"type":"person","title":"Dana Whitfield","content":"Engineering lead. Owns the pricing deck."},
           {"type":"project","title":"Three-tier pricing","content":"New pricing model shipping in Q1."}
         ],
         "clarifying_questions":[
           {"question":"Who is Marcus?","why":"He was mentioned twice","topic":"Marcus Lee","topic_type":"person"},
           {"question":"What does QBR stand for?","why":"Unexplained acronym","topic":"QBR","topic_type":"term"}
         ],
         "transcript_quality":"good"}
    """.trimIndent()

    private fun items(vararg titles: String) = titles.map { ActionItem(title = it, ownership = "mine") }

    // -------------------------------------------------------------------------------------------
    // What a summary saves

    @Test
    fun `a summary is saved as notes, tasks, knowledge and questions`(): Unit = runBlocking {
        val id = recorded()
        llm.reply(pricingReply)

        assertEquals(SummaryResult.Done, assistant.summarizeMeeting(id))

        val saved = meeting(id)
        assertEquals(MeetingStatus.READY, saved.status)
        assertEquals("Q4 pricing review", saved.title)
        assertEquals("review", saved.meetingType)
        assertEquals("The team agreed a three-tier model and will ship it in Q1.", saved.tldr)
        assertEquals("", saved.error)
        assertEquals(now, saved.summarizedAt)
        assertEquals("claude-opus-5-5", saved.model)
        assertEquals(47, saved.wordCount)
        assertEquals(listOf("Dana Whitfield", "Marcus Lee"), saved.attendees)

        val analysis = ContextBlocks.analysisOf(saved)!!
        assertEquals(listOf("Three tiers replace the current plans", "Enterprise stays custom"), analysis.keyPoints)
        assertEquals(listOf("Ship the three-tier model in Q1"), analysis.decisions)
        assertEquals(listOf("Who signs off on discounts?"), analysis.openQuestions)
        assertEquals(listOf("Legal review may slip"), analysis.risks)
        assertEquals(3, analysis.actionItems.size)
        assertEquals("good", analysis.transcriptQuality)

        val (deck, faq, venue) = tasksOf(id)
        assertEquals("Send revised pricing deck to Marcus", deck.title)
        assertEquals("Include the enterprise tier", deck.details)
        assertEquals(Ownership.OTHERS, deck.ownership)
        assertEquals("Dana Whitfield", deck.owner)
        assertEquals(Fixed.day(2026, 11, 20), deck.dueDay)
        assertEquals(2, deck.priority)
        assertEquals("Dana said she would send it by Friday", deck.evidence)

        assertEquals("Draft the pricing FAQ", faq.title)
        assertEquals(Ownership.MINE, faq.ownership)
        assertEquals("", faq.owner)
        assertNull(faq.dueDay)
        assertEquals(1, faq.priority)

        assertEquals("Book the offsite venue", venue.title)
        assertEquals(Ownership.UNCLEAR, venue.ownership)
        assertEquals(Fixed.day(2026, 11, 30), venue.dueDay)
        assertEquals(0, venue.priority)

        for (task in listOf(deck, faq, venue)) {
            assertEquals(TaskOrigin.AI, task.origin)
            assertEquals(TaskStatus.OPEN, task.status)
            assertEquals(id, task.meetingId)
            assertEquals(now, task.createdAt)
            assertFalse(task.edited)
            assertNull(task.plannedDay)
        }

        val entries = db.knowledge().all().associateBy { it.title }
        assertEquals(setOf("Dana Whitfield", "Three-tier pricing"), entries.keys)
        assertEquals(KnowledgeType.PERSON, entries.getValue("Dana Whitfield").type)
        assertEquals("Engineering lead. Owns the pricing deck.", entries.getValue("Dana Whitfield").content)
        assertEquals(KnowledgeType.PROJECT, entries.getValue("Three-tier pricing").type)
        assertTrue(entries.values.all { it.origin == KnowledgeOrigin.MEETING && it.sourceMeetingIds == listOf(id) })

        val (marcus, qbr) = db.questions().all().sortedBy { it.id }
        assertEquals("Who is Marcus?", marcus.question)
        assertEquals("He was mentioned twice", marcus.why)
        assertEquals("Marcus Lee", marcus.topic)
        assertEquals(KnowledgeType.PERSON, marcus.topicType)
        assertEquals(id, marcus.meetingId)
        assertEquals(QuestionStatus.OPEN, marcus.status)
        assertEquals("QBR", qbr.topic)
        assertEquals(KnowledgeType.TERM, qbr.topicType)
    }

    @Test
    fun `the call is recorded with what it cost`(): Unit = runBlocking {
        val id = recorded()
        llm.reply(pricingReply, model = "claude-opus-5-5", usage = LlmUsage(inputTokens = 4_321, outputTokens = 987, cacheReadTokens = 100, cacheWriteTokens = 50))
        assistant.summarizeMeeting(id)

        val usage = db.usage().all().single()
        assertEquals("meeting_summary", usage.feature)
        assertEquals("claude-opus-5-5", usage.model)
        assertEquals(4_321L, usage.inputTokens)
        assertEquals(987L, usage.outputTokens)
        assertEquals(100L, usage.cacheReadTokens)
        assertEquals(50L, usage.cacheWriteTokens)
        assertTrue(usage.ok)
    }

    @Test
    fun `a summary served by a fallback model is credited to that model`(): Unit = runBlocking {
        val id = recorded()
        llm.reply(pricingReply, model = "claude-opus-4-8")
        assistant.summarizeMeeting(id)

        assertEquals("claude-opus-4-8", meeting(id).model)
        assertEquals("claude-opus-4-8", db.usage().all().single().model)
    }

    // -------------------------------------------------------------------------------------------
    // What is sent

    @Test
    fun `the request carries the transcript, the meeting's details and the reply shape`(): Unit = runBlocking {
        val id = recorded(attendees = listOf("Dana Whitfield", "Priya Nair"))
        llm.reply(pricingReply)
        assistant.summarizeMeeting(id)

        val request = llm.requests.single()
        assertEquals("meeting_summary", request.feature)
        assertEquals(Schemas.meetingAnalysis, request.schema)
        assertEquals(listOf(LlmMessage.Role.USER), request.messages.map { it.role })

        val prompt = request.prompt
        assertTrue(
            prompt.contains(
                "<transcript>\n" +
                    "[00:00] good morning everyone let's get started with the pricing review\n" +
                    "[00:30] dana whitfield will send the revised pricing deck to marcus by friday\n" +
                    "[01:00] we agreed to ship the three tier model in the first quarter\n" +
                    "[01:30] someone needs to book the offsite venue before the end of the month\n" +
                    "</transcript>",
            ),
        )
        assertTrue(prompt.contains("<meeting>\nTitle: (not named yet)\nDate: Wednesday, 18 November 2026, 2:30 PM\nLength: 30 min\nInvited, according to the calendar: Dana Whitfield, Priya Nair\n</meeting>"))
        assertTrue(prompt.contains("<knowledge_base>\nEmpty so far.\n</knowledge_base>"))
        assertTrue("the instructions come after the material", prompt.indexOf("Write up this meeting") > prompt.indexOf("</transcript>"))
    }

    @Test
    fun `typed notes and flagged moments are marked in the transcript that is sent`(): Unit = runBlocking {
        val id = recorded()
        meetings.addSegment(id, SegmentKind.NOTE, "Dana owns the deck", 45_000)
        meetings.addSegment(id, SegmentKind.FLAG, "", 95_000)
        llm.reply(pricingReply)
        assistant.summarizeMeeting(id)

        val prompt = llm.last.prompt
        assertTrue(prompt.contains("[00:30] dana whitfield will send the revised pricing deck to marcus by friday\n[00:45] [NOTE] Dana owns the deck\n[01:00] we agreed"))
        assertTrue(prompt.contains("[01:35] [FLAG] The user marked this moment as important."))
    }

    @Test
    fun `the system prompt says who the assistant works for`(): Unit = runBlocking {
        settings.setProfile(sam)
        val id = recorded()
        llm.reply(pricingReply)
        assistant.summarizeMeeting(id)

        val system = llm.last.systemText
        assertTrue(system.contains("You work for Sam Rivera."))
        assertTrue(system.contains("<work_profile>\nName: Sam Rivera\nRole: Senior Product Manager\nCompany: Northwind Logistics\nReports to: Priya Nair\nCurrent goals:\n- Launch self-serve quoting by end of Q1\n</work_profile>"))
        assertTrue(llm.last.prompt.contains("Write up this meeting for Sam Rivera."))
    }

    @Test
    fun `with no profile yet the prompt says so instead of leaving a hole`(): Unit = runBlocking {
        val id = recorded()
        llm.reply(pricingReply)
        assistant.summarizeMeeting(id)

        assertTrue(llm.last.systemText.contains("<work_profile>\nNothing is known about the user's work yet.\n</work_profile>"))
        assertTrue(llm.last.prompt.contains("Write up this meeting for the user."))
    }

    @Test
    fun `what is already known is sent so it can be used and updated`(): Unit = runBlocking {
        knowledge.save(KnowledgeType.PERSON, "Dana Whitfield", "Engineering lead. Owns the quoting API.", KnowledgeOrigin.ONBOARDING)
        knowledge.save(KnowledgeType.PROJECT, "Atlas", "The data warehouse.", KnowledgeOrigin.MANUAL)
        val id = recorded()
        llm.reply(pricingReply)
        assistant.summarizeMeeting(id)

        val prompt = llm.last.prompt
        assertTrue(prompt.contains("- person: Dana Whitfield\n"))
        assertTrue(prompt.contains("- project: Atlas\n"))
        assertTrue(prompt.contains("### Dana Whitfield (person)\nEngineering lead. Owns the quoting API.\n"))
        assertTrue(prompt.contains("### Atlas (project)\nThe data warehouse.\n"))
        assertTrue("the knowledge base comes before the transcript", prompt.indexOf("<knowledge_base>") < prompt.indexOf("<transcript>"))
    }

    @Test
    fun `pasted text is described as pasted, a recording as recognized speech`(): Unit = runBlocking {
        val live = recorded()
        llm.reply(pricingReply)
        assistant.summarizeMeeting(live)
        assertTrue(llm.last.prompt.contains("live speech recognition"))
        assertFalse(llm.last.prompt.contains("pasted it in"))

        val pasted = meetings.importText("Vendor call", pricingTalk.joinToString("\n"))
        llm.reply(pricingReply)
        assistant.summarizeMeeting(pasted)
        assertTrue(llm.last.prompt.contains("pasted it in"))
        assertFalse(llm.last.prompt.contains("live speech recognition"))
        assertTrue(llm.last.prompt.contains("Title: Vendor call\n"))
    }

    // -------------------------------------------------------------------------------------------
    // When there is nothing to summarize, or it goes wrong

    @Test
    fun `a transcript too short to be a meeting is not sent`(): Unit = runBlocking {
        val id = recorded(lines = listOf("testing testing one two three"))

        assertEquals(SummaryResult.TooShort(5), assistant.summarizeMeeting(id))

        assertTrue("nothing may be sent to Claude", llm.requests.isEmpty())
        val saved = meeting(id)
        assertEquals(MeetingStatus.TRANSCRIBED, saved.status)
        assertTrue(saved.error, saved.error.contains("5 words"))
        assertEquals(5, saved.wordCount)
        assertTrue(db.usage().all().isEmpty())
        assertTrue(tasksOf(id).isEmpty())
    }

    @Test
    fun `the shortest meeting worth sending has twenty-five words`(): Unit = runBlocking {
        val twentyFour = recorded(lines = listOf((1..24).joinToString(" ") { "word$it" }))
        assertEquals(SummaryResult.TooShort(24), assistant.summarizeMeeting(twentyFour))
        assertTrue(llm.requests.isEmpty())

        val twentyFive = recorded(lines = listOf((1..20).joinToString(" ") { "word$it" }, "and five more words here"))
        llm.reply(pricingReply)
        assertEquals(SummaryResult.Done, assistant.summarizeMeeting(twentyFive))
        assertEquals(1, llm.requests.size)
    }

    @Test
    fun `an empty meeting is too short`(): Unit = runBlocking {
        val id = recorded(lines = emptyList())
        assertEquals(SummaryResult.TooShort(0), assistant.summarizeMeeting(id))
        assertTrue(llm.requests.isEmpty())
    }

    @Test
    fun `the user can ask for a short transcript to be summarized anyway`(): Unit = runBlocking {
        val id = recorded(lines = listOf("ship it on friday"))
        llm.reply(json(MeetingAnalysis(title = "Ship date", tldr = "Ship on Friday.")))

        assertEquals(SummaryResult.Done, assistant.summarizeMeeting(id, force = true))
        assertTrue(llm.last.prompt.contains("[00:00] ship it on friday"))
        assertEquals(MeetingStatus.READY, meeting(id).status)
    }

    @Test
    fun `a failed call leaves the meeting marked failed with the reason`(): Unit = runBlocking {
        val id = recorded()
        llm.fail(LlmException.Kind.OVERLOADED, "Claude is busy right now. Try again in a moment.")

        val result = assistant.summarizeMeeting(id)

        assertTrue(result is SummaryResult.Failed)
        assertEquals(LlmException.Kind.OVERLOADED, (result as SummaryResult.Failed).error.kind)
        val saved = meeting(id)
        assertEquals(MeetingStatus.FAILED, saved.status)
        assertEquals("Claude is busy right now. Try again in a moment.", saved.error)
        assertTrue("the placeholder name is untouched", saved.titleIsAuto)
        assertTrue(tasksOf(id).isEmpty())
        assertTrue(db.knowledge().all().isEmpty())
        assertTrue(db.questions().all().isEmpty())

        val usage = db.usage().all().single()
        assertFalse(usage.ok)
        assertEquals("meeting_summary", usage.feature)
    }

    @Test
    fun `trying again after a failure works and clears the error`(): Unit = runBlocking {
        val id = recorded()
        llm.fail(LlmException.Kind.OFFLINE, "Couldn't reach Claude. Check your internet connection.")
        assistant.summarizeMeeting(id)
        now += 1_000
        llm.reply(pricingReply)

        assertEquals(SummaryResult.Done, assistant.summarizeMeeting(id))
        assertEquals(MeetingStatus.READY, meeting(id).status)
        assertEquals("", meeting(id).error)
        assertEquals(3, tasksOf(id).size)
        assertEquals(listOf(false, true), db.usage().all().map { it.ok })
    }

    @Test
    fun `a missing key fails the summary but is not counted as a failed call`(): Unit = runBlocking {
        val id = recorded()
        llm.fail(LlmException.Kind.NO_KEY, "Add your Claude API key in Settings first.")

        val result = assistant.summarizeMeeting(id)

        assertEquals(LlmException.Kind.NO_KEY, (result as SummaryResult.Failed).error.kind)
        assertEquals(MeetingStatus.FAILED, meeting(id).status)
        assertEquals("Add your Claude API key in Settings first.", meeting(id).error)
        assertTrue(db.usage().all().isEmpty())
    }

    @Test
    fun `a reply that is not in the expected shape fails the summary`(): Unit = runBlocking {
        val id = recorded()
        llm.reply("I'm sorry, I can't produce notes for this meeting.")

        val result = assistant.summarizeMeeting(id)

        assertEquals(LlmException.Kind.BAD_REPLY, (result as SummaryResult.Failed).error.kind)
        assertEquals(MeetingStatus.FAILED, meeting(id).status)
        assertTrue(meeting(id).error.isNotBlank())
        assertTrue(tasksOf(id).isEmpty())
    }

    @Test
    fun `a reply with prose around the JSON is still read`(): Unit = runBlocking {
        val id = recorded()
        llm.reply("Here are the notes you asked for:\n\n```json\n$pricingReply\n```\nLet me know if you need anything else.")

        assertEquals(SummaryResult.Done, assistant.summarizeMeeting(id))
        assertEquals("Q4 pricing review", meeting(id).title)
        assertEquals(3, tasksOf(id).size)
    }

    @Test
    fun `a meeting that has gone is reported missing without a call`(): Unit = runBlocking {
        assertEquals(SummaryResult.Missing, assistant.summarizeMeeting(404))
        assertTrue(llm.requests.isEmpty())
    }

    @Test
    fun `a meeting deleted while its summary was being written saves nothing`(): Unit = runBlocking {
        val id = recorded()
        llm.answer {
            meetings.delete(id)
            pricingReply
        }

        assertEquals(SummaryResult.Missing, assistant.summarizeMeeting(id))
        assertTrue(db.meetings().all().isEmpty())
        assertTrue("no tasks for a meeting that no longer exists", db.tasks().all().isEmpty())
        assertTrue(db.questions().all().isEmpty())
    }

    // -------------------------------------------------------------------------------------------
    // Action items

    @Test
    fun `words Claude might send for ownership, priority and dates are read safely`(): Unit = runBlocking {
        val id = recorded()
        llm.reply(
            json(
                MeetingAnalysis(
                    actionItems = listOf(
                        ActionItem(title = "  Padded title  ", details = "  d  ", owner = "  Dana  ", ownership = "OTHERS", dueDate = " 2026-12-01 ", priority = "HIGH", evidence = "  e  "),
                        ActionItem(title = "No owner word", ownership = "", dueDate = "next Friday", priority = ""),
                        ActionItem(title = "Mine with a stray owner", owner = "Sam", ownership = "mine", dueDate = "2026-02-30", priority = "urgent"),
                        ActionItem(title = "Unknown words", ownership = "the team", priority = "critical"),
                    ),
                ),
            ),
        )
        assistant.summarizeMeeting(id)

        val (padded, noOwner, mine, unknown) = tasksOf(id)
        assertEquals("Padded title", padded.title)
        assertEquals("d", padded.details)
        assertEquals("Dana", padded.owner)
        assertEquals("e", padded.evidence)
        assertEquals(Ownership.OTHERS, padded.ownership)
        assertEquals(Fixed.day(2026, 12, 1), padded.dueDay)
        assertEquals(2, padded.priority)

        assertEquals("when in doubt a task is nobody's rather than the user's", Ownership.UNCLEAR, noOwner.ownership)
        assertNull("a date in words is no date", noOwner.dueDay)
        assertEquals(1, noOwner.priority)

        assertEquals(Ownership.MINE, mine.ownership)
        assertEquals("the user's own task names no owner", "", mine.owner)
        assertNull("a date that doesn't exist is no date", mine.dueDay)
        assertEquals(2, mine.priority)

        assertEquals(Ownership.UNCLEAR, unknown.ownership)
        assertEquals(1, unknown.priority)
    }

    @Test
    fun `an action item listed twice is saved once and one with no title not at all`(): Unit = runBlocking {
        val id = recorded()
        llm.reply(json(MeetingAnalysis(actionItems = items("Send the deck", "  ", "send the deck.", "Book venue", "", "SEND THE DECK"))))
        assistant.summarizeMeeting(id)

        assertEquals(listOf("Send the deck", "Book venue"), tasksOf(id).map { it.title })
    }

    @Test
    fun `a summary with no action items saves no tasks`(): Unit = runBlocking {
        val id = recorded()
        llm.reply(json(MeetingAnalysis(title = "Quiet one", tldr = "Nothing was agreed.")))
        assertEquals(SummaryResult.Done, assistant.summarizeMeeting(id))
        assertTrue(db.tasks().all().isEmpty())
    }

    // -------------------------------------------------------------------------------------------
    // Summarizing again

    @Test
    fun `summarizing again replaces untouched tasks with the new summary's`(): Unit = runBlocking {
        val id = recorded()
        llm.reply(json(MeetingAnalysis(actionItems = items("Send the deck", "Book venue", "Draft FAQ"))))
        assistant.summarizeMeeting(id)
        val firstIds = tasksOf(id).map { it.id }

        llm.reply(json(MeetingAnalysis(actionItems = items("Send the deck", "Call legal"))))
        assistant.summarizeMeeting(id)

        val after = tasksOf(id)
        assertEquals(listOf("Send the deck", "Call legal"), after.map { it.title })
        assertTrue("what the new summary no longer lists is gone", after.none { it.title == "Book venue" || it.title == "Draft FAQ" })
        assertTrue(after.all { it.origin == TaskOrigin.AI && it.status == TaskStatus.OPEN })
        assertEquals("the old rows were replaced, not kept alongside", 2, db.tasks().all().size)
        assertTrue(after.none { it.id in firstIds })
    }

    @Test
    fun `tasks the user finished, corrected or threw out survive a new summary and are not duplicated`(): Unit = runBlocking {
        val id = recorded()
        llm.reply(json(MeetingAnalysis(actionItems = items("Send the deck", "Book venue", "Draft FAQ", "Call legal"))))
        assistant.summarizeMeeting(id)
        val (deck, venue, faq, legal) = tasksOf(id)

        now += 60_000
        tasks.setDone(deck.id, true)
        tasks.edit(venue.copy(dueDay = today + 9))
        tasks.dismiss(faq.id)
        val doneAt = now

        // The new summary lists all four again, spelled a little differently, plus one new item.
        now += 60_000
        llm.reply(json(MeetingAnalysis(actionItems = items("send the deck.", "Book Venue", "Draft FAQ", "Call legal", "Email Priya"))))
        assistant.summarizeMeeting(id)

        val after = tasksOf(id)
        assertEquals("one row per task, no duplicates", 5, after.size)
        assertEquals(setOf("Send the deck", "Book venue", "Draft FAQ", "Call legal", "Email Priya"), after.map { it.title }.toSet())

        val deckAfter = after.single { it.id == deck.id }
        assertEquals(TaskStatus.DONE, deckAfter.status)
        assertEquals(doneAt, deckAfter.completedAt)

        val venueAfter = after.single { it.id == venue.id }
        assertEquals("the user's date stands", today + 9, venueAfter.dueDay)
        assertTrue(venueAfter.edited)

        assertEquals(TaskStatus.DISMISSED, after.single { it.id == faq.id }.status)

        // The untouched one was replaced by a fresh copy; the new one was added.
        assertFalse(after.any { it.id == legal.id })
        assertEquals(TaskStatus.OPEN, after.single { it.title == "Call legal" }.status)
        assertEquals(TaskOrigin.AI, after.single { it.title == "Email Priya" }.origin)
    }

    @Test
    fun `a dismissed task stays dismissed however often the meeting is summarized`(): Unit = runBlocking {
        val id = recorded()
        llm.reply(json(MeetingAnalysis(actionItems = items("Not really a task"))))
        assistant.summarizeMeeting(id)
        tasks.dismiss(tasksOf(id).single().id)

        repeat(3) {
            llm.reply(json(MeetingAnalysis(actionItems = items("Not really a task"))))
            assistant.summarizeMeeting(id)
        }

        assertEquals(listOf(TaskStatus.DISMISSED), tasksOf(id).map { it.status })
    }

    @Test
    fun `tasks the user added by hand to the meeting are left alone`(): Unit = runBlocking {
        val id = recorded()
        val manual = tasks.add("Send the deck", meetingId = id)!!
        val elsewhere = insert(task(title = "From another meeting", origin = TaskOrigin.AI))

        llm.reply(json(MeetingAnalysis(actionItems = items("Send the deck", "Book venue"))))
        assistant.summarizeMeeting(id)

        assertEquals("the assistant doesn't add a copy of a task the user already wrote", listOf("Send the deck", "Book venue"), tasksOf(id).map { it.title })
        assertEquals(TaskOrigin.MANUAL, db.tasks().get(manual)!!.origin)
        assertEquals("untouched tasks of other meetings are not swept up", elsewhere, db.tasks().get(elsewhere.id))
    }

    @Test
    fun `a task the user reworded does not come back under its old wording`(): Unit = runBlocking {
        val id = recorded()
        llm.reply(json(MeetingAnalysis(actionItems = items("Send the deck"))))
        assistant.summarizeMeeting(id)
        val suggested = tasksOf(id).single()
        tasks.edit(suggested.copy(title = "Send the revised pricing deck to Marcus and Priya"))

        // Claude reads the same transcript and finds the same action item again.
        llm.reply(json(MeetingAnalysis(actionItems = items("Send the deck"))))
        assistant.summarizeMeeting(id)

        assertEquals(listOf("Send the revised pricing deck to Marcus and Priya"), tasksOf(id).map { it.title })
    }

    @Test
    fun `a task whose owner the user settled keeps that answer after a new summary`(): Unit = runBlocking {
        val id = recorded()
        llm.reply(json(MeetingAnalysis(actionItems = listOf(ActionItem(title = "Book the offsite venue", ownership = "unclear")))))
        assistant.summarizeMeeting(id)
        tasks.setOwnership(tasksOf(id).single().id, Ownership.MINE)

        llm.reply(json(MeetingAnalysis(actionItems = listOf(ActionItem(title = "Book the offsite venue", ownership = "unclear")))))
        assistant.summarizeMeeting(id)

        val after = tasksOf(id).single()
        assertEquals("the user already said whose this is", Ownership.MINE, after.ownership)
    }

    @Test
    fun `a task the user pinned to a day keeps its day after a new summary`(): Unit = runBlocking {
        val id = recorded()
        llm.reply(json(MeetingAnalysis(actionItems = items("Draft FAQ"))))
        assistant.summarizeMeeting(id)
        tasks.planFor(tasksOf(id).single().id, today + 1)

        llm.reply(json(MeetingAnalysis(actionItems = items("Draft FAQ"))))
        assistant.summarizeMeeting(id)

        assertEquals(today + 1, tasksOf(id).single().plannedDay)
    }

    @Test
    fun `a new summary replaces the old notes`(): Unit = runBlocking {
        val id = recorded()
        llm.reply(json(MeetingAnalysis(title = "First go", tldr = "First summary.", decisions = listOf("Old decision"))))
        assistant.summarizeMeeting(id)
        now += 3_600_000
        llm.reply(json(MeetingAnalysis(title = "Second go", tldr = "Second summary.", decisions = listOf("New decision"))), model = "claude-sonnet-5-5")
        assistant.summarizeMeeting(id)

        val saved = meeting(id)
        assertEquals("Second summary.", saved.tldr)
        assertEquals(listOf("New decision"), ContextBlocks.analysisOf(saved)!!.decisions)
        assertEquals(now, saved.summarizedAt)
        assertEquals("claude-sonnet-5-5", saved.model)
    }

    @Test
    fun `a failed second attempt keeps the first summary's tasks`(): Unit = runBlocking {
        val id = recorded()
        llm.reply(pricingReply)
        assistant.summarizeMeeting(id)
        llm.fail(LlmException.Kind.OVERLOADED)

        assistant.summarizeMeeting(id)

        assertEquals(MeetingStatus.FAILED, meeting(id).status)
        assertEquals(3, tasksOf(id).size)
        assertEquals("the notes already written are still there to read", "The team agreed a three-tier model and will ship it in Q1.", meeting(id).tldr)
    }

    // -------------------------------------------------------------------------------------------
    // The meeting's name and people

    @Test
    fun `a name the user gave is sent to Claude and not overwritten`(): Unit = runBlocking {
        val id = recorded(title = "Weekly pricing sync")
        llm.reply(pricingReply)
        assistant.summarizeMeeting(id)

        assertTrue(llm.last.prompt.contains("Title: Weekly pricing sync\n"))
        assertEquals("Weekly pricing sync", meeting(id).title)
        assertFalse(meeting(id).titleIsAuto)
    }

    @Test
    fun `a rename or a rating made while the summary was being written is kept`(): Unit = runBlocking {
        val id = recorded()
        llm.answer {
            meetings.rename(id, "Board prep")
            meetings.rate(id, 1)
            pricingReply
        }
        assistant.summarizeMeeting(id)

        val saved = meeting(id)
        assertEquals("Board prep", saved.title)
        assertEquals(1, saved.rating)
        assertEquals(MeetingStatus.READY, saved.status)
        assertEquals("The team agreed a three-tier model and will ship it in Q1.", saved.tldr)
    }

    @Test
    fun `a very long suggested name is cut to eighty characters at most, with no space left dangling`(): Unit = runBlocking {
        val id = recorded()
        llm.reply(json(MeetingAnalysis(title = "  " + "Pricing ".repeat(30), tldr = "t")))
        assistant.summarizeMeeting(id)

        val title = meeting(id).title
        // "Pricing " is eight characters, so a cut at eighty lands on a space, which is dropped.
        assertEquals(79, title.length)
        assertEquals(title.trim(), title)
        assertTrue(title.startsWith("Pricing Pricing"))
    }

    @Test
    fun `no suggested name leaves the placeholder`(): Unit = runBlocking {
        val id = recorded()
        val placeholder = meeting(id).title
        llm.reply(json(MeetingAnalysis(title = "   ", tldr = "Too garbled to name.")))
        assistant.summarizeMeeting(id)

        assertEquals(placeholder, meeting(id).title)
        assertTrue(meeting(id).titleIsAuto)
    }

    @Test
    fun `once the assistant has named a meeting it counts as named`(): Unit = runBlocking {
        val id = recorded()
        llm.reply(pricingReply)
        assistant.summarizeMeeting(id)
        assertEquals("Q4 pricing review", meeting(id).title)
        assertFalse("titleIsAuto is documented as false once the user or the assistant has given a real name", meeting(id).titleIsAuto)

        // So a second pass is told the name instead of "(not named yet)".
        llm.reply(pricingReply)
        assistant.summarizeMeeting(id)
        assertTrue(llm.last.prompt.contains("Title: Q4 pricing review\n"))
    }

    @Test
    fun `people from the calendar invitation are kept over the ones Claude heard`(): Unit = runBlocking {
        val invited = recorded(attendees = listOf("Dana Whitfield", "Priya Nair"))
        llm.reply(pricingReply)
        assistant.summarizeMeeting(invited)
        assertEquals(listOf("Dana Whitfield", "Priya Nair"), meeting(invited).attendees)

        val uninvited = recorded()
        llm.reply(json(MeetingAnalysis(tldr = "t", attendees = listOf(" Dana ", "", "Marcus", "Dana"))))
        assistant.summarizeMeeting(uninvited)
        assertEquals(listOf("Dana", "Marcus"), meeting(uninvited).attendees)
    }

    // -------------------------------------------------------------------------------------------
    // Knowledge

    @Test
    fun `a meeting adds to an entry it was shown and records itself as a source`(): Unit = runBlocking {
        val earlier = summarized("Kickoff", Fixed.at(today - 7, 10))
        knowledge.save(KnowledgeType.PERSON, "Dana Whitfield", "Engineering lead.", KnowledgeOrigin.MEETING, meetingId = earlier)
        val id = recorded()
        llm.reply(json(MeetingAnalysis(tldr = "t", knowledge = listOf(KnowledgeNote("person", "dana whitfield", "Engineering lead. Now owns the pricing deck too.")))))
        assistant.summarizeMeeting(id)

        val entry = db.knowledge().all().single()
        assertEquals("Dana Whitfield", entry.title)
        assertEquals("Engineering lead. Now owns the pricing deck too.", entry.content)
        assertEquals(listOf(earlier, id), entry.sourceMeetingIds)
    }

    @Test
    fun `an entry Claude was not shown in full is added to, not overwritten`(): Unit = runBlocking {
        // A long-standing entry, and enough newer material that its text no longer fits in what is sent.
        val history = "Engineering lead since 2023. REMEMBER-THIS-HISTORY. " + "Background detail. ".repeat(110)
        knowledge.save(KnowledgeType.PERSON, "Dana Whitfield", history, KnowledgeOrigin.ONBOARDING)
        now += 1_000
        repeat(40) { index ->
            now += 1_000
            knowledge.save(KnowledgeType.FACT, "Filler topic $index", "f".repeat(1_000), KnowledgeOrigin.MANUAL)
        }
        // The transcript says "Dana" but never the full name, so the entry isn't picked out as mentioned.
        val id = recorded(
            lines = listOf(
                "good morning everyone let's get started with the pricing review today",
                "dana will send the revised pricing deck to marcus by friday afternoon",
                "we agreed to ship the three tier model in the first quarter",
            ),
        )
        llm.reply(json(MeetingAnalysis(tldr = "t", knowledge = listOf(KnowledgeNote("person", "Dana Whitfield", "Owns the pricing deck.")))))
        assistant.summarizeMeeting(id)

        val prompt = llm.last.prompt
        assertTrue("the entry's title is always listed", prompt.contains("- person: Dana Whitfield\n"))
        assertFalse("this test needs the entry's text to have been left out of the request", prompt.contains("REMEMBER-THIS-HISTORY"))

        val entry = db.knowledge().all().single { it.title == "Dana Whitfield" }
        assertTrue("what Claude never saw must not be thrown away", entry.content.contains("REMEMBER-THIS-HISTORY"))
        assertTrue(entry.content.contains("Owns the pricing deck."))
    }

    // -------------------------------------------------------------------------------------------
    // Clarifying questions

    private fun sixQuestions() = (1..6).map { ClarifyingQuestion(question = "Question $it?", why = "why $it", topic = "Topic $it", topicType = "term") }

    private suspend fun questionsOf(meetingId: Long): List<QuestionEntity> = db.questions().all().filter { it.meetingId == meetingId }.sortedBy { it.id }

    @Test
    fun `while still learning the assistant may ask up to four questions`(): Unit = runBlocking {
        val id = recorded()
        llm.reply(json(MeetingAnalysis(tldr = "t", clarifyingQuestions = sixQuestions())))
        assistant.summarizeMeeting(id)

        assertTrue(llm.last.prompt.contains("ask up to 4 clarifying questions"))
        assertEquals(listOf("Question 1?", "Question 2?", "Question 3?", "Question 4?"), questionsOf(id).map { it.question })
    }

    @Test
    fun `after five summarized meetings it asks at most two`(): Unit = runBlocking {
        repeat(Assistant.LEARNING_MEETINGS) { summarized("Earlier meeting $it", Fixed.at(today - 10 + it, 10)) }
        val id = recorded()
        llm.reply(json(MeetingAnalysis(tldr = "t", clarifyingQuestions = sixQuestions())))
        assistant.summarizeMeeting(id)

        assertTrue(llm.last.prompt.contains("Ask at most 2 clarifying questions"))
        assertFalse(llm.last.prompt.contains("ask up to 4"))
        assertEquals(listOf("Question 1?", "Question 2?"), questionsOf(id).map { it.question })
    }

    @Test
    fun `the fifth meeting is still a learning one`(): Unit = runBlocking {
        repeat(Assistant.LEARNING_MEETINGS - 1) { summarized("Earlier meeting $it", Fixed.at(today - 10 + it, 10)) }
        val id = recorded()
        llm.reply(json(MeetingAnalysis(tldr = "t", clarifyingQuestions = sixQuestions())))
        assistant.summarizeMeeting(id)
        assertEquals(4, questionsOf(id).size)
    }

    @Test
    fun `summarizing a meeting again does not count it as one of the five`(): Unit = runBlocking {
        repeat(Assistant.LEARNING_MEETINGS - 1) { summarized("Earlier meeting $it", Fixed.at(today - 10 + it, 10)) }
        val id = recorded()
        llm.reply(json(MeetingAnalysis(tldr = "t", clarifyingQuestions = sixQuestions())))
        assistant.summarizeMeeting(id)
        llm.reply(json(MeetingAnalysis(tldr = "t", clarifyingQuestions = sixQuestions())))
        assistant.summarizeMeeting(id)

        assertTrue(llm.last.prompt.contains("ask up to 4 clarifying questions"))
        assertEquals(4, questionsOf(id).size)
    }

    @Test
    fun `with learning mode off it asks nothing even if Claude sends questions`(): Unit = runBlocking {
        settings.setLearningMode(false)
        val id = recorded()
        llm.reply(json(MeetingAnalysis(tldr = "t", clarifyingQuestions = sixQuestions())))
        assistant.summarizeMeeting(id)

        assertTrue(llm.last.prompt.contains("Don't ask any clarifying questions this time"))
        assertTrue(db.questions().all().isEmpty())
    }

    @Test
    fun `turning learning mode off clears a meeting's unanswered questions when it is summarized again`(): Unit = runBlocking {
        val id = recorded()
        llm.reply(json(MeetingAnalysis(tldr = "t", clarifyingQuestions = sixQuestions())))
        assistant.summarizeMeeting(id)
        settings.setLearningMode(false)
        llm.reply(json(MeetingAnalysis(tldr = "t", clarifyingQuestions = sixQuestions())))
        assistant.summarizeMeeting(id)

        assertTrue(db.questions().all().none { it.status == QuestionStatus.OPEN })
    }

    @Test
    fun `it does not ask again about something answered or already waiting`(): Unit = runBlocking {
        val earlier = summarized("Kickoff", Fixed.at(today - 7, 10))
        db.questions().insert(QuestionEntity(meetingId = earlier, question = "Who is Marcus?", topic = "Marcus Lee", topicType = KnowledgeType.PERSON, answer = "Head of Sales.", status = QuestionStatus.ANSWERED, createdAt = 1, answeredAt = 2))
        db.questions().insert(QuestionEntity(meetingId = earlier, question = "What is QBR?", topic = "QBR", topicType = KnowledgeType.TERM, createdAt = 1))
        val id = recorded()
        llm.reply(
            json(
                MeetingAnalysis(
                    tldr = "t",
                    clarifyingQuestions = listOf(
                        ClarifyingQuestion("Who's Marcus again?", "", "marcus lee", "person"),
                        ClarifyingQuestion("What does QBR mean?", "", "qbr", "term"),
                        ClarifyingQuestion("What is Atlas?", "", "Atlas", "project"),
                        ClarifyingQuestion("And Atlas is what exactly?", "", "ATLAS", "project"),
                        ClarifyingQuestion("  ", "", "Blank question", "fact"),
                    ),
                ),
            ),
        )
        assistant.summarizeMeeting(id)

        assertEquals(listOf("What is Atlas?"), questionsOf(id).map { it.question })
        assertEquals("the earlier questions are untouched", 2, db.questions().all().count { it.meetingId == earlier })
    }

    @Test
    fun `questions with no topic are all kept`(): Unit = runBlocking {
        val id = recorded()
        llm.reply(
            json(MeetingAnalysis(tldr = "t", clarifyingQuestions = listOf(ClarifyingQuestion("Was the deadline moved?", "", "", "fact"), ClarifyingQuestion("Is legal involved?", "", "", "fact")))),
        )
        assistant.summarizeMeeting(id)
        assertEquals(2, questionsOf(id).size)
    }

    @Test
    fun `a new summary replaces the meeting's unanswered questions and keeps the answered ones`(): Unit = runBlocking {
        val id = recorded()
        llm.reply(
            json(MeetingAnalysis(tldr = "t", clarifyingQuestions = listOf(ClarifyingQuestion("Who is Marcus?", "", "Marcus Lee", "person"), ClarifyingQuestion("What is QBR?", "", "QBR", "term")))),
        )
        assistant.summarizeMeeting(id)
        val (marcus, _) = questionsOf(id)
        db.questions().update(marcus.copy(answer = "Head of Sales.", status = QuestionStatus.ANSWERED, answeredAt = now))

        llm.reply(
            json(MeetingAnalysis(tldr = "t", clarifyingQuestions = listOf(ClarifyingQuestion("Who is Marcus?", "", "Marcus Lee", "person"), ClarifyingQuestion("What is Atlas?", "", "Atlas", "project")))),
        )
        assistant.summarizeMeeting(id)

        val after = questionsOf(id)
        assertEquals(listOf("Who is Marcus?", "What is Atlas?"), after.map { it.question })
        assertEquals(QuestionStatus.ANSWERED, after[0].status)
        assertEquals("Head of Sales.", after[0].answer)
        assertEquals(QuestionStatus.OPEN, after[1].status)
    }

    // -------------------------------------------------------------------------------------------
    // The follow-up email

    @Test
    fun `a follow-up is drafted from the saved notes and streamed`(): Unit = runBlocking {
        settings.setProfile(sam)
        val id = recorded()
        llm.reply(pricingReply)
        assistant.summarizeMeeting(id)

        now += 60_000
        llm.reply("  Subject: Pricing review recap\n\nHi all, we agreed three tiers.\n", pieces = listOf("  Subject: Pricing review recap\n\n", "Hi all, we agreed three tiers.\n"))
        val heard = Collections.synchronizedList(ArrayList<String>())
        val draft = assistant.draftFollowUp(id) { heard += it }

        assertEquals("Subject: Pricing review recap\n\nHi all, we agreed three tiers.", draft)
        assertEquals(listOf("  Subject: Pricing review recap\n\n", "Hi all, we agreed three tiers.\n"), heard.toList())

        val request = llm.last
        assertEquals("follow_up", request.feature)
        assertNull("an email is prose, not JSON", request.schema)
        assertEquals(Effort.LOW, request.effort)
        assertTrue(request.prompt.contains("<meeting_notes>\n## \"Q4 pricing review\" on Wednesday, 18 November 2026"))
        assertTrue(request.prompt.contains("Decisions:\n- Ship the three-tier model in Q1"))
        assertTrue(request.prompt.contains("- Send revised pricing deck to Marcus (Dana Whitfield, due 2026-11-20)"))
        assertTrue(request.prompt.contains("Draft the follow-up email Sam Rivera would send"))
        assertEquals(listOf("meeting_summary", "follow_up"), db.usage().all().map { it.feature })
    }

    @Test
    fun `a follow-up for a meeting that has gone fails without a call`(): Unit = runBlocking {
        val failure = runCatching { assistant.draftFollowUp(404) {} }.exceptionOrNull()
        assertTrue(failure is LlmException)
        assertEquals(LlmException.Kind.OTHER, (failure as LlmException).kind)
        assertTrue(llm.requests.isEmpty())
    }

    @Test
    fun `the stored analysis is exactly what Claude sent`(): Unit = runBlocking {
        val id = recorded()
        llm.reply(pricingReply)
        assistant.summarizeMeeting(id)
        assertEquals(AideJson.decodeFromString(MeetingAnalysis.serializer(), pricingReply), ContextBlocks.analysisOf(meeting(id)))
    }
}
