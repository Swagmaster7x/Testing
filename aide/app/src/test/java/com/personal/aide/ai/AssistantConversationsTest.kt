package com.personal.aide.ai

import android.app.Application
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.aide.calendar.CalendarEvent
import com.personal.aide.data.AideJson
import com.personal.aide.data.InterviewTurn
import com.personal.aide.data.KnowledgeNote
import com.personal.aide.data.MeetingAnalysis
import com.personal.aide.data.ProfilePatch
import com.personal.aide.data.WorkProfile
import com.personal.aide.data.db.ChatMessageEntity
import com.personal.aide.data.db.KnowledgeOrigin
import com.personal.aide.data.db.KnowledgeType
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.TaskStatus
import com.personal.aide.data.db.ThreadKind
import com.personal.aide.domain.Days
import com.personal.aide.testing.Fixed
import com.personal.aide.testing.assertWellFormedConversation
import com.personal.aide.testing.prompt
import com.personal.aide.testing.systemText
import com.personal.aide.testing.task
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Assert.fail
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config
import java.util.Collections

@RunWith(AndroidJUnit4::class)
@Config(sdk = [35], application = Application::class)
class AssistantConversationsTest : AssistantTestBase() {

    private fun turn(
        reply: String,
        profile: ProfilePatch = ProfilePatch(),
        knowledge: List<KnowledgeNote> = emptyList(),
        done: Boolean = false,
    ): String = AideJson.encodeToString(InterviewTurn.serializer(), InterviewTurn(reply, profile, knowledge, done))

    private suspend fun messages(threadId: Long): List<ChatMessageEntity> = db.chat().messages(threadId)

    private fun roles(request: LlmRequest) = request.messages.map { it.role }

    private val user = LlmMessage.Role.USER
    private val model = LlmMessage.Role.ASSISTANT

    private suspend fun expectFailure(kind: LlmException.Kind, block: suspend () -> Unit): LlmException {
        try {
            block()
        } catch (e: LlmException) {
            assertEquals(kind, e.kind)
            return e
        }
        fail("Expected the call to fail as $kind")
        throw AssertionError()
    }

    // -------------------------------------------------------------------------------------------
    // The interview

    @Test
    fun `the interview has one thread, made the first time it is needed`(): Unit = runBlocking {
        val first = assistant.interviewThread()
        val again = assistant.interviewThread()

        assertEquals(first, again)
        val thread = db.chat().allThreads().single()
        assertEquals(ThreadKind.ONBOARDING, thread.kind)
        assertTrue(thread.title.isNotBlank())
    }

    @Test
    fun `the first turn asks Claude to open the conversation`(): Unit = runBlocking {
        val thread = assistant.interviewThread()
        llm.reply(turn("Hi! To start, what's your role?"))

        val done = assistant.interviewTurn(thread, null)

        assertFalse(done)
        assertEquals(listOf("assistant" to "Hi! To start, what's your role?"), messages(thread).map { it.role to it.text })

        val request = llm.requests.single()
        assertEquals("interview", request.feature)
        assertEquals(Schemas.interviewTurn, request.schema)
        assertEquals(listOf(LlmMessage(user, Prompts.INTERVIEW_KICKOFF)), request.messages)
        assertTrue(request.systemText.contains("you are interviewing them about their work"))
        assertTrue(request.systemText.contains("<work_profile>\nNothing is known about the user's work yet.\n</work_profile>"))
        assertEquals("interview", db.usage().all().single().feature)
    }

