package com.personal.mealgym.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.personal.mealgym.data.LibraryFilter
import com.personal.mealgym.data.db.ProteinTag
import com.personal.mealgym.ui.label

/**
 * Filters for the recipe library: "Not chicken" (stays on until turned off), protein and
 * cuisine. The same filters drive the picker, the Cook list and "Fill my week".
 */
@Composable
fun LibraryFilterBar(
    filter: LibraryFilter,
    cuisines: List<String>,
    onChange: (LibraryFilter) -> Unit,
    modifier: Modifier = Modifier,
    trailing: @Composable () -> Unit = {},
) {
    Column(modifier, verticalArrangement = Arrangement.spacedBy(0.dp)) {
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 4.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            item {
                FilterChip(
                    selected = filter.notChicken,
                    onClick = { onChange(filter.copy(notChicken = !filter.notChicken, protein = filter.protein.takeUnless { it == ProteinTag.CHICKEN })) },
                    label = { Text("Not chicken") },
                )
            }
            items(ProteinTag.entries.filter { !(filter.notChicken && it == ProteinTag.CHICKEN) }) { tag ->
                FilterChip(
                    selected = filter.protein == tag,
                    onClick = { onChange(filter.copy(protein = if (filter.protein == tag) null else tag)) },
                    label = { Text(tag.label) },
                )
            }
        }
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 4.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            item {
                FilterChip(selected = filter.cuisine == null, onClick = { onChange(filter.copy(cuisine = null)) }, label = { Text("All cuisines") })
            }
            items(cuisines) { tag ->
                FilterChip(
                    selected = filter.cuisine == tag,
                    onClick = { onChange(filter.copy(cuisine = if (filter.cuisine == tag) null else tag)) },
                    label = { Text(tag) },
                )
            }
            item { trailing() }
        }
    }
}
