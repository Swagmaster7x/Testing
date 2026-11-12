@file:OptIn(ExperimentalLayoutApi::class)

package com.personal.mealgym.ui.people

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import com.personal.mealgym.data.seed.GuideLine
import com.personal.mealgym.domain.Activity
import com.personal.mealgym.domain.Avoid
import com.personal.mealgym.domain.Experience
import com.personal.mealgym.domain.Goal
import com.personal.mealgym.domain.Place
import com.personal.mealgym.domain.PlanAnswers
import com.personal.mealgym.domain.PlanBuilder
import com.personal.mealgym.domain.Sex
import com.personal.mealgym.ui.components.SectionHeader
import com.personal.mealgym.ui.settings.SwitchRow
import kotlin.math.roundToInt

/** Age, height and weight as typed, in whichever units the form is showing. */
data class BodyText(val age: String = "", val height: String = "", val inches: String = "", val weight: String = "")

/** The setup questions while they're being answered. */
data class SetupForm(val answers: PlanAnswers = PlanAnswers(), val body: BodyText = BodyText()) {

    /** The answers with the typed numbers read in. Blank or unreadable fields stay empty. */
    fun resolved(): PlanAnswers {
        fun number(text: String) = text.trim().replace(',', '.').toDoubleOrNull()
        val height = number(body.height)
        val weight = number(body.weight)
        return answers.copy(
            age = body.age.trim().toIntOrNull(),
            heightCm = if (answers.metric) height else height?.let { PlanBuilder.feetInchesToCm(it.toInt(), number(body.inches) ?: 0.0) },
            weightKg = if (answers.metric) weight else weight?.let(PlanBuilder::lbToKg),
        )
    }

    /** Switches between pounds and feet, and kilograms and centimetres, converting what's typed. */
    fun withUnits(metric: Boolean): SetupForm = of(resolved().copy(metric = metric))

    companion object {
        fun of(a: PlanAnswers): SetupForm {
            val feetInches = a.heightCm?.let(PlanBuilder::cmToFeetInches)
            return SetupForm(
                answers = a,
                body = BodyText(
                    age = a.age?.toString().orEmpty(),
                    height = if (a.metric) a.heightCm?.roundToInt()?.toString().orEmpty() else feetInches?.first?.toString().orEmpty(),
                    inches = if (a.metric) "" else feetInches?.second?.toString().orEmpty(),
                    weight = a.weightKg?.let { if (a.metric) it else PlanBuilder.kgToLb(it) }?.roundToInt()?.toString().orEmpty(),
                ),
            )
        }
    }
}

/** A radio row with a title and a line of explanation. */
@Composable
fun ChoiceRow(selected: Boolean, title: String, body: String, onClick: () -> Unit) {
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

/** A chip that shows a tick as well as its colour when chosen. */
@Composable
fun TickChip(label: String, selected: Boolean, onClick: () -> Unit) {
    FilterChip(
        selected = selected,
        onClick = onClick,
        label = { Text(label) },
        leadingIcon = if (selected) {
            { Icon(Icons.Filled.Check, contentDescription = null, modifier = Modifier.size(FilterChipDefaults.IconSize)) }
        } else {
            null
        },
    )
}

@Composable
private fun Hint(text: String) {
    Text(text, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
}

/** Goal, and the details the calorie and protein estimate needs. Everything here is optional. */
@Composable
fun GoalStep(form: SetupForm, onChange: (SetupForm) -> Unit) {
    val a = form.answers
    fun answers(edit: (PlanAnswers) -> PlanAnswers) = onChange(form.copy(answers = edit(a)))
    fun body(edit: (BodyText) -> BodyText) = onChange(form.copy(body = edit(form.body)))

    SectionHeader("What are you aiming for?")
    Goal.entries.forEach { goal ->
        ChoiceRow(a.goalValue == goal, goal.label, goal.blurb) { answers { it.copy(goal = goal.name) } }
    }

    SectionHeader("About you")
    Hint("Used once to estimate a daily calorie and protein guide. It stays on this phone, and you can leave any of it blank.")
    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(top = 8.dp)) {
        Sex.entries.forEach { sex ->
            TickChip(sex.label, a.sexValue == sex) {
                answers { it.copy(sex = sex.name, pregnant = it.pregnant && sex != Sex.MALE) }
            }
        }
    }
    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        TickChip("Pounds and feet", !a.metric) { if (a.metric) onChange(form.withUnits(false)) }
        TickChip("Kilograms and cm", a.metric) { if (!a.metric) onChange(form.withUnits(true)) }
    }
    val resolved = form.resolved()
    NumberField(
        label = "Age",
        value = form.body.age,
        problem = "Between ${PlanBuilder.ageRange.first} and ${PlanBuilder.ageRange.last}".takeIf {
            form.body.age.isNotBlank() && resolved.age !in PlanBuilder.ageRange
        },
        onChange = { v -> body { it.copy(age = v.filter(Char::isDigit).take(3)) } },
    )
    val heightProblem = "That height doesn't look right".takeIf {
        form.body.height.isNotBlank() && (resolved.heightCm == null || resolved.heightCm !in PlanBuilder.heightRangeCm)
    }
    if (a.metric) {
        NumberField("Height (cm)", form.body.height, heightProblem) { v -> body { it.copy(height = v.take(5)) } }
    } else {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            NumberField("Height (ft)", form.body.height, heightProblem, Modifier.weight(1f)) { v ->
                body { it.copy(height = v.filter(Char::isDigit).take(1)) }
            }
            NumberField("and inches", form.body.inches, null, Modifier.weight(1f)) { v -> body { it.copy(inches = v.take(4)) } }
        }
    }
    NumberField(
        label = if (a.metric) "Weight (kg)" else "Weight (lb)",
        value = form.body.weight,
        problem = "That weight doesn't look right".takeIf {
            form.body.weight.isNotBlank() && (resolved.weightKg == null || resolved.weightKg !in PlanBuilder.weightRangeKg)
        },
        onChange = { v -> body { it.copy(weight = v.take(6)) } },
    )
    if (a.sexValue != Sex.MALE) {
        SwitchRow(
            title = "Pregnant or breastfeeding",
            body = "The app then gives no calorie numbers. Your doctor or midwife is the one to ask.",
            checked = a.pregnant,
            onChange = { on -> answers { it.copy(pregnant = on) } },
        )
    }

    SectionHeader("How active are you?")
    Activity.entries.forEach { level ->
        ChoiceRow(a.activityValue == level, level.label, level.blurb) { answers { it.copy(activity = level.name) } }
    }
}