    @Test
    fun `an answer is recorded, what it taught is merged into the profile, and the reply is stored`(): Unit = runBlocking {
        val thread = assistant.interviewThread()
        llm.reply(turn("Hi! To start, what's your role?"))
        assistant.interviewTurn(thread, null)

        // Exactly what the schema makes Claude send.
        llm.reply(
            """
            {"reply":"Got it. Who do you report to?",
             "profile":{"name":"","role":"Product Manager","company":"Northwind","industry":"","department":"","team":"","manager":"","seniority":"",
                        "working_hours":"9 to 5 Eastern","working_style":"","responsibilities":["Roadmap for the shipper portal"],"goals":[],
                        "projects":["Self-serve quoting"],"stakeholders":[],"tools":[],"recurring_meetings":["Monday roadmap sync"],
                        "success_measures":[],"challenges":[],"notes":[]},
             "knowledge":[{"type":"project","title":"Self-serve quoting","content":"Sam's main project: shippers get quotes without calling sales."}],
             "done":false}
            """.trimIndent(),
        )
        now += 90_000
        val done = assistant.interviewTurn(thread, "  I'm a PM at Northwind, working on self-serve quoting. \n")

        assertFalse(done)
        assertEquals(
            listOf(
                "assistant" to "Hi! To start, what's your role?",
                "user" to "I'm a PM at Northwind, working on self-serve quoting.",
                "assistant" to "Got it. Who do you report to?",
            ),
            messages(thread).map { it.role to it.text },
        )
        assertTrue(messages(thread).none { it.failed })
        assertEquals(
            WorkProfile(
                role = "Product Manager",
                company = "Northwind",
                workingHours = "9 to 5 Eastern",
                responsibilities = listOf("Roadmap for the shipper portal"),
                projects = listOf("Self-serve quoting"),
                recurringMeetings = listOf("Monday roadmap sync"),
            ),
            settings.currentProfile(),
        )
        val entry = db.knowledge().all().single()
        assertEquals("Self-serve quoting", entry.title)
        assertEquals(KnowledgeType.PROJECT, entry.type)
        assertEquals(KnowledgeOrigin.ONBOARDING, entry.origin)
        assertEquals(emptyList<Long>(), entry.sourceMeetingIds)
        assertEquals(now, db.chat().thread(thread)!!.updatedAt)

        val request = llm.last
        assertEquals(listOf(user, model, user), roles(request))
        assertEquals(Prompts.INTERVIEW_KICKOFF, request.messages[0].text)
        assertEquals("Hi! To start, what's your role?", request.messages[1].text)
        assertEquals("I'm a PM at Northwind, working on self-serve quoting.", request.messages[2].text)
    }

    @Test
    fun `each turn builds on the profile so far`(): Unit = runBlocking {
        settings.setProfile(sam)
        val thread = assistant.interviewThread()
        llm.reply(turn("What are you working on?"))
        assistant.interviewTurn(thread, null)
        assertTrue("what is known already is shown so it isn't asked again", llm.last.systemText.contains("Role: Senior Product Manager\n"))

        llm.reply(turn("And your team?", ProfilePatch(role = "Director of Product", goals = listOf("Launch SELF-SERVE quoting by end of Q1", "Hire two PMs"))))
        assistant.interviewTurn(thread, "I was just promoted to director")
        llm.reply(turn("Thanks.", ProfilePatch(team = "Shipper Experience, 7 people")))
        assistant.interviewTurn(thread, "Shipper Experience, seven of us")

        assertEquals(
            sam.copy(role = "Director of Product", team = "Shipper Experience, 7 people", goals = listOf("Launch self-serve quoting by end of Q1", "Hire two PMs")),
            settings.currentProfile(),
        )
        assertTrue(llm.last.systemText.contains("Role: Director of Product\n"))
        assertTrue(llm.last.systemText.contains("- Hire two PMs\n"))
    }

    @Test
    fun `every interview request starts with the user and alternates`(): Unit = runBlocking {
        val thread = assistant.interviewThread()
        llm.reply(turn("Question one?"))
        assistant.interviewTurn(thread, null)

        repeat(6) { index ->
            llm.reply(turn("Question ${index + 2}?"))
            assistant.interviewTurn(thread, "Answer ${index + 1}")
        }

        for (request in llm.requests) request.assertWellFormedConversation()
        assertTrue(llm.requests.all { it.messages.last().role == user })
        val last = llm.last
        assertEquals(13, last.messages.size)
        assertEquals(Prompts.INTERVIEW_KICKOFF, last.messages.first().text)
        assertEquals("Answer 6", last.messages.last().text)
        assertEquals("Question 6?", last.messages[last.messages.size - 2].text)
    }

