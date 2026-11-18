package com.personal.aide.ai

import com.personal.aide.calendar.Agenda
import com.personal.aide.data.AideJson
import com.personal.aide.data.DayPlan
import com.personal.aide.data.InterviewTurn
import com.personal.aide.data.KnowledgeBase
import com.personal.aide.data.MeetingAnalysis
import com.personal.aide.data.SettingsStore
import com.personal.aide.data.WeekPlan
import com.personal.aide.data.WeekReview
import com.personal.aide.data.WorkProfile
import com.personal.aide.data.db.AppDatabase
import com.personal.aide.data.db.ChatMessageEntity
import com.personal.aide.data.db.ChatThreadEntity
import com.personal.aide.data.db.InsightEntity
import com.personal.aide.data.db.InsightKind
import com.personal.aide.data.db.KnowledgeOrigin
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingSource
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.QuestionEntity
import com.personal.aide.data.db.QuestionStatus
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.data.db.TaskOrigin
import com.personal.aide.data.db.TaskStatus
import com.personal.aide.data.db.ThreadKind
import com.personal.aide.data.db.UsageEntity
import com.personal.aide.domain.Days
import com.personal.aide.domain.Retrieval
import com.personal.aide.domain.WorkStats
import com.personal.aide.domain.ellipsize
import com.personal.aide.domain.knowledgeKey
import com.personal.aide.domain.knowledgeTypeOf
import com.personal.aide.domain.ownershipOf
import com.personal.aide.domain.priorityOf
import com.personal.aide.domain.transcriptText
import com.personal.aide.domain.wordCount
import com.personal.aide.domain.workStats
import kotlinx.coroutines.CancellationException
import kotlinx.serialization.KSerializer
import java.time.ZoneId
import kotlin.math.roundToInt

/**
 * Everything the app asks of Claude. Each function gathers the context a job needs, makes one
 * call, and writes the result where the rest of the app reads it. Retrieval is done here in code;
 * the model is never handed tools, so a call can only ever read what it was sent.
 */
