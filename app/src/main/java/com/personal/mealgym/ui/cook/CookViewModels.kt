@file:OptIn(ExperimentalCoroutinesApi::class)

package com.personal.mealgym.ui.cook

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.viewModelScope
import com.personal.mealgym.AppContainer
import com.personal.mealgym.data.ShoppingWeek
import com.personal.mealgym.data.db.Ingredient
import com.personal.mealgym.data.db.MealPlanEntry
import com.personal.mealgym.data.db.MealType
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.data.db.StoreSection
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.domain.Quantities
import com.personal.mealgym.ui.MessageViewModel
import com.personal.mealgym.ui.label
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.util.concurrent.atomic.AtomicLong

// ---------- Recipe list ----------

data class CookUi(val thisWeek: List<Recipe>, val all: List<Recipe>)

class CookViewModel(c: AppContainer) : MessageViewModel() {
    val profileId = c.currentProfileId()

    val ui: StateFlow<CookUi?> = c.today.flatMapLatest { today ->
        combine(c.meals.planForWeek(profileId, Dates.weekStart(today)), c.meals.recipesFor(profileId)) { plan, recipes ->
            val byId = recipes.associateBy { it.id }
            val planned = plan.sortedWith(compareBy<MealPlanEntry> { it.date }.thenBy { it.slot.ordinal })
                .map { it.recipeId }
                .distinct()
                .mapNotNull { byId[it] }
            CookUi(planned, recipes)
        }
    }.stateInVm(null)
}

// ---------- One recipe ----------

data class RecipeUi(
    val recipe: Recipe,
    val ingredients: List<Ingredient>,
    val showNutrition: Boolean,
    val showHalfPlateTip: Boolean,
    val freeVolumeFoods: List<String>,
)

sealed interface RecipeState {
    data object Loading : RecipeState
    data object Missing : RecipeState
    data class Loaded(val ui: RecipeUi) : RecipeState
}

class RecipeViewModel(private val c: AppContainer, handle: SavedStateHandle) : MessageViewModel() {
    private val id: Long = handle.get<Long>("id") ?: 0L
    val profileId = c.currentProfileId()

    val state: StateFlow<RecipeState> = combine(c.meals.recipe(id), c.settings.settings(profileId)) { r, s ->
        if (r == null) {
            RecipeState.Missing
        } else {
            RecipeState.Loaded(
                RecipeUi(
                    recipe = r.recipe,
                    ingredients = r.ingredients.sortedBy { it.position },
                    showNutrition = s.showNutrition,
                    showHalfPlateTip = s.showHalfPlateTip,
                    freeVolumeFoods = c.freeVolumeFoods,
                ),
            )
        }
    }.stateInVm(RecipeState.Loading)

    fun delete(onDone: () -> Unit) {
        viewModelScope.launch {
            c.meals.deleteRecipe(id)
            onDone()
        }
    }
}

// ---------- Shopping list ----------

class ShoppingViewModel(private val c: AppContainer) : MessageViewModel() {
    val profileId = c.currentProfileId()

    /** 0 = this week, 1 = next week. */
    val weekOffset = MutableStateFlow(0L)

    /** "Just mine" (false) or "Both of us" (true), remembered per side. */
    val both: StateFlow<Boolean> = c.settings.settings(profileId).map { it.shoppingBoth }.stateInVm(false)

    val ui: StateFlow<ShoppingWeek?> = combine(c.today, weekOffset, both) { today, offset, both ->
        Dates.weekStart(today).plusWeeks(offset) to both
    }.flatMapLatest { (ws, both) -> c.meals.shoppingWeek(profileId, ws, both) }.stateInVm(null)

    fun setBoth(both: Boolean) {
        viewModelScope.launch { c.settings.setShoppingBoth(profileId, both) }
    }

    fun setWeekOffset(offset: Long) {
        weekOffset.value = offset
    }

    fun toggle(week: ShoppingWeek, key: String, checked: Boolean) {
        viewModelScope.launch { c.meals.setChecked(week.listKey, week.weekStart, key, checked) }
    }

    fun uncheckAll(week: ShoppingWeek) {
        viewModelScope.launch { c.meals.clearChecks(week.listKey, week.weekStart) }
    }

    companion object {
        /** Plain text for sharing: what's still to buy, grouped by store section. */
        fun shareText(week: ShoppingWeek): String {
            val lines = mutableListOf("Shopping list · week of ${Dates.monthDay(week.weekStart)}")
            var any = false
            for (section in week.result.sections) {
                val items = section.items.filter { it.key !in week.checkedKeys }
                if (items.isEmpty()) continue
                any = true
                lines += ""
                lines += section.section.label
                items.forEach { item ->
                    lines += if (item.amountText.isBlank()) "- ${item.name}" else "- ${item.name}: ${item.amountText}"
                }
            }
            if (!any) {
                lines += ""
                lines += "Everything is ticked off."
            }
            return lines.joinToString("\n")
        }
    }
}