    @Test
    fun `a failed turn keeps the answer and can be retried without typing it again`(): Unit = runBlocking {
        settings.setProfile(sam)
        val thread = assistant.interviewThread()
        llm.reply(turn("Question one?"))
        assistant.interviewTurn(thread, null)

        now += 1_000
        llm.fail(LlmException.Kind.OFFLINE, "Couldn't reach Claude. Check your internet connection.")
        expectFailure(LlmException.Kind.OFFLINE) { assistant.interviewTurn(thread, "My first answer") }

        assertEquals(listOf("assistant", "user"), messages(thread).map { it.role })
        assertEquals("My first answer", messages(thread).last().text)
        assertEquals("a failed turn teaches nothing", sam, settings.currentProfile())
        assertEquals(listOf(true, false), db.usage().all().map { it.ok })

        llm.reply(turn("Question two?", ProfilePatch(team = "Shipper Experience")))
        assistant.interviewTurn(thread, null)

        val retry = llm.last
        retry.assertWellFormedConversation()
        assertEquals(listOf(user, model, user), roles(retry))
        assertEquals("My first answer", retry.messages.last().text)
        assertEquals(listOf("assistant", "user", "assistant"), messages(thread).map { it.role })
        assertEquals("Shipper Experience", settings.currentProfile().team)
    }

    @Test
    fun `answering again after a failed turn still makes one well-formed conversation`(): Unit = runBlocking {
        val thread = assistant.interviewThread()
        llm.reply(turn("Question one?"))
        assistant.interviewTurn(thread, null)
        llm.fail(LlmException.Kind.OVERLOADED)
        expectFailure(LlmException.Kind.OVERLOADED) { assistant.interviewTurn(thread, "First try") }

        llm.reply(turn("Question two?"))
        assistant.interviewTurn(thread, "Second try")

        val request = llm.last
        request.assertWellFormedConversation()
        assertEquals(listOf(user, model, user), roles(request))
        assertTrue(request.messages.last().text.contains("First try"))
        assertTrue(request.messages.last().text.contains("Second try"))
    }

    @Test
    fun `a failure on the opening turn can be retried from nothing`(): Unit = runBlocking {
        val thread = assistant.interviewThread()
        llm.fail(LlmException.Kind.RATE_LIMITED)
        expectFailure(LlmException.Kind.RATE_LIMITED) { assistant.interviewTurn(thread, null) }
        assertTrue(messages(thread).isEmpty())

        llm.reply(turn("Question one?"))
        assistant.interviewTurn(thread, null)
        assertEquals(listOf(LlmMessage(user, Prompts.INTERVIEW_KICKOFF)), llm.last.messages)
        assertEquals(listOf("assistant"), messages(thread).map { it.role })
    }

    @Test
    fun `a blank answer is not recorded as something the user said`(): Unit = runBlocking {
        val thread = assistant.interviewThread()
        llm.reply(turn("Question one?"))
        assistant.interviewTurn(thread, "   \n")

        assertEquals(listOf("assistant"), messages(thread).map { it.role })
        assertEquals(listOf(LlmMessage(user, Prompts.INTERVIEW_KICKOFF)), llm.last.messages)
    }

    @Test
    fun `the interview ends when Claude says it is done`(): Unit = runBlocking {
        val thread = assistant.interviewThread()
        llm.reply(turn("Question one?"))
        assertFalse(assistant.interviewTurn(thread, null))
        llm.reply(turn("That's everything I need. I'll keep learning from your meetings.", done = true))
        assertTrue(assistant.interviewTurn(thread, "That's enough for now"))

        assertEquals("That's everything I need. I'll keep learning from your meetings.", messages(thread).last().text)
    }

