@file:OptIn(ExperimentalLayoutApi::class)

package com.personal.mealgym.ui.people

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.RadioButton
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
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
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.unit.dp
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import com.personal.mealgym.AppContainer
import com.personal.mealgym.R
import com.personal.mealgym.data.db.Profile
import com.personal.mealgym.data.seed.WorkoutTemplate
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.domain.Portions
import com.personal.mealgym.ui.AppNavigator
import com.personal.mealgym.ui.AppViewModels
import com.personal.mealgym.ui.MessageViewModel
import com.personal.mealgym.ui.ShowMessages
import com.personal.mealgym.ui.components.AppButton
import com.personal.mealgym.ui.components.AppScaffold
import com.personal.mealgym.ui.components.ConfirmDialog
import com.personal.mealgym.ui.components.DetailTopBar
import com.personal.mealgym.ui.components.SectionHeader
import com.personal.mealgym.ui.settings.SwitchRow
import com.personal.mealgym.ui.theme.MealGymTheme
import com.personal.mealgym.ui.theme.ThemedBackground
import com.personal.mealgym.ui.themeFor
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.time.DayOfWeek

/** A person being set up or edited. Starter plan and training days only apply when adding. */
data class PersonDraft(
    val name: String = "",
    val themeKey: String = Profile.THEME_IRON,
    val templateKey: String? = null,
    val trainingDays: Set<DayOfWeek> = emptySet(),
    val snackSlot: Boolean = false,
    val portion: Double = 1.0,
    val tipsStyle: String = Profile.TIPS_FILL_UP,
    val weekBadges: Boolean = true,
) {
    fun toProfile(id: Long, templateKey: String?) = Profile(
        id = id,
        name = name.trim(),
        themeKey = themeKey,
        snackSlot = snackSlot,
        portion = portion,
        tipsStyle = tipsStyle,
        weekBadges = weekBadges,
        templateKey = templateKey,
    )

    companion object {
        fun of(p: Profile) = PersonDraft(
            name = p.name,
            themeKey = p.themeKey,
            templateKey = p.templateKey,
            snackSlot = p.snackSlot,
            portion = p.portion,
            tipsStyle = p.tipsStyle,
            weekBadges = p.weekBadges,
        )
    }
}

class PersonViewModel(private val c: AppContainer, handle: SavedStateHandle) : MessageViewModel() {
    /** 0 when adding someone. */
    val id: Long = handle.get<Long>("id") ?: 0L
    val isNew: Boolean get() = id == 0L
    val templates: List<WorkoutTemplate> = c.seed.seed.workoutTemplates
    private var original: Profile? = null

    private val _draft = MutableStateFlow(if (isNew) starterDraft() else null)
    val draft: StateFlow<PersonDraft?> = _draft.asStateFlow()

    /** Someone can only be removed while there's somebody else. */
    val canDelete: Boolean get() = !isNew && c.profiles.value.size > 1

    init {
        if (!isNew) {
            viewModelScope.launch {
                val p = c.people.list().firstOrNull { it.id == id }
                original = p
                _draft.value = p?.let(PersonDraft::of)
            }
        }
    }

    private fun starterDraft(): PersonDraft {
        val first = templates.firstOrNull()
        return PersonDraft(templateKey = first?.key, trainingDays = daysOf(first))
    }

    private fun daysOf(t: WorkoutTemplate?): Set<DayOfWeek> =
        t?.defaultDays?.mapNotNull { runCatching { DayOfWeek.valueOf(it) }.getOrNull() }?.toSet()
            ?: setOf(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY)

    fun change(edit: (PersonDraft) -> PersonDraft) = _draft.update { it?.let(edit) }

    /** Picking a starter plan also picks its suggested training days. */
    fun chooseTemplate(key: String?) = change { d ->
        val t = c.seed.seed.template(key)
        d.copy(templateKey = key, trainingDays = if (t != null) daysOf(t) else d.trainingDays)
    }

    fun toggleDay(day: DayOfWeek) = change { d ->
        d.copy(trainingDays = if (day in d.trainingDays) d.trainingDays - day else d.trainingDays + day)
    }

    /** Saves and calls [onSaved] with the person's id. */
    fun save(onSaved: (Long) -> Unit) {
        val d = _draft.value ?: return
        if (d.name.isBlank()) return
        val clash = c.profiles.value.any { it.id != id && it.name.trim().equals(d.name.trim(), ignoreCase = true) }
        if (clash) {
            say("Someone here is already called ${d.name.trim()}.")
            return
        }
        // On the app's scope: adding the first person replaces this screen before the save returns.
        c.appScope.launch {
            val saved = if (isNew) {
                c.people.create(d.toProfile(0, null), c.seed.seed.template(d.templateKey), d.trainingDays)
            } else {
                c.people.update(d.toProfile(id, original?.templateKey))
                id
            }
            onSaved(saved)
        }
    }

