@file:OptIn(ExperimentalLayoutApi::class)

package com.personal.mealgym.ui.cook

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.Icon
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.Surface
import androidx.compose.material3.TextButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.personal.mealgym.R
import com.personal.mealgym.data.db.MealType
import com.personal.mealgym.BuildConfig
import com.personal.mealgym.domain.Foods
import com.personal.mealgym.domain.Portions
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.ui.AppNavigator
import com.personal.mealgym.ui.components.AppButton
import com.personal.mealgym.ui.components.AppScaffold
import com.personal.mealgym.ui.AppViewModels
import com.personal.mealgym.ui.ShowMessages
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
    var menu by remember { mutableStateOf(false) }
    val loaded = state as? RecipeState.Loaded
    val snackbar = remember { SnackbarHostState() }
    vm.ShowMessages(snackbar)

    AppScaffold(
        topBar = {
            DetailTopBar(
                title = "Recipe",
                onBack = nav::back,
                actions = {
                    if (loaded != null) {
                        val r = loaded.ui.recipe
                        IconButton(onClick = { vm.setFavorite(!r.isFavorite) }) {
                            Icon(
                                if (r.isFavorite) Icons.Filled.Favorite else Icons.Filled.FavoriteBorder,
                                contentDescription = if (r.isFavorite) "Unpin from the top" else "Pin to the top",
                                tint = if (r.isFavorite) MaterialTheme.colorScheme.primary else LocalContentColor.current,
                            )
                        }
                        IconButton(onClick = { nav.editRecipe(r.id) }) {
                            Icon(Icons.Filled.Edit, contentDescription = "Edit recipe")
                        }
                        Box {
                            IconButton(onClick = { menu = true }) { Icon(Icons.Filled.MoreVert, contentDescription = "More") }
                            DropdownMenu(expanded = menu, onDismissRequest = { menu = false }) {
                                DropdownMenuItem(
                                    text = { Text(if (r.isHidden) "Show again" else "Hide for now") },
                                    onClick = { menu = false; vm.setHidden(!r.isHidden) },
                                )
                                DropdownMenuItem(
                                    text = { Text("Delete") },
                                    leadingIcon = { Icon(Icons.Filled.Delete, contentDescription = null) },
                                    onClick = { menu = false; confirmDelete = true },
                                )
                            }
                        }
                    }
                },
            )
        },
        snackbarHost = { SnackbarHost(snackbar) },
    ) { padding ->
        when (val s = state) {
            RecipeState.Loading -> Unit
            RecipeState.Missing -> EmptyState("Recipe not found", "It may have been deleted.", Modifier.padding(padding))
            is RecipeState.Loaded -> RecipeContent(
                ui = s.ui,
                padding = padding,
                onCook = { nav.cooking(s.ui.recipe.id) },
                onShopping = nav::shopping,
                onSwap = { index -> vm.chooseSwap(index) { id -> nav.recipe(id) } },
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
private fun RecipeContent(
    ui: RecipeUi,
    padding: PaddingValues,
    onCook: () -> Unit,
    onShopping: () -> Unit,
    onSwap: (Int?) -> Unit,
) {
    val recipe = ui.recipe
    var bulkOpen by rememberSaveable { mutableStateOf(false) }
    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(padding),
        contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 32.dp),
    ) {
        if (ui.conflicts.isNotEmpty()) {
            item {
                Surface(
                    color = MaterialTheme.colorScheme.errorContainer,
                    contentColor = MaterialTheme.colorScheme.onErrorContainer,
                    shape = MaterialTheme.shapes.medium,
                    modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp),
                ) {
                    Text(
                        "Contains ${Foods.describe(ui.conflicts)}, which you asked to avoid.",
                        style = MaterialTheme.typography.bodyMedium,
                        modifier = Modifier.padding(12.dp),
                    )
                }
            }
        }
        if (ui.showHalfPlateTip && !ui.easierToFinish) {
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
                        if (ui.isOrderOnly) recipe.nutritionText else "Per serving, approx.: ${recipe.nutritionText}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                val allergens = ui.contains.filter { it.isAllergen }
                if (BuildConfig.STORE && allergens.isNotEmpty()) {
                    Text(
                        "Contains ${Foods.describe(allergens)}, going by the ingredient names. Always check labels.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                if (ui.portion != 1.0 && recipe.mealType in portionTypes) {
                    Text(
                        "Your portion: about ${Portions.words(ui.portion)}.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.primary,
                    )
                }
                if (!ui.isOrderOnly) Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(top = 8.dp)) {
                    AppButton(onClick = onCook, enabled = recipe.steps.isNotEmpty(), modifier = Modifier.weight(1f)) {
                        Icon(Icons.Filled.PlayArrow, contentDescription = null, modifier = Modifier.padding(end = 6.dp))
                        Text("Start cooking")
                    }
                    OutlinedButton(onClick = onShopping, modifier = Modifier.weight(1f)) {
                        Icon(Icons.Filled.ShoppingCart, contentDescription = null, modifier = Modifier.padding(end = 6.dp))
                        Text("Shopping list")
                    }
                }
                if (recipe.proteinSwaps.isNotEmpty()) SwapPicker(recipe, onSwap)
            }
        }
        if (ui.ingredients.isNotEmpty()) item { SectionHeader("Ingredients") }
        itemsIndexed(ui.ingredients, key = { _, i -> "ing-${i.id}" }) { _, ingredient ->
            Row(Modifier.padding(vertical = 3.dp)) {
                Text("•", modifier = Modifier.width(16.dp), color = MaterialTheme.colorScheme.primary)
                Text(ingredient.displayLine(), style = MaterialTheme.typography.bodyLarge)
            }
        }
        if (recipe.steps.isNotEmpty()) item { SectionHeader("Steps") }
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
        if (ui.easierToFinish) {
            if (!ui.isOrderOnly && ui.easierTips.isNotEmpty()) item { EasierToFinishCard(recipe.id, ui.easierTips) }
        } else item {
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

private val portionTypes = setOf(MealType.LUNCH, MealType.DINNER, MealType.SOUP)

/** Ashley's Side: one tip for this recipe, the rest a tap away. */
@Composable
private fun EasierToFinishCard(recipeId: Long, tips: List<String>) {
    var open by rememberSaveable { mutableStateOf(false) }
    val tip = tips[(recipeId % tips.size).toInt()]
    OutlinedCard(Modifier.fillMaxWidth().padding(top = 20.dp)) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(painterResource(R.drawable.ic_heart), contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(20.dp))
                Text("Make it easier to finish", style = MaterialTheme.typography.titleMedium, modifier = Modifier.padding(start = 8.dp))
            }
            Text(tip, style = MaterialTheme.typography.bodyMedium)
            if (open) {
                tips.filter { it != tip }.forEach { Text("• $it", style = MaterialTheme.typography.bodyMedium) }
            } else {
                TextButton(onClick = { open = true }, contentPadding = PaddingValues(0.dp)) { Text("More tips") }
            }
        }
    }
}

