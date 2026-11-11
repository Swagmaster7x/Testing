package com.personal.mealgym.data

import android.content.ContentResolver
import android.net.Uri
import androidx.room.withTransaction
import com.personal.mealgym.data.db.AppDatabase
import com.personal.mealgym.data.db.Exercise
import com.personal.mealgym.data.db.Ingredient
import com.personal.mealgym.data.db.MealPlanEntry
import com.personal.mealgym.data.db.Profile
import com.personal.mealgym.data.db.ProteinTag
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.data.db.SaunaLog
import com.personal.mealgym.data.db.SetLog
import com.personal.mealgym.data.db.ShoppingCheck
import com.personal.mealgym.data.db.SupplementLog
import com.personal.mealgym.data.db.WorkoutDay
import com.personal.mealgym.data.db.WorkoutSession
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.time.DayOfWeek
import java.time.LocalDateTime

@Serializable
data class BackupSettings(
    val trainingWeekdays: List<String>,
    val showNutrition: Boolean,
    val showHalfPlateTip: Boolean,
    val weightUnit: WeightUnit,
    /** Shared by both sides; only read from the main [BackupFile.settings]. */
    val pantryStaples: List<String> = emptyList(),
    val motion: Boolean = true,
    val chime: Boolean? = null,
    val creatineReminder: Boolean = false,
    val filterProtein: ProteinTag? = null,
    val filterCuisine: String? = null,
    val filterNotChicken: Boolean = false,
    val shoppingBoth: Boolean = false,
) {
    fun toSettings(profileId: Long) = AppSettings(
        profileId = profileId,
        trainingWeekdays = trainingWeekdays.mapNotNull { runCatching { DayOfWeek.valueOf(it) }.getOrNull() }.toSet(),
        showNutrition = showNutrition,
        showHalfPlateTip = showHalfPlateTip,
        weightUnit = weightUnit,
        pantryStaples = pantryStaples.toSet(),
        motion = motion,
        chime = chime ?: (profileId == Profiles.SWAG),
        creatineReminder = creatineReminder,
        filter = LibraryFilter(filterProtein, filterCuisine, filterNotChicken),
        shoppingBoth = shoppingBoth,
    )

    companion object {
        fun of(s: AppSettings) = BackupSettings(
            trainingWeekdays = s.trainingWeekdays.sortedBy { it.value }.map { it.name },
            showNutrition = s.showNutrition,
            showHalfPlateTip = s.showHalfPlateTip,
            weightUnit = s.weightUnit,
            pantryStaples = s.pantryStaples.sorted(),
            motion = s.motion,
            chime = s.chime,
            creatineReminder = s.creatineReminder,
            filterProtein = s.filter.protein,
            filterCuisine = s.filter.cuisine,
            filterNotChicken = s.filter.notChicken,
            shoppingBoth = s.shoppingBoth,
        )
    }
}

/**
 * Everything the app stores, in one JSON file. Version 1 files (before the two sides) still
 * import: everything in them becomes Swag's.
 */
@Serializable
data class BackupFile(
    val app: String = APP_ID,
    val formatVersion: Int = FORMAT_VERSION,
    val exportedAt: String,
    /** Swag's settings and the shared pantry list. */
    val settings: BackupSettings,
    /** Other sides' settings, keyed by profile id. */
    val sideSettings: Map<String, BackupSettings> = emptyMap(),
    val profiles: List<Profile> = emptyList(),
    val recipes: List<Recipe>,
    val ingredients: List<Ingredient>,
    val mealPlan: List<MealPlanEntry>,
    val shoppingChecks: List<ShoppingCheck>,
    val workoutDays: List<WorkoutDay>,
    val exercises: List<Exercise>,
    val workoutSessions: List<WorkoutSession>,
    val setLogs: List<SetLog>,
    val saunaLogs: List<SaunaLog>,
    val supplementLogs: List<SupplementLog> = emptyList(),
) {
    companion object {
        const val APP_ID = "com.personal.mealgym"
        const val FORMAT_VERSION = 2
        val defaultProfiles = listOf(Profile(Profiles.SWAG, "Swag", "IRON"), Profile(Profiles.ASHLEY, "Ashley", "GLAM"))
    }
}

