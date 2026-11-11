@file:OptIn(ExperimentalMaterial3Api::class)

package com.personal.mealgym.ui.plan

import androidx.compose.foundation.clickable
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
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
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
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.ui.LocalCopy
import com.personal.mealgym.ui.accepts
import com.personal.mealgym.ui.components.Badge
import com.personal.mealgym.ui.label

/** What the picker is filling. */
data class PickTarget(val date: java.time.LocalDate, val slot: MealSlot)

/**
 * "Pick your breakfast / lunch / dinner": recipes for that slot, searchable by name or cuisine.
 * Meal-prep recipes offer to fill several slots at once.
 */
@Composable
fun RecipePickerSheet(
    slot: MealSlot,
    dateLabel: String,
    recipes: List<Recipe>,
    onPick: (Recipe) -> Unit,
    onFillBatch: (Recipe) -> Unit,
    onDismiss: () -> Unit,
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    var query by rememberSaveable { mutableStateOf("") }
    var cuisine by rememberSaveable { mutableStateOf<String?>(null) }
    var anyMeal by rememberSaveable { mutableStateOf(false) }

    val cuisines = remember(recipes) { recipes.flatMap { it.cuisineTags }.distinct().sorted() }
    val shown = recipes
        .filter { anyMeal || slot.accepts(it.mealType) }
        .filter { cuisine == null || cuisine in it.cuisineTags }
        .filter { r ->
            val q = query.trim()
            q.isEmpty() || r.name.contains(q, ignoreCase = true) || r.cuisineTags.any { it.contains(q, ignoreCase = true) }
        }
        .sortedWith(compareBy<Recipe> { it.mealType.ordinal }.thenBy { it.name.lowercase() })

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
            }
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                item {
                    FilterChip(selected = cuisine == null, onClick = { cuisine = null }, label = { Text("All cuisines") })
                }
                items(cuisines) { tag ->
                    FilterChip(
                        selected = cuisine == tag,
                        onClick = { cuisine = if (cuisine == tag) null else tag },
                        label = { Text(tag) },
                    )
                }
                item {
                    FilterChip(selected = anyMeal, onClick = { anyMeal = !anyMeal }, label = { Text("Any meal type") })
                }
            }
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

@Composable
private fun PickerRow(recipe: Recipe, onPick: () -> Unit, onFillBatch: () -> Unit) {
    ListItem(
        modifier = Modifier.clickable(onClick = onPick),
        headlineContent = { Text(recipe.name) },
        supportingContent = {
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(
                    listOfNotNull(
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
