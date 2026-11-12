@file:OptIn(ExperimentalLayoutApi::class, ExperimentalMaterial3Api::class)

package com.personal.mealgym.ui.cook

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import com.personal.mealgym.AppContainer
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.domain.Cupboard
import com.personal.mealgym.domain.CupboardItem
import com.personal.mealgym.domain.CupboardMatch
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.domain.RecipeSwaps
import com.personal.mealgym.domain.Search
import com.personal.mealgym.domain.ShoppingList
import com.personal.mealgym.ui.AppNavigator
import com.personal.mealgym.ui.AppViewModels
import com.personal.mealgym.ui.MessageViewModel
import com.personal.mealgym.ui.ShowMessages
import com.personal.mealgym.ui.Sides
import com.personal.mealgym.ui.accepts
import com.personal.mealgym.ui.components.AppButton
import com.personal.mealgym.ui.components.AppScaffold
import com.personal.mealgym.ui.components.Badge
import com.personal.mealgym.ui.components.DetailTopBar
import com.personal.mealgym.ui.components.EmptyState
import com.personal.mealgym.ui.components.SectionHeader
import com.personal.mealgym.ui.label
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.launch
import java.time.LocalDate

data class CupboardUi(
    /** Everything that can be ticked, by store section. */
    val items: List<CupboardItem>,
    val have: Set<String>,
    /** Recipes that use something ticked, best fit first. */
    val matches: List<CupboardMatch>,
    val slots: List<MealSlot>,
    val today: LocalDate,
) {
    val ready: List<CupboardMatch> get() = matches.filter { it.ready }
    val almost: List<CupboardMatch> get() = matches.filter { !it.ready && it.missing.size <= 3 }
    val further: List<CupboardMatch> get() = matches.filter { it.missing.size > 3 }.take(8)
}

/**
 * "What can I make with what I have?" One cupboard for the household; recipes are the person's
 * own view of the library (nothing hidden, nothing they've asked to avoid).
 */
class CupboardViewModel(private val c: AppContainer) : MessageViewModel() {
    val profileId = c.currentProfileId()

    val ui: StateFlow<CupboardUi?> = combine(
        c.meals.recipesWithIngredients,
        c.settings.settings(profileId),
        c.settings.cupboard,
        c.meals.conflictsFor(profileId),
        combine(c.profile(profileId), c.today) { p, d -> p to d },
    ) { recipes, settings, cupboard, conflicts, (profile, today) ->
        val mine = recipes.filter { r ->
            !r.recipe.isHidden && r.recipe.id !in conflicts &&
                (r.recipe.onlyForProfileId == null || r.recipe.onlyForProfileId == profileId)
        }
        val staples = settings.pantryStaples
        val ingredients = mine.flatMap { RecipeSwaps.ingredientsFor(it.recipe, it.ingredients) }
        CupboardUi(
            items = Cupboard.catalog(ingredients, staples),
            have = cupboard,
            matches = Cupboard.match(mine.map { it.recipe to it.ingredients }, cupboard, staples),
            slots = Sides.slotsFor(profile),
            today = today,
        )
    }.stateInVm(null)

    fun toggle(item: CupboardItem, have: Boolean) {
        viewModelScope.launch { c.settings.setInCupboard(item.key, have) }
    }

    fun clear() {
        viewModelScope.launch { c.settings.setCupboard(emptySet()) }
    }

    /** Puts the recipe on the plan; what's missing then shows on that week's shopping list. */
    fun plan(recipe: Recipe, date: LocalDate, slot: MealSlot, missing: Int) {
        viewModelScope.launch {
            c.meals.setSlot(profileId, date, slot, recipe.id)
            val day = if (date == c.today.value) "today" else Dates.shortLabel(date)
            say(
                "Planned for ${slot.label.lowercase()} $day." +
                    if (missing > 0) " What's missing is on the shopping list." else "",
            )
        }
    }
}