@Composable
private fun NumberField(label: String, value: String, problem: String?, modifier: Modifier = Modifier, onChange: (String) -> Unit) {
    OutlinedTextField(
        value = value,
        onValueChange = { v -> onChange(v.filter { it.isDigit() || it == '.' || it == ',' }) },
        label = { Text(label) },
        singleLine = true,
        isError = problem != null,
        supportingText = problem?.let { { Text(it) } },
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
        modifier = modifier.fillMaxWidth().padding(top = 8.dp),
    )
}

/** Favourite cuisines, and what to keep off the plan. */
@Composable
fun FoodStep(form: SetupForm, cuisines: List<String>, onChange: (SetupForm) -> Unit) {
    val a = form.answers
    fun answers(edit: (PlanAnswers) -> PlanAnswers) = onChange(form.copy(answers = edit(a)))

    SectionHeader("Favourite cuisines")
    Hint("Pick any you like. They come up more often when the app plans your week.")
    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(top = 8.dp)) {
        cuisines.forEach { cuisine ->
            val on = cuisine in a.cuisines
            TickChip(cuisine, on) { answers { it.copy(cuisines = if (on) it.cuisines - cuisine else it.cuisines + cuisine) } }
        }
    }

    val avoiding = a.avoids
    fun toggle(flag: Avoid) = answers {
        it.copy(avoid = (if (flag in avoiding) avoiding - flag else avoiding + flag).sortedBy { f -> f.ordinal }.map { f -> f.name })
    }
    SectionHeader("Allergies")
    Hint("Recipes that contain these are kept off your plan and out of your suggestions.")
    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(top = 8.dp)) {
        Avoid.entries.filter { it.isAllergen }.forEach { flag -> TickChip(flag.label, flag in avoiding) { toggle(flag) } }
    }

    SectionHeader("Foods you don't eat")
    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        Avoid.entries.filter { !it.isAllergen }.forEach { flag -> TickChip(flag.label, flag in avoiding) { toggle(flag) } }
        val vegetarian = avoiding.containsAll(Avoid.vegetarian)
        TickChip("Vegetarian", vegetarian) {
            answers {
                val next = if (vegetarian) avoiding - Avoid.vegetarian else avoiding + Avoid.vegetarian
                it.copy(avoid = next.sortedBy { f -> f.ordinal }.map { f -> f.name })
            }
        }
    }
    Text(
        ALLERGEN_NOTE,
        style = MaterialTheme.typography.bodySmall,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
        modifier = Modifier.padding(top = 12.dp),
    )
}

const val ALLERGEN_NOTE =
    "The app works this out from ingredient names, so it can miss things. Always read the labels on what you buy, especially for an allergy."

/** Where, how experienced and how often. */
@Composable
fun TrainingStep(form: SetupForm, onChange: (SetupForm) -> Unit) {
    val a = form.answers
    fun answers(edit: (PlanAnswers) -> PlanAnswers) = onChange(form.copy(answers = edit(a)))

    SectionHeader("Where will you train?")
    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        Place.entries.forEach { place -> TickChip(place.label, a.placeValue == place) { answers { it.copy(place = place.name) } } }
    }
    SectionHeader("Have you lifted weights before?")
    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        Experience.entries.forEach { level ->
            TickChip(level.label, a.experienceValue == level) { answers { it.copy(experience = level.name) } }
        }
    }
    SectionHeader("How many days a week?")
    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        (2..6).forEach { days -> TickChip("$days days", a.daysPerWeek == days) { answers { it.copy(daysPerWeek = days) } } }
    }
    Hint("You can change your training days and every exercise later.")
}

/** The daily guide as reference lines, with the reminder that it's an estimate. */
@Composable
fun GuideCard(lines: List<GuideLine>, modifier: Modifier = Modifier) {
    OutlinedCard(modifier.fillMaxWidth()) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            lines.forEach { line ->
                Row {
                    Text(line.label, style = MaterialTheme.typography.labelLarge, modifier = Modifier.width(76.dp))
                    Text(line.text, style = MaterialTheme.typography.bodyMedium)
                }
            }
            // Only numbers need the reminder that they're an estimate.
            if (lines.any { it.label == "Calories" }) {
                Text(GUIDE_NOTE, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
    }
}

const val GUIDE_NOTE =
    "An estimate for healthy adults, not a rule. The app never tracks what you eat or weigh. " +
        "If your weight or appetite worries you, talk to a doctor or dietitian."