    /** Adds the first person on this phone and opens their screens. */
    fun start() = save { id -> c.chooseSide(id) }

    /** Removes this person. If they're the one open, the app moves to someone else first. */
    fun delete(onDeleted: () -> Unit) {
        val others = c.profiles.value.filter { it.id != id }
        if (others.isEmpty()) return
        val wasOpen = c.currentProfileId() == id
        c.appScope.launch {
            if (wasOpen) c.settings.setActiveProfile(others.first().id) else withContext(Dispatchers.Main) { onDeleted() }
            c.people.delete(id)
        }
    }
}

/** Store edition, first launch: set up the first person. The screen previews the chosen look. */
@Composable
fun FirstPersonScreen(vm: PersonViewModel = viewModel(factory = AppViewModels.Factory)) {
    val draft by vm.draft.collectAsStateWithLifecycle()
    val d = draft ?: return
    val snackbar = remember { SnackbarHostState() }
    vm.ShowMessages(snackbar)
    MealGymTheme(side = themeFor(d.themeKey)) {
        ThemedBackground {
            Column(
                Modifier
                    .fillMaxSize()
                    .safeDrawingPadding()
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = 16.dp, vertical = 24.dp),
            ) {
                Text("Welcome to Meal & Gym", style = MaterialTheme.typography.headlineSmall)
                Text(
                    "A meal planner, shopping list and gym log in one. Set yourself up; you can add other people later in Settings.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(top = 6.dp),
                )
                PersonForm(d, vm)
                Text(
                    NOT_ADVICE,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(top = 20.dp),
                )
                AppButton(
                    onClick = vm::start,
                    enabled = d.name.isNotBlank(),
                    modifier = Modifier.fillMaxWidth().padding(top = 16.dp),
                ) { Text("Start") }
            }
            SnackbarHost(snackbar, Modifier.align(Alignment.BottomCenter).safeDrawingPadding())
        }
    }
}

/** Settings → People: add someone (id 0) or edit them. */
@Composable
fun PersonScreen(nav: AppNavigator, vm: PersonViewModel = viewModel(factory = AppViewModels.Factory)) {
    val draft by vm.draft.collectAsStateWithLifecycle()
    val snackbar = remember { SnackbarHostState() }
    vm.ShowMessages(snackbar)
    var confirmDelete by rememberSaveable { mutableStateOf(false) }
    AppScaffold(
        topBar = { DetailTopBar(title = if (vm.isNew) "Add a person" else "Edit ${draft?.name?.trim().orEmpty()}", onBack = nav::back) },
        snackbarHost = { SnackbarHost(snackbar) },
    ) { padding ->
        val d = draft ?: return@AppScaffold
        Column(
            Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(start = 16.dp, end = 16.dp, bottom = 32.dp),
        ) {
            PersonForm(d, vm)
            AppButton(
                onClick = { vm.save { nav.backOnMain() } },
                enabled = d.name.isNotBlank(),
                modifier = Modifier.fillMaxWidth().padding(top = 20.dp),
            ) { Text(if (vm.isNew) "Add" else "Save") }
            if (vm.canDelete) {
                OutlinedButton(onClick = { confirmDelete = true }, modifier = Modifier.fillMaxWidth().padding(top = 8.dp)) {
                    Text("Remove ${d.name.trim()}")
                }
            }
        }
        if (confirmDelete) {
            ConfirmDialog(
                title = "Remove ${d.name.trim()}?",
                body = "Their meal plan, workout days and history are deleted from this phone. Recipes stay in the library.",
                confirmLabel = "Remove",
                onConfirm = { confirmDelete = false; vm.delete(nav::back) },
                onDismiss = { confirmDelete = false },
            )
        }
    }
}

private fun AppNavigator.backOnMain() {
    android.os.Handler(android.os.Looper.getMainLooper()).post { back() }
}

const val NOT_ADVICE =
    "Meal & Gym is a planner, not medical, nutrition or fitness advice. Check with a doctor before starting a new eating or training plan."