@Composable
fun CupboardScreen(nav: AppNavigator, vm: CupboardViewModel = viewModel(factory = AppViewModels.Factory)) {
    val ui by vm.ui.collectAsStateWithLifecycle()
    val snackbar = remember { SnackbarHostState() }
    vm.ShowMessages(snackbar)
    var showRecipes by rememberSaveable { mutableStateOf(false) }
    var query by rememberSaveable { mutableStateOf("") }
    var planning by remember { mutableStateOf<CupboardMatch?>(null) }

    AppScaffold(
        topBar = {
            DetailTopBar(
                title = "My cupboard",
                onBack = nav::back,
                actions = {
                    if (ui?.have?.isNotEmpty() == true) TextButton(onClick = vm::clear) { Text("Clear") }
                },
            )
        },
        snackbarHost = { SnackbarHost(snackbar) },
    ) { padding ->
        val state = ui ?: return@AppScaffold
        Column(Modifier.fillMaxSize().padding(padding)) {
        // Stays put above the list, so the count of matches is always in view while ticking.
        SingleChoiceSegmentedButtonRow(Modifier.fillMaxWidth().padding(start = 16.dp, end = 16.dp, bottom = 8.dp)) {
            // Short labels: with the whole library matching, the second count is often three digits.
            listOf("I have (${state.have.size})" to false, "I can make (${state.matches.size})" to true)
                .forEachIndexed { index, (label, value) ->
                    SegmentedButton(
                        selected = showRecipes == value,
                        onClick = { showRecipes = value },
                        shape = SegmentedButtonDefaults.itemShape(index, 2),
                    ) { Text(label, maxLines = 1, overflow = TextOverflow.Ellipsis) }
                }
        }
        // Each view keeps its own place, so the recipes always open at the top.
        val haveList = rememberLazyListState()
        val makeList = rememberLazyListState()
        LazyColumn(
            state = if (showRecipes) makeList else haveList,
            modifier = Modifier.fillMaxWidth().weight(1f),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 32.dp),
        ) {
            if (showRecipes) {
                recipes(state, onOpen = { nav.recipe(it.recipe.id) }, onPlan = { planning = it })
            } else {
                item {
                    Text(
                        "Tick what's in your fridge and cupboards. Pantry staples from Settings already count.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    OutlinedTextField(
                        value = query,
                        onValueChange = { query = it },
                        placeholder = { Text("Search ingredients") },
                        leadingIcon = { Icon(Icons.Filled.Search, contentDescription = null) },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
                    )
                }
                val q = query.trim()
                val shown = state.items.filter { Search.matches(it.name, q) }
                if (shown.isEmpty()) {
                    item {
                        EmptyState(
                            title = "No ingredient called \"$q\"",
                            body = "The list has every ingredient the recipes use. Try a shorter word.",
                        )
                    }
                }
                ShoppingList.sectionOrder.forEach { section ->
                    val inSection = shown.filter { it.section == section }
                    if (inSection.isNotEmpty()) {
                        item(key = "h-$section") { SectionHeader(section.label) }
                        item(key = "c-$section") { ItemChips(inSection, state.have, vm::toggle) }
                    }
                }
                if (state.have.isNotEmpty()) {
                    item {
                        AppButton(onClick = { showRecipes = true }, modifier = Modifier.fillMaxWidth().padding(top = 20.dp)) {
                            Text(
                                when (val n = state.matches.size) {
                                    0 -> "See what I can make"
                                    1 -> "See 1 recipe I can make"
                                    else -> "See $n recipes I can make"
                                },
                            )
                        }
                    }
                }
            }
        }
        }

        planning?.let { match ->
            PlanItSheet(
                match = match,
                slots = state.slots.filter { it.accepts(match.recipe.mealType) }.ifEmpty { state.slots },
                today = state.today,
                onPlan = { date, slot ->
                    vm.plan(match.recipe, date, slot, match.missing.size)
                    planning = null
                },
                onDismiss = { planning = null },
            )
        }
    }
}

@Composable
private fun ItemChips(items: List<CupboardItem>, have: Set<String>, onToggle: (CupboardItem, Boolean) -> Unit) {
    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        items.forEach { item ->
            val ticked = item.key in have
            FilterChip(
                selected = ticked,
                onClick = { onToggle(item, !ticked) },
                label = { Text(item.name) },
                // A tick as well as the colour, so it's clear what's chosen.
                leadingIcon = if (ticked) {
                    { Icon(Icons.Filled.Check, contentDescription = null, modifier = Modifier.size(FilterChipDefaults.IconSize)) }
                } else {
                    null
                },
            )
        }
    }
}

