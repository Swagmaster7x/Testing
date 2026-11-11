package com.personal.mealgym.data

import androidx.room.withTransaction
import com.personal.mealgym.data.db.AppDatabase
import com.personal.mealgym.data.db.Exercise
import com.personal.mealgym.data.db.Feeling
import com.personal.mealgym.data.db.SaunaLog
import com.personal.mealgym.data.db.SetLog
import com.personal.mealgym.data.db.SupplementLog
import com.personal.mealgym.data.db.WorkoutDay
import com.personal.mealgym.data.db.WorkoutSession
import com.personal.mealgym.domain.Dates
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import java.time.LocalDate

/** Workouts, sessions, sauna and supplements, each kept per side. */
class GymRepository(private val db: AppDatabase) {
    private val workoutDao = db.workoutDao()
    private val saunaDao = db.saunaDao()
    private val supplementDao = db.supplementDao()

    fun days(profileId: Long): Flow<List<WorkoutDay>> = workoutDao.observeDays(profileId)

    /** All exercises; screens pick the ones belonging to the side's days. */
    val exercises: Flow<List<Exercise>> = workoutDao.observeExercises()

    fun sessions(profileId: Long): Flow<List<WorkoutSession>> = workoutDao.observeSessions(profileId)

    fun saunaLogs(profileId: Long): Flow<List<SaunaLog>> = saunaDao.observeAll(profileId)

    /** Latest weight/reps note keyed by lower-case exercise name, so a swap keeps its own history. */
    fun latestLogs(profileId: Long): Flow<Map<String, SetLog>> =
        workoutDao.observeLatestLogs(profileId).map { logs -> logs.associateBy { it.exerciseNameUsed.lowercase() } }

    suspend fun saveSession(
        profileId: Long,
        date: LocalDate,
        day: WorkoutDay,
        feeling: Feeling,
        note: String?,
        logs: List<SetLog>,
    ): Long = db.withTransaction {
        val id = workoutDao.insertSession(
            WorkoutSession(
                date = Dates.iso(date),
                workoutDayId = day.id,
                dayOrder = day.dayOrder,
                dayName = day.name,
                feeling = feeling,
                note = note?.takeIf { it.isNotBlank() }?.trim(),
                profileId = profileId,
            ),
        )
        if (logs.isNotEmpty()) workoutDao.insertSetLogs(logs.map { it.copy(id = 0, sessionId = id, profileId = profileId) })
        id
    }

    suspend fun logSauna(profileId: Long, date: LocalDate, minutes: Int) {
        if (minutes > 0) saunaDao.insert(SaunaLog(date = Dates.iso(date), minutes = minutes, profileId = profileId))
    }

    fun supplementsOn(profileId: Long, date: LocalDate): Flow<List<SupplementLog>> =
        supplementDao.observeDay(profileId, Dates.iso(date))

    suspend fun setSupplement(profileId: Long, date: LocalDate, item: String, taken: Boolean) {
        if (taken) {
            supplementDao.insert(SupplementLog(profileId = profileId, date = Dates.iso(date), item = item))
        } else {
            supplementDao.delete(profileId, Dates.iso(date), item)
        }
    }

    // Editing workouts

    suspend fun renameDay(day: WorkoutDay, name: String) = workoutDao.updateDay(day.copy(name = name.trim()))

    suspend fun addDay(profileId: Long, name: String) {
        val next = (workoutDao.getDays(profileId).maxOfOrNull { it.dayOrder } ?: 0) + 1
        workoutDao.insertDay(WorkoutDay(dayOrder = next, name = name.trim(), profileId = profileId))
    }

    /** Removes a day and closes the gap so the cycle stays Day 1..N. */
    suspend fun deleteDay(day: WorkoutDay) = db.withTransaction {
        workoutDao.deleteDay(day.id)
        val renumbered = workoutDao.getDays(day.profileId).sortedBy { it.dayOrder }.mapIndexed { i, d -> d.copy(dayOrder = i + 1) }
        workoutDao.updateDays(renumbered)
    }

    suspend fun saveExercise(exercise: Exercise) {
        if (exercise.id == 0L) {
            val position = workoutDao.maxPosition(exercise.workoutDayId) + 1
            workoutDao.insertExercise(exercise.copy(position = position))
        } else {
            workoutDao.updateExercise(exercise)
        }
    }

    suspend fun deleteExercise(exercise: Exercise) = workoutDao.deleteExercise(exercise)
}