    @Test
    fun `an empty reply still leaves the user something to read`(): Unit = runBlocking {
        val thread = assistant.interviewThread()
        llm.reply(turn("   "))
        assistant.interviewTurn(thread, null)
        llm.reply(turn("", done = true))
        assistant.interviewTurn(thread, "Stop")

        val said = messages(thread).filter { it.role == "assistant" }.map { it.text }
        assertEquals(2, said.size)
        assertTrue(said.all { it.isNotBlank() })
        assertTrue("an unfinished interview asks for more", said[0].endsWith("?"))
        assertFalse("a finished one doesn't", said[1].endsWith("?"))
    }

    @Test
    fun `a reply that is not in the expected shape fails the turn and stores nothing from Claude`(): Unit = runBlocking {
        val thread = assistant.interviewThread()
        llm.reply("Hi there! What do you do?")
        expectFailure(LlmException.Kind.BAD_REPLY) { assistant.interviewTurn(thread, null) }
        assertTrue(messages(thread).isEmpty())
    }

    @Test
    fun `what the interview learns about someone adds to what is already known about them`(): Unit = runBlocking {
        knowledge.save(KnowledgeType.PERSON, "Priya Nair", "VP Product. Prefers written updates on Fridays. Joined from Acme in 2024.", KnowledgeOrigin.MEETING)
        val thread = assistant.interviewThread()
        llm.reply(turn("Who do you report to?"))
        assistant.interviewTurn(thread, null)

        llm.reply(turn("Thanks. What are you working on?", ProfilePatch(manager = "Priya Nair"), listOf(KnowledgeNote("person", "Priya Nair", "Sam's manager."))))
        assistant.interviewTurn(thread, "Priya Nair is my manager")

        // The interview is never shown the knowledge base, so Claude could not have folded the old text in.
        val request = llm.last
        assertFalse(
            "this test needs the old entry to have been left out of the request",
            (request.systemText + request.messages.joinToString("\n") { it.text }).contains("Prefers written updates"),
        )
        val entry = db.knowledge().all().single()
        assertTrue("what was known before must survive: ${entry.content}", entry.content.contains("Prefers written updates on Fridays."))
        assertTrue(entry.content.contains("Sam's manager."))
    }

    // -------------------------------------------------------------------------------------------
    // Ask

    @Test
    fun `a question and its answer are stored in the thread`(): Unit = runBlocking {
        val thread = assistant.newAskThread()
        llm.reply("  Three tiers, shipping in Q1.\n", pieces = listOf("  Three tiers,", " shipping in Q1.\n"))
        val heard = Collections.synchronizedList(ArrayList<String>())
        now += 5_000

        val answer = assistant.ask(thread, "  What did we decide on pricing? ") { heard += it }

        assertEquals("Three tiers, shipping in Q1.", answer)
        assertEquals(listOf("  Three tiers,", " shipping in Q1.\n"), heard.toList())
        assertEquals(
            listOf("user" to "What did we decide on pricing?", "assistant" to "Three tiers, shipping in Q1."),
            messages(thread).map { it.role to it.text },
        )
        assertTrue(messages(thread).none { it.failed })

        val saved = db.chat().thread(thread)!!
        assertEquals(ThreadKind.ASK, saved.kind)
        assertEquals("What did we decide on pricing?", saved.title)
        assertEquals(now, saved.updatedAt)

        val usage = db.usage().all().single()
        assertEquals("ask", usage.feature)
        assertTrue(usage.ok)
    }

    @Test
    fun `the request for an answer is prose with the context in front of the question`(): Unit = runBlocking {
        settings.setProfile(sam)
        val thread = assistant.newAskThread()
        llm.reply("Three tiers.")
        assistant.ask(thread, "What did we decide on pricing?") {}

        val request = llm.requests.single()
        assertEquals("ask", request.feature)
        assertNull(request.schema)
        assertEquals(Effort.LOW, request.effort)
        assertEquals(listOf(user), roles(request))
        assertTrue(request.prompt.startsWith("<context>\nToday is Wednesday, 18 November 2026.\n"))
        assertTrue(request.prompt.endsWith("</context>\n\nWhat did we decide on pricing?"))

        assertEquals(2, request.system.size)
        assertTrue(request.system[0].text.contains("Sam Rivera is asking you something in the app's chat."))
        assertFalse(request.system[0].cache)
        assertTrue("the profile and knowledge base are the part worth caching between turns", request.system[1].cache)
        assertTrue(request.system[1].text.contains("<work_profile>\nName: Sam Rivera\n"))
        assertTrue(request.system[1].text.contains("<knowledge_base>\nEmpty so far.\n</knowledge_base>"))
    }

