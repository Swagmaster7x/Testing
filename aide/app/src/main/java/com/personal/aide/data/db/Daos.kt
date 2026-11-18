package com.personal.aide.data.db

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

@Dao
interface MeetingDao {
    @Insert suspend fun insert(meeting: MeetingEntity): Long
    @Update suspend fun update(meeting: MeetingEntity)
    @Delete suspend fun delete(meeting: MeetingEntity)

    @Query("SELECT * FROM meetings WHERE id = :id") suspend fun get(id: Long): MeetingEntity?
    @Query("SELECT * FROM meetings WHERE id = :id") fun observe(id: Long): Flow<MeetingEntity?>
    @Query("SELECT * FROM meetings ORDER BY startedAt DESC") fun observeAll(): Flow<List<MeetingEntity>>
    @Query("SELECT * FROM meetings ORDER BY startedAt DESC") suspend fun all(): List<MeetingEntity>
    @Query("SELECT * FROM meetings WHERE startedAt >= :from AND startedAt < :to ORDER BY startedAt")
    suspend fun between(from: Long, to: Long): List<MeetingEntity>
    @Query("SELECT COUNT(*) FROM meetings WHERE status = 'READY'") suspend fun readyCount(): Int

    @Query("UPDATE meetings SET status = :to WHERE status = :from")
    suspend fun moveStatus(from: MeetingStatus, to: MeetingStatus)

    @Query("UPDATE meetings SET rating = :rating WHERE id = :id") suspend fun rate(id: Long, rating: Int)

    @Insert suspend fun insertSegment(segment: SegmentEntity): Long
    @Insert suspend fun insertSegments(segments: List<SegmentEntity>)
    @Update suspend fun updateSegment(segment: SegmentEntity)
    @Query("SELECT * FROM segments WHERE meetingId = :meetingId ORDER BY offsetMs, id")
    fun observeSegments(meetingId: Long): Flow<List<SegmentEntity>>
    @Query("SELECT * FROM segments WHERE meetingId = :meetingId ORDER BY offsetMs, id")
    suspend fun segments(meetingId: Long): List<SegmentEntity>
    @Query("SELECT * FROM segments ORDER BY meetingId, offsetMs, id") suspend fun allSegments(): List<SegmentEntity>
    @Query("DELETE FROM segments WHERE meetingId = :meetingId") suspend fun deleteSegments(meetingId: Long)
    @Query("DELETE FROM meetings") suspend fun deleteAll()
}

@Dao
interface TaskDao {
    @Insert suspend fun insert(task: TaskEntity): Long
    @Insert suspend fun insertAll(tasks: List<TaskEntity>)
    @Update suspend fun update(task: TaskEntity)
    @Delete suspend fun delete(task: TaskEntity)

    @Query("SELECT * FROM tasks WHERE id = :id") suspend fun get(id: Long): TaskEntity?
    @Query("SELECT * FROM tasks ORDER BY createdAt DESC") fun observeAll(): Flow<List<TaskEntity>>
    @Query("SELECT * FROM tasks ORDER BY createdAt DESC") suspend fun all(): List<TaskEntity>
    @Query("SELECT * FROM tasks WHERE meetingId = :meetingId ORDER BY id")
    fun observeForMeeting(meetingId: Long): Flow<List<TaskEntity>>
    @Query("SELECT * FROM tasks WHERE meetingId = :meetingId ORDER BY id")
    suspend fun forMeeting(meetingId: Long): List<TaskEntity>

    /** Clears the way for a fresh summary: only assistant-made tasks nobody has touched go. */
    @Query("DELETE FROM tasks WHERE meetingId = :meetingId AND origin = 'AI' AND status = 'OPEN' AND edited = 0")
    suspend fun deleteUntouchedAiTasks(meetingId: Long)

    @Query("DELETE FROM tasks") suspend fun deleteAll()
}

@Dao
interface KnowledgeDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE) suspend fun insert(entry: KnowledgeEntity): Long
    @Update suspend fun update(entry: KnowledgeEntity)
    @Delete suspend fun delete(entry: KnowledgeEntity)

    @Query("SELECT * FROM knowledge WHERE id = :id") suspend fun get(id: Long): KnowledgeEntity?
    @Query("SELECT * FROM knowledge WHERE id = :id") fun observe(id: Long): Flow<KnowledgeEntity?>
    @Query("SELECT * FROM knowledge WHERE type = :type AND `key` = :key LIMIT 1")
    suspend fun find(type: KnowledgeType, key: String): KnowledgeEntity?
    @Query("SELECT * FROM knowledge WHERE `key` = :key LIMIT 1") suspend fun findByKey(key: String): KnowledgeEntity?
    @Query("SELECT * FROM knowledge ORDER BY pinned DESC, updatedAt DESC") fun observeAll(): Flow<List<KnowledgeEntity>>
    @Query("SELECT * FROM knowledge ORDER BY pinned DESC, updatedAt DESC") suspend fun all(): List<KnowledgeEntity>
    @Query("SELECT COUNT(*) FROM knowledge") fun observeCount(): Flow<Int>
    @Query("DELETE FROM knowledge") suspend fun deleteAll()
}

@Dao
interface QuestionDao {
    @Insert suspend fun insert(question: QuestionEntity): Long
    @Insert suspend fun insertAll(questions: List<QuestionEntity>)
    @Update suspend fun update(question: QuestionEntity)

