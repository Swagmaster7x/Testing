package com.personal.mealgym.data.seed

import android.content.Context
import androidx.room.withTransaction
import com.personal.mealgym.data.SettingsRepository
import com.personal.mealgym.data.db.AppDatabase
import com.personal.mealgym.data.db.Exercise
import com.personal.mealgym.data.db.Ingredient
import com.personal.mealgym.data.db.MealType
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.data.db.StoreSection
import com.personal.mealgym.data.db.WorkoutDay
import com.personal.mealgym.domain.Quantities
import com.personal.mealgym.domain.ShoppingList
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

@Serializable
data class SeedFile(
    val version: Int,
    val recipes: List<SeedRecipe>,
    val freeVolumeFoods: List<String>,
    val pantryStaples: List<String>,
    val workoutDays: List<SeedWorkoutDay>,
    val gymTips: List<String>,
)

@Serializable
data class SeedRecipe(
    val key: String,
    val name: String,
    val mealType: MealType,
    val cuisineTags: List<String>,
    val servings: Int,
    val servingSize: String,
    val nutrition: String? = null,
    val mealPrep: Boolean = false,
    val ingredients: List<SeedIngredient>,
    val steps: List<String>,
    val volumeTip: String? = null,
)

@Serializable
data class SeedIngredient(
    val quantity: String? = null,
    val unit: String? = null,
    val name: String,
    val note: String? = null,
    val section: StoreSection,
)

@Serializable
data class SeedWorkoutDay(val order: Int, val name: String, val exercises: List<SeedExercise>)

@Serializable
data class SeedExercise(
    val group: String,
    val name: String,
    val sets: String,
    val reps: String,
    val swaps: List<String>,
    val note: String? = null,
)

object SeedParser {
    private val json = Json { ignoreUnknownKeys = true }

    fun parse(text: String): SeedFile = json.decodeFromString(SeedFile.serializer(), text)

    fun recipeOf(seed: SeedRecipe): Recipe = Recipe(
        seedKey = seed.key,
        name = seed.name,
        mealType = seed.mealType,
        cuisineTags = seed.cuisineTags,
        servings = seed.servings,
        servingSizeText = seed.servingSize,
        nutritionText = seed.nutrition,
        steps = seed.steps,
        volumeTip = seed.volumeTip,
        isMealPrep = seed.mealPrep,
        isUserCreated = false,
    )

    fun ingredientsOf(seed: SeedRecipe, recipeId: Long, staples: Set<String>): List<Ingredient> =
        seed.ingredients.mapIndexed { index, i ->
            Ingredient(
                recipeId = recipeId,
                position = index,
                name = i.name,
                quantity = Quantities.parse(i.quantity),
                unit = i.unit,
                note = i.note,
                storeSection = i.section,
                isPantryStaple = ShoppingList.isAlwaysHave(i.name, staples),
            )
        }

    fun exercisesOf(seed: SeedWorkoutDay, dayId: Long): List<Exercise> =
        seed.exercises.mapIndexed { index, e ->
            Exercise(
                workoutDayId = dayId,
                position = index,
                name = e.name,
                setsText = e.sets,
                repsText = e.reps,
                groupLabel = e.group,
                alternatives = e.swaps,
                note = e.note,
            )
        }
}

/** Loads the bundled seed file and, on first launch, fills the database from it. */
class SeedRepository(private val context: Context) {

    val seed: SeedFile by lazy {
        val text = context.assets.open("seed.json").bufferedReader().use { it.readText() }
        SeedParser.parse(text)
    }

    suspend fun installIfNeeded(db: AppDatabase, settings: SettingsRepository) {
        if (settings.seedVersion() >= seed.version) return
        if (db.recipeDao().count() == 0) install(db)
        settings.setPantryStaples(seed.pantryStaples.toSet())
        settings.setSeedVersion(seed.version)
    }

    private suspend fun install(db: AppDatabase) {
        val staples = seed.pantryStaples.toSet()
        db.withTransaction {
            for (r in seed.recipes) {
                val id = db.recipeDao().insert(SeedParser.recipeOf(r))
                db.recipeDao().insertIngredients(SeedParser.ingredientsOf(r, id, staples))
            }
            for (d in seed.workoutDays) {
                val dayId = db.workoutDao().insertDay(WorkoutDay(dayOrder = d.order, name = d.name))
                db.workoutDao().insertExercises(SeedParser.exercisesOf(d, dayId))
            }
        }
    }
}