    @Test
    fun `a long first question names the thread in short and later questions do not rename it`(): Unit = runBlocking {
        val thread = assistant.newAskThread()
        val long = "What exactly did we decide about the pricing tiers in the review with Dana and Marcus on Monday morning?"
        llm.reply("Three tiers.")
        assistant.ask(thread, long) {}

        val title = db.chat().thread(thread)!!.title
        assertTrue(title, title.length <= 61 && title.endsWith("…"))
        assertTrue(long.startsWith(title.dropLast(1)))

        llm.reply("Dana.")
        assistant.ask(thread, "Who owns it?") {}
        assertEquals(title, db.chat().thread(thread)!!.title)
    }

    @Test
    fun `the context lists the user's work and the meetings that bear on the question`(): Unit = runBlocking {
        val deck = insert(task(title = "Send pricing deck", due = today, createdAt = Fixed.at(today - 1, 9)))
        val contract = insert(task(title = "Send contract", ownership = Ownership.OTHERS, owner = "Marcus Lee", createdAt = Fixed.at(today - 3, 9)))
        val venue = insert(task(title = "Book venue", ownership = Ownership.UNCLEAR, createdAt = Fixed.at(today - 2, 9)))
        insert(task(title = "Draft FAQ", status = TaskStatus.DONE, createdAt = Fixed.at(today - 4, 9), completedAt = Fixed.at(today - 1, 16)))
        insert(task(title = "Not a real task", status = TaskStatus.DISMISSED, createdAt = Fixed.at(today - 4, 9)))
        summarized(
            "Pricing review",
            Fixed.at(Fixed.monday, 10),
            MeetingAnalysis(title = "Pricing review", tldr = "Agreed three tiers.", decisions = listOf("Ship the three-tier model in Q1")),
            attendees = listOf("Dana Whitfield"),
        )
        summarized("Hiring sync", Fixed.at(Fixed.monday + 1, 10), MeetingAnalysis(title = "Hiring sync", tldr = "Two offers out."))
        val unsummarized = recorded(title = "Vendor call")

        val thread = assistant.newAskThread()
        llm.reply("Three tiers.")
        assistant.ask(thread, "What did we decide about pricing tiers?") {}

        val prompt = llm.last.prompt
        assertTrue(prompt.contains("<my_open_tasks>\n- [id ${deck.id}] Send pricing deck | due 2026-11-18 (today) | normal priority | added 1 days ago\n</my_open_tasks>"))
        assertTrue(prompt.contains("<waiting_on_others>\n- [id ${contract.id}] Send contract (owner: Marcus Lee) | no due date | normal priority | added 3 days ago\n</waiting_on_others>"))
        assertTrue(prompt.contains("<tasks_with_unclear_owner>\n- [id ${venue.id}] Book venue | no due date"))
        assertTrue(prompt.contains("<recently_completed>\n- Draft FAQ (done 2026-11-17)\n</recently_completed>"))
        assertFalse("thrown-out tasks are not part of the picture", prompt.contains("Not a real task"))

        assertTrue(prompt.contains("- 2026-11-16 \"Pricing review\": Agreed three tiers."))
        assertTrue(prompt.contains("- 2026-11-17 \"Hiring sync\": Two offers out."))
        assertFalse("a meeting with no summary has nothing to offer yet", prompt.contains("Vendor call"))
        assertTrue("the meeting itself is still there", db.meetings().get(unsummarized) != null)

        assertTrue(prompt.contains("<meetings_that_may_be_relevant>\n## \"Pricing review\" on Monday, 16 November 2026\nWith: Dana Whitfield\nAgreed three tiers.\nDecisions:\n- Ship the three-tier model in Q1"))
        assertFalse("a meeting about something else is not sent in full", prompt.contains("## \"Hiring sync\""))
    }

