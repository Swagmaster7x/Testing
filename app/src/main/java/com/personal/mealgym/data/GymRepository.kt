package com.personal.mealgym.data

import androidx.room.withTransaction
import com.personal.mealgym.data.db.AppDatabase
import com.personal.mealgym.data.db.Exercise
import com.personal.mealgym.data.db.Feeling
import com.personal.mealgym.data.db.SaunaLog
import com.personal.mealgym.data.db.SetLog
import com.personal.mealgym.data.db.WorkoutDay
import com.personal.mealgym.data.db.WorkoutSession
import com.personal.mealgym.domain.Dates
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import java.time.LocalDate

class GymRepository(private val db: AppDatabase) {
    private val workoutDao = db.workoutDao()
    private val saunaDao = db.saunaDao()

    val days: Flow<List<WorkoutDay>> = workoutDao.observeDays()
    val exercises: Flow<List<Exercise>> = workoutDao.observeExercises()
    val sessions: Flow<List<WorkoutSession>> = workoutDao.observeSessions()
    val saunaLogs: Flow<List<SaunaLog>> = saunaDao.observeAll()

    /** Latest weight/reps note keyed by lower-case exercise name, so a swap keeps its own history. */
    val latestLogs: Flow<Map<String, SetLog>> =
        workoutDao.observeLatestLogs().map { logs -> logs.associateBy { it.exerciseNameUsed.lowercase() } }

    suspend fun saveSession(
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
            ),
        )
        if (logs.isNotEmpty()) workoutDao.insertSetLogs(logs.map { it.copy(id = 0, sessionId = id) })
        id
    }

    suspend fun logSauna(date: LocalDate, minutes: Int) {
        if (minutes > 0) saunaDao.insert(SaunaLog(date = Dates.iso(date), minutes = minutes))
    }

    // Editing workouts

    suspend fun renameDay(day: WorkoutDay, name: String) = workoutDao.updateDay(day.copy(name = name.trim()))

    suspend fun addDay(name: String) {
        val next = (workoutDao.getDays().maxOfOrNull { it.dayOrder } ?: 0) + 1
        workoutDao.insertDay(WorkoutDay(dayOrder = next, name = name.trim()))
    }

    /** Removes a day and closes the gap so the cycle stays Day 1..N. */
    suspend fun deleteDay(day: WorkoutDay) = db.withTransaction {
        workoutDao.deleteDay(day.id)
        val renumbered = workoutDao.getDays().sortedBy { it.dayOrder }.mapIndexed { i, d -> d.copy(dayOrder = i + 1) }
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