// ---------- Add / edit a recipe ----------

data class IngredientForm(
    val key: Long = nextKey.incrementAndGet(),
    val quantity: String = "",
    val unit: String = "",
    val name: String = "",
    val note: String = "",
    val section: StoreSection = StoreSection.PRODUCE_FROZEN,
) {
    companion object {
        private val nextKey = AtomicLong(0)
    }
}

data class StepForm(val key: Long = nextKey.incrementAndGet(), val text: String = "") {
    companion object {
        private val nextKey = AtomicLong(0)
    }
}

class RecipeEditViewModel(private val c: AppContainer, handle: SavedStateHandle) : MessageViewModel() {
    val id: Long = handle.get<Long>("id") ?: 0L
    val isNew: Boolean get() = id == 0L

    var loaded by mutableStateOf(isNew)
        private set
    var name by mutableStateOf("")
    var mealType by mutableStateOf(MealType.DINNER)
    var cuisineTags by mutableStateOf("")
    var servings by mutableStateOf("1")
    var servingSize by mutableStateOf("")
    var nutrition by mutableStateOf("")
    var isMealPrep by mutableStateOf(false)
    var volumeTip by mutableStateOf("")
    val ingredients = mutableStateListOf<IngredientForm>()
    val steps = mutableStateListOf<StepForm>()

    private var original: Recipe? = null

    init {
        if (isNew) {
            ingredients += IngredientForm()
            steps += StepForm()
        } else {
            viewModelScope.launch {
                val r = c.meals.getRecipe(id)
                if (r != null) {
                    original = r.recipe
                    name = r.recipe.name
                    mealType = r.recipe.mealType
                    cuisineTags = r.recipe.cuisineTags.joinToString(", ")
                    servings = r.recipe.servings.toString()
                    servingSize = r.recipe.servingSizeText
                    nutrition = r.recipe.nutritionText.orEmpty()
                    isMealPrep = r.recipe.isMealPrep
                    volumeTip = r.recipe.volumeTip.orEmpty()
                    ingredients += r.ingredients.sortedBy { it.position }.map {
                        IngredientForm(
                            quantity = it.quantity?.let(Quantities::format).orEmpty(),
                            unit = it.unit.orEmpty(),
                            name = it.name,
                            note = it.note.orEmpty(),
                            section = it.storeSection,
                        )
                    }
                    steps += r.recipe.steps.map { StepForm(text = it) }
                }
                if (ingredients.isEmpty()) ingredients += IngredientForm()
                if (steps.isEmpty()) steps += StepForm()
                loaded = true
            }
        }
    }

    val canSave: Boolean get() = loaded && name.isNotBlank()

    fun save(onSaved: (Long) -> Unit) {
        if (!canSave) return
        val recipe = Recipe(
            id = id,
            seedKey = original?.seedKey,
            name = name.trim(),
            mealType = mealType,
            cuisineTags = cuisineTags.split(',').map { it.trim() }.filter { it.isNotEmpty() },
            servings = servings.trim().toIntOrNull()?.coerceIn(1, 50) ?: 1,
            servingSizeText = servingSize.trim(),
            nutritionText = nutrition.trim().ifEmpty { null },
            steps = steps.map { it.text.trim() }.filter { it.isNotEmpty() },
            volumeTip = volumeTip.trim().ifEmpty { null },
            isMealPrep = isMealPrep,
            isUserCreated = original?.isUserCreated ?: true,
        )
        val rows = ingredients.filter { it.name.isNotBlank() }.mapIndexed { index, f ->
            val qtyText = f.quantity.trim()
            val parsed = Quantities.parse(qtyText)
            // Keep amounts like "a few" readable even though they can't be added up.
            val unit = if (parsed == null && qtyText.isNotEmpty()) "$qtyText ${f.unit.trim()}".trim() else f.unit.trim()
            Ingredient(
                recipeId = id,
                position = index,
                name = f.name.trim(),
                quantity = parsed,
                unit = unit.ifEmpty { null },
                note = f.note.trim().ifEmpty { null },
                storeSection = f.section,
                isPantryStaple = f.section == StoreSection.PANTRY,
            )
        }
        viewModelScope.launch {
            val savedId = c.meals.saveRecipe(recipe, rows)
            onSaved(savedId)
        }
    }
}