class Assistant(
    private val db: AppDatabase,
    private val settings: SettingsStore,
    private val llm: Llm,
    private val knowledge: KnowledgeBase,
    private val agenda: Agenda,
    private val now: () -> Long = System::currentTimeMillis,
    private val zone: () -> ZoneId = ZoneId::systemDefault,
) {
    sealed interface SummaryResult {
        data object Done : SummaryResult
        /** Not enough was said to be worth a summary. */
        data class TooShort(val words: Int) : SummaryResult
        data class Failed(val error: LlmException) : SummaryResult
        data object Missing : SummaryResult
    }

    // ---------------------------------------------------------------------------------------
    // Meetings

    /**
     * Turns a meeting's transcript into notes, tasks, knowledge and questions. Safe to run again:
     * a new summary replaces the old one, and only untouched assistant-made tasks are replaced.
     */
    suspend fun summarizeMeeting(meetingId: Long, force: Boolean = false): SummaryResult {
        val meetings = db.meetings()
        val meeting = meetings.get(meetingId) ?: return SummaryResult.Missing
        val segments = meetings.segments(meetingId)
        val transcript = transcriptText(segments)
        val words = wordCount(segments.joinToString(" ") { it.text })
        if (words < MIN_WORDS && !force) {
            meetings.update(
                meeting.copy(
                    status = MeetingStatus.TRANSCRIBED,
                    wordCount = words,
                    error = "Only $words words were captured, which is too little to summarize.",
                ),
            )
            return SummaryResult.TooShort(words)
        }

        meetings.update(meeting.copy(status = MeetingStatus.PROCESSING, error = "", wordCount = words))
        val prefs = settings.current()
        val profile = settings.currentProfile()
        val entries = db.knowledge().all()
        val imported = meeting.source == MeetingSource.IMPORT
        val maxQuestions = when {
            !prefs.learningMode -> 0
            meetings.readyCount() < LEARNING_MEETINGS -> 4
            else -> 2
        }
        val zone = zone()
        val header = buildString {
            append("<meeting>\n")
            append("Title: ").append(if (meeting.titleIsAuto) "(not named yet)" else meeting.title).append('\n')
            append("Date: ").append(Days.longDate(Days.ofMillis(meeting.startedAt, zone)))
            append(", ").append(Days.timeOfDay(meeting.startedAt, zone)).append('\n')
            meeting.endedAt?.takeIf { it > meeting.startedAt }?.let { append("Length: ").append(Days.duration(it - meeting.startedAt)).append('\n') }
            if (meeting.attendees.isNotEmpty()) append("Invited, according to the calendar: ").append(meeting.attendees.joinToString(", ")).append('\n')
            append("</meeting>")
        }
        val request = LlmRequest(
            feature = "meeting_summary",
            system = listOf(SystemPart(Prompts.identity(profile) + "\n\n" + Prompts.profileBlock(profile))),
            messages = listOf(
                LlmMessage(
                    LlmMessage.Role.USER,
                    listOf(
                        ContextBlocks.knowledge(entries, transcript, KNOWLEDGE_BUDGET, focusIsLongText = true),
                        header,
                        "<transcript>\n$transcript\n</transcript>",
                        Prompts.meetingTask(profile, imported, maxQuestions, learning = maxQuestions > 2),
                    ).joinToString("\n\n"),
                ),
            ),
            schema = Schemas.meetingAnalysis,
            maxTokens = 32_000,
            effort = Effort.MEDIUM,
        )

        val (analysis, response) = try {
            callForJson(request, MeetingAnalysis.serializer())
        } catch (e: LlmException) {
            meetings.get(meetingId)?.let { meetings.update(it.copy(status = MeetingStatus.FAILED, error = e.message.orEmpty())) }
            return SummaryResult.Failed(e)
        } catch (e: CancellationException) {
            meetings.get(meetingId)?.let { meetings.update(it.copy(status = MeetingStatus.TRANSCRIBED)) }
            throw e
        }

        // The user may have renamed or rated the meeting while the summary was being written.
        val current = meetings.get(meetingId) ?: return SummaryResult.Missing
        meetings.update(
            current.copy(
                title = if (current.titleIsAuto && analysis.title.isNotBlank()) analysis.title.trim().take(80) else current.title,
                status = MeetingStatus.READY,
                attendees = current.attendees.ifEmpty { analysis.attendees.map { it.trim() }.filter { it.isNotEmpty() }.distinct() },
                meetingType = analysis.meetingType.trim(),
                tldr = analysis.tldr.trim(),
                analysisJson = AideJson.encodeToString(MeetingAnalysis.serializer(), analysis),
                error = "",
                wordCount = words,
                summarizedAt = now(),
                model = response.model,
            ),
        )
        saveActionItems(meetingId, analysis)
        knowledge.saveNotes(analysis.knowledge, KnowledgeOrigin.MEETING, meetingId)
        saveQuestions(meetingId, analysis, maxQuestions)
        return SummaryResult.Done
    }

    private suspend fun saveActionItems(meetingId: Long, analysis: MeetingAnalysis) {
        val tasks = db.tasks()
        tasks.deleteUntouchedAiTasks(meetingId)
        // What survived was done, corrected or thrown out by the user; don't bring those back.
        val kept = tasks.forMeeting(meetingId).mapTo(HashSet()) { knowledgeKey(it.title) }
        val time = now()
        val fresh = analysis.actionItems.mapNotNull { item ->
            val title = item.title.trim()
            if (title.isEmpty() || !kept.add(knowledgeKey(title))) return@mapNotNull null
            val ownership = ownershipOf(item.ownership)
            TaskEntity(
                title = title,
                details = item.details.trim(),
                owner = if (ownership == Ownership.MINE) "" else item.owner.trim(),
                ownership = ownership,
                dueDay = Days.parseIso(item.dueDate),
                priority = priorityOf(item.priority),
                origin = TaskOrigin.AI,
                meetingId = meetingId,
                createdAt = time,
                evidence = item.evidence.trim(),
            )
        }
        if (fresh.isNotEmpty()) tasks.insertAll(fresh)
    }

    private suspend fun saveQuestions(meetingId: Long, analysis: MeetingAnalysis, maxQuestions: Int) {
        val questions = db.questions()
        questions.deleteOpenForMeeting(meetingId)
        if (maxQuestions <= 0) return
        // Don't ask again about a topic that is already answered, or already waiting for an answer.
        val asked = questions.all().filter { it.status != QuestionStatus.SKIPPED }.mapTo(HashSet()) { knowledgeKey(it.topic) }
        val time = now()
        val fresh = analysis.clarifyingQuestions.take(maxQuestions).mapNotNull { item ->
            val question = item.question.trim()
            val topicKey = knowledgeKey(item.topic)
            if (question.isEmpty() || (topicKey.isNotEmpty() && !asked.add(topicKey))) return@mapNotNull null
            QuestionEntity(
                meetingId = meetingId,
                question = question,
                why = item.why.trim(),
                topic = item.topic.trim(),
                topicType = knowledgeTypeOf(item.topicType),
                createdAt = time,
            )
        }
        if (fresh.isNotEmpty()) questions.insertAll(fresh)
    }

    /** Writes a follow-up email for a summarized meeting, streaming it to [onText]. */
    suspend fun draftFollowUp(meetingId: Long, onText: (String) -> Unit): String {
        val meeting = db.meetings().get(meetingId)
            ?: throw LlmException(LlmException.Kind.OTHER, "That meeting no longer exists.")
        val profile = settings.currentProfile()
        val response = call(
            LlmRequest(
                feature = "follow_up",
                system = listOf(SystemPart(Prompts.identity(profile) + "\n\n" + Prompts.profileBlock(profile))),
                messages = listOf(
                    LlmMessage(
                        LlmMessage.Role.USER,
                        "<meeting_notes>\n${ContextBlocks.meetingNotes(meeting, zone())}\n</meeting_notes>\n\n" + Prompts.followUpTask(profile),
                    ),
                ),
                maxTokens = 8_000,
                effort = Effort.LOW,
            ),
            onText,
        )
        return response.text.trim()
    }

    // ---------------------------------------------------------------------------------------
    // The onboarding interview

    /** The interview thread, created on first use. */
    suspend fun interviewThread(): Long =
        db.chat().latestThread(ThreadKind.ONBOARDING)?.id
            ?: db.chat().insertThread(ChatThreadEntity(kind = ThreadKind.ONBOARDING, title = "Getting to know you", createdAt = now(), updatedAt = now()))

    /**
     * One step of the interview. With [answer] the user's reply is recorded first; without it the
     * assistant speaks next from wherever the conversation stands (the opening question, or a
     * retry after a failed call). Returns true when the assistant considers the interview done.
     */
    suspend fun interviewTurn(threadId: Long, answer: String?): Boolean {
        val chat = db.chat()
        answer?.trim()?.takeIf { it.isNotEmpty() }?.let {
            chat.insertMessage(ChatMessageEntity(threadId = threadId, role = "user", text = it, createdAt = now()))
        }
        val profile = settings.currentProfile()
        val history = listOf(LlmMessage(LlmMessage.Role.USER, Prompts.INTERVIEW_KICKOFF)) + historyOf(threadId)
        val (turn, _) = callForJson(
            LlmRequest(
                feature = "interview",
                system = listOf(
                    SystemPart(Prompts.identity(profile)),
                    SystemPart(Prompts.interviewTask(profile)),
                    SystemPart(Prompts.profileBlock(profile)),
                ),
                messages = mergeTurns(history),
                schema = Schemas.interviewTurn,
                maxTokens = 8_000,
                effort = Effort.LOW,
            ),
            InterviewTurn.serializer(),
        )
        settings.updateProfile { it.merge(turn.profile) }
        knowledge.saveNotes(turn.knowledge, KnowledgeOrigin.ONBOARDING)
        val reply = turn.reply.trim().ifEmpty { if (turn.done) "Thanks, that's what I need to get started." else "Tell me a bit more?" }
        chat.insertMessage(ChatMessageEntity(threadId = threadId, role = "assistant", text = reply, createdAt = now()))
        chat.thread(threadId)?.let { chat.updateThread(it.copy(updatedAt = now())) }
        return turn.done
    }

    // ---------------------------------------------------------------------------------------
    // Ask

    suspend fun newAskThread(meetingId: Long? = null): Long {
        val time = now()
        val kind = if (meetingId != null) ThreadKind.MEETING else ThreadKind.ASK
        return db.chat().insertThread(ChatThreadEntity(kind = kind, meetingId = meetingId, createdAt = time, updatedAt = time))
    }

    /**
     * Answers a question in a chat thread, streaming the reply to [onText]. The question and the
     * answer (or a note that it failed) are stored in the thread either way.
     */
    suspend fun ask(threadId: Long, question: String, onText: (String) -> Unit): String {
        val chat = db.chat()
        val clean = question.trim()
        val thread = chat.thread(threadId) ?: throw LlmException(LlmException.Kind.OTHER, "That conversation no longer exists.")
        val earlier = historyOf(threadId)
        chat.insertMessage(ChatMessageEntity(threadId = threadId, role = "user", text = clean, createdAt = now()))
        chat.updateThread(thread.copy(title = thread.title.ifBlank { clean.ellipsize(60) }, updatedAt = now()))

        val profile = settings.currentProfile()
        val entries = db.knowledge().all()
        // A follow-up ("and who owns that?") only makes sense next to what came before it.
        val recentQuestions = earlier.filter { it.role == LlmMessage.Role.USER }.takeLast(2).joinToString(" ") { it.text }
        val focus = "$recentQuestions $clean".trim()
        val system = listOf(
            SystemPart(Prompts.identity(profile) + "\n\n" + Prompts.askTask(profile)),
            // Stable from one turn to the next, so follow-up questions read it from the cache.
            SystemPart(
                Prompts.profileBlock(profile) + "\n\n" +
                    ContextBlocks.knowledge(entries, "", KNOWLEDGE_BUDGET, focusIsLongText = false),
                cache = true,
            ),
        )
        val shown = ContextBlocks.pickKnowledge(entries, "", KNOWLEDGE_BUDGET, focusIsLongText = false).mapTo(HashSet()) { it.id }
        val context = askContext(focus, thread.meetingId, entries.map { it.id }.filterNot { it in shown }.toSet())
        val messages = mergeTurns(earlier.takeLast(MAX_HISTORY) + LlmMessage(LlmMessage.Role.USER, "$context\n\n$clean"))
        return try {
            val response = call(
                LlmRequest(feature = "ask", system = system, messages = messages, maxTokens = 16_000, effort = Effort.LOW),
                onText,
            )
            val text = response.text.trim()
            chat.insertMessage(ChatMessageEntity(threadId = threadId, role = "assistant", text = text, createdAt = now()))
            text
        } catch (e: LlmException) {
            chat.insertMessage(
                ChatMessageEntity(threadId = threadId, role = "assistant", text = e.message.orEmpty(), createdAt = now(), failed = true),
            )
            throw e
        }
    }

    /** What is sent alongside a question: the state of the user's work, and the meetings that bear on it. */
    private suspend fun askContext(focus: String, meetingId: Long?, hiddenKnowledgeIds: Set<Long>): String {
        val zone = zone()
        val today = Days.today(zone, now())
        val meetings = db.meetings().all().filter { it.status == MeetingStatus.READY }
        val titles = meetings.associate { it.id to it.title }
        val open = db.tasks().all().filter { it.status == TaskStatus.OPEN }
        val done = db.tasks().all().filter { it.status == TaskStatus.DONE }.sortedByDescending { it.completedAt ?: 0 }.take(15)
        val relevant = Retrieval.rank(
            focus,
            meetings.map { Retrieval.Doc(it, it.title + " " + it.attendees.joinToString(" "), it.tldr + " " + it.analysisJson) },
            limit = 4,
        ).map { it.item }
        val events = agenda.events(Days.startMillis(today, zone), Days.startMillis(today + 2, zone))

        return buildString {
            append("<context>\n")
            append("Today is ").append(Days.longDate(today)).append(".\n\n")
            append("<my_open_tasks>\n").append(ContextBlocks.tasks(open.filter { it.ownership == Ownership.MINE }, today, titles, zone)).append("\n</my_open_tasks>\n\n")
            append("<waiting_on_others>\n").append(ContextBlocks.tasks(open.filter { it.ownership == Ownership.OTHERS }, today, titles, zone)).append("\n</waiting_on_others>\n\n")
            open.filter { it.ownership == Ownership.UNCLEAR }.takeIf { it.isNotEmpty() }?.let {
                append("<tasks_with_unclear_owner>\n").append(ContextBlocks.tasks(it, today, titles, zone)).append("\n</tasks_with_unclear_owner>\n\n")
            }
            if (done.isNotEmpty()) {
                append("<recently_completed>\n")
                for (task in done) append("- ").append(task.title).append(" (done ").append(Days.iso(Days.ofMillis(task.completedAt ?: 0, zone))).append(")\n")
                append("</recently_completed>\n\n")
            }
            if (events.isNotEmpty()) append("<calendar_today_and_tomorrow>\n").append(ContextBlocks.calendar(events, zone)).append("\n</calendar_today_and_tomorrow>\n\n")
            append("<recent_meetings>\n")
            append(meetings.take(10).joinToString("\n") { ContextBlocks.meetingLine(it, zone) }.ifEmpty { "None summarized yet." })
            append("\n</recent_meetings>\n")

            val focusMeeting = meetingId?.let { id -> db.meetings().get(id) }
            if (focusMeeting != null) {
                append("\n<this_meeting>\n").append(ContextBlocks.meetingNotes(focusMeeting, zone)).append("\n\nTranscript:\n")
                append(transcriptText(db.meetings().segments(focusMeeting.id))).append("\n</this_meeting>\n")
            }
            val others = relevant.filter { it.id != meetingId }
            if (others.isNotEmpty()) {
                append("\n<meetings_that_may_be_relevant>\n")
                append(others.joinToString("\n\n") { ContextBlocks.meetingNotes(it, zone) })
                append("\n</meetings_that_may_be_relevant>\n")
            }
            if (hiddenKnowledgeIds.isNotEmpty()) {
                // The knowledge base outgrew what is sent every turn; add what this question touches.
                val extra = Retrieval.rank(
                    focus,
                    db.knowledge().all().filter { it.id in hiddenKnowledgeIds }.map { Retrieval.Doc(it, it.title, it.content) },
                    limit = 8,
                ).map { it.item }
                if (extra.isNotEmpty()) {
                    append("\n<more_from_the_knowledge_base>\n")
                    for (entry in extra) append("### ").append(entry.title).append('\n').append(entry.content.trim()).append("\n\n")
                    append("</more_from_the_knowledge_base>\n")
                }
            }
            append("</context>")
        }
    }

    // ---------------------------------------------------------------------------------------
    // Plans and reviews

    /** Chooses what the user should do on [day] and remembers the plan for that day. */
    suspend fun planDay(day: Long): DayPlan {
        val zone = zone()
        val profile = settings.currentProfile()
        val (mine, waiting, titles) = openWork()
        if (mine.isEmpty()) throw LlmException(LlmException.Kind.OTHER, "There are no open tasks to plan yet.")
        val events = agenda.events(Days.startMillis(day, zone), Days.startMillis(day + 1, zone))
        val body = buildString {
            append("The day to plan: ").append(Days.longDate(day)).append(".\n\n")
            append("<calendar>\n").append(ContextBlocks.calendar(events, zone)).append("\n</calendar>\n\n")
            append("<open_tasks>\n").append(ContextBlocks.tasks(mine, day, titles, zone)).append("\n</open_tasks>\n\n")
            append("<waiting_on_others>\n").append(ContextBlocks.tasks(waiting, day, titles, zone)).append("\n</waiting_on_others>\n\n")
            append(recentMeetingsBlock(zone))
            append("\n\n").append(Prompts.dayPlanTask(profile))
        }
        val (raw, _) = callForJson(planRequest("day_plan", profile, body, Schemas.dayPlan), DayPlan.serializer())
        val known = mine.mapTo(HashSet()) { it.id }
        val focus = raw.focus.filter { it.taskId in known }.distinctBy { it.taskId }.take(5)
        val plan = raw.copy(
            focus = focus,
            ifTime = raw.ifTime.filter { it.taskId in known && focus.none { f -> f.taskId == it.taskId } }.distinctBy { it.taskId },
        )
        db.insights().upsert(
            InsightEntity(kind = InsightKind.DAY_PLAN, periodStart = day, json = AideJson.encodeToString(DayPlan.serializer(), plan), createdAt = now()),
        )
        return plan
    }

    /** Lays the open tasks out over the rest of the week containing [today]. Nothing moves until the user applies it. */
    suspend fun planWeek(today: Long): WeekPlan {
        val zone = zone()
        val profile = settings.currentProfile()
        val (mine, waiting, titles) = openWork()
        if (mine.isEmpty()) throw LlmException(LlmException.Kind.OTHER, "There are no open tasks to plan yet.")
        val weekStart = Days.weekStart(today)
        val weekEnd = weekStart + 6
        val events = agenda.events(Days.startMillis(today, zone), Days.startMillis(weekEnd + 1, zone))
        val body = buildString {
            append("Today is ").append(Days.longDate(today)).append(". The week runs to ").append(Days.longDate(weekEnd)).append(".\n\n")
            append("<calendar>\n").append(ContextBlocks.calendar(events, zone)).append("\n</calendar>\n\n")
            append("<open_tasks>\n").append(ContextBlocks.tasks(mine, today, titles, zone)).append("\n</open_tasks>\n\n")
            append("<waiting_on_others>\n").append(ContextBlocks.tasks(waiting, today, titles, zone)).append("\n</waiting_on_others>\n\n")
            append(Prompts.weekPlanTask(profile))
        }
        val (raw, _) = callForJson(planRequest("week_plan", profile, body, Schemas.weekPlan), WeekPlan.serializer())
        val known = mine.mapTo(HashSet()) { it.id }
        val used = HashSet<Long>()
        val plan = raw.copy(
            days = raw.days.mapNotNull { dayPlan ->
                val day = Days.parseIso(dayPlan.day)?.takeIf { it in today..weekEnd } ?: return@mapNotNull null
                val ids = dayPlan.taskIds.filter { it in known && used.add(it) }
                if (ids.isEmpty()) null else dayPlan.copy(day = Days.iso(day), taskIds = ids)
            }.sortedBy { it.day },
        )
        db.insights().upsert(
            InsightEntity(kind = InsightKind.WEEK_PLAN, periodStart = weekStart, json = AideJson.encodeToString(WeekPlan.serializer(), plan), createdAt = now()),
        )
        return plan
    }

    /** The assistant's read of how the week starting [weekStart] went, with the numbers it was judged on. */
    suspend fun reviewWeek(weekStart: Long): WeekReview {
        val zone = zone()
        val today = Days.today(zone, now())
        val profile = settings.currentProfile()
        val weekEnd = weekStart + 6
        val tasks = db.tasks().all()
        val allMeetings = db.meetings().all()
        val stats = workStats(tasks, allMeetings, weekStart, weekEnd, today, zone)
        val from = Days.startMillis(weekStart, zone)
        val until = Days.startMillis(weekEnd + 1, zone)
        val titles = allMeetings.associate { it.id to it.title }
        val mine = tasks.filter { it.ownership == Ownership.MINE }
        val completed = mine.filter { it.status == TaskStatus.DONE && (it.completedAt ?: 0) in from until until }
        val open = mine.filter { it.status == TaskStatus.OPEN }
        val waiting = tasks.filter { it.ownership == Ownership.OTHERS && it.status == TaskStatus.OPEN }
        val weekMeetings = allMeetings.filter { it.startedAt in from until until && it.status == MeetingStatus.READY }.sortedBy { it.startedAt }
        val previous = db.insights().get(InsightKind.WEEK_REVIEW, weekStart - 7)
            ?.let { runCatching { AideJson.decodeFromString(WeekReview.serializer(), it.json) }.getOrNull() }

        val body = buildString {
            append("The week under review: ").append(Days.longDate(weekStart)).append(" to ").append(Days.longDate(weekEnd)).append(". ")
            append(if (today <= weekEnd) "It is still in progress; today is ${Days.longDate(today)}." else "Today is ${Days.longDate(today)}.").append("\n\n")
            append("<numbers>\n").append(statsText(stats)).append("\n</numbers>\n\n")
            append("<completed_this_week>\n")
            append(
                completed.joinToString("\n") { task ->
                    val doneDay = Days.ofMillis(task.completedAt ?: 0, zone)
                    "- ${task.title} (done ${Days.iso(doneDay)}" + (task.dueDay?.let { due -> if (doneDay > due) ", ${doneDay - due} days after its due date" else ", on time" } ?: "") + ")"
                }.ifEmpty { "Nothing." },
            )
            append("\n</completed_this_week>\n\n")
            append("<still_open>\n").append(ContextBlocks.tasks(open, minOf(today, weekEnd), titles, zone)).append("\n</still_open>\n\n")
            append("<waiting_on_others>\n").append(ContextBlocks.tasks(waiting, minOf(today, weekEnd), titles, zone)).append("\n</waiting_on_others>\n\n")
            append("<meetings_this_week>\n")
            append(weekMeetings.joinToString("\n\n") { ContextBlocks.meetingNotes(it, zone) }.ifEmpty { "None recorded." })
            append("\n</meetings_this_week>\n\n")
            if (previous != null) {
                append("<last_weeks_review>\n").append(previous.headline).append('\n')
                if (previous.suggestions.isNotEmpty()) append("Suggested then:\n").append(previous.suggestions.joinToString("\n") { "- $it" }).append('\n')
                append("</last_weeks_review>\n\n")
            }
            append(Prompts.weekReviewTask(profile))
        }
        val (review, _) = callForJson(planRequest("week_review", profile, body, Schemas.weekReview), WeekReview.serializer())
        db.insights().upsert(
            InsightEntity(kind = InsightKind.WEEK_REVIEW, periodStart = weekStart, json = AideJson.encodeToString(WeekReview.serializer(), review), createdAt = now()),
        )
        return review
    }

    private fun planRequest(feature: String, profile: WorkProfile, body: String, schema: kotlinx.serialization.json.JsonObject) = LlmRequest(
        feature = feature,
        system = listOf(SystemPart(Prompts.identity(profile) + "\n\n" + Prompts.profileBlock(profile))),
        messages = listOf(LlmMessage(LlmMessage.Role.USER, body)),
        schema = schema,
        maxTokens = 16_000,
        effort = Effort.MEDIUM,
    )

    private suspend fun openWork(): Triple<List<TaskEntity>, List<TaskEntity>, Map<Long, String>> {
        val open = db.tasks().all().filter { it.status == TaskStatus.OPEN }
        val titles = db.meetings().all().associate { it.id to it.title }
        return Triple(open.filter { it.ownership == Ownership.MINE }, open.filter { it.ownership == Ownership.OTHERS }, titles)
    }

    private suspend fun recentMeetingsBlock(zone: ZoneId): String {
        val recent = db.meetings().all().filter { it.status == MeetingStatus.READY }.take(6)
        return "<recent_meetings>\n" + recent.joinToString("\n") { ContextBlocks.meetingLine(it, zone) }.ifEmpty { "None." } + "\n</recent_meetings>"
    }

    private fun statsText(stats: WorkStats): String = buildString {
        append("Tasks completed: ").append(stats.completed).append('\n')
        append("New tasks taken on: ").append(stats.created).append('\n')
        stats.onTimeRate?.let {
            append("Of the completed tasks that had a due date: ").append(stats.completedOnTime).append(" on time, ")
            append(stats.completedLate).append(" late (").append((it * 100).roundToInt()).append("% on time)\n")
        }
        append("Open tasks now: ").append(stats.openNow).append(", of which overdue: ").append(stats.overdueNow).append('\n')
        stats.averageDaysToClose?.let { append("Average days from taking a task on to finishing it: ").append("%.1f".format(it)).append('\n') }
        append("Waiting on other people for: ").append(stats.waitingNow).append(" things")
        if (stats.waitingNow > 0) append(" (the oldest for ").append(stats.oldestWaitingDays).append(" days)")
        append('\n')
        append("Meetings recorded: ").append(stats.meetings).append(", totalling ").append(stats.meetingMinutes).append(" minutes")
    }

    // ---------------------------------------------------------------------------------------
    // Plumbing

    /** A thread's turns as the model should see them: failed assistant turns are left out. */
    private suspend fun historyOf(threadId: Long): List<LlmMessage> =
        db.chat().messages(threadId).filter { !it.failed && it.text.isNotBlank() }.map {
            LlmMessage(if (it.role == "user") LlmMessage.Role.USER else LlmMessage.Role.ASSISTANT, it.text)
        }

    /** Joins neighbouring turns from the same side, so the conversation always alternates and starts with the user. */
    private fun mergeTurns(messages: List<LlmMessage>): List<LlmMessage> {
        val merged = ArrayList<LlmMessage>()
        for (message in messages.dropWhile { it.role == LlmMessage.Role.ASSISTANT }) {
            val last = merged.lastOrNull()
            if (last != null && last.role == message.role) {
                merged[merged.lastIndex] = last.copy(text = last.text + "\n\n" + message.text)
            } else {
                merged += message
            }
        }
        return merged
    }

    private suspend fun call(request: LlmRequest, onText: ((String) -> Unit)? = null): LlmResponse {
        val started = now()
        val model = settings.current().model.id
        try {
            val response = llm.complete(request, onText)
            db.usage().insert(
                UsageEntity(
                    at = started,
                    feature = request.feature,
                    model = response.model.ifBlank { model },
                    inputTokens = response.usage.inputTokens,
                    outputTokens = response.usage.outputTokens,
                    cacheReadTokens = response.usage.cacheReadTokens,
                    cacheWriteTokens = response.usage.cacheWriteTokens,
                    ok = true,
                    millis = now() - started,
                ),
            )
            return response
        } catch (e: LlmException) {
            // Not having set a key up isn't a failed call.
            if (e.kind != LlmException.Kind.NO_KEY) {
                db.usage().insert(UsageEntity(at = started, feature = request.feature, model = model, ok = false, millis = now() - started))
            }
            throw e
        }
    }

    private suspend fun <T> callForJson(request: LlmRequest, serializer: KSerializer<T>): Pair<T, LlmResponse> {
        val response = call(request)
        val text = response.text.trim()
        val parsed = runCatching { AideJson.decodeFromString(serializer, text) }.getOrElse {
            // Constrained output should always parse; this covers a fallback model that wrapped it in prose.
            val start = text.indexOf('{')
            val end = text.lastIndexOf('}')
            val inner = if (start in 0 until end) text.substring(start, end + 1) else ""
            runCatching { AideJson.decodeFromString(serializer, inner) }.getOrElse {
                throw LlmException(LlmException.Kind.BAD_REPLY, "Claude's reply wasn't in the expected form. Try again.")
            }
        }
        return parsed to response
    }

    companion object {
        /** Below this, a recording is a mic test, not a meeting. */
        const val MIN_WORDS = 25
        /** How many meetings the assistant spends asking more questions than usual. */
        const val LEARNING_MEETINGS = 5
        /** Characters of knowledge base text sent in full with a request (roughly 8,000 tokens). */
        const val KNOWLEDGE_BUDGET = 32_000
        const val MAX_HISTORY = 24
    }
}
