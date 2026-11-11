@file:OptIn(ExperimentalLayoutApi::class)

package com.personal.mealgym.ui.cook

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.personal.mealgym.data.db.MealType
import com.personal.mealgym.data.db.ProteinTag
import com.personal.mealgym.data.db.StoreSection
import com.personal.mealgym.domain.ShoppingList
import com.personal.mealgym.ui.AppNavigator
import com.personal.mealgym.ui.components.AppButton
import com.personal.mealgym.ui.components.AppScaffold
import com.personal.mealgym.ui.AppViewModels
import com.personal.mealgym.ui.components.DetailTopBar
import com.personal.mealgym.ui.components.SectionHeader
import com.personal.mealgym.ui.label

@Composable
fun RecipeEditScreen(nav: AppNavigator, vm: RecipeEditViewModel = viewModel(factory = AppViewModels.Factory)) {
    val onSaved: (Long) -> Unit = { nav.back() }
    AppScaffold(
        topBar = {
            DetailTopBar(
                title = if (vm.isNew) "New recipe" else "Edit recipe",
                onBack = nav::back,
                actions = { TextButton(onClick = { vm.save(onSaved) }, enabled = vm.canSave) { Text("Save") } },
            )
        },
    ) { padding ->
        if (!vm.loaded) return@AppScaffold
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(padding).imePadding(),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 32.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            item {
                OutlinedTextField(
                    value = vm.name,
                    onValueChange = { vm.name = it },
                    label = { Text("Name") },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
                    modifier = Modifier.fillMaxWidth(),
                )
            }
            item {
                FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    MealType.entries.forEach { t ->
                        FilterChip(selected = vm.mealType == t, onClick = { vm.mealType = t }, label = { Text(t.label) })
                    }
                }
            }
            item {
                Text("Main protein", style = MaterialTheme.typography.labelLarge, modifier = Modifier.padding(top = 4.dp))
                FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    ProteinTag.entries.forEach { t ->
                        FilterChip(
                            selected = vm.protein == t,
                            onClick = { vm.protein = if (vm.protein == t) null else t },
                            label = { Text(t.label) },
                        )
                    }
                }
            }
            item {
                OutlinedTextField(
                    value = vm.cuisineTags,
                    onValueChange = { vm.cuisineTags = it },
                    label = { Text("Cuisine tags, comma-separated") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                )
            }
            item {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = vm.servings,
                        onValueChange = { v -> vm.servings = v.filter { it.isDigit() }.take(2) },
                        label = { Text("Serves") },
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.width(96.dp),
                    )
                    OutlinedTextField(
                        value = vm.servingSize,
                        onValueChange = { vm.servingSize = it },
                        label = { Text("Serving size, e.g. 1 bowl") },
                        singleLine = true,
                        modifier = Modifier.weight(1f),
                    )
                }
            }
            item {
                OutlinedTextField(
                    value = vm.nutrition,
                    onValueChange = { vm.nutrition = it },
                    label = { Text("Nutrition per serving (optional)") },
                    supportingText = { Text("Shown as reference text only. Never added up.") },
                    modifier = Modifier.fillMaxWidth(),
                )
            }
            item {
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
                    Column(Modifier.weight(1f)) {
                        Text("Meal-prep", style = MaterialTheme.typography.bodyLarge)
                        Text(
                            "One cook fills several slots",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                    Switch(checked = vm.isMealPrep, onCheckedChange = { vm.isMealPrep = it })
                }
            }

            item { SectionHeader("Ingredients (for the whole recipe)") }
            itemsIndexed(vm.ingredients, key = { _, f -> "ing-${f.key}" }) { index, form ->
                IngredientEditor(
                    form = form,
                    onChange = { updated -> vm.ingredients[index] = updated },
                    onRemove = { vm.ingredients.removeAt(index) },
                )
            }
            item {
                TextButton(onClick = { vm.ingredients += IngredientForm() }) {
                    Icon(Icons.Filled.Add, contentDescription = null, modifier = Modifier.padding(end = 6.dp))
                    Text("Add ingredient")
                }
            }

            item { SectionHeader("Steps") }
            itemsIndexed(vm.steps, key = { _, s -> "step-${s.key}" }) { index, step ->
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("${index + 1}.", modifier = Modifier.width(28.dp), color = MaterialTheme.colorScheme.primary)
                    OutlinedTextField(
                        value = step.text,
                        onValueChange = { vm.steps[index] = step.copy(text = it) },
                        keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
                        modifier = Modifier.weight(1f),
                    )
                    IconButton(onClick = { vm.steps.removeAt(index) }) {
                        Icon(Icons.Filled.Close, contentDescription = "Remove step")
                    }
                }
            }
            item {
                TextButton(onClick = { vm.steps += StepForm() }) {
                    Icon(Icons.Filled.Add, contentDescription = null, modifier = Modifier.padding(end = 6.dp))
                    Text("Add step")
                }
            }

            item { SectionHeader("Bulk it up") }
            item {
                OutlinedTextField(
                    value = vm.volumeTip,
                    onValueChange = { vm.volumeTip = it },
                    label = { Text("Big-bowl build (optional)") },
                    modifier = Modifier.fillMaxWidth(),
                )
            }
            item {
                AppButton(onClick = { vm.save(onSaved) }, enabled = vm.canSave, modifier = Modifier.fillMaxWidth().padding(top = 16.dp)) {
                    Text("Save recipe")
                }
            }
        }
    }
}

