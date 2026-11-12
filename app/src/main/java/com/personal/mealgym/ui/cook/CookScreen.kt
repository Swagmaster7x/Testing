package com.personal.mealgym.ui.cook

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.TextButton
import androidx.compose.foundation.layout.Row
import androidx.compose.ui.Alignment
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.personal.mealgym.R
import com.personal.mealgym.data.db.MealType
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.ui.AppNavigator
import com.personal.mealgym.ui.components.AppScaffold
import com.personal.mealgym.ui.AppViewModels
import com.personal.mealgym.domain.Search
import com.personal.mealgym.domain.WeekFiller
import com.personal.mealgym.ui.components.Badge
import com.personal.mealgym.ui.components.LibraryFilterBar
import com.personal.mealgym.ui.components.SectionHeader
import com.personal.mealgym.ui.components.TabTopBar
import com.personal.mealgym.ui.label

@Composable
fun CookScreen(nav: AppNavigator, vm: CookViewModel = viewModel(factory = AppViewModels.Factory)) {
    val ui by vm.ui.collectAsStateWithLifecycle()
    val filter by vm.filter.collectAsStateWithLifecycle()
    var query by rememberSaveable { mutableStateOf("") }
    var type by rememberSaveable { mutableStateOf<MealType?>(null) }
    var showHidden by rememberSaveable { mutableStateOf(false) }
    var showAvoided by rememberSaveable { mutableStateOf(false) }
    val conflicts by vm.conflicts.collectAsStateWithLifecycle()

    AppScaffold(
        topBar = {
            TabTopBar(
                title = "Cook",
                onHistory = nav::history,
                onSettings = nav::settings,
                extraActions = {
                    IconButton(onClick = { nav.editRecipe() }) { Icon(Icons.Filled.Add, contentDescription = "Add a recipe") }
                },
            )
        },
    ) { padding ->
        val state = ui ?: return@AppScaffold
        val q = query.trim()
        val hiddenCount = state.all.count { it.isHidden }
        val filtered = state.all
            .filter { showHidden == it.isHidden }
            .filter { showAvoided == (it.id in conflicts) }
            .filter { type == null || it.mealType == type }
            .filter { WeekFiller.matches(it, filter) }
            .filter { r -> Search.matches(r.name, q) || r.cuisineTags.any { Search.matches(it, q) } }
            .sortedWith(compareBy<Recipe> { !it.isFavorite }.thenBy { it.mealType.ordinal }.thenBy { it.name.lowercase() })
        val cuisines = state.all.flatMap { it.cuisineTags }.distinct().sorted()

        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(padding),
            contentPadding = PaddingValues(bottom = 16.dp),
        ) {
            item {
                FilledTonalButton(
                    onClick = nav::shopping,
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
                ) {
                    Icon(Icons.Filled.ShoppingCart, contentDescription = null, modifier = Modifier.padding(end = 8.dp))
                    Text("Shopping list for this week")
                }
            }
            item {
                OutlinedButton(
                    onClick = nav::cupboard,
                    modifier = Modifier.fillMaxWidth().padding(start = 16.dp, end = 16.dp, top = 8.dp),
                ) {
                    Icon(Icons.Filled.Search, contentDescription = null, modifier = Modifier.padding(end = 8.dp))
                    Text("What can I make from my cupboard?")
                }
            }
            item {
                OutlinedButton(
                    onClick = nav::cravings,
                    modifier = Modifier.fillMaxWidth().padding(start = 16.dp, end = 16.dp, top = 8.dp),
                ) {
                    Icon(painterResource(R.drawable.ic_restaurant), contentDescription = null, modifier = Modifier.padding(end = 8.dp))
                    Text("What are you craving?")
                }
            }
            if (state.thisWeek.isNotEmpty() && q.isEmpty() && type == null) {
                item { SectionHeader("Cooking this week", Modifier.padding(horizontal = 16.dp)) }
                items(state.thisWeek, key = { "week-${it.id}" }) { recipe ->
                    RecipeRow(recipe, onFavorite = { vm.setFavorite(recipe, it) }) { nav.recipe(recipe.id) }
                }
            }
            item { SectionHeader("All recipes", Modifier.padding(horizontal = 16.dp)) }
            item {
                OutlinedTextField(
                    value = query,
                    onValueChange = { query = it },
                    placeholder = { Text("Search by name or cuisine") },
                    leadingIcon = { Icon(Icons.Filled.Search, contentDescription = null) },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
                )
            }
            item {
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    item { FilterChip(selected = type == null, onClick = { type = null }, label = { Text("All") }) }
                    items(MealType.entries.filter { t -> state.all.any { it.mealType == t } }) { t ->
                        FilterChip(selected = type == t, onClick = { type = if (type == t) null else t }, label = { Text(t.label) })
                    }
                    if (hiddenCount > 0) {
                        item {
                            FilterChip(selected = showHidden, onClick = { showHidden = !showHidden }, label = { Text("Show hidden ($hiddenCount)") })
                        }
                    }
                }
            }
            // Recipes with something this person avoids are kept out of the list, and said so plainly.
            if (conflicts.isNotEmpty()) {
                item {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.fillMaxWidth().padding(start = 16.dp, end = 8.dp),
                    ) {
                        Text(
                            if (showAvoided) {
                                "Showing the ${conflicts.size} recipes with something you avoid."
                            } else {
                                "${conflicts.size} recipes with something you avoid are left out."
                            },
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.weight(1f),
                        )
                        TextButton(onClick = { showAvoided = !showAvoided }) { Text(if (showAvoided) "Back to mine" else "Show them") }
                    }
                }
            }
            item { LibraryFilterBar(filter = filter, cuisines = cuisines, onChange = vm::setFilter) }
            items(filtered, key = { "all-${it.id}" }) { recipe ->
                RecipeRow(recipe, onFavorite = { vm.setFavorite(recipe, it) }) { nav.recipe(recipe.id) }
            }
            if (filtered.isEmpty()) {
                item {
                    Text(
                        "No recipes match.",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(16.dp),
                    )
                }
            }
        }
    }
}

@Composable
fun RecipeRow(recipe: Recipe, onFavorite: ((Boolean) -> Unit)? = null, onClick: () -> Unit) {
    ListItem(
        modifier = Modifier.clickable(onClick = onClick),
        headlineContent = { Text(recipe.name) },
        supportingContent = {
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(
                    listOfNotNull(
                        recipe.protein?.label,
                        recipe.cuisineTags.joinToString(", ").takeIf { it.isNotBlank() },
                        recipe.mealType.label,
                        "Serves ${recipe.servings}",
                    ).joinToString(" · "),
                )
                if (recipe.isMealPrep) Badge("makes ${recipe.slotsPerCook}")
            }
        },
        trailingContent = onFavorite?.let { toggle ->
            {
                IconButton(onClick = { toggle(!recipe.isFavorite) }) {
                    Icon(
                        if (recipe.isFavorite) Icons.Filled.Favorite else Icons.Filled.FavoriteBorder,
                        contentDescription = if (recipe.isFavorite) "Unpin from the top" else "Pin to the top",
                        tint = if (recipe.isFavorite) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        },
    )
}
