package com.personal.mealgym.data

import android.content.ContentResolver
import android.net.Uri
import androidx.room.withTransaction
import com.personal.mealgym.data.db.AppDatabase
import com.personal.mealgym.data.db.Exercise
import com.personal.mealgym.data.db.Ingredient
import com.personal.mealgym.data.db.MealPlanEntry
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.data.db.SaunaLog
import com.personal.mealgym.data.db.SetLog
import com.personal.mealgym.data.db.ShoppingCheck
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
    val pantryStaples: List<String>,
)

/** Everything the app stores, in one JSON file. */
@Serializable
data class BackupFile(
    val app: String = APP_ID,
    val formatVersion: Int = FORMAT_VERSION,
    val exportedAt: String,
    val settings: BackupSettings,
    val recipes: List<Recipe>,
    val ingredients: List<Ingredient>,
    val mealPlan: List<MealPlanEntry>,
    val shoppingChecks: List<ShoppingCheck>,
    val workoutDays: List<WorkoutDay>,
    val exercises: List<Exercise>,
    val workoutSessions: List<WorkoutSession>,
    val setLogs: List<SetLog>,
    val saunaLogs: List<SaunaLog>,
) {
    companion object {
        const val APP_ID = "com.personal.mealgym"
        const val FORMAT_VERSION = 1
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
        val s = settings.current()
        val recipeDao = db.recipeDao()
        val workoutDao = db.workoutDao()
        return BackupFile(
            exportedAt = LocalDateTime.now().withNano(0).toString(),
            settings = BackupSettings(
                trainingWeekdays = s.trainingWeekdays.sortedBy { it.value }.map { it.name },
                showNutrition = s.showNutrition,
                showHalfPlateTip = s.showHalfPlateTip,
                weightUnit = s.weightUnit,
                pantryStaples = s.pantryStaples.sorted(),
            ),
            recipes = recipeDao.allRecipes(),
            ingredients = recipeDao.allIngredients(),
            mealPlan = db.planDao().all(),
            shoppingChecks = db.shoppingDao().all(),
            workoutDays = workoutDao.allDays(),
            exercises = workoutDao.allExercises(),
            workoutSessions = workoutDao.allSessions(),
            setLogs = workoutDao.allSetLogs(),
            saunaLogs = db.saunaDao().all(),
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
            db.planDao().deleteAll()
            recipeDao.deleteAllRecipes()
            workoutDao.deleteAllSessions()
            workoutDao.deleteAllDays()

            recipeDao.insertRecipes(file.recipes)
            recipeDao.insertIngredients(file.ingredients)
            db.planDao().putAll(file.mealPlan)
            db.shoppingDao().insertAll(file.shoppingChecks)
            workoutDao.insertDays(file.workoutDays)
            workoutDao.insertExercises(file.exercises)
            workoutDao.insertSessions(file.workoutSessions)
            workoutDao.insertSetLogs(file.setLogs)
            db.saunaDao().insertAll(file.saunaLogs)
        }
        val s = file.settings
        settings.replaceAll(
            AppSettings(
                trainingWeekdays = s.trainingWeekdays.mapNotNull { runCatching { DayOfWeek.valueOf(it) }.getOrNull() }.toSet(),
                showNutrition = s.showNutrition,
                showHalfPlateTip = s.showHalfPlateTip,
                weightUnit = s.weightUnit,
                pantryStaples = s.pantryStaples.toSet(),
            ),
        )
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
