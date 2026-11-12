package com.personal.mealgym.data

import androidx.room.withTransaction
import com.personal.mealgym.data.db.AppDatabase
import com.personal.mealgym.data.db.Profile
import com.personal.mealgym.data.seed.SeedParser
import com.personal.mealgym.data.seed.WorkoutTemplate
import kotlinx.coroutines.flow.Flow
import java.time.DayOfWeek

/** The people on this phone. Recipes and the pantry list are shared; everything else is per person. */
class ProfileRepository(
    private val db: AppDatabase,
    private val settings: SettingsRepository,
) {
    private val dao = db.profileDao()

    val all: Flow<List<Profile>> = dao.observeAll()

    suspend fun list(): List<Profile> = dao.all()

    /**
     * Adds a person, copies the [template]'s workout days to them (none for "Start empty") and
     * saves their training days. Returns the new person's id.
     */
    suspend fun create(profile: Profile, template: WorkoutTemplate?, trainingDays: Set<DayOfWeek>): Long {
        val id = db.withTransaction {
            val id = dao.maxId() + 1
            dao.upsert(profile.copy(id = id, name = profile.name.trim(), templateKey = template?.key))
            template?.days?.forEach { d ->
                val dayId = db.workoutDao().insertDay(SeedParser.dayOf(d, id))
                db.workoutDao().insertExercises(SeedParser.exercisesOf(d, dayId))
            }
            id
        }
        // A deleted person's id can come back; start from clean settings.
        settings.forget(id)
        settings.setTrainingWeekdays(id, trainingDays)
        settings.setChime(id, true)
        return id
    }

    suspend fun update(profile: Profile) = dao.upsert(profile.copy(name = profile.name.trim()))

    /** Removes a person and everything that was only theirs. Shared recipes stay. */
    suspend fun delete(id: Long) {
        db.withTransaction {
            dao.deletePlan(id)
            dao.deleteSessions(id)
            dao.deleteWorkoutDays(id)
            dao.deleteSauna(id)
            dao.deleteSupplements(id)
            dao.deleteShoppingChecks("p$id")
            dao.releaseRecipes(id)
            dao.delete(id)
        }
        settings.forget(id)
    }
}
