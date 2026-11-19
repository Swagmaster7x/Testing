@file:OptIn(ExperimentalMaterial3Api::class)

package com.personal.aide.ui.knowledge

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.personal.aide.AppContainer
import com.personal.aide.data.WorkProfile
import com.personal.aide.data.db.KnowledgeEntity
import com.personal.aide.data.db.KnowledgeOrigin
import com.personal.aide.data.db.KnowledgeType
import com.personal.aide.domain.Retrieval
import com.personal.aide.domain.plural
import com.personal.aide.ui.components.AideCard
import com.personal.aide.ui.components.AideIcons
import com.personal.aide.ui.components.EmptyState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn

data class KnowledgeState(
    val loaded: Boolean = false,
    val profile: WorkProfile = WorkProfile(),
    val query: String = "",
    val filter: KnowledgeType? = null,
    val entries: List<KnowledgeEntity> = emptyList(),
    val counts: Map<KnowledgeType, Int> = emptyMap(),
    val total: Int = 0,
)

class KnowledgeViewModel(container: AppContainer) : ViewModel() {
    private val query = MutableStateFlow("")
    private val filter = MutableStateFlow<KnowledgeType?>(null)

    val state: StateFlow<KnowledgeState> = combine(
        container.db.knowledge().observeAll(),
        container.settings.profile,
        query,
        filter,
    ) { entries, profile, query, filter ->
        val typed = if (filter == null) entries else entries.filter { it.type == filter }
        val shown = if (query.isBlank()) {
            typed
        } else {
            val ranked = Retrieval.rank(query, typed.map { Retrieval.Doc(it, it.title, it.content) }).map { it.item }
            (typed.filter { it.title.contains(query.trim(), ignoreCase = true) } + ranked).distinctBy { it.id }
        }
        KnowledgeState(
            loaded = true,
            profile = profile,
            query = query,
            filter = filter,
            entries = shown,
            counts = entries.groupingBy { it.type }.eachCount(),
            total = entries.size,
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), KnowledgeState())

    fun search(text: String) {
        query.value = text
    }

    fun filter(type: KnowledgeType?) {
        filter.value = type
    }
}

fun KnowledgeType.icon(): ImageVector = when (this) {
    KnowledgeType.PERSON -> Icons.Filled.Person
    KnowledgeType.PROJECT -> AideIcons.Folder
    KnowledgeType.TERM -> AideIcons.Label
    KnowledgeType.DECISION -> AideIcons.Gavel
    KnowledgeType.PROCESS -> AideIcons.Loop
    KnowledgeType.ORG -> AideIcons.Building
    KnowledgeType.FACT -> AideIcons.Bulb
}

fun originLabel(entry: KnowledgeEntity): String = when (entry.origin) {
    KnowledgeOrigin.MEETING -> when (val count = entry.sourceMeetingIds.size) {
        0, 1 -> "From a meeting"
        else -> "From $count meetings"
    }
    KnowledgeOrigin.ONBOARDING -> "From your interview"
    KnowledgeOrigin.ANSWER -> "From your answer"
    KnowledgeOrigin.CHAT -> "From a conversation"
    KnowledgeOrigin.MANUAL -> "Added by you"
}

