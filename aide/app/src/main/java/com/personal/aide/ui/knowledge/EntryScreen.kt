@file:OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)

package com.personal.aide.ui.knowledge

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.personal.aide.AppContainer
import com.personal.aide.data.db.KnowledgeEntity
import com.personal.aide.data.db.KnowledgeOrigin
import com.personal.aide.data.db.KnowledgeType
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.domain.Days
import com.personal.aide.domain.knowledgeKey
import com.personal.aide.domain.label
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class EntryState(
    val loaded: Boolean = false,
    val entry: KnowledgeEntity? = null,
    val sources: List<MeetingEntity> = emptyList(),
    val error: String? = null,
    /** For a new entry opened from a person's page: who it is about. */
    val prefillName: String = "",
)

/** [entryId] 0 means a new entry. */
class EntryViewModel(private val container: AppContainer, private val entryId: Long, private val prefillName: String = "") : ViewModel() {
    private val _state = MutableStateFlow(EntryState())
    val state: StateFlow<EntryState> = _state.asStateFlow()

    init {
        viewModelScope.launch {
            val entry = if (entryId == 0L) null else container.db.knowledge().get(entryId)
            val sources = entry?.sourceMeetingIds.orEmpty().mapNotNull { container.db.meetings().get(it) }
            _state.value = EntryState(loaded = true, entry = entry, sources = sources, prefillName = if (entry == null) prefillName else "")
        }
    }

    fun save(type: KnowledgeType, title: String, content: String, pinned: Boolean, onSaved: () -> Unit) {
        viewModelScope.launch {
            val dao = container.db.knowledge()
            val key = knowledgeKey(title)
            val current = _state.value.entry
            val clash = dao.find(type, key)?.takeIf { it.id != current?.id }
            if (clash != null) {
                _state.value = _state.value.copy(error = "There is already an entry called \"${clash.title}\". Open that one to add to it.")
                return@launch
            }
            val now = System.currentTimeMillis()
            if (current == null) {
                dao.insert(
                    KnowledgeEntity(
                        type = type, title = title.trim(), key = key, content = content.trim(),
                        origin = KnowledgeOrigin.MANUAL, pinned = pinned, createdAt = now, updatedAt = now,
                    ),
                )
            } else {
                dao.update(current.copy(type = type, title = title.trim(), key = key, content = content.trim(), pinned = pinned, updatedAt = now))
            }
            onSaved()
        }
    }

    fun delete(onDeleted: () -> Unit) {
        val entry = _state.value.entry ?: return
        viewModelScope.launch {
            container.db.knowledge().delete(entry)
            onDeleted()
        }
    }

    fun clearError() {
        _state.value = _state.value.copy(error = null)
    }
}

@Composable
fun EntryScreen(
    state: EntryState,
    onBack: () -> Unit,
    onSave: (KnowledgeType, String, String, Boolean) -> Unit,
    onDelete: () -> Unit,
    onOpenMeeting: (Long) -> Unit,
    onClearError: () -> Unit = {},
) {
    val entry = state.entry
    var type by rememberSaveable(entry?.id) { mutableStateOf(entry?.type ?: KnowledgeType.PERSON) }
    var title by rememberSaveable(entry?.id) { mutableStateOf(entry?.title ?: state.prefillName) }
    var content by rememberSaveable(entry?.id) { mutableStateOf(entry?.content.orEmpty()) }
    var pinned by rememberSaveable(entry?.id) { mutableStateOf(entry?.pinned ?: false) }
    var deleting by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (entry == null) "New entry" else "Edit entry") },
                navigationIcon = { IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back") } },
                actions = {
                    if (entry != null) IconButton(onClick = { deleting = true }) { Icon(Icons.Filled.Delete, contentDescription = "Delete this entry") }
                    TextButton(onClick = { onSave(type, title, content, pinned) }, enabled = title.isNotBlank() && content.isNotBlank()) { Text("Save") }
                },
            )
        },
    ) { padding ->
        Column(
            Modifier.fillMaxSize().padding(padding).imePadding().verticalScroll(rememberScrollState()).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp),
        ) {
            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                for (option in KnowledgeType.entries) {
                    FilterChip(selected = type == option, onClick = { type = option }, label = { Text(option.label()) })
                }
            }
            OutlinedTextField(
                value = title,
                onValueChange = { title = it; onClearError() },
                label = { Text(if (type == KnowledgeType.PERSON) "Name" else "Title") },
                singleLine = true,
                isError = state.error != null,
                supportingText = state.error?.let { message -> { Text(message) } },
                modifier = Modifier.fillMaxWidth(),
                keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Words),
            )
            OutlinedTextField(
                value = content,
                onValueChange = { content = it },
                label = { Text("What Aide should know") },
                minLines = 6,
                modifier = Modifier.fillMaxWidth(),
                keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
            )
            Row(Modifier.fillMaxWidth().clickable { pinned = !pinned }, verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) {
                    Text("Always keep in mind", style = MaterialTheme.typography.bodyLarge)
                    Text(
                        "Pinned entries go to Aide with every request, not only when they look relevant.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                Switch(checked = pinned, onCheckedChange = { pinned = it })
            }
            if (entry != null) {
                Text(
                    originLabel(entry) + " · updated " + Days.dateTime(entry.updatedAt),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            if (state.sources.isNotEmpty()) {
                Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                    Text("Learned in", style = MaterialTheme.typography.titleSmall)
                    for (meeting in state.sources) {
                        TextButton(onClick = { onOpenMeeting(meeting.id) }, contentPadding = androidx.compose.foundation.layout.PaddingValues(0.dp)) {
                            Text(meeting.title + " · " + Days.mediumDate(Days.ofMillis(meeting.startedAt)))
                        }
                    }
                }
            }
        }
    }

    if (deleting) {
        AlertDialog(
            onDismissRequest = { deleting = false },
            title = { Text("Delete this entry?") },
            text = { Text("Aide will forget it. It may learn it again from a later meeting.") },
            confirmButton = { TextButton(onClick = { deleting = false; onDelete() }) { Text("Delete", color = MaterialTheme.colorScheme.error) } },
            dismissButton = { TextButton(onClick = { deleting = false }) { Text("Cancel") } },
        )
    }
}