    @Test
    fun `with nothing stored the context still reads sensibly`(): Unit = runBlocking {
        val thread = assistant.newAskThread()
        llm.reply("I don't have anything on that yet.")
        assistant.ask(thread, "What's on my plate?") {}

        val prompt = llm.last.prompt
        assertTrue(prompt.contains("<my_open_tasks>\nNone.\n</my_open_tasks>"))
        assertTrue(prompt.contains("<waiting_on_others>\nNone.\n</waiting_on_others>"))
        assertTrue(prompt.contains("<recent_meetings>\nNone summarized yet.\n</recent_meetings>"))
        for (absent in listOf("<tasks_with_unclear_owner>", "<recently_completed>", "<calendar_today_and_tomorrow>", "<this_meeting>", "<meetings_that_may_be_relevant>", "<more_from_the_knowledge_base>")) {
            assertFalse(absent, prompt.contains(absent))
        }
    }

    @Test
    fun `today's and tomorrow's calendar is included when there is one`(): Unit = runBlocking {
        events = listOf(CalendarEvent(1, "Roadmap sync", Fixed.at(today, 16), Fixed.at(today, 16, 30), attendees = listOf("Priya Nair")))
        val thread = assistant.newAskThread()
        llm.reply("Roadmap sync at four.")
        assistant.ask(thread, "What's next today?") {}

        assertTrue(llm.last.prompt.contains("<calendar_today_and_tomorrow>\n- Wednesday 4:00 PM–4:30 PM: Roadmap sync (with Priya Nair)\n</calendar_today_and_tomorrow>"))
        assertEquals(listOf(Days.startMillis(today, Fixed.zone) to Days.startMillis(today + 2, Fixed.zone)), agendaQueries)
    }

    @Test
    fun `a follow-up is sent with the conversation so far, and finds what the earlier question was about`(): Unit = runBlocking {
        summarized(
            "Pricing review",
            Fixed.at(Fixed.monday, 10),
            MeetingAnalysis(title = "Pricing review", tldr = "Agreed three tiers.", decisions = listOf("Dana owns the rollout")),
        )
        val thread = assistant.newAskThread()
        llm.reply("Three tiers.")
        assistant.ask(thread, "What did we decide on pricing?") {}
        llm.reply("Dana.")
        assistant.ask(thread, "And who owns that?") {}

        val request = llm.last
        request.assertWellFormedConversation()
        assertEquals(listOf(user, model, user), roles(request))
        assertEquals("earlier questions are sent as they were asked, without their context", "What did we decide on pricing?", request.messages[0].text)
        assertEquals("Three tiers.", request.messages[1].text)
        assertTrue(request.prompt.startsWith("<context>\n"))
        assertTrue(request.prompt.endsWith("\n\nAnd who owns that?"))
        assertTrue(
            "\"that\" only means something next to the earlier question, so the pricing meeting must still be found",
            request.prompt.contains("## \"Pricing review\" on Monday, 16 November 2026"),
        )
        assertEquals(listOf("user", "assistant", "user", "assistant"), messages(thread).map { it.role })
    }

    @Test
    fun `the system prompt is identical from one turn to the next so it can be cached`(): Unit = runBlocking {
        settings.setProfile(sam)
        knowledge.save(KnowledgeType.PERSON, "Dana Whitfield", "Engineering lead.", KnowledgeOrigin.MANUAL)
        knowledge.save(KnowledgeType.PROJECT, "Atlas", "The data warehouse.", KnowledgeOrigin.MANUAL)
        val thread = assistant.newAskThread()
        llm.reply("One.")
        assistant.ask(thread, "Who is Dana?") {}
        now += 120_000
        llm.reply("Two.")
        assistant.ask(thread, "And what is Atlas?") {}

        assertEquals(llm.requests[0].system, llm.requests[1].system)
    }

