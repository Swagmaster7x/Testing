package com.personal.mealgym.ui.cook

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.personal.mealgym.data.db.MealType
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.ui.AppNavigator
import com.personal.mealgym.ui.AppViewModels
import com.personal.mealgym.ui.components.Badge
import com.personal.mealgym.ui.components.SectionHeader
import com.personal.mealgym.ui.components.TabTopBar
import com.personal.mealgym.ui.label

@Composable
fun CookScreen(nav: AppNavigator, vm: CookViewModel = viewModel(factory = AppViewModels.Factory)) {
    val ui by vm.ui.collectAsStateWithLifecycle()
    var query by rememberSaveable { mutableStateOf("") }
    var type by rememberSaveable { mutableStateOf<MealType?>(null) }

    Scaffold(
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
        val state = ui ?: return@Scaffold
        val q = query.trim()
        val filtered = state.all
            .filter { type == null || it.mealType == type }
            .filter { r -> q.isEmpty() || r.name.contains(q, true) || r.cuisineTags.any { it.contains(q, true) } }
            .sortedWith(compareBy<Recipe> { it.mealType.ordinal }.thenBy { it.name.lowercase() })

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
            if (state.thisWeek.isNotEmpty() && q.isEmpty() && type == null) {
                item { SectionHeader("Cooking this week", Modifier.padding(horizontal = 16.dp)) }
                items(state.thisWeek, key = { "week-${it.id}" }) { recipe -> RecipeRow(recipe) { nav.recipe(recipe.id) } }
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
                    items(MealType.entries) { t ->
                        FilterChip(selected = type == t, onClick = { type = if (type == t) null else t }, label = { Text(t.label) })
                    }
                }
            }
            items(filtered, key = { "all-${it.id}" }) { recipe -> RecipeRow(recipe) { nav.recipe(recipe.id) } }
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
fun RecipeRow(recipe: Recipe, onClick: () -> Unit) {
    ListItem(
        modifier = Modifier.clickable(onClick = onClick),
        headlineContent = { Text(recipe.name) },
        supportingContent = {
            Text(
                listOfNotNull(
                    recipe.cuisineTags.joinToString(", ").takeIf { it.isNotBlank() },
                    recipe.mealType.label,
                    "Serves ${recipe.servings}",
                ).joinToString(" · "),
            )
        },
        trailingContent = if (recipe.isMealPrep) {
            { Badge("makes ${recipe.slotsPerCook}") }
        } else {
            null
        },
    )
}
