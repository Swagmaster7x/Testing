@file:OptIn(ExperimentalLayoutApi::class)

package com.personal.mealgym.ui.people

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.relocation.BringIntoViewRequester
import androidx.compose.foundation.relocation.bringIntoViewRequester
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.unit.dp
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import com.personal.mealgym.AppContainer
import com.personal.mealgym.data.WeightUnit
import com.personal.mealgym.data.db.Profile
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.data.seed.WorkoutTemplate
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.domain.MealSetup
import com.personal.mealgym.domain.PlanAnswers
import com.personal.mealgym.domain.PlanBuilder
import com.personal.mealgym.domain.Portions
import com.personal.mealgym.domain.TargetResult
import com.personal.mealgym.ui.AppNavigator
import com.personal.mealgym.ui.AppViewModels
import com.personal.mealgym.ui.MessageViewModel
import com.personal.mealgym.ui.ShowMessages
import com.personal.mealgym.ui.SystemBars
import com.personal.mealgym.ui.components.AppButton
import com.personal.mealgym.ui.components.AppScaffold
import com.personal.mealgym.ui.components.ConfirmDialog
import com.personal.mealgym.ui.components.DetailTopBar
import com.personal.mealgym.ui.components.SectionHeader
import com.personal.mealgym.ui.looks.CustomLookEditor
import com.personal.mealgym.ui.looks.LookGrid
import com.personal.mealgym.ui.looks.LookPreview
import com.personal.mealgym.ui.plan.WeekPlanner
import com.personal.mealgym.ui.settings.SwitchRow
import com.personal.mealgym.ui.theme.CustomLook
import com.personal.mealgym.ui.theme.Looks
import com.personal.mealgym.ui.theme.MealGymTheme
import com.personal.mealgym.ui.theme.ThemedBackground
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.time.DayOfWeek

/** A person being set up or edited. */
data class PersonDraft(
    val name: String = "",
    val themeKey: String = Profile.THEME_IRON,
    val templateKey: String? = null,
    val trainingDays: Set<DayOfWeek> = emptySet(),
    val snackSlot: Boolean = false,
    val portion: Double = 1.0,
    val tipsStyle: String = Profile.TIPS_FILL_UP,
    val weekBadges: Boolean = true,
    /** The look creator's choices, kept even while a ready-made look is picked. */
    val customLook: String? = null,
    /** The setup questions (new people only). */
    val form: SetupForm = SetupForm(),
    /** "Skip the questions" was chosen: no answers are saved and nothing is suggested. */
    val skipped: Boolean = false,
    /** Plan the first week of meals when the person is added. */
    val fillWeek: Boolean = true,
    /** Answers already on the profile being edited; kept as they are. */
    val savedAnswers: String? = null,
) {
    /** What gets saved from the questions: nothing when they were skipped. */
    val answers: PlanAnswers? get() = if (skipped) null else form.resolved()

    fun toProfile(id: Long, templateKey: String?, planAnswers: String?) = Profile(
        id = id,
        name = name.trim(),
        themeKey = themeKey,
        snackSlot = snackSlot,
        portion = portion,
        tipsStyle = tipsStyle,
        weekBadges = weekBadges,
        templateKey = templateKey,
        customLook = customLook,
        planAnswers = planAnswers,
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
            customLook = p.customLook,
            savedAnswers = p.planAnswers,
        )
    }
}

/** The pages of setup for a new person. */
enum class SetupStep(val title: String) {
    YOU("About you"),
    GOAL("Your goal"),
    FOOD("Food"),
    TRAINING("Training"),
    PLAN("Your plan"),
}

class PersonViewModel(private val c: AppContainer, handle: SavedStateHandle) : MessageViewModel() {
    /** 0 when adding someone. */
    val id: Long = handle.get<Long>("id") ?: 0L
    val isNew: Boolean get() = id == 0L
    val templates: List<WorkoutTemplate> = c.seed.seed.workoutTemplates

    /** Cuisines to choose favourites from: the library's own, minus labels that aren't cuisines. */
    val cuisines: List<String> = c.seed.seed.recipes.flatMap { it.cuisineTags }.distinct()
        .filter { it !in setOf("Snack", "Starbucks", "Copycat") }
        .sorted()

    private var original: Profile? = null
    private var library: List<Recipe> = emptyList()