    @Test
    fun `a failed answer is stored as failed and the error is passed on`(): Unit = runBlocking {
        val thread = assistant.newAskThread()
        llm.fail(LlmException.Kind.RATE_LIMITED, "Claude is rate-limiting this key. Give it a minute and try again.")

        val error = expectFailure(LlmException.Kind.RATE_LIMITED) { assistant.ask(thread, "What did we decide on pricing?") {} }

        assertEquals("Claude is rate-limiting this key. Give it a minute and try again.", error.message)
        val stored = messages(thread)
        assertEquals(listOf("user", "assistant"), stored.map { it.role })
        assertEquals("What did we decide on pricing?", stored[0].text)
        assertFalse(stored[0].failed)
        assertEquals("Claude is rate-limiting this key. Give it a minute and try again.", stored[1].text)
        assertTrue(stored[1].failed)
        assertFalse(db.usage().all().single().ok)
    }

    @Test
    fun `a failed answer is left out of later requests`(): Unit = runBlocking {
        val thread = assistant.newAskThread()
        llm.fail(LlmException.Kind.OVERLOADED, "Claude is busy right now. Try again in a moment.")
        expectFailure(LlmException.Kind.OVERLOADED) { assistant.ask(thread, "What did we decide on pricing?") {} }

        llm.reply("Three tiers.")
        assistant.ask(thread, "Sorry, again: what did we decide?") {}

        val second = llm.last
        second.assertWellFormedConversation()
        assertEquals("the unanswered question and the new one are one user turn", listOf(user), roles(second))
        assertTrue(second.prompt.contains("What did we decide on pricing?"))
        assertTrue(second.prompt.endsWith("Sorry, again: what did we decide?"))
        assertFalse("the error text is not something Claude said", second.messages.any { it.text.contains("Claude is busy right now") })

        llm.reply("Dana.")
        assistant.ask(thread, "Who owns it?") {}

        val third = llm.last
        third.assertWellFormedConversation()
        assertEquals(listOf(user, model, user), roles(third))
        assertEquals("Three tiers.", third.messages[1].text)
        assertFalse(third.messages.any { it.text.contains("Claude is busy right now") })
        assertEquals(
            listOf("user", "assistant", "user", "assistant", "user", "assistant"),
            messages(thread).map { it.role },
        )
        assertEquals(listOf(false, true, false, false, false, false), messages(thread).map { it.failed })
    }

    @Test
    fun `asking about a meeting sends that meeting's notes and transcript once`(): Unit = runBlocking {
        val id = recorded()
        llm.reply(json(MeetingAnalysis(title = "Pricing review", tldr = "Agreed three tiers.", decisions = listOf("Ship in Q1"))))
        assistant.summarizeMeeting(id)

        val thread = assistant.newAskThread(meetingId = id)
        assertEquals(ThreadKind.MEETING, db.chat().thread(thread)!!.kind)
        assertEquals(id, db.chat().thread(thread)!!.meetingId)

        llm.reply("Dana.")
        assistant.ask(thread, "Who is sending the pricing deck?") {}

        val prompt = llm.last.prompt
        assertTrue(prompt.contains("<this_meeting>\n## \"Pricing review\" on Wednesday, 18 November 2026"))
        assertTrue(prompt.contains("Transcript:\n[00:00] good morning everyone let's get started with the pricing review\n[00:30] dana whitfield will send the revised pricing deck to marcus by friday"))
        assertEquals("the meeting being asked about is not sent a second time as 'possibly relevant'", 1, Regex("## \"Pricing review\"").findAll(prompt).count())
    }

