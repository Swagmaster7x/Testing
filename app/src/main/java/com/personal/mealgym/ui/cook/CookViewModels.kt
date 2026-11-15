@file:OptIn(ExperimentalCoroutinesApi::class)

package com.personal.mealgym.ui.cook

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.viewModelScope
import com.personal.mealgym.AppContainer
import com.personal.mealgym.data.LibraryFilter
import com.personal.mealgym.cook.CookTimer
import com.personal.mealgym.data.ShoppingWeek
import com.personal.mealgym.data.db.CookRating
import com.personal.mealgym.data.db.Ingredient
import com.personal.mealgym.data.db.MealPlanEntry
import com.personal.mealgym.data.db.MealType
import com.personal.mealgym.data.db.ProteinTag
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.data.db.StoreSection
import com.personal.mealgym.domain.Avoid
import com.personal.mealgym.domain.Cupboard
import com.personal.mealgym.domain.CupboardItem
import com.personal.mealgym.domain.ShoppingItem
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.domain.Foods
import com.personal.mealgym.domain.answers
import com.personal.mealgym.domain.Quantities
import com.personal.mealgym.domain.RecipeSwaps
import com.personal.mealgym.ui.MessageViewModel
import com.personal.mealgym.ui.label
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.util.concurrent.atomic.AtomicLong
import kotlin.math.roundToInt

// ---------- Recipe list ----------

data class CookUi(val thisWeek: List<Recipe>, val all: List<Recipe>)

class CookViewModel(private val c: AppContainer) : MessageViewModel() {
    val profileId = c.currentProfileId()

    val filter: StateFlow<LibraryFilter> = c.settings.settings(profileId).map { it.filter }.stateInVm(LibraryFilter())

    fun setFilter(filter: LibraryFilter) {
        viewModelScope.launch { c.settings.setFilter(profileId, filter) }
    }

    fun setFavorite(recipe: Recipe, favorite: Boolean) {
        viewModelScope.launch { c.meals.setFavorite(recipe.id, favorite) }
    }

    /** Recipes this person asked to avoid, with why. */
    val conflicts: StateFlow<Map<Long, Set<Avoid>>> = c.meals.conflictsFor(profileId).stateInVm(emptyMap())

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
    /** What the recipe contains, from its ingredient names (allergens and kinds of meat). */
    val contains: Set<Avoid> = emptySet(),
    /** The part of [contains] this person asked to avoid. */
    val conflicts: Set<Avoid> = emptySet(),
    /** "Make it easier to finish" instead of the half-plate and volume tips. */
    val easierToFinish: Boolean = false,
    val easierTips: List<String> = emptyList(),
    /** The person's lunch and dinner portion, when it isn't a whole serving. */
    val portion: Double = 1.0,
    /** "Like the chili at Wendy's": the restaurant food this is a home version of. */
    val inspirations: List<String> = emptyList(),
    /** How much is being cooked compared with the recipe as written (2.0 is double). [ingredients] are already scaled. */
    val scale: Double = 1.0,
    /** How many times this person has cooked it, when they last did, and what they last said about it. */
    val cooked: Int = 0,
    val lastCooked: LocalDate? = null,
    val rating: CookRating? = null,
) {
    /** How many servings the scaled recipe makes. */
    val scaledServings: Int get() = (recipe.servings * scale).roundToInt().coerceAtLeast(1)

    /** Coffee-shop orders and the like: nothing to cook or buy. */
    val isOrderOnly: Boolean get() = recipe.steps.isEmpty() && ingredients.isEmpty()
}

sealed interface RecipeState {
    data object Loading : RecipeState
    data object Missing : RecipeState
    data class Loaded(val ui: RecipeUi) : RecipeState
}

class RecipeViewModel(private val c: AppContainer, handle: SavedStateHandle) : MessageViewModel() {
    private val id: Long = handle.get<Long>("id") ?: 0L
    val profileId = c.currentProfileId()

    /** Cooking mode opens at whatever size the recipe page was showing. */
    private val scale = MutableStateFlow((handle.get<Float>("scale") ?: 1f).toDouble().coerceIn(0.5, 4.0))

    fun setScale(value: Double) {
        scale.value = value.coerceIn(0.5, 4.0)
    }

