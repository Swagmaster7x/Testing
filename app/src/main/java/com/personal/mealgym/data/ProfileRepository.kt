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
        val id = dao.maxId() + 1
        // Settings first: the app opens a person's screens as soon as their profile exists.
        // A deleted person's id can come back, so start from clean settings.
        settings.forget(id)
        settings.setTrainingWeekdays(id, trainingDays)
        settings.setChime(id, true)
        db.withTransaction {
            template?.days?.forEach { d ->
                val dayId = db.workoutDao().insertDay(SeedParser.dayOf(d, id))
                db.workoutDao().insertExercises(SeedParser.exercisesOf(d, dayId))
            }
            dao.upsert(profile.copy(id = id, name = profile.name.trim(), templateKey = template?.key))
        }
        return id
    }

    suspend fun update(profile: Profile) = dao.upsert(profile.copy(name = profile.name.trim()))

    /** Switches to a ready-made look (or back to the saved custom one), touching nothing else. */
    suspend fun setLook(id: Long, themeKey: String) = dao.setLook(id, themeKey)

    /** Saves a look made in the creator and switches to it. */
    suspend fun setCustomLook(id: Long, customLook: String) = dao.setLook(id, "CUSTOM", customLook)

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
