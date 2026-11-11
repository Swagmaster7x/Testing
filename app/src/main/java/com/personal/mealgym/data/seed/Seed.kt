package com.personal.mealgym.data.seed

import android.content.Context
import androidx.room.withTransaction
import com.personal.mealgym.data.BackupFile
import com.personal.mealgym.data.Profiles
import com.personal.mealgym.data.SettingsRepository
import com.personal.mealgym.data.db.AppDatabase
import com.personal.mealgym.data.db.Exercise
import com.personal.mealgym.data.db.Ingredient
import com.personal.mealgym.data.db.MealType
import com.personal.mealgym.data.db.Meta
import com.personal.mealgym.data.db.ProteinSwap
import com.personal.mealgym.data.db.ProteinTag
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.data.db.StoreSection
import com.personal.mealgym.data.db.WorkoutDay
import com.personal.mealgym.domain.Quantities
import com.personal.mealgym.domain.ShoppingList
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

@Serializable
data class SeedFile(
    /** Seed level: 1 = first release, 2 = the two sides and the bigger recipe library. */
    val version: Int,
    val recipes: List<SeedRecipe>,
    val freeVolumeFoods: List<String>,
    val pantryStaples: List<String>,
    /** Staples added after level 1, ticked on upgrade too. */
    val extraPantryStaples: List<String> = emptyList(),
    val workoutDays: List<SeedWorkoutDay>,
    /** Swag's gym-screen text. */
    val gymTips: List<String>,
    /** Ashley's gym-screen text. */
    val gymTipsAshley: List<String> = emptyList(),
    /** Ashley's "Make it easier to finish" tips. */
    val easierToFinishTips: List<String> = emptyList(),
    /** Ashley's daily guide, shown as reference text only. */
    val dailyGuide: List<GuideLine> = emptyList(),
)

@Serializable
data class GuideLine(val label: String, val text: String)

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
    val ingredients: List<SeedIngredient> = emptyList(),
    val steps: List<String> = emptyList(),
    val volumeTip: String? = null,
    val protein: ProteinTag? = null,
    val swaps: List<ProteinSwap> = emptyList(),
    /** "ashley" for entries only on her side (her coffee-shop breakfasts). */
    val onlyFor: String? = null,
    /** Seed level the recipe arrived in. */
    val since: Int = 1,
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
data class SeedWorkoutDay(
    val order: Int,
    val name: String,
    val exercises: List<SeedExercise>,
    /** "swag" or "ashley". */
    val profile: String = "swag",
    val shortName: String? = null,
    val since: Int = 1,
)

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

    fun profileId(key: String?): Long? = when (key?.lowercase()) {
        null -> null
        "ashley" -> Profiles.ASHLEY
        else -> Profiles.SWAG
    }

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
        protein = seed.protein,
        proteinSwaps = seed.swaps,
        onlyForProfileId = profileId(seed.onlyFor),
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

    fun dayOf(seed: SeedWorkoutDay): WorkoutDay = WorkoutDay(
        dayOrder = seed.order,
        name = seed.name,
        profileId = profileId(seed.profile) ?: Profiles.SWAG,
        shortName = seed.shortName,
    )

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

/**
 * Loads the bundled seed file and brings the database up to its level: everything on a new
 * install, only what's new on an upgrade (so recipes deleted on the phone don't come back).
 */
class SeedRepository(private val context: Context) {

    val seed: SeedFile by lazy {
        val text = context.assets.open("seed.json").bufferedReader().use { it.readText() }
        SeedParser.parse(text)
    }

    suspend fun sync(db: AppDatabase, settings: SettingsRepository, freshDatabase: Boolean) {
        db.profileDao().insertAll(BackupFile.defaultProfiles)
        val level = db.metaDao().get(SEED_LEVEL)?.toIntOrNull()
            ?: if (freshDatabase || db.recipeDao().count() == 0) 0 else 1
        if (level >= seed.version) return
        val staples = (seed.pantryStaples + seed.extraPantryStaples).toSet()

        db.withTransaction {
            val recipeDao = db.recipeDao()
            for (r in seed.recipes) {
                val existing = recipeDao.bySeedKey(r.key)
                if (r.since > level && existing == null) {
                    val id = recipeDao.insert(SeedParser.recipeOf(r))
                    recipeDao.insertIngredients(SeedParser.ingredientsOf(r, id, staples))
                } else if (existing != null && level < 2 && existing.protein == null) {
                    // Recipes from before the library upgrade gain their protein tag and swaps.
                    recipeDao.update(
                        existing.copy(
                            protein = r.protein,
                            proteinSwaps = r.swaps,
                            onlyForProfileId = existing.onlyForProfileId ?: SeedParser.profileId(r.onlyFor),
                        ),
                    )
                }
            }
            for (d in seed.workoutDays.filter { it.since > level }) {
                val dayId = db.workoutDao().insertDay(SeedParser.dayOf(d))
                db.workoutDao().insertExercises(SeedParser.exercisesOf(d, dayId))
            }
            db.metaDao().put(Meta(SEED_LEVEL, seed.version.toString()))
        }

        if (level < 1) settings.setPantryStaples(seed.pantryStaples.toSet() + seed.extraPantryStaples)
        else settings.addPantryStaples(seed.extraPantryStaples)
    }

    companion object {
        const val SEED_LEVEL = "seedLevel"
    }
}