    val state: StateFlow<RecipeState> = combine(
        c.meals.recipe(id),
        c.settings.settings(profileId),
        c.profile(profileId),
        scale,
        c.meals.cookLogs(profileId),
    ) { r, s, person, size, cookLogs ->
        chime = s.chime
        if (r == null) {
            RecipeState.Missing
        } else {
            val mine = cookLogs.filter { it.recipeId == id }
            RecipeState.Loaded(
                RecipeUi(
                    recipe = r.recipe,
                    ingredients = RecipeSwaps.ingredientsFor(r.recipe, r.ingredients.sortedBy { it.position })
                        .map { ing -> if (size == 1.0) ing else ing.copy(quantity = ing.quantity?.times(size)) },
                    scale = size,
                    cooked = mine.size,
                    lastCooked = mine.firstOrNull()?.let { Dates.parse(it.date) },
                    rating = mine.firstNotNullOfOrNull { it.rating },
                    showNutrition = s.showNutrition,
                    showHalfPlateTip = s.showHalfPlateTip,
                    freeVolumeFoods = c.freeVolumeFoods,
                    easierToFinish = person.easierToFinish,
                    easierTips = c.seed.seed.easierToFinishTips,
                    portion = person.portion,
                    contains = Foods.inRecipe(r.recipe, r.ingredients),
                    conflicts = Foods.inRecipe(r.recipe, r.ingredients) intersect person.answers?.avoids.orEmpty(),
                    inspirations = c.restaurants.file.inspirations(r.recipe.seedKey),
                ),
            )
        }
    }.stateInVm(RecipeState.Loading)

    fun setFavorite(favorite: Boolean) {
        viewModelScope.launch { c.meals.setFavorite(id, favorite) }
    }

    private var chime = false

    /** Kitchen timers started from steps, for this recipe or any other; they outlive the screen. */
    val timers: StateFlow<List<CookTimer>> = c.cookTimers.timers

    fun startTimer(stepNumber: Int, seconds: Int) {
        val name = (state.value as? RecipeState.Loaded)?.ui?.recipe?.name.orEmpty()
        c.cookTimers.start("Step $stepNumber · $name", seconds, chime)
    }

    fun dismissTimer(id: Long) = c.cookTimers.dismiss(id)

    /** "I cooked it", with how it went if they said. [onDone] runs once it's noted. */
    fun logCooked(rating: CookRating?, usedUp: Set<String> = emptySet(), onDone: () -> Unit = {}) {
        // A rating was showing and was deliberately unpicked.
        val takenBack = rating == null && (state.value as? RecipeState.Loaded)?.ui?.rating != null
        viewModelScope.launch {
            // The clock, not the app's "today": nothing on this screen keeps that ticking past midnight.
            c.meals.logCooked(profileId, id, LocalDate.now(), rating, takeBackRating = takenBack)
            if (usedUp.isNotEmpty()) c.settings.setInCupboard(usedUp, have = false)
            onDone()
        }
    }

    /**
     * What this recipe takes from the cupboard, offered as "Used up?" when it's cooked. Empty
     * unless the cupboard is being kept up to date.
     */
    val fromCupboard: StateFlow<List<CupboardItem>> = combine(
        c.meals.recipe(id),
        c.settings.cupboard,
        c.settings.settings(profileId),
        c.settings.cupboardAuto,
    ) { r, cupboard, s, auto ->
        if (!auto || r == null) {
            emptyList()
        } else {
            Cupboard.usedBy(RecipeSwaps.ingredientsFor(r.recipe, r.ingredients.sortedBy { it.position }), cupboard, s.pantryStaples)
        }
    }.stateInVm(emptyList())

    fun setHidden(hidden: Boolean) {
        viewModelScope.launch {
            c.meals.setHidden(id, hidden)
            say(if (hidden) "Hidden for now. Find it under Show hidden in Cook." else "Back in the library.")
        }
    }

