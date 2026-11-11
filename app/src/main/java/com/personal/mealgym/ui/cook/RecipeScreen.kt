@file:OptIn(ExperimentalLayoutApi::class)

package com.personal.mealgym.ui.cook

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.personal.mealgym.ui.AppNavigator
import com.personal.mealgym.ui.components.AppScaffold
import com.personal.mealgym.ui.AppViewModels
import com.personal.mealgym.ui.components.Badge
import com.personal.mealgym.ui.components.ConfirmDialog
import com.personal.mealgym.ui.components.DetailTopBar
import com.personal.mealgym.ui.components.EmptyState
import com.personal.mealgym.ui.components.SectionHeader
import com.personal.mealgym.ui.displayLine
import com.personal.mealgym.ui.label

const val HALF_PLATE_TIP = "Serve half first. Seconds are the other half."

@Composable
fun RecipeScreen(nav: AppNavigator, vm: RecipeViewModel = viewModel(factory = AppViewModels.Factory)) {
    val state by vm.state.collectAsStateWithLifecycle()
    var confirmDelete by rememberSaveable { mutableStateOf(false) }
    val loaded = state as? RecipeState.Loaded

    AppScaffold(
        topBar = {
            DetailTopBar(
                title = "Recipe",
                onBack = nav::back,
                actions = {
                    if (loaded != null) {
                        IconButton(onClick = { nav.editRecipe(loaded.ui.recipe.id) }) {
                            Icon(Icons.Filled.Edit, contentDescription = "Edit recipe")
                        }
                        IconButton(onClick = { confirmDelete = true }) {
                            Icon(Icons.Filled.Delete, contentDescription = "Delete recipe")
                        }
                    }
                },
            )
        },
    ) { padding ->
        when (val s = state) {
            RecipeState.Loading -> Unit
            RecipeState.Missing -> EmptyState("Recipe not found", "It may have been deleted.", Modifier.padding(padding))
            is RecipeState.Loaded -> RecipeContent(
                ui = s.ui,
                padding = padding,
                onCook = { nav.cooking(s.ui.recipe.id) },
                onShopping = nav::shopping,
            )
        }
    }

    if (confirmDelete && loaded != null) {
        ConfirmDialog(
            title = "Delete this recipe?",
            body = "\"${loaded.ui.recipe.name}\" will be removed, along with any planned meals that use it.",
            confirmLabel = "Delete",
            onConfirm = {
                confirmDelete = false
                vm.delete(onDone = nav::back)
            },
            onDismiss = { confirmDelete = false },
        )
    }
}

@Composable
private fun RecipeContent(ui: RecipeUi, padding: PaddingValues, onCook: () -> Unit, onShopping: () -> Unit) {
    val recipe = ui.recipe
    var bulkOpen by rememberSaveable { mutableStateOf(false) }
    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(padding),
        contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 32.dp),
    ) {
        if (ui.showHalfPlateTip) {
            item {
                Surface(
                    color = MaterialTheme.colorScheme.tertiaryContainer,
                    contentColor = MaterialTheme.colorScheme.onTertiaryContainer,
                    shape = MaterialTheme.shapes.medium,
                    modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp),
                ) {
                    Text(HALF_PLATE_TIP, style = MaterialTheme.typography.bodyMedium, modifier = Modifier.padding(12.dp))
                }
            }
        }
        item {
            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text(recipe.name, style = MaterialTheme.typography.headlineSmall)
                FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Badge(recipe.mealType.label)
                    recipe.cuisineTags.forEach { Badge(it) }
                    if (recipe.isMealPrep) Badge("Meal-prep · makes ${recipe.slotsPerCook}")
                }
                Text(
                    listOf("Serves ${recipe.servings}", recipe.servingSizeText).filter { it.isNotBlank() }.joinToString(" · "),
                    style = MaterialTheme.typography.bodyLarge,
                )
                if (ui.showNutrition && !recipe.nutritionText.isNullOrBlank()) {
                    Text(
                        "Per serving, approx.: ${recipe.nutritionText}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(top = 8.dp)) {
                    Button(onClick = onCook, enabled = recipe.steps.isNotEmpty(), modifier = Modifier.weight(1f)) {
                        Icon(Icons.Filled.PlayArrow, contentDescription = null, modifier = Modifier.padding(end = 6.dp))
                        Text("Start cooking")
                    }
                    OutlinedButton(onClick = onShopping, modifier = Modifier.weight(1f)) {
                        Icon(Icons.Filled.ShoppingCart, contentDescription = null, modifier = Modifier.padding(end = 6.dp))
                        Text("Shopping list")
                    }
                }
            }
        }
        item { SectionHeader("Ingredients") }
        itemsIndexed(ui.ingredients, key = { _, i -> "ing-${i.id}" }) { _, ingredient ->
            Row(Modifier.padding(vertical = 3.dp)) {
                Text("•", modifier = Modifier.width(16.dp), color = MaterialTheme.colorScheme.primary)
                Text(ingredient.displayLine(), style = MaterialTheme.typography.bodyLarge)
            }
        }
        item { SectionHeader("Steps") }
        itemsIndexed(recipe.steps, key = { index, _ -> "step-$index" }) { index, step ->
            Row(Modifier.padding(vertical = 4.dp)) {
                Text(
                    "${index + 1}.",
                    modifier = Modifier.width(28.dp),
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.primary,
                    style = MaterialTheme.typography.bodyLarge,
                )
                Text(step, style = MaterialTheme.typography.bodyLarge)
            }
        }
        item {
            OutlinedCard(Modifier.fillMaxWidth().padding(top = 20.dp)) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth().clickable { bulkOpen = !bulkOpen }.padding(16.dp),
                ) {
                    Column(Modifier.weight(1f)) {
                        Text("Bulk it up", style = MaterialTheme.typography.titleMedium)
                        Text(
                            "Free-volume foods for a bigger bowl",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                    Icon(
                        if (bulkOpen) Icons.Filled.KeyboardArrowUp else Icons.Filled.KeyboardArrowDown,
                        contentDescription = if (bulkOpen) "Collapse" else "Expand",
                    )
                }
                AnimatedVisibility(bulkOpen) {
                    Column(Modifier.padding(start = 16.dp, end = 16.dp, bottom = 16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        if (!recipe.volumeTip.isNullOrBlank()) {
                            Text("Big-bowl build", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.primary)
                            Text(recipe.volumeTip, style = MaterialTheme.typography.bodyMedium)
                        }
                        Text("Free-volume foods", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.primary)
                        Text(ui.freeVolumeFoods.joinToString(", "), style = MaterialTheme.typography.bodyMedium)
                    }
                }
            }
        }
    }
}
