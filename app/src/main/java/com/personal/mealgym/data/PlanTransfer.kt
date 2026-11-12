package com.personal.mealgym.data

import android.content.ContentResolver
import android.net.Uri
import androidx.room.withTransaction
import com.personal.mealgym.data.db.AppDatabase
import com.personal.mealgym.data.db.MealPlanEntry
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.seed.SeedParser
import com.personal.mealgym.data.seed.SeedRecipe
import com.personal.mealgym.domain.Dates
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.time.LocalDate

/**
 * One person's meal plan as a file, so it can go from one phone to another (there is no sync).
 * Each meal carries its recipe, so the other phone can add any recipe it doesn't have yet.
 */
@Serializable
data class PlanFile(
    val app: String = BackupFile.APP_ID,
    val kind: String = KIND,
    /** Whose plan this is: the person's name in lower case. */
    val profile: String,
    val from: String,
    val to: String,
    val meals: List<PlannedMeal>,
) {
    companion object {
        const val KIND = "meal-plan"
    }
}

@Serializable
data class PlannedMeal(val date: String, val slot: MealSlot, val recipe: SeedRecipe)

data class PlanImportResult(val profileId: Long, val meals: Int, val newRecipes: Int)

class PlanTransfer(
    private val db: AppDatabase,
    private val packs: RecipePacks,
    private val contentResolver: ContentResolver,
) {
    private val json = Json {
        ignoreUnknownKeys = true
        prettyPrint = true
        encodeDefaults = false
    }

    /** This week and next for one person. */
    suspend fun snapshot(profileId: Long, weekStart: LocalDate): PlanFile {
        val from = Dates.iso(weekStart)
        val to = Dates.iso(weekStart.plusDays(13))
        val entries = db.planDao().getRange(profileId, from, to).sortedWith(compareBy<MealPlanEntry> { it.date }.thenBy { it.slot.ordinal })
        val recipeCache = HashMap<Long, SeedRecipe>()
        val ownPack = packs.ownRecipes().recipes.associateBy { it.name }
        val meals = entries.mapNotNull { e ->
            val recipe = recipeCache.getOrPut(e.recipeId) {
                val r = db.recipeDao().getWithIngredients(e.recipeId)?.recipe ?: return@mapNotNull null
                // Seed recipes travel by key; the phone's own recipes travel in full.
                ownPack[r.name] ?: SeedRecipe(
                    key = r.seedKey ?: "R${r.id}",
                    name = r.name,
                    mealType = r.mealType,
                    cuisineTags = r.cuisineTags,
                    servings = r.servings,
                    servingSize = r.servingSizeText,
                    protein = r.protein,
                )
            }
            PlannedMeal(e.date, e.slot, recipe)
        }
        val name = db.profileDao().all().firstOrNull { it.id == profileId }?.name.orEmpty()
        return PlanFile(profile = name.trim().lowercase(), from = from, to = to, meals = meals)
    }

    fun encode(file: PlanFile): String = json.encodeToString(PlanFile.serializer(), file)

    fun decode(text: String): PlanFile {
        val file = json.decodeFromString(PlanFile.serializer(), text)
        require(file.app == BackupFile.APP_ID && file.kind == PlanFile.KIND) { "This file isn't a Meal & Gym meal plan." }
        return file
    }

    /**
     * Puts the plan on the person with the same name on this phone (or on [fallbackProfileId]),
     * adding any recipes this phone doesn't have.
     */
    suspend fun apply(file: PlanFile, fallbackProfileId: Long): PlanImportResult {
        val profileId = db.profileDao().all().firstOrNull { it.name.trim().equals(file.profile.trim(), ignoreCase = true) }?.id
            ?: fallbackProfileId
        val dao = db.recipeDao()
        var newRecipes = 0
        val entries = mutableListOf<MealPlanEntry>()
        db.withTransaction {
            for (meal in file.meals) {
                val existing = dao.bySeedKey(meal.recipe.key) ?: dao.byName(meal.recipe.name)
                val recipeId = existing?.id ?: run {
                    newRecipes++
                    val onlyFor = meal.recipe.onlyFor?.let { profileId }
                    val id = dao.insert(SeedParser.recipeOf(meal.recipe, onlyFor).copy(seedKey = null, isUserCreated = true))
                    dao.insertIngredients(SeedParser.ingredientsOf(meal.recipe, id, emptySet()))
                    id
                }
                entries += MealPlanEntry(date = meal.date, slot = meal.slot, recipeId = recipeId, profileId = profileId)
            }
            db.planDao().putAll(entries)
        }
        return PlanImportResult(profileId, entries.size, newRecipes)
    }

    suspend fun exportTo(uri: Uri, profileId: Long, weekStart: LocalDate): Int = withContext(Dispatchers.IO) {
        val file = snapshot(profileId, weekStart)
        require(file.meals.isNotEmpty()) { "Nothing is planned this week or next yet." }
        val stream = contentResolver.openOutputStream(uri, "wt") ?: error("Couldn't open the file for writing.")
        stream.bufferedWriter().use { it.write(encode(file)) }
        file.meals.size
    }

    suspend fun importFrom(uri: Uri, fallbackProfileId: Long): PlanImportResult = withContext(Dispatchers.IO) {
        val stream = contentResolver.openInputStream(uri) ?: error("Couldn't open the file.")
        apply(decode(stream.bufferedReader().use { it.readText() }), fallbackProfileId)
    }
}
