package com.personal.aide.data

import com.personal.aide.data.db.KnowledgeOrigin
import com.personal.aide.data.db.MeetingDao
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingSource
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.QuestionDao
import com.personal.aide.data.db.QuestionEntity
import com.personal.aide.data.db.QuestionStatus
import com.personal.aide.data.db.SegmentEntity
import com.personal.aide.data.db.SegmentKind
import com.personal.aide.data.db.TaskDao
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.data.db.TaskOrigin
import com.personal.aide.data.db.TaskStatus
import com.personal.aide.domain.Days
import com.personal.aide.domain.splitImportedText
import com.personal.aide.domain.wordCount

/** Creating and changing meetings and their transcripts. */
class MeetingStore(private val dao: MeetingDao, private val now: () -> Long = System::currentTimeMillis) {

    suspend fun startLive(title: String?, attendees: List<String> = emptyList(), calendarEventId: Long? = null): Long {
        val time = now()
        val given = title?.trim().orEmpty()
        return dao.insert(
            MeetingEntity(
                title = given.ifEmpty { defaultTitle(time) },
                titleIsAuto = given.isEmpty(),
                startedAt = time,
                source = MeetingSource.LIVE,
                status = MeetingStatus.RECORDING,
                attendees = attendees,
                calendarEventId = calendarEventId,
            ),
        )
    }

    suspend fun addSegment(meetingId: Long, kind: SegmentKind, text: String, offsetMs: Long): Long =
        dao.insertSegment(SegmentEntity(meetingId = meetingId, offsetMs = offsetMs, kind = kind, text = text.trim()))

    /** Closes a live recording. Returns the meeting, or null if it has gone. */
    suspend fun finish(meetingId: Long): MeetingEntity? {
        val meeting = dao.get(meetingId) ?: return null
        val words = dao.segments(meetingId).filter { it.kind != SegmentKind.FLAG }.sumOf { wordCount(it.text) }
        val finished = meeting.copy(
            endedAt = meeting.endedAt ?: now(),
            status = if (meeting.status == MeetingStatus.RECORDING) MeetingStatus.TRANSCRIBED else meeting.status,
            wordCount = words,
        )
        dao.update(finished)
        return finished
    }

    /** A meeting made from pasted text: an exported transcript, or the user's own notes. */
    suspend fun importText(title: String?, text: String, startedAt: Long = now()): Long {
        val given = title?.trim().orEmpty()
        val lines = splitImportedText(text)
        val id = dao.insert(
            MeetingEntity(
                title = given.ifEmpty { defaultTitle(startedAt) },
                titleIsAuto = given.isEmpty(),
                startedAt = startedAt,
                endedAt = startedAt,
                source = MeetingSource.IMPORT,
                status = MeetingStatus.TRANSCRIBED,
                wordCount = lines.sumOf { wordCount(it) },
            ),
        )
        dao.insertSegments(lines.mapIndexed { index, line -> SegmentEntity(meetingId = id, offsetMs = index.toLong(), text = line) })
        return id
    }

    suspend fun rename(meetingId: Long, title: String) {
        val clean = title.trim()
        if (clean.isEmpty()) return
        dao.get(meetingId)?.let { dao.update(it.copy(title = clean, titleIsAuto = false)) }
    }

    suspend fun rate(meetingId: Long, rating: Int) = dao.rate(meetingId, rating.coerceIn(-1, 1))

    suspend fun delete(meetingId: Long) {
        dao.get(meetingId)?.let { dao.delete(it) }
    }

    /** A recording the app died in the middle of is closed off; a summary cut short can be asked for again. */
    suspend fun recoverAfterRestart(activeMeetingId: Long? = null) {
        for (meeting in dao.all()) {
            if (meeting.status == MeetingStatus.RECORDING && meeting.id != activeMeetingId) finish(meeting.id)
        }
        dao.moveStatus(MeetingStatus.PROCESSING, MeetingStatus.TRANSCRIBED)
    }

    companion object {
        fun defaultTitle(startedAt: Long): String = "Meeting, " + Days.dateTime(startedAt)
    }
}

/** Creating and changing tasks, and remembering which changes say something about the assistant. */
class TaskStore(private val dao: TaskDao, private val now: () -> Long = System::currentTimeMillis) {

