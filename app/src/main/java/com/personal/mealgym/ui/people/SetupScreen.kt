package com.personal.mealgym.ui.people

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import com.personal.mealgym.AppContainer
import com.personal.mealgym.data.WeightUnit
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.data.seed.WorkoutTemplate
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.domain.Foods
import com.personal.mealgym.domain.MealSetup
import com.personal.mealgym.domain.PlanAnswers
import com.personal.mealgym.domain.PlanBuilder
import com.personal.mealgym.domain.Portions
import com.personal.mealgym.domain.TargetResult
import com.personal.mealgym.domain.answers
import com.personal.mealgym.ui.AppNavigator
import com.personal.mealgym.ui.AppViewModels
import com.personal.mealgym.ui.MessageViewModel
import com.personal.mealgym.ui.ShowMessages
import com.personal.mealgym.ui.components.AppButton
import com.personal.mealgym.ui.components.AppScaffold
import com.personal.mealgym.ui.components.DetailTopBar
import com.personal.mealgym.ui.components.SectionHeader
import com.personal.mealgym.ui.plan.WeekPlanner
import com.personal.mealgym.ui.settings.SwitchRow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

/** What to change when the questions are answered again. */
data class RedoChoices(
    val meals: Boolean = true,
    val trainingDays: Boolean = true,
    /** Off by default: it removes workout days the person may have edited. */
    val workouts: Boolean = false,
    val fillWeek: Boolean = false,
)

data class RedoState(val form: SetupForm, val page: Int = 0, val choices: RedoChoices = RedoChoices())

/** Settings > My plan: answer the setup questions again for the person who's open. */
class SetupViewModel(private val c: AppContainer) : MessageViewModel() {
    val profileId = c.currentProfileId()
    private val profile = c.currentProfile()
    val name: String = profile.name
    val templates: List<WorkoutTemplate> = c.seed.seed.workoutTemplates
    val cuisines: List<String> = c.seed.seed.recipes.flatMap { it.cuisineTags }.distinct()
        .filter { it !in setOf("Snack", "Starbucks") }
        .sorted()
    private var library: List<Recipe> = emptyList()

    private val _state = MutableStateFlow(RedoState(SetupForm.of(profile.answers ?: PlanAnswers())))
    val state: StateFlow<RedoState> = _state.asStateFlow()

    init {
        viewModelScope.launch { library = c.meals.recipes.first() }
    }

    fun change(form: SetupForm) = _state.update { it.copy(form = form) }
    fun choose(edit: (RedoChoices) -> RedoChoices) = _state.update { it.copy(choices = edit(it.choices)) }
    fun next() = _state.update { it.copy(page = (it.page + 1).coerceAtMost(LAST_PAGE)) }

    /** Steps back a page. False on the first page. */
    fun back(): Boolean {
        if (_state.value.page == 0) return false
        _state.update { it.copy(page = it.page - 1) }
        return true
    }

    fun suggestedMeals(a: PlanAnswers): MealSetup =
        PlanBuilder.mealSetup((PlanBuilder.targets(a) as? TargetResult.Ready)?.targets?.calories, library)

    fun suggestedTemplate(a: PlanAnswers): WorkoutTemplate? = PlanBuilder.suggestTemplate(a, templates)

    fun save(onSaved: () -> Unit) {
        val s = _state.value
        val answers = s.form.resolved()
        viewModelScope.launch {
            c.people.setPlanAnswers(profileId, answers.encode())
            c.settings.setWeightUnit(profileId, if (answers.metric) WeightUnit.KG else WeightUnit.LB)
            if (s.choices.meals) {
                val meals = suggestedMeals(answers)
                c.people.list().firstOrNull { it.id == profileId }?.let { p ->
                    c.people.update(p.copy(portion = meals.portion, snackSlot = meals.snack, tipsStyle = PlanBuilder.tipsStyle(answers.goalValue)))
                }
            }
            if (s.choices.trainingDays) c.settings.setTrainingWeekdays(profileId, PlanBuilder.trainingDays(answers.daysPerWeek))
            if (s.choices.workouts) {
                suggestedTemplate(answers)?.let { template ->
                    c.people.replaceWorkoutPlan(profileId, template)
                    // A workout in progress belonged to the old days.
                    c.workoutDraft.clear()
                }
            }
            if (s.choices.fillWeek) {
                c.people.list().firstOrNull { it.id == profileId }?.let { p ->
                    WeekPlanner.fill(c, p, Dates.weekStart(c.today.value), c.today.value)
                }
            }
            onSaved()
        }
    }