    @Test
    fun `a long conversation sends only its most recent turns`(): Unit = runBlocking {
        val thread = assistant.newAskThread()
        for (index in 1..15) {
            db.chat().insertMessage(ChatMessageEntity(threadId = thread, role = "user", text = "question $index", createdAt = now + index))
            db.chat().insertMessage(ChatMessageEntity(threadId = thread, role = "assistant", text = "answer $index", createdAt = now + index))
        }
        llm.reply("Latest answer.")
        assistant.ask(thread, "the newest question") {}

        val request = llm.last
        request.assertWellFormedConversation()
        assertEquals(Assistant.MAX_HISTORY + 1, request.messages.size)
        assertEquals("question 4", request.messages.first().text)
        assertEquals("answer 15", request.messages[request.messages.size - 2].text)
        assertTrue(request.prompt.endsWith("the newest question"))
    }

    @Test
    fun `a long conversation cut at an answer still starts with the user`(): Unit = runBlocking {
        val thread = assistant.newAskThread()
        for (index in 1..12) {
            db.chat().insertMessage(ChatMessageEntity(threadId = thread, role = "user", text = "question $index", createdAt = now + index))
            db.chat().insertMessage(ChatMessageEntity(threadId = thread, role = "assistant", text = "answer $index", createdAt = now + index))
        }
        // A thirteenth question whose answer failed, so the history has an odd number of turns.
        db.chat().insertMessage(ChatMessageEntity(threadId = thread, role = "user", text = "question 13", createdAt = now + 13))
        db.chat().insertMessage(ChatMessageEntity(threadId = thread, role = "assistant", text = "Claude is busy.", createdAt = now + 13, failed = true))
        llm.reply("Latest answer.")
        assistant.ask(thread, "the newest question") {}

        val request = llm.last
        request.assertWellFormedConversation()
        assertEquals("question 2", request.messages.first().text)
        assertTrue(request.prompt.startsWith("question 13"))
        assertTrue(request.prompt.endsWith("the newest question"))
        assertTrue(request.messages.size <= Assistant.MAX_HISTORY + 1)
    }

    @Test
    fun `asking in a thread that has gone fails without a call or a stray message`(): Unit = runBlocking {
        expectFailure(LlmException.Kind.OTHER) { assistant.ask(404, "Anyone there?") {} }
        assertTrue(llm.requests.isEmpty())
        assertTrue(db.chat().allMessages().isEmpty())
    }

    @Test
    fun `a knowledge base too big to send whole is searched for what the question touches`(): Unit = runBlocking {
        knowledge.save(
            KnowledgeType.PROJECT,
            "Atlas",
            "The data warehouse. ATLAS-MARKER. The migration to the new cluster is owned by Dana. " + "Background detail. ".repeat(110),
            KnowledgeOrigin.MEETING,
        )
        repeat(40) { index ->
            now += 1_000
            knowledge.save(KnowledgeType.FACT, "Filler topic $index", "f".repeat(1_000), KnowledgeOrigin.MANUAL)
        }
        val thread = assistant.newAskThread()
        llm.reply("On track.")
        assistant.ask(thread, "What is the status of the Atlas migration?") {}

        val request = llm.last
        assertTrue("every title is still listed", request.systemText.contains("- project: Atlas\n"))
        assertFalse("this test needs the entry's text to be too much for the standing prompt", request.systemText.contains("ATLAS-MARKER"))
        assertTrue(request.prompt.contains("<more_from_the_knowledge_base>\n### Atlas\nThe data warehouse. ATLAS-MARKER."))
        assertFalse("entries that have nothing to do with the question stay out", request.prompt.contains("### Filler topic"))
    }

    @Test
    fun `a knowledge base that fits is not sent twice`(): Unit = runBlocking {
        knowledge.save(KnowledgeType.PROJECT, "Atlas", "The data warehouse.", KnowledgeOrigin.MANUAL)
        val thread = assistant.newAskThread()
        llm.reply("A warehouse.")
        assistant.ask(thread, "What is Atlas?") {}

        assertTrue(llm.last.systemText.contains("### Atlas (project)\nThe data warehouse.\n"))
        assertFalse(llm.last.prompt.contains("<more_from_the_knowledge_base>"))
        assertFalse(llm.last.prompt.contains("The data warehouse."))
    }
}
