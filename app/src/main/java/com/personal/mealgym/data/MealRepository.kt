package com.personal.mealgym.data

import androidx.room.withTransaction
import com.personal.mealgym.data.db.AppDatabase
import com.personal.mealgym.data.db.CookLog
import com.personal.mealgym.data.db.CookRating
import com.personal.mealgym.data.db.OffPlanMeal
import com.personal.mealgym.data.db.Ingredient
import com.personal.mealgym.data.db.MealPlanEntry
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.data.db.RecipeWithIngredients
import com.personal.mealgym.data.db.ShoppingCheck
import com.personal.mealgym.domain.Avoid
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.domain.Foods
import com.personal.mealgym.domain.answers
import com.personal.mealgym.domain.PlannedRecipe
import com.personal.mealgym.domain.Portions
import com.personal.mealgym.domain.RecipeSwaps
import com.personal.mealgym.domain.ShoppingList
import com.personal.mealgym.domain.ShoppingResult
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.map
import java.time.LocalDate

data class ShoppingWeek(
    val weekStart: LocalDate,
    /** "p1"/"p2" for one side's list, "both" for the shared list. */
    val listKey: String,
    val result: ShoppingResult,
    val checkedKeys: Set<String>,
)

class MealRepository(
    private val db: AppDatabase,
    private val settings: SettingsRepository,
) {
    private val recipeDao = db.recipeDao()
    private val planDao = db.planDao()
    private val shoppingDao = db.shoppingDao()

    val recipes: Flow<List<Recipe>> = recipeDao.observeAll()
    val pantryIngredientNames: Flow<List<String>> = recipeDao.observePantryIngredientNames()

    /** The library as one side sees it: shared recipes plus that side's own entries. */
    fun recipesFor(profileId: Long): Flow<List<Recipe>> =
        recipes.map { list -> list.filter { it.onlyForProfileId == null || it.onlyForProfileId == profileId } }

    /** Every recipe with its ingredients, for cupboard matching. */
    val recipesWithIngredients: Flow<List<RecipeWithIngredients>> = recipeDao.observeAllWithIngredients()

    /** What each recipe contains (allergens and kinds of meat), worked out from its ingredients. */
    val contents: Flow<Map<Long, Set<Avoid>>> = recipesWithIngredients.map { list ->
        list.associate { it.recipe.id to Foods.inRecipe(it.recipe, it.ingredients) }
    }

    /**
     * The recipes one person asked to avoid, with the reasons. Empty for anyone who hasn't
     * said they avoid anything.
     */
    fun conflictsFor(profileId: Long): Flow<Map<Long, Set<Avoid>>> =
        combine(contents, db.profileDao().observeAll()) { contents, people ->
            val avoids = people.firstOrNull { it.id == profileId }?.answers?.avoids.orEmpty()
            if (avoids.isEmpty()) {
                emptyMap()
            } else {
                contents.mapValues { (_, has) -> has intersect avoids }.filterValues { it.isNotEmpty() }
            }
        }

    fun recipe(id: Long): Flow<RecipeWithIngredients?> = recipeDao.observeWithIngredients(id)

    suspend fun getRecipe(id: Long): RecipeWithIngredients? = recipeDao.getWithIngredients(id)

    suspend fun recipeBySeedKey(key: String): Recipe? = recipeDao.bySeedKey(key)

    fun planForRange(profileId: Long, start: LocalDate, end: LocalDate): Flow<List<MealPlanEntry>> =
        planDao.observeRange(profileId, Dates.iso(start), Dates.iso(end))

    fun planForWeek(profileId: Long, weekStart: LocalDate): Flow<List<MealPlanEntry>> =
        planForRange(profileId, weekStart, weekStart.plusDays(6))

    fun planUpTo(profileId: Long, date: LocalDate): Flow<List<MealPlanEntry>> = planDao.observeUpTo(profileId, Dates.iso(date))

    /** A slot holds a recipe or something off the plan (eating out, leftovers, a skip), never both. */
    suspend fun setSlot(profileId: Long, date: LocalDate, slot: MealSlot, recipeId: Long) = db.withTransaction {
        planDao.clearOffPlan(profileId, Dates.iso(date), slot)
        planDao.put(MealPlanEntry(date = Dates.iso(date), slot = slot, recipeId = recipeId, profileId = profileId))
    }

    suspend fun clearSlot(profileId: Long, date: LocalDate, slot: MealSlot) = db.withTransaction {
        planDao.clear(profileId, Dates.iso(date), slot)
        planDao.clearOffPlan(profileId, Dates.iso(date), slot)
    }

    suspend fun copyTo(profileId: Long, dates: Collection<LocalDate>, slot: MealSlot, recipeId: Long) = db.withTransaction {
        dates.forEach { planDao.clearOffPlan(profileId, Dates.iso(it), slot) }
        planDao.putAll(dates.map { MealPlanEntry(date = Dates.iso(it), slot = slot, recipeId = recipeId, profileId = profileId) })
    }

    // Slots planned as eating out, leftovers or a skip. They never reach the shopping list.

    fun offPlanForWeek(profileId: Long, weekStart: LocalDate): Flow<List<OffPlanMeal>> =
        planDao.observeOffPlan(profileId, Dates.iso(weekStart), Dates.iso(weekStart.plusDays(6)))

    fun offPlanUpTo(profileId: Long, date: LocalDate): Flow<List<OffPlanMeal>> = planDao.observeOffPlanUpTo(profileId, Dates.iso(date))

    suspend fun weekOffPlan(profileId: Long, weekStart: LocalDate): List<OffPlanMeal> =
        planDao.getOffPlan(profileId, Dates.iso(weekStart), Dates.iso(weekStart.plusDays(6)))

    suspend fun setOffPlan(meal: OffPlanMeal) = db.withTransaction {
        planDao.clear(meal.profileId, meal.date, meal.slot)
        planDao.putOffPlan(meal.copy(id = 0, title = meal.title?.trim()?.takeIf { it.isNotEmpty() }))
    }

    /** Cooking for guests that meal: [extra] servings on top of the person's own, bought with the rest. */
    suspend fun setExtraServings(profileId: Long, date: LocalDate, slot: MealSlot, extra: Double) =
        planDao.setExtraServings(profileId, Dates.iso(date), slot, extra.coerceIn(0.0, MAX_EXTRA_SERVINGS))

    // "Cooked it"

    suspend fun logCooked(profileId: Long, recipeId: Long, date: LocalDate, rating: CookRating?) =
        planDao.insertCookLog(CookLog(profileId = profileId, recipeId = recipeId, date = Dates.iso(date), rating = rating))

    fun cookLogs(profileId: Long): Flow<List<CookLog>> = planDao.observeCookLogs(profileId)

    /** What one person last said about each recipe they've cooked. */
    fun ratings(profileId: Long): Flow<Map<Long, CookRating>> = cookLogs(profileId).map { logs ->
        // Newest first, so the first rated entry per recipe is the latest opinion.
        val latest = LinkedHashMap<Long, CookRating>()
        for (log in logs) log.rating?.let { latest.putIfAbsent(log.recipeId, it) }
        latest
    }

    /**
     * Puts a meal-prep recipe in [date]'s slot and in the next empty same slots of that week,
     * up to the number of portions one cook makes. Returns how many slots were filled.
     */
    suspend fun fillBatch(profileId: Long, date: LocalDate, slot: MealSlot, recipe: Recipe): Int {
        val weekEnd = Dates.weekStart(date).plusDays(6)
        val taken = planDao.getRange(profileId, Dates.iso(date), Dates.iso(weekEnd)).filter { it.slot == slot }.map { it.date }.toSet() +
            planDao.getOffPlan(profileId, Dates.iso(date), Dates.iso(weekEnd)).filter { it.slot == slot && it.date != Dates.iso(date) }.map { it.date }
        val targets = mutableListOf(date)
        var d = date.plusDays(1)
        while (targets.size < recipe.slotsPerCook && !d.isAfter(weekEnd)) {
            if (Dates.iso(d) !in taken) targets += d
            d = d.plusDays(1)
        }
        copyTo(profileId, targets, slot, recipe.id)
        return targets.size
    }

    /** Copies last week's meals into this week's empty slots. Returns how many were copied. */
    suspend fun repeatLastWeek(profileId: Long, weekStart: LocalDate): Int {
        val lastWeek = planDao.getRange(profileId, Dates.iso(weekStart.minusDays(7)), Dates.iso(weekStart.minusDays(1)))
        val filled = planDao.getRange(profileId, Dates.iso(weekStart), Dates.iso(weekStart.plusDays(6))).map { it.date to it.slot }.toSet() +
            planDao.getOffPlan(profileId, Dates.iso(weekStart), Dates.iso(weekStart.plusDays(6))).map { it.date to it.slot }
        val copies = lastWeek
            .map { it.copy(id = 0, date = Dates.iso(Dates.parse(it.date).plusDays(7)), extraServings = 0.0) }
            .filter { (it.date to it.slot) !in filled }
        planDao.putAll(copies)
        return copies.size
    }

    suspend fun weekEntries(profileId: Long, weekStart: LocalDate): List<MealPlanEntry> =
        planDao.getRange(profileId, Dates.iso(weekStart), Dates.iso(weekStart.plusDays(6)))

    suspend fun putEntries(entries: List<MealPlanEntry>) = db.withTransaction {
        entries.forEach { planDao.clearOffPlan(it.profileId, it.date, it.slot) }
        planDao.putAll(entries)
    }

    fun listKey(profileId: Long, both: Boolean) = if (both) "both" else "p$profileId"

    /** The week's shopping list for one side, or for both sides together. */
    fun shoppingWeek(profileId: Long, weekStart: LocalDate, both: Boolean): Flow<ShoppingWeek> {
        val start = Dates.iso(weekStart)
        val end = Dates.iso(weekStart.plusDays(6))
        val plan = if (both) planDao.observeRangeAllProfiles(start, end) else planDao.observeRange(profileId, start, end)
        val key = listKey(profileId, both)
        return combine(
            plan,
            recipeDao.observeAllWithIngredients(),
            settings.settings(profileId),
            shoppingDao.observeWeek(key, start),
            db.profileDao().observeAll(),
        ) { entries, recipes, appSettings, checks, people ->
            val portions = people.associate { it.id to it.portion }
            ShoppingWeek(
                weekStart = weekStart,
                listKey = key,
                result = ShoppingList.build(plannedRecipes(entries, recipes) { portions[it] ?: 1.0 }, appSettings.pantryStaples),
                checkedKeys = checks.filter { it.checked }.map { it.ingredientKey }.toSet(),
            )
        }
    }

    suspend fun setChecked(listKey: String, weekStart: LocalDate, key: String, checked: Boolean) =
        shoppingDao.upsert(ShoppingCheck(Dates.iso(weekStart), key, checked, listKey))

    suspend fun clearChecks(listKey: String, weekStart: LocalDate) = shoppingDao.clearWeek(listKey, Dates.iso(weekStart))

    suspend fun saveRecipe(recipe: Recipe, ingredients: List<Ingredient>): Long = db.withTransaction {
        val id = if (recipe.id == 0L) {
            recipeDao.insert(recipe)
        } else {
            recipeDao.update(recipe)
            recipe.id
        }
        recipeDao.deleteIngredientsFor(id)
        recipeDao.insertIngredients(
            ingredients.mapIndexed { index, ing -> ing.copy(id = 0, recipeId = id, position = index) },
        )
        id
    }

    /** Also removes the recipe from any planned slots. */
    suspend fun deleteRecipe(id: Long) = recipeDao.delete(id)

    suspend fun setFavorite(id: Long, favorite: Boolean) = recipeDao.setFavorite(id, favorite)

    suspend fun setHidden(id: Long, hidden: Boolean) = recipeDao.setHidden(id, hidden)

    suspend fun setActiveSwap(id: Long, swap: Int?) = recipeDao.setActiveSwap(id, swap)

    companion object {
        const val MAX_EXTRA_SERVINGS = 12.0

        /**
         * Counts portions per recipe across the plan (each person's lunches and dinners use their
         * own portion size) with any "Make it with..." swap applied.
         */
        fun plannedRecipes(
            entries: List<MealPlanEntry>,
            recipes: List<RecipeWithIngredients>,
            portionOf: (profileId: Long) -> Double = { 1.0 },
        ): List<PlannedRecipe> {
            val byId = recipes.associateBy { it.recipe.id }
            val ordered = entries.sortedWith(compareBy<MealPlanEntry> { it.date }.thenBy { it.slot.ordinal }.thenBy { it.profileId })
            val portions = LinkedHashMap<Long, Double>()
            for (e in ordered) {
                // The person's own share, plus anyone extra they're cooking for that meal.
                portions[e.recipeId] = (portions[e.recipeId] ?: 0.0) + Portions.forSlot(portionOf(e.profileId), e.slot) + e.extraServings
            }
            return portions.mapNotNull { (id, amount) ->
                byId[id]?.let { PlannedRecipe(it.recipe, RecipeSwaps.ingredientsFor(it.recipe, it.ingredients), amount) }
            }
        }
    }
}
