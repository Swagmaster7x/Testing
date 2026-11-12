package com.personal.mealgym.data.seed

import android.content.Context
import androidx.room.withTransaction
import com.personal.mealgym.data.Profiles
import com.personal.mealgym.data.SettingsRepository
import com.personal.mealgym.data.db.AppDatabase
import com.personal.mealgym.data.db.Exercise
import com.personal.mealgym.data.db.Ingredient
import com.personal.mealgym.data.db.MealType
import com.personal.mealgym.data.db.Meta
import com.personal.mealgym.data.db.Profile
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
    /** Workout days installed for the people in [profiles]. */
    val workoutDays: List<SeedWorkoutDay> = emptyList(),
    /** Gym-screen text, unless the person's starter plan has its own. */
    val gymTips: List<String>,
    /** "Make it easier to finish" tips, for people who chose that tip style. */
    val easierToFinishTips: List<String> = emptyList(),
    /** A daily guide, shown as reference text only to people with the "easier to finish" style. */
    val dailyGuide: List<GuideLine> = emptyList(),
    /** People the app starts with (none in the store edition: everyone sets up their own). */
    val profiles: List<SeedProfile> = emptyList(),
    /** Starter workout plans offered when a person is added, and their gym tips. */
    val workoutTemplates: List<WorkoutTemplate> = emptyList(),
) {
    /** Maps a seed's person key ("swag", "ashley") to its profile id. */
    fun profileId(key: String?): Long? =
        key?.let { k -> profiles.firstOrNull { it.key.equals(k, ignoreCase = true) }?.id ?: Profiles.FIRST }

    fun template(key: String?): WorkoutTemplate? = key?.let { k -> workoutTemplates.firstOrNull { it.key == k } }

    val defaultProfiles: List<Profile> get() = profiles.map { it.toProfile() }
}

@Serializable
data class SeedProfile(
    val id: Long,
    val key: String,
    val name: String,
    val theme: String = Profile.THEME_IRON,
    val snackSlot: Boolean = false,
    val portion: Double = 1.0,
    val tipsStyle: String = Profile.TIPS_FILL_UP,
    val weekBadges: Boolean = false,
    val templateKey: String? = null,
) {
    fun toProfile() = Profile(
        id = id,
        name = name,
        themeKey = theme,
        snackSlot = snackSlot,
        portion = portion,
        tipsStyle = tipsStyle,
        weekBadges = weekBadges,
        templateKey = templateKey,
    )
}

/** A starter plan: its workout days are copied to a new person, who can then edit them. */
@Serializable
data class WorkoutTemplate(
    val key: String,
    val name: String,
    val description: String = "",
    /** Suggested training days, e.g. "MONDAY". */
    val defaultDays: List<String> = emptyList(),
    val tips: List<String> = emptyList(),
    val days: List<SeedWorkoutDay> = emptyList(),
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
    /** A person key from [SeedFile.profiles] for entries only that person sees. */
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
    /** A person key from [SeedFile.profiles]. */
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

    fun recipeOf(seed: SeedRecipe, onlyForProfileId: Long? = null): Recipe = Recipe(
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
        onlyForProfileId = onlyForProfileId,
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

    fun dayOf(seed: SeedWorkoutDay, profileId: Long): WorkoutDay = WorkoutDay(
        dayOrder = seed.order,
        name = seed.name,
        profileId = profileId,
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

    /**
     * Adds whatever seed recipes, workout days and pantry staples this phone hasn't been
     * offered yet. The keys offered so far are remembered, so anything deleted on the phone
     * stays deleted, and an upgrade only brings what's new.
     */
    suspend fun sync(db: AppDatabase, settings: SettingsRepository, freshDatabase: Boolean) {
        db.profileDao().insertAll(seed.defaultProfiles)
        val meta = db.metaDao()
        val level = meta.get(SEED_LEVEL)?.toIntOrNull()
            ?: if (freshDatabase || db.recipeDao().count() == 0) 0 else 1

        // Before keys were tracked, everything from the installed level counts as offered.
        val offeredRecipes = meta.get(SEED_RECIPES)?.let(::splitKeys)
            ?: seed.recipes.filter { it.since <= level }.map { it.key }.toSet()
        val offeredDays = meta.get(SEED_DAYS)?.let(::splitKeys)
            ?: seed.workoutDays.filter { it.since <= level }.map(::dayKey).toSet()
        val offeredStaples = meta.get(SEED_STAPLES)?.let(::splitKeys)
            ?: if (level >= 1) seed.pantryStaples.toSet() else emptySet()

        val allStaples = (seed.pantryStaples + seed.extraPantryStaples).toSet()
        val recipeDao = db.recipeDao()
        db.withTransaction {
            for (r in seed.recipes) {
                val existing = recipeDao.bySeedKey(r.key)
                if (r.key !in offeredRecipes) {
                    if (existing == null) {
                        val id = recipeDao.insert(SeedParser.recipeOf(r, seed.profileId(r.onlyFor)))
                        recipeDao.insertIngredients(SeedParser.ingredientsOf(r, id, allStaples))
                    }
                } else if (existing != null && existing.protein == null && r.protein != null) {
                    // Recipes from before the library upgrade gain their protein tag and swaps.
                    recipeDao.update(
                        existing.copy(
                            protein = r.protein,
                            proteinSwaps = existing.proteinSwaps.ifEmpty { r.swaps },
                            onlyForProfileId = existing.onlyForProfileId ?: seed.profileId(r.onlyFor),
                        ),
                    )
                }
            }
            for (d in seed.workoutDays.filter { dayKey(it) !in offeredDays }) {
                val dayId = db.workoutDao().insertDay(SeedParser.dayOf(d, seed.profileId(d.profile) ?: Profiles.FIRST))
                db.workoutDao().insertExercises(SeedParser.exercisesOf(d, dayId))
            }
            meta.put(Meta(SEED_RECIPES, (offeredRecipes + seed.recipes.map { it.key }).sorted().joinToString(",")))
            meta.put(Meta(SEED_DAYS, (offeredDays + seed.workoutDays.map(::dayKey)).sorted().joinToString(",")))
            meta.put(Meta(SEED_STAPLES, (offeredStaples + allStaples).sorted().joinToString(",")))
            meta.put(Meta(SEED_LEVEL, maxOf(level, seed.version).toString()))
        }

        val newStaples = allStaples - offeredStaples
        if (level == 0) settings.setPantryStaples(allStaples) else if (newStaples.isNotEmpty()) settings.addPantryStaples(newStaples)
    }

    private fun splitKeys(text: String): Set<String> = text.split(',').filter { it.isNotBlank() }.toSet()

    private fun dayKey(d: SeedWorkoutDay) = "${d.profile.lowercase()}-${d.order}"

    companion object {
        const val SEED_LEVEL = "seedLevel"
        const val SEED_RECIPES = "seedRecipes"
        const val SEED_DAYS = "seedDays"
        const val SEED_STAPLES = "seedStaples"
    }
}