class BackupManager(
    private val db: AppDatabase,
    private val settings: SettingsRepository,
    private val contentResolver: ContentResolver,
) {
    private val json = Json {
        prettyPrint = true
        encodeDefaults = true
        ignoreUnknownKeys = true
    }

    suspend fun snapshot(): BackupFile {
        val recipeDao = db.recipeDao()
        val workoutDao = db.workoutDao()
        val profiles = db.profileDao().all().ifEmpty { BackupFile.defaultProfiles }
        return BackupFile(
            exportedAt = LocalDateTime.now().withNano(0).toString(),
            settings = BackupSettings.of(settings.current(Profiles.SWAG)),
            sideSettings = profiles.filter { it.id != Profiles.SWAG }
                .associate { it.id.toString() to BackupSettings.of(settings.current(it.id)).copy(pantryStaples = emptyList()) },
            profiles = profiles,
            recipes = recipeDao.allRecipes(),
            ingredients = recipeDao.allIngredients(),
            mealPlan = db.planDao().all(),
            shoppingChecks = db.shoppingDao().all(),
            workoutDays = workoutDao.allDays(),
            exercises = workoutDao.allExercises(),
            workoutSessions = workoutDao.allSessions(),
            setLogs = workoutDao.allSetLogs(),
            saunaLogs = db.saunaDao().all(),
            supplementLogs = db.supplementDao().all(),
        )
    }

    fun encode(file: BackupFile): String = json.encodeToString(BackupFile.serializer(), file)

    fun decode(text: String): BackupFile {
        val file = json.decodeFromString(BackupFile.serializer(), text)
        require(file.app == BackupFile.APP_ID) { "This file isn't a Meal & Gym backup." }
        require(file.formatVersion <= BackupFile.FORMAT_VERSION) { "This backup was made by a newer version of the app." }
        return file
    }

    /** Replaces everything in the app with [file]. */
    suspend fun restore(file: BackupFile) {
        db.withTransaction {
            val recipeDao = db.recipeDao()
            val workoutDao = db.workoutDao()
            // Ingredients, plan entries, exercises and set logs go with their parents (cascade).
            db.shoppingDao().deleteAll()
            db.saunaDao().deleteAll()
            db.supplementDao().deleteAll()
            db.planDao().deleteAll()
            recipeDao.deleteAllRecipes()
            workoutDao.deleteAllSessions()
            workoutDao.deleteAllDays()
            db.profileDao().deleteAll()

            db.profileDao().insertAll(file.profiles.ifEmpty { BackupFile.defaultProfiles })
            db.profileDao().insertAll(BackupFile.defaultProfiles)
            recipeDao.insertRecipes(file.recipes)
            recipeDao.insertIngredients(file.ingredients)
            db.planDao().putAll(file.mealPlan)
            db.shoppingDao().insertAll(file.shoppingChecks)
            workoutDao.insertDays(file.workoutDays)
            workoutDao.insertExercises(file.exercises)
            workoutDao.insertSessions(file.workoutSessions)
            workoutDao.insertSetLogs(file.setLogs)
            db.saunaDao().insertAll(file.saunaLogs)
            db.supplementDao().insertAll(file.supplementLogs)
        }
        settings.replace(file.settings.toSettings(Profiles.SWAG), includePantry = true)
        file.sideSettings.forEach { (id, s) ->
            id.toLongOrNull()?.let { settings.replace(s.toSettings(it), includePantry = false) }
        }
    }

    suspend fun exportTo(uri: Uri): BackupFile = withContext(Dispatchers.IO) {
        val file = snapshot()
        val stream = contentResolver.openOutputStream(uri, "wt") ?: error("Couldn't open the file for writing.")
        stream.bufferedWriter().use { it.write(encode(file)) }
        file
    }

    suspend fun importFrom(uri: Uri): BackupFile = withContext(Dispatchers.IO) {
        val stream = contentResolver.openInputStream(uri) ?: error("Couldn't open the file.")
        val file = decode(stream.bufferedReader().use { it.readText() })
        restore(file)
        file
    }
}