    suspend fun add(
        title: String,
        dueDay: Long? = null,
        priority: Int = 1,
        details: String = "",
        ownership: Ownership = Ownership.MINE,
        owner: String = "",
        plannedDay: Long? = null,
        meetingId: Long? = null,
    ): Long? {
        val clean = title.trim()
        if (clean.isEmpty()) return null
        return dao.insert(
            TaskEntity(
                title = clean,
                details = details.trim(),
                owner = owner.trim(),
                ownership = ownership,
                dueDay = dueDay,
                priority = priority.coerceIn(0, 2),
                origin = TaskOrigin.MANUAL,
                meetingId = meetingId,
                createdAt = now(),
                plannedDay = plannedDay,
            ),
        )
    }

    suspend fun setDone(taskId: Long, done: Boolean) {
        val task = dao.get(taskId) ?: return
        dao.update(
            if (done) task.copy(status = TaskStatus.DONE, completedAt = now(), kept = true)
            else task.copy(status = TaskStatus.OPEN, completedAt = null, kept = true),
        )
    }

    /** "This isn't a real task": kept, hidden, and counted against the assistant if it suggested it. */
    suspend fun dismiss(taskId: Long) {
        dao.get(taskId)?.let { dao.update(it.copy(status = TaskStatus.DISMISSED)) }
    }

    suspend fun restore(taskId: Long) {
        dao.get(taskId)?.let { dao.update(it.copy(status = TaskStatus.OPEN, completedAt = null, kept = true)) }
    }

    /** Settles whose a task is. Answering the assistant's "unclear" is not a correction; overruling it is. */
    suspend fun setOwnership(taskId: Long, ownership: Ownership, owner: String = "") {
        val task = dao.get(taskId) ?: return
        val overruled = task.origin == TaskOrigin.AI && task.ownership != Ownership.UNCLEAR && task.ownership != ownership
        dao.update(
            task.copy(
                ownership = ownership,
                owner = if (ownership == Ownership.MINE) "" else owner.trim().ifEmpty { task.owner },
                edited = task.edited || overruled,
                kept = true,
            ),
        )
    }

    /** Saves the user's edit. An assistant-made task whose wording or date had to change is marked as corrected. */
    suspend fun edit(updated: TaskEntity) {
        val before = dao.get(updated.id) ?: return
        val corrected = before.origin == TaskOrigin.AI && (
            before.title.trim() != updated.title.trim() ||
                before.dueDay != updated.dueDay ||
                (before.ownership != Ownership.UNCLEAR && before.ownership != updated.ownership)
            )
        val saved = updated.copy(
            title = updated.title.trim(),
            details = updated.details.trim(),
            edited = before.edited || corrected,
            suggestedTitle = before.suggestedTitle,
            kept = before.kept,
        )
        // Opening the editor and saving it as it was changes nothing, including whether a new summary may replace it.
        dao.update(if (saved == before) saved else saved.copy(kept = true))
    }

    suspend fun planFor(taskId: Long, day: Long?) {
        dao.get(taskId)?.let { dao.update(it.copy(plannedDay = day, kept = true)) }
    }

    /** Puts each task on the day a week plan gave it. Tasks that have gone, or are done, are skipped. */
    suspend fun applyWeekPlan(plan: WeekPlan) {
        for (dayPlan in plan.days) {
            val day = Days.parseIso(dayPlan.day) ?: continue
            for (id in dayPlan.taskIds) {
                val task = dao.get(id) ?: continue
                if (task.status == TaskStatus.OPEN) dao.update(task.copy(plannedDay = day, kept = true))
            }
        }
    }

    suspend fun delete(taskId: Long) {
        dao.get(taskId)?.let { dao.delete(it) }
    }
}

/** The assistant's questions to the user, and what happens to the answers. */
class QuestionStore(
    private val dao: QuestionDao,
    private val knowledge: KnowledgeBase,
    private val now: () -> Long = System::currentTimeMillis,
) {
    /** Records the answer and files it in the knowledge base under the question's topic. */
    suspend fun answer(questionId: Long, answer: String) {
        val clean = answer.trim()
        if (clean.isEmpty()) return
        val question = dao.get(questionId) ?: return
        dao.update(question.copy(answer = clean, status = QuestionStatus.ANSWERED, answeredAt = now()))
        knowledge.save(
            type = question.topicType,
            title = question.topic.ifBlank { question.question },
            content = clean,
            origin = KnowledgeOrigin.ANSWER,
            meetingId = question.meetingId,
            replace = false,
        )
    }

    suspend fun skip(questionId: Long) {
        dao.get(questionId)?.let { dao.update(it.copy(status = QuestionStatus.SKIPPED)) }
    }

    suspend fun add(question: QuestionEntity): Long = dao.insert(question)
}