@Composable
fun KnowledgeScreen(
    state: KnowledgeState,
    onSearch: (String) -> Unit,
    onFilter: (KnowledgeType?) -> Unit,
    onOpen: (Long) -> Unit,
    onAdd: () -> Unit,
    onProfile: () -> Unit,
    onAsk: () -> Unit,
    onOpenPerson: (String) -> Unit = {},
) {
    Scaffold(
        contentWindowInsets = WindowInsets(0),
        topBar = {
            TopAppBar(
                title = { Text("Knowledge") },
                actions = { IconButton(onClick = onAsk) { Icon(AideIcons.Sparkle, contentDescription = "Ask Aide") } },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background),
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = onAdd, containerColor = MaterialTheme.colorScheme.primary, contentColor = MaterialTheme.colorScheme.onPrimary) {
                Icon(Icons.Filled.Add, contentDescription = "Add something Aide should know")
            }
        },
    ) { padding ->
        LazyColumn(
            Modifier.fillMaxSize().padding(padding),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 4.dp, bottom = 96.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            item(key = "profile") { ProfileCard(state.profile, onProfile) }
            if (state.total == 0 && state.loaded) {
                item(key = "empty") {
                    EmptyState(
                        icon = AideIcons.Knowledge,
                        title = "Aide's memory starts here",
                        body = "After each meeting Aide saves what is worth remembering: who people are, what projects are about, what acronyms mean, what was decided. You can add things yourself too.",
                    )
                }
                return@LazyColumn
            }
            item(key = "search") {
                OutlinedTextField(
                    value = state.query,
                    onValueChange = onSearch,
                    placeholder = { Text("Search what Aide knows") },
                    leadingIcon = { Icon(Icons.Filled.Search, contentDescription = null) },
                    singleLine = true,
                    shape = MaterialTheme.shapes.extraLarge,
                    modifier = Modifier.fillMaxWidth(),
                )
            }
            item(key = "filters") {
                Row(Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    FilterChip(selected = state.filter == null, onClick = { onFilter(null) }, label = { Text("All (${state.total})") })
                    for (type in KnowledgeType.entries) {
                        val count = state.counts[type] ?: 0
                        if (count == 0) continue
                        FilterChip(selected = state.filter == type, onClick = { onFilter(type) }, label = { Text("${type.plural()} ($count)") })
                    }
                }
            }
            if (state.entries.isEmpty()) {
                item(key = "none") {
                    Text("Nothing matches.", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.padding(16.dp))
                }
            }
            items(state.entries, key = { it.id }) { entry -> EntryCard(entry) {
                    // A person has a page of their own, with what is open between you; the entry is edited from there.
                    if (entry.type == KnowledgeType.PERSON) onOpenPerson(entry.title) else onOpen(entry.id)
                } }
        }
    }
}

@Composable
private fun ProfileCard(profile: WorkProfile, onOpen: () -> Unit) {
    AideCard(onClick = onOpen, container = MaterialTheme.colorScheme.primaryContainer) {
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text("Your work profile", style = MaterialTheme.typography.titleSmall, color = MaterialTheme.colorScheme.onPrimaryContainer)
            val headline = listOf(profile.name, profile.role).filter { it.isNotBlank() }.joinToString(", ")
            val place = listOf(profile.department, profile.company, profile.industry).filter { it.isNotBlank() }.joinToString(" · ")
            Text(
                headline.ifBlank { "Tell Aide about your job" },
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onPrimaryContainer,
            )
            if (place.isNotBlank()) Text(place, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onPrimaryContainer)
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                LinearProgressIndicator(
                    progress = { profile.completeness() },
                    modifier = Modifier.weight(1f),
                    color = MaterialTheme.colorScheme.primary,
                    trackColor = MaterialTheme.colorScheme.surfaceContainerLowest,
                )
                Text(
                    "${profile.filledAreas()} of ${WorkProfile.AREAS} areas",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onPrimaryContainer,
                )
            }
        }
    }
}

@Composable
private fun EntryCard(entry: KnowledgeEntity, onClick: () -> Unit) {
    AideCard(onClick = onClick) {
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Box(
                Modifier.size(38.dp).clip(CircleShape).background(MaterialTheme.colorScheme.secondaryContainer),
                contentAlignment = Alignment.Center,
            ) {
                Icon(entry.type.icon(), contentDescription = null, tint = MaterialTheme.colorScheme.onSecondaryContainer, modifier = Modifier.size(20.dp))
            }
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(3.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(entry.title, style = MaterialTheme.typography.titleMedium, maxLines = 1, overflow = TextOverflow.Ellipsis, modifier = Modifier.weight(1f, fill = false))
                    if (entry.pinned) Icon(AideIcons.Pin, contentDescription = "Pinned", tint = MaterialTheme.colorScheme.tertiary, modifier = Modifier.size(16.dp))
                }
                Text(
                    entry.content,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 3,
                    overflow = TextOverflow.Ellipsis,
                )
                Text(originLabel(entry), style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
            }
        }
    }
}
