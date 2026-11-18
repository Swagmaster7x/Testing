@file:OptIn(ExperimentalMaterial3Api::class)

package com.personal.aide.ui.knowledge

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.unit.dp
import com.personal.aide.data.WorkProfile
import com.personal.aide.ui.components.AideIcons
import com.personal.aide.ui.components.Banner
import com.personal.aide.ui.components.Tone

private fun List<String>.asLines(): String = joinToString("\n")
private fun String.asList(): List<String> = lines().map { it.trim().removePrefix("- ").trim() }.filter { it.isNotEmpty() }

/** Everything Aide knows about the user's job, laid out to read and correct. */
@Composable
fun ProfileScreen(profile: WorkProfile, hasKey: Boolean, onBack: () -> Unit, onSave: (WorkProfile) -> Unit, onInterview: () -> Unit) {
    var name by rememberSaveable(profile) { mutableStateOf(profile.name) }
    var role by rememberSaveable(profile) { mutableStateOf(profile.role) }
    var company by rememberSaveable(profile) { mutableStateOf(profile.company) }
    var industry by rememberSaveable(profile) { mutableStateOf(profile.industry) }
    var department by rememberSaveable(profile) { mutableStateOf(profile.department) }
    var team by rememberSaveable(profile) { mutableStateOf(profile.team) }
    var manager by rememberSaveable(profile) { mutableStateOf(profile.manager) }
    var seniority by rememberSaveable(profile) { mutableStateOf(profile.seniority) }
    var hours by rememberSaveable(profile) { mutableStateOf(profile.workingHours) }
    var style by rememberSaveable(profile) { mutableStateOf(profile.workingStyle) }
    var responsibilities by rememberSaveable(profile) { mutableStateOf(profile.responsibilities.asLines()) }
    var goals by rememberSaveable(profile) { mutableStateOf(profile.goals.asLines()) }
    var projects by rememberSaveable(profile) { mutableStateOf(profile.projects.asLines()) }
    var stakeholders by rememberSaveable(profile) { mutableStateOf(profile.stakeholders.asLines()) }
    var tools by rememberSaveable(profile) { mutableStateOf(profile.tools.asLines()) }
    var meetings by rememberSaveable(profile) { mutableStateOf(profile.recurringMeetings.asLines()) }
    var measures by rememberSaveable(profile) { mutableStateOf(profile.successMeasures.asLines()) }
    var challenges by rememberSaveable(profile) { mutableStateOf(profile.challenges.asLines()) }
    var notes by rememberSaveable(profile) { mutableStateOf(profile.notes.asLines()) }

    fun current() = WorkProfile(
        name = name.trim(), role = role.trim(), company = company.trim(), industry = industry.trim(),
        department = department.trim(), team = team.trim(), manager = manager.trim(), seniority = seniority.trim(),
        workingHours = hours.trim(), workingStyle = style.trim(),
        responsibilities = responsibilities.asList(), goals = goals.asList(), projects = projects.asList(),
        stakeholders = stakeholders.asList(), tools = tools.asList(), recurringMeetings = meetings.asList(),
        successMeasures = measures.asList(), challenges = challenges.asList(), notes = notes.asList(),
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Your work profile") },
                navigationIcon = { IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back") } },
                actions = { TextButton(onClick = { onSave(current()) }) { Text("Save") } },
            )
        },
    ) { padding ->
        Column(
            Modifier.fillMaxSize().padding(padding).imePadding().verticalScroll(rememberScrollState()).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            if (hasKey) {
                Banner(
                    "Rather talk than type? Aide can interview you and fill this in.",
                    tone = Tone.ASSISTANT,
                    icon = AideIcons.Sparkle,
                    action = if (profile.filledAreas() > 5) "Continue" else "Start",
                    onAction = { onSave(current()); onInterview() },
                )
            }
            Text(
                "Aide reads this before every meeting and every answer. The more it knows, the less it has to guess.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Field("Your name", name) { name = it }
            Field("Role or job title", role) { role = it }
            Field("Company", company) { company = it }
            Field("Industry", industry) { industry = it }
            Field("Department", department) { department = it }
            Field("Team", team) { team = it }
            Field("Who you report to", manager) { manager = it }
            Field("Level (and whether you manage people)", seniority) { seniority = it }
            Field("Working hours and time zone", hours) { hours = it }
            Field("How you like updates: brief or detailed, formal or casual", style) { style = it }
            ListField("What you're responsible for", responsibilities) { responsibilities = it }
            ListField("Current goals", goals) { goals = it }
            ListField("Projects", projects) { projects = it }
            ListField("People you work with (name and role)", stakeholders) { stakeholders = it }
            ListField("Tools you use", tools) { tools = it }
            ListField("Regular meetings", meetings) { meetings = it }
            ListField("How your performance is judged", measures) { measures = it }
            ListField("What you find hard, or want help with", challenges) { challenges = it }
            ListField("Anything else", notes) { notes = it }
        }
    }
}

@Composable
private fun Field(label: String, value: String, onChange: (String) -> Unit) {
    OutlinedTextField(
        value = value,
        onValueChange = onChange,
        label = { Text(label) },
        singleLine = true,
        modifier = Modifier.fillMaxWidth(),
        keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
    )
}

@Composable
private fun ListField(label: String, value: String, onChange: (String) -> Unit) {
    OutlinedTextField(
        value = value,
        onValueChange = onChange,
        label = { Text(label) },
        supportingText = { Text("One per line") },
        minLines = 2,
        modifier = Modifier.fillMaxWidth(),
        keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
    )
}
