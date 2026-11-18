package com.personal.aide.data.db

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey
import kotlinx.serialization.Serializable

enum class MeetingStatus { RECORDING, TRANSCRIBED, PROCESSING, READY, FAILED }
enum class MeetingSource { LIVE, IMPORT }

/** One meeting: a live recording or pasted text, plus what the assistant made of it. */
@Serializable
@Entity(tableName = "meetings")
data class MeetingEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val title: String,
    /** False once the user (or the assistant) has given it a real name. */
    val titleIsAuto: Boolean = true,
    val startedAt: Long,
    val endedAt: Long? = null,
    val source: MeetingSource = MeetingSource.LIVE,
    val status: MeetingStatus = MeetingStatus.RECORDING,
    val attendees: List<String> = emptyList(),
    val calendarEventId: Long? = null,
    val meetingType: String = "",
    val tldr: String = "",
    /** [com.personal.aide.data.MeetingAnalysis] as JSON; empty until summarized. */
    val analysisJson: String = "",
    val error: String = "",
    /** The user's verdict on the summary: -1, 0 (none) or 1. */
    val rating: Int = 0,
    val wordCount: Int = 0,
    val summarizedAt: Long? = null,
    val model: String = "",
)

enum class SegmentKind { SPEECH, NOTE, FLAG }

/** A piece of a meeting in the order it happened: recognized speech, a typed note, or a flagged moment. */
@Serializable
@Entity(
    tableName = "segments",
    foreignKeys = [
        ForeignKey(
            entity = MeetingEntity::class,
            parentColumns = ["id"],
            childColumns = ["meetingId"],
            onDelete = ForeignKey.CASCADE,
        ),
    ],
    indices = [Index("meetingId")],
)
data class SegmentEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val meetingId: Long,
    /** Milliseconds since the meeting started. */
    val offsetMs: Long,
    val kind: SegmentKind = SegmentKind.SPEECH,
    val text: String,
)

enum class TaskStatus { OPEN, DONE, DISMISSED }
enum class TaskOrigin { AI, MANUAL }

/** Whose job it is. UNCLEAR is the assistant saying it could not tell from the transcript. */
enum class Ownership { MINE, OTHERS, UNCLEAR }

@Serializable
@Entity(
    tableName = "tasks",
    foreignKeys = [
        ForeignKey(
            entity = MeetingEntity::class,
            parentColumns = ["id"],
            childColumns = ["meetingId"],
            onDelete = ForeignKey.SET_NULL,
        ),
    ],
    indices = [Index("meetingId"), Index("status")],
)
data class TaskEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val title: String,
    val details: String = "",
    /** A person's name when it is someone else's; empty for the user's own. */
    val owner: String = "",
    val ownership: Ownership = Ownership.MINE,
    /** Days since 1970-01-01 in the phone's time zone, or null for no date. */
    val dueDay: Long? = null,
    /** 0 low, 1 normal, 2 high. */
    val priority: Int = 1,
    val status: TaskStatus = TaskStatus.OPEN,
    val origin: TaskOrigin = TaskOrigin.MANUAL,
    val meetingId: Long? = null,
    val createdAt: Long,
    val completedAt: Long? = null,
    /** A day the user (or a plan) pinned this to, separate from when it is due. */
    val plannedDay: Long? = null,
    /** What in the meeting this came from, in the assistant's words. */
    val evidence: String = "",
    /** The user changed an assistant-made task; counted when judging the assistant. */
    val edited: Boolean = false,
    /** The wording the assistant first gave it, so the same action item is recognised when a meeting is summarized again. */
    @ColumnInfo(defaultValue = "") val suggestedTitle: String = "",
    /** The user has acted on this task (settled whose it is, planned it, changed it), so a fresh summary must leave it be. */
    @ColumnInfo(defaultValue = "0") val kept: Boolean = false,
)

enum class KnowledgeType { PERSON, PROJECT, TERM, DECISION, PROCESS, ORG, FACT }
enum class KnowledgeOrigin { ONBOARDING, MEETING, ANSWER, MANUAL, CHAT }

/** One thing the assistant knows about the user's work. [key] is the title folded for matching. */
@Serializable
@Entity(
    tableName = "knowledge",
    indices = [Index(value = ["type", "key"], unique = true)],
)
data class KnowledgeEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val type: KnowledgeType,
    val title: String,
    val key: String,
    val content: String,
    val sourceMeetingIds: List<Long> = emptyList(),
    val origin: KnowledgeOrigin = KnowledgeOrigin.MANUAL,
    val pinned: Boolean = false,
    val createdAt: Long,
    val updatedAt: Long,
)

enum class QuestionStatus { OPEN, ANSWERED, SKIPPED }

/** Something the assistant wants to ask the user so it can do better next time. */
@Serializable
@Entity(
    tableName = "questions",
    foreignKeys = [
        ForeignKey(
            entity = MeetingEntity::class,
            parentColumns = ["id"],
            childColumns = ["meetingId"],
            onDelete = ForeignKey.SET_NULL,
        ),
    ],
    indices = [Index("meetingId"), Index("status")],
)
data class QuestionEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val meetingId: Long? = null,
    val question: String,
    val why: String = "",
    /** The knowledge entry the answer belongs under. */
    val topic: String = "",
    val topicType: KnowledgeType = KnowledgeType.FACT,
    val answer: String = "",
    val status: QuestionStatus = QuestionStatus.OPEN,
    val createdAt: Long,
    val answeredAt: Long? = null,
)

enum class ThreadKind { ASK, ONBOARDING, MEETING }

@Serializable
@Entity(tableName = "chat_threads")
data class ChatThreadEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val kind: ThreadKind = ThreadKind.ASK,
    val title: String = "",
    val meetingId: Long? = null,
    val createdAt: Long,
    val updatedAt: Long,
)

@Serializable
@Entity(
    tableName = "chat_messages",
    foreignKeys = [
        ForeignKey(
            entity = ChatThreadEntity::class,
            parentColumns = ["id"],
            childColumns = ["threadId"],
            onDelete = ForeignKey.CASCADE,
        ),
    ],
    indices = [Index("threadId")],
)
data class ChatMessageEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val threadId: Long,
    /** "user" or "assistant". */
    val role: String,
    val text: String,
    val createdAt: Long,
    val rating: Int = 0,
    /** An assistant turn that failed; shown, but never sent back to the model. */
    val failed: Boolean = false,
)

enum class InsightKind { DAY_PLAN, WEEK_PLAN, WEEK_REVIEW }

/** A plan or review the assistant wrote for a day or a week, kept so it isn't paid for twice. */
@Serializable
@Entity(
    tableName = "insights",
    indices = [Index(value = ["kind", "periodStart"], unique = true)],
)
data class InsightEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val kind: InsightKind,
    /** The day, or the Monday of the week, as days since 1970-01-01. */
    val periodStart: Long,
    val json: String,
    val createdAt: Long,
    val rating: Int = 0,
)

/** One call to Claude, for the cost overview and for judging the assistant. */
@Serializable
@Entity(tableName = "usage", indices = [Index("at")])
data class UsageEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val at: Long,
    val feature: String,
    val model: String,
    val inputTokens: Long = 0,
    val outputTokens: Long = 0,
    val cacheReadTokens: Long = 0,
    val cacheWriteTokens: Long = 0,
    val ok: Boolean = true,
    val millis: Long = 0,
)