@Composable
private fun PersonForm(d: PersonDraft, vm: PersonViewModel) {
    SectionHeader("Name")
    OutlinedTextField(
        value = d.name,
        onValueChange = { v -> vm.change { it.copy(name = v.take(30)) } },
        label = { Text("What should the app call you?") },
        singleLine = true,
        keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Words),
        modifier = Modifier.fillMaxWidth(),
    )

    SectionHeader("Look")
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
        LookCard(Profile.THEME_IRON, "Dark fantasy", "Iron, ember and old parchment", d.themeKey, Modifier.weight(1f)) { key ->
            vm.change { it.copy(themeKey = key) }
        }
        LookCard(Profile.THEME_GLAM, "Y2K glam", "Chrome, pink and sparkle", d.themeKey, Modifier.weight(1f)) { key ->
            vm.change { it.copy(themeKey = key) }
        }
    }

    if (vm.isNew) {
        SectionHeader("Starter workout plan")
        vm.templates.forEach { t ->
            ChoiceRow(
                selected = d.templateKey == t.key,
                title = t.name,
                body = t.description,
                onClick = { vm.chooseTemplate(t.key) },
            )
        }
        ChoiceRow(
            selected = d.templateKey == null,
            title = "Start empty",
            body = "Add your own workout days in Settings, under Edit workouts.",
            onClick = { vm.chooseTemplate(null) },
        )

        SectionHeader("Training days")
        Text(
            "Workouts cycle in order across these days. A missed day just moves on to the next session.",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp), modifier = Modifier.padding(vertical = 8.dp)) {
            DayOfWeek.entries.forEach { day ->
                FilterChip(
                    selected = day in d.trainingDays,
                    onClick = { vm.toggleDay(day) },
                    label = { Text(Dates.shortDayName(day)) },
                )
            }
        }
    }

    SectionHeader("Meals")
    SwitchRow(
        title = "Snack slot",
        body = "Adds a fourth meal, Snack, to Today and the week plan.",
        checked = d.snackSlot,
        onChange = { on -> vm.change { it.copy(snackSlot = on) } },
    )
    Text("Lunch and dinner portion", style = MaterialTheme.typography.bodyLarge, modifier = Modifier.padding(top = 8.dp))
    Text(
        "How much of one serving you usually eat. Shopping amounts follow it.",
        style = MaterialTheme.typography.bodySmall,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
    )
    SingleChoiceSegmentedButtonRow(Modifier.fillMaxWidth().padding(vertical = 8.dp)) {
        Portions.choices.forEachIndexed { index, portion ->
            SegmentedButton(
                selected = d.portion == portion,
                onClick = { vm.change { it.copy(portion = portion) } },
                shape = SegmentedButtonDefaults.itemShape(index, Portions.choices.size),
            ) { Text(Portions.shortLabel(portion)) }
        }
    }
    Text("Recipe tips", style = MaterialTheme.typography.bodyLarge, modifier = Modifier.padding(top = 8.dp))
    ChoiceRow(
        selected = d.tipsStyle == Profile.TIPS_FILL_UP,
        title = "Fill up",
        body = "A half-plate-of-vegetables reminder and ways to bulk a meal up.",
        onClick = { vm.change { it.copy(tipsStyle = Profile.TIPS_FILL_UP) } },
    )
    ChoiceRow(
        selected = d.tipsStyle == Profile.TIPS_EASIER,
        title = "Easier to finish",
        body = "Ideas for days when a full plate feels like a lot.",
        onClick = { vm.change { it.copy(tipsStyle = Profile.TIPS_EASIER) } },
    )

    SectionHeader("Week plan")
    SwitchRow(
        title = "Show gym days",
        body = "Each day on the week plan shows which workout is coming up, or Rest.",
        checked = d.weekBadges,
        onChange = { on -> vm.change { it.copy(weekBadges = on) } },
    )
}

@Composable
private fun ChoiceRow(selected: Boolean, title: String, body: String, onClick: () -> Unit) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .fillMaxWidth()
            .selectable(selected = selected, role = Role.RadioButton, onClick = onClick)
            .padding(vertical = 6.dp),
    ) {
        RadioButton(selected = selected, onClick = null, modifier = Modifier.padding(end = 12.dp))
        Column(Modifier.weight(1f)) {
            Text(title, style = MaterialTheme.typography.bodyLarge)
            if (body.isNotBlank()) {
                Text(body, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
    }
}

/** A small preview of a look, drawn in that look. */
@Composable
private fun LookCard(
    key: String,
    title: String,
    body: String,
    selectedKey: String,
    modifier: Modifier = Modifier,
    onPick: (String) -> Unit,
) {
    val selected = key == selectedKey
    val outline = MaterialTheme.colorScheme.primary
    MealGymTheme(side = themeFor(key)) {
        Surface(
            shape = MaterialTheme.shapes.large,
            border = BorderStroke(if (selected) 3.dp else 1.dp, if (selected) outline else MaterialTheme.colorScheme.outlineVariant),
            modifier = modifier.selectable(selected = selected, role = Role.RadioButton) { onPick(key) },
        ) {
            ThemedBackground {
                Column(
                    Modifier.fillMaxWidth().padding(14.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Icon(
                        painterResource(if (key == Profile.THEME_GLAM) R.drawable.ic_star else R.drawable.ic_launcher_monochrome),
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(48.dp),
                    )
                    Spacer(Modifier.height(8.dp))
                    Text(title, style = MaterialTheme.typography.titleMedium, color = MaterialTheme.colorScheme.onBackground)
                    Text(
                        body,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        }
    }
}