    companion object {
        const val LAST_PAGE = 3
    }
}

@Composable
fun SetupScreen(nav: AppNavigator, vm: SetupViewModel = viewModel(factory = AppViewModels.Factory)) {
    val state by vm.state.collectAsStateWithLifecycle()
    val snackbar = remember { SnackbarHostState() }
    vm.ShowMessages(snackbar)
    val scroll = rememberScrollState()
    LaunchedEffect(state.page) { scroll.scrollTo(0) }
    BackHandler(enabled = state.page > 0) { vm.back() }
    val titles = listOf("Your goal", "Food", "Training", "Your plan")
    AppScaffold(
        topBar = {
            DetailTopBar(title = "${titles[state.page]} (${state.page + 1} of ${titles.size})", onBack = { if (!vm.back()) nav.back() })
        },
        snackbarHost = { SnackbarHost(snackbar) },
    ) { padding ->
        Column(
            Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(scroll)
                .padding(start = 16.dp, end = 16.dp, bottom = 32.dp),
        ) {
            when (state.page) {
                0 -> GoalStep(state.form, vm::change)
                1 -> FoodStep(state.form, vm.cuisines, vm::change)
                2 -> TrainingStep(state.form, vm::change)
                else -> ReviewPage(state, vm)
            }
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth().padding(top = 24.dp),
            ) {
                if (state.page > 0) OutlinedButton(onClick = { vm.back() }) { Text("Back") }
                if (state.page == SetupViewModel.LAST_PAGE) {
                    AppButton(onClick = { vm.save(nav::back) }, modifier = Modifier.weight(1f)) { Text("Save my plan") }
                } else {
                    AppButton(onClick = vm::next, modifier = Modifier.weight(1f)) { Text("Next") }
                }
            }
        }
    }
}

@Composable
private fun ReviewPage(state: RedoState, vm: SetupViewModel) {
    val answers = state.form.resolved()
    SectionHeader("Your daily guide")
    val guide = PlanBuilder.guide(answers)
    if (guide.isEmpty()) {
        Text(
            "Add your age, height and weight on the goal page for an estimated calorie and protein guide.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    } else {
        GuideCard(guide)
    }
    if (answers.avoids.isNotEmpty()) {
        Text(
            "Kept off your plan: ${Foods.describe(answers.avoids)}. Meals already planned stay until you change them.",
            style = MaterialTheme.typography.bodyMedium,
            modifier = Modifier.padding(top = 8.dp),
        )
    }

    SectionHeader("What should change?")
    val meals = vm.suggestedMeals(answers)
    SwitchRow(
        title = "Use the suggested meal setup",
        body = "${Portions.words(meals.portion).replaceFirstChar { it.uppercase() }} at lunch and dinner, " +
            (if (meals.snack) "with a snack" else "no snack") +
            ": about ${"%,d".format(meals.typicalCalories)} calories and ${meals.typicalProtein} g of protein on a typical day.",
        checked = state.choices.meals,
        onChange = { on -> vm.choose { it.copy(meals = on) } },
    )
    SwitchRow(
        title = "Set my training days",
        body = PlanBuilder.trainingDays(answers.daysPerWeek).sortedBy { it.value }.joinToString(", ") { Dates.shortDayName(it) },
        checked = state.choices.trainingDays,
        onChange = { on -> vm.choose { it.copy(trainingDays = on) } },
    )
    vm.suggestedTemplate(answers)?.let { template ->
        SwitchRow(
            title = "Replace my workout days with \"${template.name}\"",
            body = "Your current workout days and any changes you made to them are removed. Your workout history stays.",
            checked = state.choices.workouts,
            onChange = { on -> vm.choose { it.copy(workouts = on) } },
        )
    }
    SwitchRow(
        title = "Fill this week's empty meal slots",
        body = "Planned meals stay as they are.",
        checked = state.choices.fillWeek,
        onChange = { on -> vm.choose { it.copy(fillWeek = on) } },
    )
    Text(
        NOT_ADVICE,
        style = MaterialTheme.typography.bodySmall,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
        modifier = Modifier.padding(top = 16.dp),
    )
}