/** "Make it with...": swap the main protein, or jump to the matching recipe. */
@Composable
private fun SwapPicker(recipe: Recipe, onSwap: (Int?) -> Unit) {
    var open by remember { mutableStateOf(false) }
    val active = recipe.activeSwap?.let { recipe.proteinSwaps.getOrNull(it) }
    Column(Modifier.padding(top = 4.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
        if (active != null) {
            Surface(
                color = MaterialTheme.colorScheme.secondaryContainer,
                contentColor = MaterialTheme.colorScheme.onSecondaryContainer,
                shape = MaterialTheme.shapes.medium,
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text(
                    listOfNotNull("Made with ${active.label.lowercase()}.", active.note).joinToString(" "),
                    style = MaterialTheme.typography.bodyMedium,
                    modifier = Modifier.padding(12.dp),
                )
            }
        }
        Box {
            OutlinedButton(onClick = { open = true }) {
                Text(if (active == null) "Make it with..." else "Make it with... (${active.label})")
            }
            DropdownMenu(expanded = open, onDismissRequest = { open = false }) {
                DropdownMenuItem(
                    text = { Text("The original" + (recipe.protein?.let { " (${it.label.lowercase()})" } ?: "")) },
                    onClick = { open = false; onSwap(null) },
                )
                recipe.proteinSwaps.forEachIndexed { index, swap ->
                    DropdownMenuItem(
                        text = { Text(if (swap.useRecipeKey != null) "${swap.label} (opens that recipe)" else swap.label) },
                        onClick = { open = false; onSwap(index) },
                    )
                }
            }
        }
    }
}