private fun androidx.compose.foundation.lazy.LazyListScope.recipes(
    state: CupboardUi,
    onOpen: (CupboardMatch) -> Unit,
    onPlan: (CupboardMatch) -> Unit,
) {
    if (state.have.isEmpty()) {
        item {
            EmptyState(
                title = "Nothing ticked yet",
                body = "Tick a few things under \"I have\" and recipes that use them show up here.",
            )
        }
        return
    }
    if (state.matches.isEmpty()) {
        item {
            EmptyState(
                title = "No recipe uses those yet",
                body = "Tick a protein or a few more vegetables and try again.",
            )
        }
        return
    }
    fun group(title: String, matches: List<CupboardMatch>) {
        if (matches.isEmpty()) return
        item(key = "t-$title") { SectionHeader(title) }
        items(matches, key = { "m-${it.recipe.id}" }) { match ->
            MatchCard(match, onOpen = { onOpen(match) }, onPlan = { onPlan(match) })
        }
    }
    group("Ready to cook", state.ready)
    group("Almost there", state.almost)
    group("Needs a shop", state.further)
}

@Composable
private fun MatchCard(match: CupboardMatch, onOpen: () -> Unit, onPlan: () -> Unit) {
    ElevatedCard(onClick = onOpen, modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
        Column(Modifier.padding(start = 16.dp, top = 12.dp, end = 8.dp, bottom = 4.dp)) {
            Text(match.recipe.name, style = MaterialTheme.typography.titleMedium)
            FlowRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp),
                modifier = Modifier.padding(top = 4.dp),
            ) {
                Badge(match.recipe.mealType.label)
                Badge(if (match.ready) "You have everything" else "You have ${match.haveCount} of ${match.total}")
            }
            if (!match.ready) {
                Text(
                    "To buy: " + match.missing.joinToString(", ") { it.name },
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(top = 6.dp, end = 8.dp),
                )
            }
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                TextButton(onClick = onOpen) { Text("Open recipe") }
                TextButton(onClick = onPlan) { Text("Plan it") }
            }
        }
    }
}

/** Pick a day in the next week and a meal; planning it puts what's missing on the shopping list. */
@Composable
private fun PlanItSheet(
    match: CupboardMatch,
    slots: List<MealSlot>,
    today: LocalDate,
    onPlan: (LocalDate, MealSlot) -> Unit,
    onDismiss: () -> Unit,
) {
    var day by remember { mutableStateOf(today) }
    var slot by remember { mutableStateOf(slots.first()) }
    ModalBottomSheet(onDismissRequest = onDismiss) {
        Column(Modifier.padding(start = 16.dp, end = 16.dp, bottom = 24.dp)) {
            Text(match.recipe.name, style = MaterialTheme.typography.titleLarge)
            Text("Which day?", style = MaterialTheme.typography.labelLarge, modifier = Modifier.padding(top = 12.dp))
            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                (0L..6L).map { today.plusDays(it) }.forEach { date ->
                    FilterChip(
                        selected = day == date,
                        onClick = { day = date },
                        label = {
                            Text(
                                when (date) {
                                    today -> "Today"
                                    today.plusDays(1) -> "Tomorrow"
                                    else -> Dates.shortDayName(date.dayOfWeek)
                                },
                            )
                        },
                    )
                }
            }
            if (slots.size > 1) {
                Text("Which meal?", style = MaterialTheme.typography.labelLarge, modifier = Modifier.padding(top = 12.dp))
                FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    slots.forEach { s ->
                        FilterChip(selected = slot == s, onClick = { slot = s }, label = { Text(s.label) })
                    }
                }
            }
            Text(
                "This replaces anything already planned for that meal." +
                    if (match.ready) "" else " What you're missing goes on that week's shopping list.",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 12.dp),
            )
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(top = 12.dp)) {
                AppButton(onClick = { onPlan(day, slot) }, modifier = Modifier.weight(1f)) { Text("Add to my plan") }
                OutlinedButton(onClick = onDismiss) { Text("Cancel") }
            }
        }
    }
}
