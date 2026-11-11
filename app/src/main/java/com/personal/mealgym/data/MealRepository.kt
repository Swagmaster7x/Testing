package com.personal.mealgym.data

import androidx.room.withTransaction
import com.personal.mealgym.data.db.AppDatabase
import com.personal.mealgym.data.db.Ingredient
import com.personal.mealgym.data.db.MealPlanEntry
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.data.db.RecipeWithIngredients
import com.personal.mealgym.data.db.ShoppingCheck
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.domain.PlannedRecipe
import com.personal.mealgym.domain.ShoppingList
import com.personal.mealgym.domain.ShoppingResult
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.combine
import java.time.LocalDate

data class ShoppingWeek(
    val weekStart: LocalDate,
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
    val recipesWithIngredients: Flow<List<RecipeWithIngredients>> = recipeDao.observeAllWithIngredients()
    val pantryIngredientNames: Flow<List<String>> = recipeDao.observePantryIngredientNames()

    fun recipe(id: Long): Flow<RecipeWithIngredients?> = recipeDao.observeWithIngredients(id)

    suspend fun getRecipe(id: Long): RecipeWithIngredients? = recipeDao.getWithIngredients(id)

    fun planForRange(start: LocalDate, end: LocalDate): Flow<List<MealPlanEntry>> =
        planDao.observeRange(Dates.iso(start), Dates.iso(end))

    fun planForWeek(weekStart: LocalDate): Flow<List<MealPlanEntry>> = planForRange(weekStart, weekStart.plusDays(6))

    fun planUpTo(date: LocalDate): Flow<List<MealPlanEntry>> = planDao.observeUpTo(Dates.iso(date))

    suspend fun setSlot(date: LocalDate, slot: MealSlot, recipeId: Long) =
        planDao.put(MealPlanEntry(date = Dates.iso(date), slot = slot, recipeId = recipeId))

    suspend fun clearSlot(date: LocalDate, slot: MealSlot) = planDao.clear(Dates.iso(date), slot)

    suspend fun copyTo(dates: Collection<LocalDate>, slot: MealSlot, recipeId: Long) =
        planDao.putAll(dates.map { MealPlanEntry(date = Dates.iso(it), slot = slot, recipeId = recipeId) })

    /**
     * Puts a meal-prep recipe in [date]'s slot and in the next empty same slots of that week,
     * up to the number of portions one cook makes. Returns how many slots were filled.
     */
    suspend fun fillBatch(date: LocalDate, slot: MealSlot, recipe: Recipe): Int {
        val weekEnd = Dates.weekStart(date).plusDays(6)
        val taken = planDao.getRange(Dates.iso(date), Dates.iso(weekEnd))
            .filter { it.slot == slot }
            .map { it.date }
            .toSet()
        val targets = mutableListOf(date)
        var d = date.plusDays(1)
        while (targets.size < recipe.slotsPerCook && !d.isAfter(weekEnd)) {
            if (Dates.iso(d) !in taken) targets += d
            d = d.plusDays(1)
        }
        copyTo(targets, slot, recipe.id)
        return targets.size
    }

    /** Copies last week's meals into this week's empty slots. Returns how many were copied. */
    suspend fun repeatLastWeek(weekStart: LocalDate): Int {
        val lastWeek = planDao.getRange(Dates.iso(weekStart.minusDays(7)), Dates.iso(weekStart.minusDays(1)))
        val filled = planDao.getRange(Dates.iso(weekStart), Dates.iso(weekStart.plusDays(6)))
            .map { it.date to it.slot }
            .toSet()
        val copies = lastWeek
            .map { it.copy(id = 0, date = Dates.iso(Dates.parse(it.date).plusDays(7))) }
            .filter { (it.date to it.slot) !in filled }
        planDao.putAll(copies)
        return copies.size
    }

    fun shoppingWeek(weekStart: LocalDate): Flow<ShoppingWeek> = combine(
        planForWeek(weekStart),
        recipeDao.observeAllWithIngredients(),
        settings.settings,
        shoppingDao.observeWeek(Dates.iso(weekStart)),
    ) { plan, recipes, appSettings, checks ->
        val byId = recipes.associateBy { it.recipe.id }
        val ordered = plan.sortedWith(compareBy<MealPlanEntry> { it.date }.thenBy { it.slot.ordinal })
        val counts = LinkedHashMap<Long, Int>()
        for (entry in ordered) counts[entry.recipeId] = (counts[entry.recipeId] ?: 0) + 1
        val planned = counts.mapNotNull { (id, n) ->
            byId[id]?.let { PlannedRecipe(it.recipe, it.ingredients, n) }
        }
        ShoppingWeek(
            weekStart = weekStart,
            result = ShoppingList.build(planned, appSettings.pantryStaples),
            checkedKeys = checks.filter { it.checked }.map { it.ingredientKey }.toSet(),
        )
    }

    suspend fun setChecked(weekStart: LocalDate, key: String, checked: Boolean) =
        shoppingDao.upsert(ShoppingCheck(Dates.iso(weekStart), key, checked))

    suspend fun clearChecks(weekStart: LocalDate) = shoppingDao.clearWeek(Dates.iso(weekStart))

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
}