    /**
     * Picks a "Make it with..." option ([index] null = the original). A swap that points to
     * another recipe opens that recipe instead.
     */
    fun chooseSwap(index: Int?, openRecipe: (Long) -> Unit) {
        val recipe = (state.value as? RecipeState.Loaded)?.ui?.recipe ?: return
        val swap = index?.let { recipe.proteinSwaps.getOrNull(it) }
        viewModelScope.launch {
            val linked = swap?.useRecipeKey
            if (linked != null) {
                c.meals.recipeBySeedKey(linked)?.let { openRecipe(it.id) } ?: say("That recipe isn't in the library any more.")
            } else {
                c.meals.setActiveSwap(id, index)
            }
        }
    }

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

    /** How many people are on this phone: the "Both of us" choice only shows with more than one. */
    val peopleCount: StateFlow<Int> = c.profiles.map { it.size }.stateInVm(c.profiles.value.size)

    /** "Just mine" (false) or "Both of us" / "Everyone" (true), remembered per person. */
    val both: StateFlow<Boolean> = combine(c.settings.settings(profileId), c.profiles) { s, people -> s.shoppingBoth && people.size > 1 }
        .stateInVm(false)

    val ui: StateFlow<ShoppingWeek?> = combine(c.today, weekOffset, both) { today, offset, both ->
        Dates.weekStart(today).plusWeeks(offset) to both
    }.flatMapLatest { (ws, both) -> c.meals.shoppingWeek(profileId, ws, both) }.stateInVm(null)

    /** What's ticked in "My cupboard": those items are labelled on the list, not removed. */
    val cupboard: StateFlow<Set<String>> = c.settings.cupboard.stateInVm(emptySet())

    fun setBoth(both: Boolean) {
        viewModelScope.launch { c.settings.setShoppingBoth(profileId, both) }
    }

    fun setWeekOffset(offset: Long) {
        weekOffset.value = offset
    }

    /** "Keep it up to date" on the cupboard: ticked items go into it. */
    val cupboardAuto: StateFlow<Boolean> = c.settings.cupboardAuto.stateInVm(false)

    /** Cupboard items this screen put there, so unticking a slip takes it back out (and nothing else). */
    private val addedHere = mutableSetOf<String>()

    /**
     * Ticks an item off. With the cupboard kept up to date, buying something puts it in the
     * cupboard with today's date; unticking takes out only what the tick put in.
     */
    fun toggle(week: ShoppingWeek, item: ShoppingItem, checked: Boolean) {
        viewModelScope.launch {
            c.meals.setChecked(week.listKey, week.weekStart, item.key, checked)
            if (!c.settings.cupboardAuto.first()) return@launch
            // "X or Y" lines: whichever is listed first stands for what was bought.
            val key = Cupboard.options(item.name).firstOrNull() ?: return@launch
            val today = LocalDate.now().toEpochDay()
            if (checked) {
                if (key !in c.settings.cupboard.first()) {
                    addedHere += key
                    c.settings.setInCupboard(key, true, today)
                }
            } else {
                // Take back what a tick put in: one from this visit, or one dated today (the list was
                // left and reopened). Not if another ticked line is the same food ("broccoli" and
                // "frozen broccoli"), and never something that was in the cupboard before today.
                val stillTicked = week.result.sections.flatMap { it.items }
                    .any { it.key != item.key && it.key in week.checkedKeys && Cupboard.options(it.name).firstOrNull() == key }
                val addedToday = c.settings.cupboardSince.first()[key] == today
                if (!stillTicked && (addedHere.remove(key) || addedToday)) c.settings.setInCupboard(key, false)
            }
        }
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
    var protein by mutableStateOf<ProteinTag?>(null)
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
                    protein = r.recipe.protein
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
        // Start from the stored recipe so favourite, hidden, swaps and side stay as they were.
        val base = original ?: Recipe(name = "", mealType = mealType, isUserCreated = true)
        val recipe = base.copy(
            id = id,
            name = name.trim(),
            protein = protein,
            mealType = mealType,
            cuisineTags = cuisineTags.split(',').map { it.trim() }.filter { it.isNotEmpty() },
            servings = servings.trim().toIntOrNull()?.coerceIn(1, 50) ?: 1,
            servingSizeText = servingSize.trim(),
            nutritionText = nutrition.trim().ifEmpty { null },
            steps = steps.map { it.text.trim() }.filter { it.isNotEmpty() },
            volumeTip = volumeTip.trim().ifEmpty { null },
            isMealPrep = isMealPrep,
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