    private val _draft = MutableStateFlow(if (isNew) starterDraft() else null)
    val draft: StateFlow<PersonDraft?> = _draft.asStateFlow()

    private val _step = MutableStateFlow(SetupStep.YOU)
    val step: StateFlow<SetupStep> = _step.asStateFlow()

    /** Someone can only be removed while there's somebody else. */
    val canDelete: Boolean get() = !isNew && c.profiles.value.size > 1

    init {
        viewModelScope.launch {
            library = c.meals.recipes.first()
            if (!isNew) {
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

    /** Picking a starter plan by hand also picks its suggested training days. */
    fun chooseTemplate(key: String?) = change { d ->
        val t = c.seed.seed.template(key)
        d.copy(templateKey = key, trainingDays = if (t != null && d.skipped) daysOf(t) else d.trainingDays)
    }

    fun toggleDay(day: DayOfWeek) = change { d ->
        d.copy(trainingDays = if (day in d.trainingDays) d.trainingDays - day else d.trainingDays + day)
    }

    /** The starter plan the answers point to, to mark as suggested. */
    fun suggestedTemplate(d: PersonDraft): WorkoutTemplate? = d.answers?.let { PlanBuilder.suggestTemplate(it, templates) }

    /** What a typical day comes to with the portion and snack currently chosen. */
    fun typicalDay(d: PersonDraft): MealSetup? =
        if (library.isEmpty()) null else PlanBuilder.mealSetups(library).firstOrNull { it.portion == d.portion && it.snack == d.snackSlot }

    fun next() {
        val d = _draft.value ?: return
        if (_step.value == SetupStep.YOU) {
            if (d.name.isBlank()) {
                say("Add a name first.")
                return
            }
            if (nameTaken(d)) return
        }
        val following = SetupStep.entries.getOrNull(_step.value.ordinal + 1) ?: return
        if (following == SetupStep.PLAN) suggest()
        _step.value = following
    }

    /** Steps back a page. False on the first page, when there's nowhere to go. */
    fun back(): Boolean {
        val d = _draft.value
        val previous = when {
            _step.value == SetupStep.PLAN && d?.skipped == true -> SetupStep.YOU
            else -> SetupStep.entries.getOrNull(_step.value.ordinal - 1)
        } ?: return false
        if (d?.skipped == true) change { it.copy(skipped = false) }
        _step.value = previous
        return true
    }

    /** Straight to the plan page with the standard setup and no answers saved. */
    fun skipQuestions() {
        change { it.copy(skipped = true) }
        _step.value = SetupStep.PLAN
    }

    /** Sets the plan page up from the answers: workout plan, training days, portions, snack, tips. */
    private fun suggest() = change { d ->
        val a = d.answers ?: return@change d
        val target = (PlanBuilder.targets(a) as? TargetResult.Ready)?.targets?.calories
        val meals = PlanBuilder.mealSetup(target, library)
        d.copy(
            templateKey = PlanBuilder.suggestTemplate(a, templates)?.key,
            trainingDays = PlanBuilder.trainingDays(a.daysPerWeek),
            portion = meals.portion,
            snackSlot = meals.snack,
            tipsStyle = PlanBuilder.tipsStyle(a.goalValue),
        )
    }

    private fun nameTaken(d: PersonDraft): Boolean {
        val clash = c.profiles.value.any { it.id != id && it.name.trim().equals(d.name.trim(), ignoreCase = true) }
        if (clash) say("Someone here is already called ${d.name.trim()}.")
        return clash
    }

    /** Saves and calls [onSaved] with the person's id. */
    fun save(onSaved: (Long) -> Unit) {
        val d = _draft.value ?: return
        if (d.name.isBlank() || nameTaken(d)) return
        // On the app's scope: adding the first person replaces this screen before the save returns.
        c.appScope.launch {
            val saved = if (isNew) {
                val answers = d.answers
                val newId = c.people.create(
                    d.toProfile(0, null, answers?.encode()),
                    c.seed.seed.template(d.templateKey),
                    d.trainingDays,
                )
                if (answers != null) c.settings.setWeightUnit(newId, if (answers.metric) WeightUnit.KG else WeightUnit.LB)
                if (d.fillWeek) {
                    c.people.list().firstOrNull { it.id == newId }?.let { WeekPlanner.firstWeek(c, it, c.today.value) }
                }
                newId
            } else {
                c.people.update(d.toProfile(id, original?.templateKey, d.savedAnswers))
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
    val step by vm.step.collectAsStateWithLifecycle()
    val d = draft ?: return
    val snackbar = remember { SnackbarHostState() }
    vm.ShowMessages(snackbar)
    val look = Looks.forKey(d.themeKey, d.customLook)
    val scroll = rememberScrollState()
    LaunchedEffect(step) { scroll.scrollTo(0) }
    BackHandler(enabled = step != SetupStep.YOU) { vm.back() }
    SystemBars(look.isDark(isSystemInDarkTheme()))
    MealGymTheme(look = look) {
        ThemedBackground {
            Column(
                Modifier
                    .fillMaxSize()
                    .safeDrawingPadding()
                    .verticalScroll(scroll)
                    .padding(horizontal = 16.dp, vertical = 24.dp),
            ) {
                Text(
                    if (step == SetupStep.YOU) "Welcome to Meal & Gym" else step.title,
                    style = MaterialTheme.typography.headlineSmall,
                )
                Text(
                    if (step == SetupStep.YOU) {
                        "A meal planner, shopping list and gym log in one. A few questions and the app builds your plan. You can add other people later."
                    } else {
                        "Step ${step.ordinal + 1} of ${SetupStep.entries.size}"
                    },
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(top = 6.dp),
                )
                SetupPages(step, d, vm, finishLabel = "Start", onFinish = vm::start)
            }
            SnackbarHost(snackbar, Modifier.align(Alignment.BottomCenter).safeDrawingPadding())
        }
    }
}

/** Settings → People: add someone (id 0, the same steps as first launch) or edit them. */
@Composable
fun PersonScreen(nav: AppNavigator, vm: PersonViewModel = viewModel(factory = AppViewModels.Factory)) {
    val draft by vm.draft.collectAsStateWithLifecycle()
    val step by vm.step.collectAsStateWithLifecycle()
    val snackbar = remember { SnackbarHostState() }
    vm.ShowMessages(snackbar)
    var confirmDelete by rememberSaveable { mutableStateOf(false) }
    val scroll = rememberScrollState()
    LaunchedEffect(step) { scroll.scrollTo(0) }
    BackHandler(enabled = vm.isNew && step != SetupStep.YOU) { vm.back() }
    AppScaffold(
        topBar = {
            DetailTopBar(
                title = when {
                    !vm.isNew -> "Edit ${draft?.name?.trim().orEmpty()}"
                    step == SetupStep.YOU -> "Add a person"
                    else -> "${step.title} (${step.ordinal + 1} of ${SetupStep.entries.size})"
                },
                onBack = { if (!vm.isNew || !vm.back()) nav.back() },
            )
        },
        snackbarHost = { SnackbarHost(snackbar) },
    ) { padding ->
        val d = draft ?: return@AppScaffold
        Column(
            Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(scroll)
                .padding(start = 16.dp, end = 16.dp, bottom = 32.dp),
        ) {
            if (vm.isNew) {
                SetupPages(step, d, vm, finishLabel = "Add", onFinish = { vm.save { nav.backOnMain() } })
            } else {
                NameAndLook(d, vm)
                MealChoices(d, vm, typical = null)
                AppButton(
                    onClick = { vm.save { nav.backOnMain() } },
                    enabled = d.name.isNotBlank(),
                    modifier = Modifier.fillMaxWidth().padding(top = 20.dp),
                ) { Text("Save") }
                if (vm.canDelete) {
                    OutlinedButton(onClick = { confirmDelete = true }, modifier = Modifier.fillMaxWidth().padding(top = 8.dp)) {
                        Text("Remove ${d.name.trim()}")
                    }
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

/** One page of setup, with Back and Next (or the finishing button) underneath. */
@Composable
private fun SetupPages(step: SetupStep, d: PersonDraft, vm: PersonViewModel, finishLabel: String, onFinish: () -> Unit) {
    when (step) {
        SetupStep.YOU -> NameAndLook(d, vm)
        SetupStep.GOAL -> GoalStep(d.form) { f -> vm.change { it.copy(form = f) } }
        SetupStep.FOOD -> FoodStep(d.form, vm.cuisines) { f -> vm.change { it.copy(form = f) } }
        SetupStep.TRAINING -> TrainingStep(d.form) { f -> vm.change { it.copy(form = f) } }
        SetupStep.PLAN -> PlanPage(d, vm)
    }
    Row(
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.fillMaxWidth().padding(top = 24.dp),
    ) {
        if (step != SetupStep.YOU) OutlinedButton(onClick = { vm.back() }) { Text("Back") }
        if (step == SetupStep.PLAN) {
            AppButton(onClick = onFinish, enabled = d.name.isNotBlank(), modifier = Modifier.weight(1f)) { Text(finishLabel) }
        } else {
            AppButton(onClick = vm::next, enabled = d.name.isNotBlank(), modifier = Modifier.weight(1f)) { Text("Next") }
        }
    }
    if (step == SetupStep.YOU) {
        TextButton(onClick = vm::skipQuestions, enabled = d.name.isNotBlank(), modifier = Modifier.padding(top = 4.dp)) {
            Text("Skip the questions and set things up myself")
        }
    }
}

@Composable
private fun NameAndLook(d: PersonDraft, vm: PersonViewModel) {
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
    val custom = CustomLook.decode(d.customLook)
    // Scroll to the creator only when it's just been opened, not when editing someone who already has their own look.
    var openedCreator by remember { mutableStateOf(false) }
    LookGrid(
        selectedKey = d.themeKey,
        custom = custom,
        onPick = { key ->
            openedCreator = key == Looks.CUSTOM && d.themeKey != Looks.CUSTOM
            vm.change {
                if (key == Looks.CUSTOM) it.copy(themeKey = key, customLook = it.customLook ?: CustomLook().encode()) else it.copy(themeKey = key)
            }
        },
    )
    if (d.themeKey == Looks.CUSTOM) {
        val editing = custom ?: CustomLook()
        val creator = remember { BringIntoViewRequester() }
        LaunchedEffect(openedCreator) {
            if (openedCreator) {
                creator.bringIntoView()
                openedCreator = false
            }
        }
        SectionHeader("Make your own", Modifier.bringIntoViewRequester(creator))
        LookPreview(Looks.custom(editing))
        CustomLookEditor(editing, onChange = { c -> vm.change { it.copy(customLook = c.encode()) } })
    }
}

/** The last page: what the answers came to, with everything still adjustable. */
@Composable
private fun PlanPage(d: PersonDraft, vm: PersonViewModel) {
    val answers = d.answers
    if (answers != null) {
        SectionHeader("Your daily guide")
        val guide = PlanBuilder.guide(answers)
        if (guide.isEmpty()) {
            Text(
                "Add your age, height and weight on the goal page for an estimated calorie and protein guide. The plan below works without it.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        } else {
            GuideCard(guide)
        }
        if (answers.avoids.isNotEmpty()) {
            Text(
                "Kept off your plan: ${com.personal.mealgym.domain.Foods.describe(answers.avoids)}.",
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier.padding(top = 8.dp),
            )
        }
    }

    SectionHeader("Workout plan")
    val suggested = vm.suggestedTemplate(d)?.key
    vm.templates.forEach { t ->
        ChoiceRow(
            selected = d.templateKey == t.key,
            title = if (t.key == suggested) "${t.name} (suggested)" else t.name,
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

    MealChoices(d, vm, typical = vm.typicalDay(d))
    SwitchRow(
        title = "Plan my first week of meals",
        body = "Fills the empty slots with recipes that fit. Change any of them whenever you like.",
        checked = d.fillWeek,
        onChange = { on -> vm.change { it.copy(fillWeek = on) } },
    )
    Text(
        NOT_ADVICE,
        style = MaterialTheme.typography.bodySmall,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
        modifier = Modifier.padding(top = 16.dp),
    )
}

@Composable
private fun MealChoices(d: PersonDraft, vm: PersonViewModel, typical: MealSetup?) {
    SectionHeader("Meals")
    if (typical != null) {
        Text(
            "Set up like this, a typical day comes to about ${"%,d".format(typical.typicalCalories)} calories and ${typical.typicalProtein} g of protein.",
            style = MaterialTheme.typography.bodyMedium,
            modifier = Modifier.padding(bottom = 4.dp),
        )
    }
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
