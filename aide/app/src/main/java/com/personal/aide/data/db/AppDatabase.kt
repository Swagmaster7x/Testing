package com.personal.aide.data.db

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverter
import androidx.room.TypeConverters
import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.builtins.serializer
import kotlinx.serialization.json.Json

class Converters {
    @TypeConverter
    fun stringsToJson(value: List<String>): String = Json.encodeToString(ListSerializer(String.serializer()), value)

    @TypeConverter
    fun jsonToStrings(value: String): List<String> =
        runCatching { Json.decodeFromString(ListSerializer(String.serializer()), value) }.getOrDefault(emptyList())

    @TypeConverter
    fun longsToJson(value: List<Long>): String = Json.encodeToString(ListSerializer(Long.serializer()), value)

    @TypeConverter
    fun jsonToLongs(value: String): List<Long> =
        runCatching { Json.decodeFromString(ListSerializer(Long.serializer()), value) }.getOrDefault(emptyList())
}

@Database(
    entities = [
        MeetingEntity::class,
        SegmentEntity::class,
        TaskEntity::class,
        KnowledgeEntity::class,
        QuestionEntity::class,
        ChatThreadEntity::class,
        ChatMessageEntity::class,
        InsightEntity::class,
        UsageEntity::class,
    ],
    version = 1,
    exportSchema = true,
)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun meetings(): MeetingDao
    abstract fun tasks(): TaskDao
    abstract fun knowledge(): KnowledgeDao
    abstract fun questions(): QuestionDao
    abstract fun chat(): ChatDao
    abstract fun insights(): InsightDao
    abstract fun usage(): UsageDao
    abstract fun restore(): RestoreDao

    companion object {
        fun create(context: Context): AppDatabase =
            Room.databaseBuilder(context, AppDatabase::class.java, "aide.db").build()

        fun inMemory(context: Context): AppDatabase =
            Room.inMemoryDatabaseBuilder(context, AppDatabase::class.java).allowMainThreadQueries().build()
    }
}
