package com.personal.mealgym.gym

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.io.File

/** The workout being done right now: ticked sets, swaps and optional weight/reps notes. */
@Serializable
data class WorkoutDraft(
    /** ISO date the workout belongs to. */
    val date: String,
    val dayId: Long,
    val checkedSets: Map<Long, Set<Int>> = emptyMap(),
    /** Exercise id -> the alternative being done instead. */
    val swaps: Map<Long, String> = emptyMap(),
    val weights: Map<Long, String> = emptyMap(),
    val reps: Map<Long, String> = emptyMap(),
)

/**
 * Keeps the in-progress workout outside any one screen and writes it to a small file, so
 * switching tabs or apps mid-workout (or Android closing the app) loses nothing.
 */
class WorkoutDraftStore(private val file: File, private val scope: CoroutineScope) {
    private val json = Json { ignoreUnknownKeys = true }
    private val writeLock = Mutex()
    private val _draft = MutableStateFlow(load())
    val draft: StateFlow<WorkoutDraft?> = _draft.asStateFlow()

    fun start(date: String, dayId: Long) = set(WorkoutDraft(date = date, dayId = dayId))

    fun update(transform: (WorkoutDraft) -> WorkoutDraft) {
        _draft.update { it?.let(transform) }
        persist()
    }

    fun clear() = set(null)

    private fun set(value: WorkoutDraft?) {
        _draft.value = value
        persist()
    }

    private fun load(): WorkoutDraft? = runCatching {
        if (file.exists()) json.decodeFromString(WorkoutDraft.serializer(), file.readText()) else null
    }.getOrNull()

    private fun persist() {
        val snapshot = _draft.value
        scope.launch(Dispatchers.IO) {
            writeLock.withLock {
                runCatching {
                    if (snapshot == null) {
                        file.delete()
                    } else {
                        file.writeText(json.encodeToString(WorkoutDraft.serializer(), snapshot))
                    }
                }
            }
        }
    }
}
