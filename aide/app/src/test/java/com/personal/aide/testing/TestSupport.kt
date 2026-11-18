package com.personal.aide.testing

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.emptyPreferences
import androidx.room.Room
import com.personal.aide.ai.AideModel
import com.personal.aide.ai.KeyCheck
import com.personal.aide.ai.Llm
import com.personal.aide.ai.LlmException
import com.personal.aide.ai.LlmMessage
import com.personal.aide.ai.LlmRequest
import com.personal.aide.ai.LlmResponse
import com.personal.aide.ai.LlmUsage
import com.personal.aide.data.db.AppDatabase
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.data.db.TaskOrigin
import com.personal.aide.data.db.TaskStatus
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import java.time.LocalDate
import java.time.ZoneId
import java.time.ZonedDateTime
import java.util.concurrent.CopyOnWriteArrayList
import java.util.concurrent.Executor

/**
 * One fixed moment for tests that need "now": Wednesday 18 November 2026, 2:30 in the afternoon
 * in New York. The week it sits in runs from Monday the 16th to Sunday the 22nd.
 */
object Fixed {
    val zone: ZoneId = ZoneId.of("America/New_York")
    val today: Long = LocalDate.of(2026, 11, 18).toEpochDay()
    val monday: Long = today - 2
    val sunday: Long = today + 4
    val now: Long = at(today, 14, 30)

    /** The instant the clock in [zone] reads [hour]:[minute] on [day]. */
    fun at(day: Long, hour: Int = 12, minute: Int = 0, zone: ZoneId = this.zone): Long =
        ZonedDateTime.of(LocalDate.ofEpochDay(day).atTime(hour, minute), zone).toInstant().toEpochMilli()

    fun day(year: Int, month: Int, dayOfMonth: Int): Long = LocalDate.of(year, month, dayOfMonth).toEpochDay()
}

/** A task with only the fields a test cares about spelled out. */
fun task(
    id: Long = 0,
    title: String = "Task $id",
    due: Long? = null,
    planned: Long? = null,
    priority: Int = 1,
    ownership: Ownership = Ownership.MINE,
    status: TaskStatus = TaskStatus.OPEN,
    origin: TaskOrigin = TaskOrigin.MANUAL,
    createdAt: Long = Fixed.now,
    completedAt: Long? = null,
    owner: String = "",
    details: String = "",
    meetingId: Long? = null,
    edited: Boolean = false,
) = TaskEntity(
    id = id,
    title = title,
    details = details,
    owner = owner,
    ownership = ownership,
    dueDay = due,
    priority = priority,
    status = status,
    origin = origin,
    meetingId = meetingId,
    createdAt = createdAt,
    completedAt = completedAt,
    plannedDay = planned,
    edited = edited,
)

/**
 * Preferences kept in memory, so a [com.personal.aide.data.SettingsStore] can be built without a
 * file or background threads. Updates apply one at a time, like the real thing.
 */
class MemoryDataStore : DataStore<Preferences> {
    private val state = MutableStateFlow(emptyPreferences())
    private val mutex = Mutex()

    override val data: Flow<Preferences> = state

    override suspend fun updateData(transform: suspend (t: Preferences) -> Preferences): Preferences =
        mutex.withLock { transform(state.value).toPreferences().also { state.value = it } }
}

/**
 * An in-memory database whose queries run on the calling thread, for tests that drive coroutines
 * with a test scheduler and need every write to have happened by the time the scheduler is idle.
 */
fun inlineDatabase(context: Context): AppDatabase {
    val inline = Executor { it.run() }
    return Room.inMemoryDatabaseBuilder(context, AppDatabase::class.java)
        .allowMainThreadQueries()
        .setQueryExecutor(inline)
        .setTransactionExecutor(inline)
        .build()
}

/**
 * Stands in for Claude: records every request and answers from a script, in order. A call nobody
 * scripted fails the test, so "nothing was sent" can be asserted by scripting nothing.
 */
class FakeLlm : Llm {
    val requests = CopyOnWriteArrayList<LlmRequest>()
    private val script = ArrayDeque<suspend (LlmRequest, ((String) -> Unit)?) -> LlmResponse>()

    val last: LlmRequest get() = requests.last()

    /** The next call gets [text]; when the caller streams, it arrives as [pieces]. */
    fun reply(
        text: String,
        model: String = "claude-opus-5-5",
        usage: LlmUsage = LlmUsage(inputTokens = 1_000, outputTokens = 200),
        pieces: List<String> = listOf(text),
    ) {
        script.addLast { _, onText ->
            pieces.forEach { onText?.invoke(it) }
            LlmResponse(text, model, usage)
        }
    }

    /** The next call fails the way [AnthropicLlm][com.personal.aide.ai.AnthropicLlm] reports failures. */
    fun fail(kind: LlmException.Kind, message: String = "Claude is busy right now. Try again in a moment.") {
        script.addLast { _, _ -> throw LlmException(kind, message) }
    }

    /** The next call is handled by [block], which sees the request before answering. */
    fun answer(block: suspend (LlmRequest) -> String) {
        script.addLast { request, _ -> LlmResponse(block(request), "claude-opus-5-5", LlmUsage(inputTokens = 1_000, outputTokens = 200)) }
    }

    override suspend fun complete(request: LlmRequest, onText: ((String) -> Unit)?): LlmResponse {
        requests += request
        val next = synchronized(script) { script.removeFirstOrNull() }
            ?: throw AssertionError("Claude was called (${request.feature}) when no reply was scripted")
        return next(request, onText)
    }

    override suspend fun checkKey(apiKey: String, model: AideModel): KeyCheck = KeyCheck.Valid
}

/** Everything in the system prompt, in the order it is sent. */
val LlmRequest.systemText: String get() = system.joinToString("\n\n") { it.text }

/** The turn the model is being asked to answer. */
val LlmRequest.prompt: String get() = messages.last().text

/** What every request to the Messages API must satisfy: starts with the user, alternates, ends with the user. */
fun LlmRequest.assertWellFormedConversation() {
    check(messages.isNotEmpty()) { "The request has no messages" }
    check(messages.first().role == LlmMessage.Role.USER) { "The conversation must start with the user: ${roles()}" }
    for (index in 1 until messages.size) {
        check(messages[index].role != messages[index - 1].role) { "Two ${messages[index].role} turns in a row at $index: ${roles()}" }
    }
    check(messages.all { it.text.isNotBlank() }) { "A turn is empty: ${roles()}" }
}

private fun LlmRequest.roles(): String = messages.joinToString(" ") { it.role.name.take(1) }
