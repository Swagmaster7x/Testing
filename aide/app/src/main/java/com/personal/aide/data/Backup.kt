package com.personal.aide.data

import androidx.room.withTransaction
import com.personal.aide.data.db.AppDatabase
import com.personal.aide.data.db.ChatMessageEntity
import com.personal.aide.data.db.ChatThreadEntity
import com.personal.aide.data.db.InsightEntity
import com.personal.aide.data.db.KnowledgeEntity
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.QuestionEntity
import com.personal.aide.data.db.SegmentEntity
import com.personal.aide.data.db.SeriesEntity
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.data.db.WinEntity
import kotlinx.serialization.Serializable

/** Everything the app knows, as one file. The API key is deliberately not part of it. */
@Serializable
data class BackupFile(
    val format: Int = FORMAT,
    val exportedAt: Long = 0,
    val profile: WorkProfile = WorkProfile(),
    val meetings: List<MeetingEntity> = emptyList(),
    val segments: List<SegmentEntity> = emptyList(),
    val tasks: List<TaskEntity> = emptyList(),
    val knowledge: List<KnowledgeEntity> = emptyList(),
    val questions: List<QuestionEntity> = emptyList(),
    val threads: List<ChatThreadEntity> = emptyList(),
    val messages: List<ChatMessageEntity> = emptyList(),
    val insights: List<InsightEntity> = emptyList(),
    val series: List<SeriesEntity> = emptyList(),
    val wins: List<WinEntity> = emptyList(),
) {
    companion object {
        /** 2 added recurring meetings and the wins log; a format 1 file restores with none. */
        const val FORMAT = 2
    }
}

class Backup(
    private val db: AppDatabase,
    private val settings: SettingsStore,
    private val now: () -> Long = System::currentTimeMillis,
) {
    suspend fun export(): String = AideJson.encodeToString(
        BackupFile.serializer(),
        BackupFile(
            exportedAt = now(),
            profile = settings.currentProfile(),
            meetings = db.meetings().all(),
            segments = db.meetings().allSegments(),
            tasks = db.tasks().all(),
            knowledge = db.knowledge().all(),
            questions = db.questions().all(),
            threads = db.chat().allThreads(),
            messages = db.chat().allMessages(),
            insights = db.insights().all(),
            series = db.series().all(),
            wins = db.wins().all(),
        ),
    )

    /**
     * Replaces everything in the app with the contents of a backup file.
     * @throws IllegalArgumentException when [json] isn't a backup this version can read.
     */
    suspend fun restore(json: String) {
        val file = runCatching { AideJson.decodeFromString(BackupFile.serializer(), json) }
            .getOrElse { throw IllegalArgumentException("That file isn't an Aide backup.") }
        require(file.format >= 1 && file.exportedAt > 0) { "That file isn't an Aide backup." }
        require(file.format <= BackupFile.FORMAT) { "That backup was made by a newer version of Aide." }
        db.withTransaction {
            wipeTables()
            val restore = db.restore()
            restore.meetings(file.meetings)
            restore.segments(file.segments)
            restore.tasks(file.tasks)
            restore.knowledge(file.knowledge)
            restore.questions(file.questions)
            restore.threads(file.threads)
            restore.messages(file.messages)
            restore.insights(file.insights)
            restore.series(file.series)
            restore.wins(file.wins)
        }
        settings.setProfile(file.profile)
    }

    /** Erases all meetings, tasks, knowledge, chats and the work profile. Settings and the API key stay. */
    suspend fun eraseEverything() {
        db.withTransaction { wipeTables() }
        settings.setProfile(WorkProfile())
    }

    private suspend fun wipeTables() {
        db.chat().deleteAll()
        db.questions().deleteAll()
        db.tasks().deleteAll()
        db.meetings().deleteAll()
        db.knowledge().deleteAll()
        db.insights().deleteAll()
        db.series().deleteAll()
        db.wins().deleteAll()
        db.usage().deleteAll()
    }
}
