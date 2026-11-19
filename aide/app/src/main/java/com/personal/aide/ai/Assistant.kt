package com.personal.aide.ai

import com.personal.aide.calendar.Agenda
import com.personal.aide.data.AideJson
import com.personal.aide.data.DayPlan
import com.personal.aide.data.GoalRead
import com.personal.aide.data.InterviewTurn
import com.personal.aide.data.KnowledgeBase
import com.personal.aide.data.MeetingAnalysis
import com.personal.aide.data.PersonAgenda
import com.personal.aide.data.ProgressUpdate
import com.personal.aide.data.SelfReview
import com.personal.aide.data.SeriesStore
import com.personal.aide.data.SettingsStore
import com.personal.aide.data.WeekPlan
import com.personal.aide.data.WeekReview
import com.personal.aide.data.WinStore
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
import com.personal.aide.data.db.SeriesEntity
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.data.db.TaskOrigin
import com.personal.aide.data.db.TaskStatus
import com.personal.aide.data.db.ThreadKind
import com.personal.aide.data.db.UsageEntity
import com.personal.aide.data.db.WinSource
import com.personal.aide.domain.Days
import com.personal.aide.domain.Retrieval
import com.personal.aide.domain.WorkStats
import com.personal.aide.domain.buildPersonView
import com.personal.aide.domain.ellipsize
import com.personal.aide.domain.knowledgeKey
import com.personal.aide.domain.knowledgeTypeOf
import com.personal.aide.domain.ownershipOf
import com.personal.aide.domain.priorityOf
import com.personal.aide.domain.transcriptText
import com.personal.aide.domain.wordCount
import com.personal.aide.domain.workStats
import androidx.room.withTransaction
import kotlinx.coroutines.CancellationException
import kotlinx.serialization.KSerializer
import java.time.ZoneId
import java.util.Locale
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
    private val series: SeriesStore = SeriesStore(db.series(), db.meetings(), now),
    private val wins: WinStore = WinStore(db.wins(), now),
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
        // Recurring meetings: the one this belongs to if that is known, else the few it most plausibly could.
        val allSeries = db.series().all()
        val own = meeting.seriesId?.let { id -> allSeries.firstOrNull { it.id == id } }
        val thread = seriesContext(meeting, transcript, own, allSeries, zone)
        // The entries whose full text goes with the request; the assistant may rewrite these and only these.
        val shownInFull = ContextBlocks.pickKnowledge(entries, transcript, KNOWLEDGE_BUDGET, focusIsLongText = true).mapTo(HashSet()) { it.key }
        val request = LlmRequest(
            feature = "meeting_summary",
            system = listOf(SystemPart(Prompts.identity(profile) + "\n\n" + Prompts.profileBlock(profile))),
            messages = listOf(
                LlmMessage(
                    LlmMessage.Role.USER,
                    listOf(
                        ContextBlocks.knowledge(entries, transcript, KNOWLEDGE_BUDGET, focusIsLongText = true),
                        thread.text,
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

        val (raw, response) = try {
            callForJson(request, MeetingAnalysis.serializer())
        } catch (e: LlmException) {
            meetings.get(meetingId)?.let { meetings.update(it.copy(status = MeetingStatus.FAILED, error = e.message.orEmpty())) }
            return SummaryResult.Failed(e)
        } catch (e: CancellationException) {
            meetings.get(meetingId)?.let { meetings.update(it.copy(status = MeetingStatus.TRANSCRIBED)) }
            throw e
        }

        // Everything the notes produce is saved together or not at all.
        return try {
            db.withTransaction {
                // The user may have renamed or rated the meeting while the summary was being written.
                val current = meetings.get(meetingId) ?: return@withTransaction SummaryResult.Missing
                val named = current.titleIsAuto && raw.title.isNotBlank()
                // A series the user or the calendar chose stands; otherwise the assistant's reading decides.
                val seriesId = current.seriesId
                    ?: thread.candidates.firstOrNull { it.id == raw.series.existingId }?.id
                    ?: raw.series.newName.takeIf { it.isNotBlank() }?.let { series.findOrCreate(it) }
                // What it said about "last time" only means something against the series it was shown.
                val earlierTasks = thread.earlierTasks[seriesId].orEmpty()
                val analysis = raw.copy(
                    sinceLastTime = if (seriesId != null && seriesId in thread.withNotes) raw.sinceLastTime.map { it.trim() }.filter { it.isNotEmpty() } else emptyList(),
                    earlierItems = raw.earlierItems.filter { it.taskId in earlierTasks }.distinctBy { it.taskId },
                )
                meetings.update(
                    current.copy(
                        seriesId = seriesId,
                        title = if (named) analysis.title.trim().take(80).trim() else current.title,
                        // Once it has a real name it keeps it, whoever gave it.
                        titleIsAuto = current.titleIsAuto && !named,
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
                saveActionItems(
                    meetingId,
                    analysis,
                    // The earlier notes still carry the assistant's own wording, so that is what it tends to repeat.
                    alreadyTracked = earlierTasks.values.filter { it.status == TaskStatus.OPEN }.flatMap { listOf(it.title, it.suggestedTitle) }.filter { it.isNotBlank() },
                )
                knowledge.saveNotes(analysis.knowledge, KnowledgeOrigin.MEETING, meetingId) { key -> key in shownInFull }
                saveQuestions(meetingId, analysis, maxQuestions)
                SummaryResult.Done
            }
        } catch (e: CancellationException) {
            throw e
        } catch (e: Exception) {
            val failure = LlmException(LlmException.Kind.OTHER, "The notes were written but couldn't be saved. Try again.", e)
            meetings.get(meetingId)?.let { meetings.update(it.copy(status = MeetingStatus.FAILED, error = failure.message.orEmpty())) }
            SummaryResult.Failed(failure)
        }
    }

    /**
     * The meeting's recurring-meeting context for a request: the text to send, the series it
     * covers, and for each of those the earlier action items the assistant may report on.
     */
    private class Thread(
        val text: String,
        val candidates: List<SeriesEntity>,
        val earlierTasks: Map<Long, Map<Long, TaskEntity>>,
        /** The series that were shown with an earlier occurrence's notes: only against those does "since last time" mean anything. */
        val withNotes: Set<Long>,
    )

    private suspend fun seriesContext(
        meeting: MeetingEntity,
        transcript: String,
        own: SeriesEntity?,
        all: List<SeriesEntity>,
        zone: ZoneId,
    ): Thread {
        if (meeting.seriesId == SeriesStore.NOT_RECURRING) {
            // The user's word is final; don't offer the assistant a choice it isn't allowed to make.
            return Thread("<recurring_meetings>\nThe user has said this meeting is not one of their recurring meetings.\n</recurring_meetings>", emptyList(), emptyMap(), emptySet())
        }
        val everyMeeting = db.meetings().all()
        val everyTask = db.tasks().all()
        val today = Days.today(zone, now())
        val bySeries = everyMeeting.filter { it.seriesId != null && it.seriesId != SeriesStore.NOT_RECURRING && it.id != meeting.id && it.startedAt < meeting.startedAt }.groupBy { it.seriesId!! }

        val candidates = if (own != null) {
            listOf(own)
        } else {
            // Rank the user's recurring meetings by how well their name, people and last notes match this one.
            val probe = meeting.title + " " + meeting.attendees.joinToString(" ") + " " + transcript.take(4_000)
            Retrieval.rank(
                probe,
                all.map { one ->
                    val last = bySeries[one.id]?.maxByOrNull { it.startedAt }
                    Retrieval.Doc(one, one.name + " " + last?.attendees.orEmpty().joinToString(" "), last?.tldr.orEmpty())
                },
                limit = MAX_SERIES_CANDIDATES,
            ).map { it.item }
        }

        val earlier = HashMap<Long, Map<Long, TaskEntity>>()
        val withNotes = HashSet<Long>()
        val text = buildString {
            append("<recurring_meetings>\n")
            when {
                own != null -> append("This meeting is an occurrence of the recurring meeting below.\n")
                candidates.isEmpty() -> append(if (all.isEmpty()) "The user keeps no recurring meetings yet.\n" else "None of the user's recurring meetings looks like a match for this one.\n")
                else -> append("The user's recurring meetings that this one might be an occurrence of:\n")
            }
            for (one in candidates) {
                val past = bySeries[one.id].orEmpty().sortedByDescending { it.startedAt }
                val last = past.firstOrNull { it.status == MeetingStatus.READY }
                append("\n## [series ").append(one.id).append("] \"").append(one.name).append("\"\n")
                if (last == null) {
                    append("No earlier notes on record.\n")
                    earlier[one.id] = emptyMap()
                    continue
                }
                withNotes += one.id
                append("Its previous occurrence:\n").append(ContextBlocks.meetingNotes(last, zone)).append('\n')
                // What came out of its recent occurrences: still open, or finished since the last one.
                val recent = past.take(3).mapTo(HashSet()) { it.id }
                val items = everyTask.filter { task ->
                    task.meetingId in recent && task.ownership != Ownership.UNCLEAR && (
                        task.status == TaskStatus.OPEN || (task.status == TaskStatus.DONE && (task.completedAt ?: 0) >= last.startedAt)
                        )
                }.take(MAX_EARLIER_ITEMS)
                earlier[one.id] = items.associateBy { it.id }
                if (items.isNotEmpty()) {
                    append("Action items from its earlier occurrences, as they stand today:\n")
                    for (task in items) {
                        append("- [id ").append(task.id).append("] ").append(task.title).append(" | ")
                        append(if (task.ownership == Ownership.MINE) "the user's" else task.owner.ifBlank { "someone else" } + "'s").append(" | ")
                        append(
                            when {
                                task.status == TaskStatus.DONE -> "marked done " + Days.iso(Days.ofMillis(task.completedAt ?: 0, zone))
                                task.dueDay == null -> "still open"
                                task.dueDay < today -> "still open, ${today - task.dueDay} days past its date"
                                else -> "still open, due " + Days.iso(task.dueDay)
                            },
                        ).append('\n')
                    }
                }
            }
            append("</recurring_meetings>")
        }
        return Thread(text, candidates, earlier, withNotes)
    }

    private suspend fun saveActionItems(meetingId: Long, analysis: MeetingAnalysis, alreadyTracked: List<String> = emptyList()) {
        val tasks = db.tasks()
        tasks.deleteUntouchedAiTasks(meetingId)
        // What survived was done, changed, settled or thrown out by the user; don't bring those back,
        // whether under the wording they have now or the one the assistant first gave them. Nor is an
        // action item still open from an earlier occurrence of the same recurring meeting a new one.
        val kept = alreadyTracked.mapTo(HashSet()) { knowledgeKey(it) }
        for (task in tasks.forMeeting(meetingId)) {
            kept += knowledgeKey(task.title)
            if (task.suggestedTitle.isNotBlank()) kept += knowledgeKey(task.suggestedTitle)
        }
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
                suggestedTitle = title,
            )
        }
        if (fresh.isNotEmpty()) tasks.insertAll(fresh)
    }

    private suspend fun saveQuestions(meetingId: Long, analysis: MeetingAnalysis, maxQuestions: Int) {
        val questions = db.questions()
        questions.deleteOpenForMeeting(meetingId)
        if (maxQuestions <= 0) return
        // Don't ask again about a topic that is already answered, waiting for an answer, or was skipped:
        // skipping a question means "don't ask me this", not "ask me after every meeting".
        val asked = questions.all().mapTo(HashSet()) { knowledgeKey(it.topic) }
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
    suspend fun draftFollowUp(meetingId: Long, onText: (String) -> Unit): String = job {
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
        response.text.trim()
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
    suspend fun interviewTurn(threadId: Long, answer: String?): Boolean = job {
        val chat = db.chat()
        answer?.trim()?.takeIf { it.isNotEmpty() }?.let {
            chat.insertMessage(ChatMessageEntity(threadId = threadId, role = "user", text = it, createdAt = now()))
        }
        val profile = settings.currentProfile()
        var history = listOf(LlmMessage(LlmMessage.Role.USER, Prompts.INTERVIEW_KICKOFF)) + historyOf(threadId)
        // The API answers the user's turn; if the assistant spoke last, hand the turn back to it explicitly.
        if (history.last().role == LlmMessage.Role.ASSISTANT) history = history + LlmMessage(LlmMessage.Role.USER, Prompts.INTERVIEW_CONTINUE)
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
        // The interview never shows the assistant the knowledge base, so what it learns is added, never swapped in.
        knowledge.saveNotes(turn.knowledge, KnowledgeOrigin.ONBOARDING)
        val reply = turn.reply.trim().ifEmpty { if (turn.done) "Thanks, that's what I need to get started." else "Tell me a bit more?" }
        chat.insertMessage(ChatMessageEntity(threadId = threadId, role = "assistant", text = reply, createdAt = now()))
        chat.thread(threadId)?.let { chat.updateThread(it.copy(updatedAt = now())) }
        turn.done
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
            job {
                val response = call(
                    LlmRequest(feature = "ask", system = system, messages = messages, maxTokens = 16_000, effort = Effort.LOW),
                    onText,
                )
                val text = response.text.trim()
                chat.insertMessage(ChatMessageEntity(threadId = threadId, role = "assistant", text = text, createdAt = now()))
                text
            }
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
            meetings.map { Retrieval.Doc(it, it.title + " " + it.attendees.joinToString(" "), ContextBlocks.searchText(it)) },
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
            // The record of what the user has achieved, so "what have I done this quarter" has something to stand on.
            val logged = db.wins().all().take(MAX_WINS_IN_CONTEXT)
            if (logged.isNotEmpty()) {
                append("<wins_log>\n")
                for (win in logged) {
                    append("- ").append(Days.iso(win.day)).append(": ").append(win.title)
                    if (win.goal.isNotBlank()) append(" [goal: ").append(win.goal).append(']')
                    append('\n')
                }
                append("</wins_log>\n\n")
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
    suspend fun planDay(day: Long): DayPlan = job {
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
        plan
    }

    /** Lays the open tasks out over the rest of the week containing [today]. Nothing moves until the user applies it. */
    suspend fun planWeek(today: Long): WeekPlan = job {
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
        plan
    }

    /** The assistant's read of how the week starting [weekStart] went, with the numbers it was judged on. */
    suspend fun reviewWeek(weekStart: Long): WeekReview = job {
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
        review
    }

    // ---------------------------------------------------------------------------------------
    // Goals, wins and the self-review

    /**
     * One pass over what has happened since the last pass: adds what is worth keeping to the wins
     * log, and says where each of the user's goals stands. Returns what it added and concluded.
     */
    suspend fun updateProgress(): ProgressUpdate = job {
        val zone = zone()
        val today = Days.today(zone, now())
        val profile = settings.currentProfile()
        val lastPass = db.insights().get(InsightKind.GOALS, 0)
        // A day of overlap with the last pass; the log refuses duplicates.
        val since = lastPass?.let { Days.ofMillis(it.createdAt, zone) - 1 } ?: (today - FIRST_PROGRESS_DAYS)
        val from = Days.startMillis(since, zone)
        val allTasks = db.tasks().all()
        val allMeetings = db.meetings().all()
        val titles = allMeetings.associate { it.id to it.title }
        val mine = allTasks.filter { it.ownership == Ownership.MINE }
        val done = mine.filter { it.status == TaskStatus.DONE && (it.completedAt ?: 0) >= from }.sortedBy { it.completedAt }.takeLast(80)
        val recent = allMeetings.filter { it.status == MeetingStatus.READY && it.startedAt >= from }.sortedBy { it.startedAt }.takeLast(30)
        if (done.isEmpty() && recent.isEmpty()) {
            throw LlmException(LlmException.Kind.OTHER, "Nothing has been finished or recorded since the last update, so there is nothing new to add.")
        }
        val logged = db.wins().all()

        val body = buildString {
            append("Today is ").append(Days.longDate(today)).append(". This covers everything since ").append(Days.longDate(since)).append(".\n\n")
            append("<goals>\n").append(profile.goals.joinToString("\n") { "- $it" }.ifEmpty { "None set." }).append("\n</goals>\n\n")
            if (profile.successMeasures.isNotEmpty()) {
                append("<judged_on>\n").append(profile.successMeasures.joinToString("\n") { "- $it" }).append("\n</judged_on>\n\n")
            }
            append("<already_logged>\n")
            append(logged.take(40).joinToString("\n") { "- ${Days.iso(it.day)}: ${it.title}" + if (it.goal.isNotBlank()) " [${it.goal}]" else "" }.ifEmpty { "Nothing yet." })
            append("\n</already_logged>\n\n")
            append("<completed_tasks>\n")
            append(
                done.joinToString("\n") { task ->
                    val doneDay = Days.ofMillis(task.completedAt ?: 0, zone)
                    buildString {
                        append("- [task ").append(task.id).append("] ").append(task.title).append(" | done ").append(Days.iso(doneDay))
                        task.dueDay?.let { due -> append(if (doneDay > due) " | ${doneDay - due} days after its date" else " | on time") }
                        task.meetingId?.let { id -> titles[id]?.let { append(" | from \"").append(it).append('"') } }
                        if (task.details.isNotBlank()) append(" | ").append(task.details.trim().take(160))
                    }
                }.ifEmpty { "None." },
            )
            append("\n</completed_tasks>\n\n")
            append("<meetings>\n")
            append(
                recent.joinToString("\n") { meeting ->
                    val decisions = ContextBlocks.analysisOf(meeting)?.decisions.orEmpty()
                    "- [meeting ${meeting.id}] ${Days.iso(Days.ofMillis(meeting.startedAt, zone))} \"${meeting.title}\": ${meeting.tldr}" +
                        if (decisions.isNotEmpty()) " Decided: " + decisions.joinToString("; ") else ""
                }.ifEmpty { "None." },
            )
            append("\n</meetings>\n\n")
            append("<still_open>\n").append(ContextBlocks.tasks(mine.filter { it.status == TaskStatus.OPEN }, today, titles, zone)).append("\n</still_open>\n\n")
            append(Prompts.progressTask(profile))
        }
        val (raw, _) = callForJson(planRequest("progress", profile, body, Schemas.progressUpdate), ProgressUpdate.serializer())

        // Keep only what points at real things: the user's own goals, tasks they finished, meetings they held.
        val goalByKey = profile.goals.associateBy { knowledgeKey(it) }
        val doneIds = done.mapTo(HashSet()) { it.id }
        val meetingIds = recent.mapTo(HashSet()) { it.id }
        val added = raw.wins.mapNotNull { win ->
            val day = (Days.parseIso(win.day) ?: today).coerceAtMost(today)
            val goal = goalByKey[knowledgeKey(win.goal)].orEmpty()
            val id = wins.add(
                title = win.title,
                day = day,
                detail = win.detail,
                goal = goal,
                source = WinSource.ASSISTANT,
                taskId = win.taskId.takeIf { it in doneIds },
                meetingId = win.meetingId.takeIf { it in meetingIds },
            )
            if (id == null) null else win.copy(goal = goal, day = Days.iso(day))
        }
        val reads = raw.goals.associateBy { knowledgeKey(it.goal) }
        val goals = profile.goals.map { goal -> reads[knowledgeKey(goal)]?.copy(goal = goal) ?: GoalRead(goal = goal) }
        val update = ProgressUpdate(wins = added, goals = goals)
        db.insights().upsert(
            InsightEntity(kind = InsightKind.GOALS, periodStart = 0, json = AideJson.encodeToString(ProgressUpdate.serializer(), update.copy(wins = emptyList())), createdAt = now()),
        )
        update
    }

    /** Drafts a self-review for the days [fromDay] to [toDay], streaming it to [onText], and keeps the draft. */
    suspend fun draftSelfReview(fromDay: Long, toDay: Long, onText: (String) -> Unit): String = job {
        val zone = zone()
        val today = Days.today(zone, now())
        val profile = settings.currentProfile()
        val from = Days.startMillis(fromDay, zone)
        val until = Days.startMillis(toDay + 1, zone)
        val logged = db.wins().all().filter { it.day in fromDay..toDay }.sortedBy { it.day }
        val allTasks = db.tasks().all()
        val allMeetings = db.meetings().all()
        val finished = allTasks.filter { it.ownership == Ownership.MINE && it.status == TaskStatus.DONE && (it.completedAt ?: 0) in from until until }
        if (logged.isEmpty() && finished.isEmpty()) {
            throw LlmException(LlmException.Kind.OTHER, "There is nothing on record for that period yet: no wins logged and no tasks finished.")
        }
        val reads = db.insights().get(InsightKind.GOALS, 0)
            ?.let { runCatching { AideJson.decodeFromString(ProgressUpdate.serializer(), it.json) }.getOrNull() }?.goals.orEmpty()
            .associateBy { knowledgeKey(it.goal) }
        val reviews = db.insights().all().filter { it.kind == InsightKind.WEEK_REVIEW && it.periodStart in (fromDay - 6)..toDay }
            .mapNotNull { stored -> runCatching { AideJson.decodeFromString(WeekReview.serializer(), stored.json) }.getOrNull()?.let { stored.periodStart to it } }
            .sortedBy { it.first }

        val body = buildString {
            append("The period under review: ").append(Days.longDate(fromDay)).append(" to ").append(Days.longDate(toDay)).append(". Today is ").append(Days.longDate(today)).append(".\n\n")
            append("<goals>\n")
            if (profile.goals.isEmpty()) append("None set.\n")
            for (goal in profile.goals) {
                append("- ").append(goal)
                reads[knowledgeKey(goal)]?.takeIf { it.note.isNotBlank() }?.let { append(" (as it stands: ").append(it.status.replace('_', ' ')).append(". ").append(it.note).append(')') }
                append('\n')
            }
            append("</goals>\n\n")
            append("<wins_log>\n")
            append(
                logged.joinToString("\n") { win ->
                    "- ${Days.iso(win.day)}: ${win.title}" + (if (win.detail.isNotBlank()) " — ${win.detail}" else "") + if (win.goal.isNotBlank()) " [goal: ${win.goal}]" else ""
                }.ifEmpty { "Nothing logged." },
            )
            append("\n</wins_log>\n\n")
            append("<numbers>\n").append(statsText(workStats(allTasks, allMeetings, fromDay, toDay, today, zone))).append("\n</numbers>\n\n")
            append("<tasks_finished>\n").append(finished.sortedBy { it.completedAt }.takeLast(60).joinToString("\n") { "- " + it.title }.ifEmpty { "None." }).append("\n</tasks_finished>\n\n")
            if (reviews.isNotEmpty()) {
                append("<weekly_reviews>\n")
                for ((week, review) in reviews) {
                    append("- Week of ").append(Days.iso(week)).append(": ").append(review.headline)
                    if (review.patterns.isNotEmpty()) append(" Patterns: ").append(review.patterns.joinToString("; "))
                    append('\n')
                }
                append("</weekly_reviews>\n\n")
            }
            append(Prompts.selfReviewTask(profile))
        }
        val response = call(
            LlmRequest(
                feature = "self_review",
                system = listOf(SystemPart(Prompts.identity(profile) + "\n\n" + Prompts.profileBlock(profile))),
                messages = listOf(LlmMessage(LlmMessage.Role.USER, body)),
                maxTokens = 16_000,
                effort = Effort.MEDIUM,
            ),
            onText,
        )
        val text = response.text.trim()
        db.insights().upsert(
            InsightEntity(kind = InsightKind.SELF_REVIEW, periodStart = fromDay, json = AideJson.encodeToString(SelfReview.serializer(), SelfReview(fromDay, toDay, text)), createdAt = now()),
        )
        text
    }

    // ---------------------------------------------------------------------------------------
    // People

    /** Suggests what to cover in the user's next conversation with [name], and keeps the suggestion. */
    suspend fun suggestAgenda(name: String): PersonAgenda = job {
        val zone = zone()
        val today = Days.today(zone, now())
        val profile = settings.currentProfile()
        val allMeetings = db.meetings().all()
        val person = buildPersonView(name, db.knowledge().all(), db.tasks().all(), allMeetings, self = profile.name)
        val together = person.meetings.filter { it.status == MeetingStatus.READY }.take(3)
        if (person.entry == null && person.theyOwe.isEmpty() && person.openWithThem.isEmpty() && together.isEmpty()) {
            throw LlmException(LlmException.Kind.OTHER, "There is nothing on record with ${person.name} yet to build an agenda from.")
        }
        val titles = allMeetings.associate { it.id to it.title }
        val body = buildString {
            append("Today is ").append(Days.longDate(today)).append(".\n\n")
            append("<person>\n").append(person.name).append('\n').append(person.entry?.content?.trim() ?: "Nothing saved about them yet.").append("\n</person>\n\n")
            append("<they_owe_the_user>\n").append(ContextBlocks.tasks(person.theyOwe, today, titles, zone)).append("\n</they_owe_the_user>\n\n")
            append("<the_user_owes_or_has_open_with_them>\n").append(ContextBlocks.tasks(person.openWithThem, today, titles, zone)).append("\n</the_user_owes_or_has_open_with_them>\n\n")
            append("<recent_meetings_together>\n")
            append(together.joinToString("\n\n") { ContextBlocks.meetingNotes(it, zone) }.ifEmpty { "None with notes." })
            append("\n</recent_meetings_together>\n\n")
            append(Prompts.agendaTask(profile, person.name))
        }
        val (agenda, _) = callForJson(planRequest("person_agenda", profile, body, Schemas.personAgenda), PersonAgenda.serializer())
        db.insights().upsert(
            InsightEntity(kind = InsightKind.PERSON_AGENDA, periodStart = person.number, json = AideJson.encodeToString(PersonAgenda.serializer(), agenda), createdAt = now()),
        )
        agenda
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
        stats.averageDaysToClose?.let { append("Average days from taking a task on to finishing it: ").append(String.format(Locale.US, "%.1f", it)).append('\n') }
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

    /**
     * Runs one of the assistant's jobs so that whatever goes wrong inside it, short of being
     * cancelled, reaches the caller as an [LlmException] with something to show the user.
     */
    private suspend fun <T> job(block: suspend () -> T): T = try {
        block()
    } catch (e: CancellationException) {
        throw e
    } catch (e: LlmException) {
        throw e
    } catch (e: Exception) {
        throw LlmException(LlmException.Kind.OTHER, "Something went wrong inside Aide: ${e.message ?: e.javaClass.simpleName}", e)
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
        /** How many recurring meetings a meeting of unknown series is compared against. */
        const val MAX_SERIES_CANDIDATES = 3
        /** How many earlier action items per recurring meeting the assistant is asked to report on. */
        const val MAX_EARLIER_ITEMS = 25
        /** How far back the first pass over wins looks, in days. */
        const val FIRST_PROGRESS_DAYS = 90L

        /** How many of the newest wins go along with a question to Ask. */
        const val MAX_WINS_IN_CONTEXT = 20
        /** Characters of knowledge base text sent in full with a request (roughly 8,000 tokens). */
        const val KNOWLEDGE_BUDGET = 32_000
        const val MAX_HISTORY = 24
    }
}
