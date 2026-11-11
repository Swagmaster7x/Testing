package com.personal.mealgym.ui.cook

import android.content.Intent
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.Checkbox
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.domain.ShoppingItem
import com.personal.mealgym.ui.AppNavigator
import com.personal.mealgym.ui.AppViewModels
import com.personal.mealgym.ui.components.DetailTopBar
import com.personal.mealgym.ui.components.EmptyState
import com.personal.mealgym.ui.components.SectionHeader
import com.personal.mealgym.ui.label

@Composable
fun ShoppingListScreen(nav: AppNavigator, vm: ShoppingViewModel = viewModel(factory = AppViewModels.Factory)) {
    val week by vm.ui.collectAsStateWithLifecycle()
    val offset by vm.weekOffset.collectAsStateWithLifecycle()
    val context = LocalContext.current

    Scaffold(
        topBar = {
            DetailTopBar(
                title = "Shopping list",
                onBack = nav::back,
                actions = {
                    val w = week
                    IconButton(
                        onClick = {
                            if (w != null) {
                                val send = Intent(Intent.ACTION_SEND)
                                    .setType("text/plain")
                                    .putExtra(Intent.EXTRA_TEXT, ShoppingViewModel.shareText(w))
                                context.startActivity(Intent.createChooser(send, "Share shopping list"))
                            }
                        },
                        enabled = w != null && w.result.sections.isNotEmpty(),
                    ) { Icon(Icons.Filled.Share, contentDescription = "Share as text") }
                },
            )
        },
    ) { padding ->
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(padding),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 32.dp),
        ) {
            item {
                SingleChoiceSegmentedButtonRow(Modifier.fillMaxWidth()) {
                    listOf("This week", "Next week").forEachIndexed { index, label ->
                        SegmentedButton(
                            selected = offset == index.toLong(),
                            onClick = { vm.setWeekOffset(index.toLong()) },
                            shape = SegmentedButtonDefaults.itemShape(index, 2),
                        ) { Text(label) }
                    }
                }
            }
            val w = week ?: return@LazyColumn
            item {
                Text(
                    "Week of ${Dates.weekLabel(w.weekStart)}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(top = 8.dp),
                )
            }
            if (w.result.sections.isEmpty()) {
                item {
                    EmptyState(
                        title = "Nothing to buy yet",
                        body = "Plan some meals for this week and the list builds itself.",
                    )
                }
            }
            w.result.sections.forEach { section ->
                item(key = "h-${section.section}") { SectionHeader(section.section.label) }
                items(section.items, key = { "i-${it.key}" }) { item ->
                    val checked = item.key in w.checkedKeys
                    ShoppingRow(item, checked) { vm.toggle(w.weekStart, item.key, !checked) }
                }
            }
            if (w.result.skippedAlwaysHave.isNotEmpty()) {
                item {
                    Column(Modifier.padding(top = 20.dp)) {
                        Text("Not listed (you always have these)", style = MaterialTheme.typography.labelLarge)
                        Text(
                            w.result.skippedAlwaysHave.joinToString(", "),
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                        TextButton(onClick = nav::settings, contentPadding = PaddingValues(0.dp)) {
                            Text("Change in Settings")
                        }
                    }
                }
            }
            if (w.checkedKeys.isNotEmpty()) {
                item {
                    TextButton(onClick = { vm.uncheckAll(w.weekStart) }) { Text("Untick everything") }
                }
            }
        }
    }
}

@Composable
private fun ShoppingRow(item: ShoppingItem, checked: Boolean, onToggle: () -> Unit) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.fillMaxWidth().clickable(onClick = onToggle).padding(vertical = 4.dp),
    ) {
        Checkbox(checked = checked, onCheckedChange = null, modifier = Modifier.padding(end = 12.dp))
        Column(Modifier.weight(1f)) {
            Text(
                item.name,
                style = MaterialTheme.typography.bodyLarge,
                textDecoration = if (checked) TextDecoration.LineThrough else null,
                color = if (checked) MaterialTheme.colorScheme.onSurfaceVariant else MaterialTheme.colorScheme.onSurface,
            )
            Text(
                item.recipeNames.joinToString(", "),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
        if (item.amountText.isNotBlank()) {
            Text(
                item.amountText,
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier.padding(start = 12.dp),
                color = if (checked) MaterialTheme.colorScheme.onSurfaceVariant else MaterialTheme.colorScheme.onSurface,
            )
        }
    }
}