@Composable
private fun IngredientEditor(form: IngredientForm, onChange: (IngredientForm) -> Unit, onRemove: () -> Unit) {
    OutlinedCard(Modifier.fillMaxWidth()) {
        Column(Modifier.padding(8.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                OutlinedTextField(
                    value = form.quantity,
                    onValueChange = { onChange(form.copy(quantity = it)) },
                    label = { Text("Qty") },
                    singleLine = true,
                    modifier = Modifier.width(72.dp),
                )
                OutlinedTextField(
                    value = form.unit,
                    onValueChange = { onChange(form.copy(unit = it)) },
                    label = { Text("Unit") },
                    singleLine = true,
                    modifier = Modifier.width(88.dp),
                )
                OutlinedTextField(
                    value = form.name,
                    onValueChange = { onChange(form.copy(name = it)) },
                    label = { Text("Ingredient") },
                    singleLine = true,
                    modifier = Modifier.weight(1f),
                )
            }
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                OutlinedTextField(
                    value = form.note,
                    onValueChange = { onChange(form.copy(note = it)) },
                    label = { Text("Note") },
                    singleLine = true,
                    modifier = Modifier.weight(1f),
                )
                SectionPicker(form.section) { onChange(form.copy(section = it)) }
                IconButton(onClick = onRemove) { Icon(Icons.Filled.Close, contentDescription = "Remove ingredient") }
            }
        }
    }
}

@Composable
private fun SectionPicker(section: StoreSection, onPick: (StoreSection) -> Unit) {
    var open by remember { mutableStateOf(false) }
    Box {
        OutlinedButton(onClick = { open = true }, contentPadding = PaddingValues(horizontal = 10.dp)) {
            Text(section.shortLabel)
        }
        DropdownMenu(expanded = open, onDismissRequest = { open = false }) {
            ShoppingList.sectionOrder.forEach { s ->
                DropdownMenuItem(text = { Text(s.label) }, onClick = { onPick(s); open = false })
            }
        }
    }
}

private val StoreSection.shortLabel: String
    get() = when (this) {
        StoreSection.PROTEIN -> "Protein"
        StoreSection.PRODUCE_FROZEN -> "Produce"
        StoreSection.CARBS -> "Carbs"
        StoreSection.PANTRY -> "Pantry"
    }
