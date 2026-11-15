@file:OptIn(ExperimentalMaterial3Api::class)

package com.personal.mealgym.ui.plan

import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.AssistChip
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.personal.mealgym.data.Restaurant
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.OffPlanKind
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.ui.LocalCopy
import com.personal.mealgym.data.LibraryFilter
import com.personal.mealgym.domain.Search
import com.personal.mealgym.domain.WeekFiller
import com.personal.mealgym.ui.accepts
import com.personal.mealgym.ui.components.LibraryFilterBar
import com.personal.mealgym.ui.components.Badge
import com.personal.mealgym.ui.label

/** What the picker is filling. */
data class PickTarget(val date: java.time.LocalDate, val slot: MealSlot)

/** A slot that isn't a recipe: eating out (with what, if known), leftovers, or skipping it. */
data class OffPlanChoice(
    val kind: OffPlanKind,
    val title: String? = null,
    val restaurantKey: String? = null,
    val calories: Int? = null,
    val protein: Int? = null,
)

/**
 * "Pick your breakfast / lunch / dinner": recipes for that slot, searchable by name or cuisine.
 * Meal-prep recipes offer to fill several slots at once.
 */
@Composable
fun RecipePickerSheet(
    slot: MealSlot,
    dateLabel: String,
    recipes: List<Recipe>,
    filter: LibraryFilter,
    onFilterChange: (LibraryFilter) -> Unit,
    onPick: (Recipe) -> Unit,
    onFillBatch: (Recipe) -> Unit,
    onDismiss: () -> Unit,
    /** Places to choose from under "Eating out". */
    restaurants: List<Restaurant> = emptyList(),
    /** When given, the picker also offers eating out, leftovers and skipping the meal. */
    onOffPlan: ((OffPlanChoice) -> Unit)? = null,
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    var query by rememberSaveable { mutableStateOf("") }
    var anyMeal by rememberSaveable { mutableStateOf(false) }
    var eatingOut by rememberSaveable { mutableStateOf(false) }

    if (eatingOut && onOffPlan != null) {
        ModalBottomSheet(onDismissRequest = onDismiss, sheetState = sheetState) {
            EatingOutChooser(slot, dateLabel, restaurants, onBack = { eatingOut = false }, onChoose = onOffPlan)
        }
        return
    }

    val cuisines = remember(recipes) { recipes.flatMap { it.cuisineTags }.distinct().sorted() }
    val shown = recipes
        .filter { !it.isHidden }
        .filter { anyMeal || slot.accepts(it.mealType) }
        .filter { WeekFiller.matches(it, filter) }
        .filter { r ->
            val q = query.trim()
            Search.matches(r.name, q) || r.cuisineTags.any { Search.matches(it, q) }
        }
        .sortedWith(compareBy<Recipe> { !it.isFavorite }.thenBy { it.mealType.ordinal }.thenBy { it.name.lowercase() })

    ModalBottomSheet(onDismissRequest = onDismiss, sheetState = sheetState) {
        Column(Modifier.fillMaxHeight(0.92f).imePadding()) {
            Column(Modifier.padding(horizontal = 16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(LocalCopy.current.pickTitle(slot), style = MaterialTheme.typography.headlineSmall)
                Text(dateLabel, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                OutlinedTextField(
                    value = query,
                    onValueChange = { query = it },
                    placeholder = { Text("Search by name or cuisine") },
                    leadingIcon = { Icon(Icons.Filled.Search, contentDescription = null) },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                )
                if (onOffPlan != null) {
                    // Not every meal is cooked: these keep the week honest and stay off the shopping list.
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.horizontalScroll(rememberScrollState())) {
                        AssistChip(onClick = { eatingOut = true }, label = { Text("Eating out") })
                        AssistChip(onClick = { onOffPlan(OffPlanChoice(OffPlanKind.LEFTOVERS)) }, label = { Text("Leftovers") })
                        AssistChip(onClick = { onOffPlan(OffPlanChoice(OffPlanKind.SKIP)) }, label = { Text("Skip this meal") })
                    }
                }
            }
            LibraryFilterBar(
                filter = filter,
                cuisines = cuisines,
                onChange = onFilterChange,
                modifier = Modifier.padding(vertical = 4.dp),
                trailing = { FilterChip(selected = anyMeal, onClick = { anyMeal = !anyMeal }, label = { Text("Any meal type") }) },
            )
            HorizontalDivider()
            LazyColumn(contentPadding = PaddingValues(bottom = 24.dp)) {
                items(shown, key = { it.id }) { recipe ->
                    PickerRow(recipe, onPick = { onPick(recipe) }, onFillBatch = { onFillBatch(recipe) })
                }
                if (shown.isEmpty()) {
                    item {
                        Text(
                            "No recipes match. Try another search or turn on \"Any meal type\".",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(16.dp),
                        )
                    }
                }
            }
        }
    }
}

/**
 * "Eating out": just mark it, say where in your own words, or pick a place and one of its better
 * choices so the day's total has rough figures.
 */
@Composable
private fun EatingOutChooser(
    slot: MealSlot,
    dateLabel: String,
    restaurants: List<Restaurant>,
    onBack: () -> Unit,
    onChoose: (OffPlanChoice) -> Unit,
) {
    var placeKey by rememberSaveable { mutableStateOf<String?>(null) }
    var where by rememberSaveable { mutableStateOf("") }
    val place = restaurants.firstOrNull { it.key == placeKey }

    Column(Modifier.fillMaxHeight(0.92f).imePadding()) {
        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(horizontal = 4.dp)) {
            IconButton(onClick = { if (place != null) placeKey = null else onBack() }) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = if (place != null) "Back to places" else "Back to recipes")
            }
            Column {
                Text(place?.name ?: "Eating out", style = MaterialTheme.typography.headlineSmall)
                Text("${slot.label} · $dateLabel", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
        LazyColumn(contentPadding = PaddingValues(bottom = 24.dp)) {
            if (place == null) {
                item {
                    ListItem(
                        modifier = Modifier.clickable { onChoose(OffPlanChoice(OffPlanKind.EATING_OUT)) },
                        headlineContent = { Text("Just mark it as eating out") },
                        supportingContent = { Text("Nothing is added to the day's total.") },
                    )
                }
                item {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                    ) {
                        OutlinedTextField(
                            value = where,
                            onValueChange = { where = it.take(60) },
                            label = { Text("Where or what (optional)") },
                            singleLine = true,
                            modifier = Modifier.weight(1f),
                        )
                        OutlinedButton(
                            onClick = { onChoose(OffPlanChoice(OffPlanKind.EATING_OUT, title = where.trim())) },
                            enabled = where.isNotBlank(),
                        ) { Text("Add") }
                    }
                }
                if (restaurants.isNotEmpty()) {
                    item {
                        Text(
                            "Or pick a place to choose from its better picks",
                            style = MaterialTheme.typography.labelLarge,
                            color = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.padding(start = 16.dp, end = 16.dp, top = 12.dp, bottom = 4.dp),
                        )
                    }
                }
                items(restaurants, key = { it.key }) { r ->
                    ListItem(
                        modifier = Modifier.clickable { placeKey = r.key },
                        headlineContent = { Text(r.name) },
                        supportingContent = { Text(r.kind) },
                    )
                }
            } else {
                item {
                    Text(
                        "Figures are approximate and go towards the day's total. The place's own page under Cook has ordering tips and allergen notes.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp),
                    )
                }
                items(place.picks, key = { it.name }) { pick ->
                    ListItem(
                        modifier = Modifier.clickable {
                            onChoose(OffPlanChoice(OffPlanKind.EATING_OUT, "${place.name}: ${pick.name}", place.key, pick.calories, pick.protein))
                        },
                        headlineContent = { Text(pick.name) },
                        supportingContent = pick.about?.let { about -> { Text(about) } },
                    )
                }
                item {
                    ListItem(
                        modifier = Modifier.clickable { onChoose(OffPlanChoice(OffPlanKind.EATING_OUT, place.name, place.key)) },
                        headlineContent = { Text("Something else at ${place.name}") },
                        supportingContent = { Text("Nothing is added to the day's total.") },
                    )
                }
            }
        }
    }
}

@Composable
private fun PickerRow(recipe: Recipe, onPick: () -> Unit, onFillBatch: () -> Unit) {
    ListItem(
        modifier = Modifier.clickable(onClick = onPick),
        headlineContent = { Text(recipe.name) },
        supportingContent = {
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(
                    listOfNotNull(
                        if (recipe.isFavorite) "♥" else null,
                        recipe.protein?.label,
                        recipe.cuisineTags.joinToString(", ").takeIf { it.isNotBlank() },
                        "Serves ${recipe.servings}",
                    ).joinToString(" · "),
                )
                if (recipe.isMealPrep) Badge("makes ${recipe.slotsPerCook}")
            }
        },
        trailingContent = if (recipe.isMealPrep) {
            {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    OutlinedButton(onClick = onFillBatch) { Text("Fill ${recipe.slotsPerCook}") }
                }
            }
        } else {
            null
        },
    )
}