    @Query("SELECT * FROM questions WHERE id = :id") suspend fun get(id: Long): QuestionEntity?
    @Query("SELECT * FROM questions WHERE status = 'OPEN' ORDER BY createdAt DESC")
    fun observeOpen(): Flow<List<QuestionEntity>>
    @Query("SELECT * FROM questions WHERE meetingId = :meetingId ORDER BY id")
    fun observeForMeeting(meetingId: Long): Flow<List<QuestionEntity>>
    @Query("SELECT * FROM questions ORDER BY createdAt DESC") suspend fun all(): List<QuestionEntity>
    @Query("SELECT * FROM questions ORDER BY createdAt DESC") fun observeAll(): Flow<List<QuestionEntity>>
    @Query("DELETE FROM questions WHERE meetingId = :meetingId AND status = 'OPEN'")
    suspend fun deleteOpenForMeeting(meetingId: Long)
    @Query("DELETE FROM questions") suspend fun deleteAll()
}

@Dao
interface ChatDao {
    @Insert suspend fun insertThread(thread: ChatThreadEntity): Long
    @Update suspend fun updateThread(thread: ChatThreadEntity)
    @Delete suspend fun deleteThread(thread: ChatThreadEntity)
    @Query("SELECT * FROM chat_threads WHERE id = :id") suspend fun thread(id: Long): ChatThreadEntity?
    @Query("SELECT * FROM chat_threads WHERE kind = :kind ORDER BY updatedAt DESC")
    fun observeThreads(kind: ThreadKind): Flow<List<ChatThreadEntity>>
    @Query("SELECT * FROM chat_threads WHERE kind = :kind ORDER BY updatedAt DESC LIMIT 1")
    suspend fun latestThread(kind: ThreadKind): ChatThreadEntity?
    @Query("SELECT * FROM chat_threads ORDER BY id") suspend fun allThreads(): List<ChatThreadEntity>

    @Insert suspend fun insertMessage(message: ChatMessageEntity): Long
    @Update suspend fun updateMessage(message: ChatMessageEntity)
    @Query("SELECT * FROM chat_messages WHERE threadId = :threadId ORDER BY id")
    fun observeMessages(threadId: Long): Flow<List<ChatMessageEntity>>
    @Query("SELECT * FROM chat_messages WHERE threadId = :threadId ORDER BY id")
    suspend fun messages(threadId: Long): List<ChatMessageEntity>
    @Query("SELECT * FROM chat_messages ORDER BY id") suspend fun allMessages(): List<ChatMessageEntity>
    @Query("SELECT * FROM chat_messages ORDER BY id") fun observeAllMessages(): Flow<List<ChatMessageEntity>>
    @Query("UPDATE chat_messages SET rating = :rating WHERE id = :id") suspend fun rate(id: Long, rating: Int)
    @Query("DELETE FROM chat_threads") suspend fun deleteAll()
}

@Dao
interface InsightDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE) suspend fun upsert(insight: InsightEntity): Long
    @Query("SELECT * FROM insights WHERE kind = :kind AND periodStart = :periodStart LIMIT 1")
    fun observe(kind: InsightKind, periodStart: Long): Flow<InsightEntity?>
    @Query("SELECT * FROM insights WHERE kind = :kind AND periodStart = :periodStart LIMIT 1")
    suspend fun get(kind: InsightKind, periodStart: Long): InsightEntity?
    @Query("SELECT * FROM insights ORDER BY id") suspend fun all(): List<InsightEntity>
    @Query("SELECT * FROM insights ORDER BY id") fun observeAll(): Flow<List<InsightEntity>>
    @Query("UPDATE insights SET rating = :rating WHERE id = :id") suspend fun rate(id: Long, rating: Int)
    @Query("DELETE FROM insights") suspend fun deleteAll()
}

@Dao
interface UsageDao {
    @Insert suspend fun insert(usage: UsageEntity): Long
    @Query("SELECT * FROM usage WHERE at >= :since ORDER BY at") fun observeSince(since: Long): Flow<List<UsageEntity>>
    @Query("SELECT * FROM usage ORDER BY at") suspend fun all(): List<UsageEntity>
    @Query("DELETE FROM usage") suspend fun deleteAll()
}

/** Writes whole tables back from a backup file, keeping every row's id so links between rows hold. */
@Dao
interface RestoreDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE) suspend fun meetings(rows: List<MeetingEntity>)
    @Insert(onConflict = OnConflictStrategy.REPLACE) suspend fun segments(rows: List<SegmentEntity>)
    @Insert(onConflict = OnConflictStrategy.REPLACE) suspend fun tasks(rows: List<TaskEntity>)
    @Insert(onConflict = OnConflictStrategy.REPLACE) suspend fun knowledge(rows: List<KnowledgeEntity>)
    @Insert(onConflict = OnConflictStrategy.REPLACE) suspend fun questions(rows: List<QuestionEntity>)
    @Insert(onConflict = OnConflictStrategy.REPLACE) suspend fun threads(rows: List<ChatThreadEntity>)
    @Insert(onConflict = OnConflictStrategy.REPLACE) suspend fun messages(rows: List<ChatMessageEntity>)
    @Insert(onConflict = OnConflictStrategy.REPLACE) suspend fun insights(rows: List<InsightEntity>)
}
