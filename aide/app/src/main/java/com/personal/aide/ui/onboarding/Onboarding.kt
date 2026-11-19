@file:OptIn(ExperimentalMaterial3Api::class)

package com.personal.aide.ui.onboarding

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.personal.aide.AppContainer
import com.personal.aide.ai.KeyCheck
import com.personal.aide.data.WorkProfile
import com.personal.aide.notify.Brief
import com.personal.aide.ui.components.AideCard
import com.personal.aide.ui.components.AideIcons
import com.personal.aide.ui.components.ChatInput
import com.personal.aide.ui.components.Working
import com.personal.aide.ui.interview.InterviewPane
import com.personal.aide.ui.interview.InterviewState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

enum class OnboardingStep { WELCOME, KEY, BASICS, INTERVIEW, READY }

data class OnboardingState(
    val step: OnboardingStep = OnboardingStep.WELCOME,
    val hasKey: Boolean = false,
    val checkingKey: Boolean = false,
    val keyError: String? = null,
    val profile: WorkProfile = WorkProfile(),
    val briefEnabled: Boolean = false,
    val calendarEnabled: Boolean = false,
)

class OnboardingViewModel(private val container: AppContainer) : ViewModel() {
    private val step = MutableStateFlow(OnboardingStep.WELCOME)
    private val checking = MutableStateFlow(false)
    private val keyError = MutableStateFlow<String?>(null)

    val state: StateFlow<OnboardingState> = combine(
        step,
        container.secrets.hasKey,
        combine(checking, keyError) { busy, error -> busy to error },
        container.settings.profile,
        container.settings.settings,
    ) { step, hasKey, key, profile, settings ->
        OnboardingState(step, hasKey, key.first, key.second, profile, settings.briefEnabled, settings.calendarEnabled)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), OnboardingState())

    fun go(to: OnboardingStep) {
        keyError.value = null
        step.value = to
    }

    fun back() {
        val current = step.value
        if (current == OnboardingStep.WELCOME) return
        var previous = OnboardingStep.entries[current.ordinal - 1]
        // The interview only exists once Claude is connected.
        if (previous == OnboardingStep.INTERVIEW && !state.value.hasKey) previous = OnboardingStep.BASICS
        go(previous)
    }

    /** Checks the key with Claude; a key that works is saved and the setup moves on. */
    fun saveKey(key: String, evenIfUnchecked: Boolean = false) {
        if (checking.value) return
        checking.value = true
        keyError.value = null
        viewModelScope.launch {
            val result = if (evenIfUnchecked) KeyCheck.Valid else container.llm.checkKey(key, container.settings.current().model)
            checking.value = false
            when (result) {
                KeyCheck.Valid -> try {
                    container.secrets.setApiKey(key)
                    step.value = OnboardingStep.BASICS
                } catch (e: Exception) {
                    keyError.value = "This phone couldn't store the key securely (${e.message ?: e.javaClass.simpleName})."
                }
                is KeyCheck.Invalid -> keyError.value = result.reason
            }
        }
    }

    fun saveBasics(name: String, role: String, company: String, industry: String, department: String) {
        viewModelScope.launch {
            container.settings.updateProfile {
                it.copy(
                    name = name.trim().ifEmpty { it.name },
                    role = role.trim().ifEmpty { it.role },
                    company = company.trim().ifEmpty { it.company },
                    industry = industry.trim().ifEmpty { it.industry },
                    department = department.trim().ifEmpty { it.department },
                )
            }
            step.value = if (state.value.hasKey) OnboardingStep.INTERVIEW else OnboardingStep.READY
        }
    }

    fun setBrief(on: Boolean) {
        viewModelScope.launch {
            val minutes = container.settings.current().briefMinutes
            container.settings.setBrief(on, minutes)
            Brief.schedule(container.appContext, on, minutes)
        }
    }

    fun setCalendar(on: Boolean) {
        viewModelScope.launch {
            container.settings.setCalendarEnabled(on)
            com.personal.aide.notify.Reminders.sync(container)
        }
    }

    fun finish() {
        viewModelScope.launch { container.settings.setOnboarded(true) }
    }
}

class OnboardingActions(
    val onGo: (OnboardingStep) -> Unit = {},
    val onBack: () -> Unit = {},
    val onSaveKey: (String, Boolean) -> Unit = { _, _ -> },
    val onGetKey: () -> Unit = {},
    val onSaveBasics: (String, String, String, String, String) -> Unit = { _, _, _, _, _ -> },
    val onAnswer: (String) -> Unit = {},
    val onRetryInterview: () -> Unit = {},
    val onAllowMicrophone: () -> Unit = {},
    val onBrief: (Boolean) -> Unit = {},
    val onCalendar: (Boolean) -> Unit = {},
    val onFinish: () -> Unit = {},
)

@Composable
fun OnboardingScreen(state: OnboardingState, interview: InterviewState, microphoneAllowed: Boolean, actions: OnboardingActions) {
    Surface(color = MaterialTheme.colorScheme.background, modifier = Modifier.fillMaxSize()) {
        Column(Modifier.fillMaxSize().statusBarsPadding()) {
            if (state.step != OnboardingStep.WELCOME) {
                Row(Modifier.fillMaxWidth().padding(horizontal = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                    TextButton(onClick = actions.onBack) { Text("Back") }
                    LinearProgressIndicator(
                        progress = { state.step.ordinal / (OnboardingStep.entries.size - 1f) },
                        modifier = Modifier.weight(1f).padding(horizontal = 12.dp),
                    )
                    Text(
                        "${state.step.ordinal} of ${OnboardingStep.entries.size - 1}",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(end = 12.dp),
                    )
                }
            }
            when (state.step) {
                OnboardingStep.WELCOME -> Welcome(actions)
                OnboardingStep.KEY -> KeyStep(state, actions)
                OnboardingStep.BASICS -> BasicsStep(state, actions)
                OnboardingStep.INTERVIEW -> InterviewStep(interview, actions)
                OnboardingStep.READY -> ReadyStep(state, microphoneAllowed, actions)
            }
        }
    }
}

@Composable
private fun StepPage(title: String, body: String, footer: @Composable () -> Unit, content: @Composable () -> Unit) {
    Column(Modifier.fillMaxSize().imePadding()) {
        Column(
            Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = 24.dp, vertical = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            Text(title, style = MaterialTheme.typography.headlineMedium)
            Text(body, style = MaterialTheme.typography.bodyLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
            content()
        }
        Column(Modifier.fillMaxWidth().navigationBarsPadding().padding(horizontal = 24.dp, vertical = 12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            footer()
        }
    }
}

@Composable
private fun Welcome(actions: OnboardingActions) {
    Column(Modifier.fillMaxSize().navigationBarsPadding().padding(24.dp), verticalArrangement = Arrangement.spacedBy(20.dp)) {
        Spacer(Modifier.height(24.dp))
        Box(
            Modifier.size(72.dp).clip(RoundedCornerShape(20.dp)).background(MaterialTheme.colorScheme.primary),
            contentAlignment = Alignment.Center,
        ) {
            Icon(AideIcons.Sparkle, contentDescription = null, tint = MaterialTheme.colorScheme.tertiaryContainer, modifier = Modifier.size(40.dp))
        }
        Text("Aide", style = MaterialTheme.typography.displaySmall)
        Text(
            "A work assistant that sits in on your meetings and keeps track of everything that comes out of them.",
            style = MaterialTheme.typography.titleLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
            Feature(AideIcons.Mic, "Listens and transcribes", "Live, as people talk. No audio is kept.")
            Feature(AideIcons.Meetings, "Writes the notes", "Summary, decisions, and who is doing what by when.")
            Feature(AideIcons.Tasks, "Runs your to-do list", "By day and by week, built from what was agreed.")
            Feature(AideIcons.Knowledge, "Learns your work", "People, projects and jargon, so every meeting goes better than the last.")
            Feature(AideIcons.Insights, "Tells you how you're doing", "An honest weekly review, with the numbers behind it.")
        }
        Spacer(Modifier.weight(1f))
        Button(onClick = { actions.onGo(OnboardingStep.KEY) }, modifier = Modifier.fillMaxWidth().height(52.dp)) { Text("Get started") }
    }
}

@Composable
private fun Feature(icon: ImageVector, title: String, body: String) {
    Row(horizontalArrangement = Arrangement.spacedBy(14.dp), verticalAlignment = Alignment.CenterVertically) {
        Box(Modifier.size(40.dp).clip(CircleShape).background(MaterialTheme.colorScheme.primaryContainer), contentAlignment = Alignment.Center) {
            Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.onPrimaryContainer, modifier = Modifier.size(22.dp))
        }
        Column {
            Text(title, style = MaterialTheme.typography.titleMedium)
            Text(body, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
private fun KeyStep(state: OnboardingState, actions: OnboardingActions) {
    var key by rememberSaveable { mutableStateOf("") }
    StepPage(
        title = "Connect Claude",
        body = "Aide's thinking is done by Claude. You connect it with your own API key, which stays encrypted on this phone.",
        footer = {
            Button(
                onClick = { if (state.hasKey && key.isBlank()) actions.onGo(OnboardingStep.BASICS) else actions.onSaveKey(key, false) },
                enabled = (key.isNotBlank() || state.hasKey) && !state.checkingKey,
                modifier = Modifier.fillMaxWidth().height(52.dp),
            ) { Text(if (state.hasKey && key.isBlank()) "Continue" else "Check key and continue") }
            if (state.keyError != null && key.isNotBlank()) {
                TextButton(onClick = { actions.onSaveKey(key, true) }, modifier = Modifier.fillMaxWidth()) { Text("Save it anyway") }
            }
            TextButton(onClick = { actions.onGo(OnboardingStep.BASICS) }, modifier = Modifier.fillMaxWidth()) {
                Text(if (state.hasKey) "Keep the key I already saved" else "Do this later")
            }
        },
    ) {
        AideCard {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("How to get a key", style = MaterialTheme.typography.titleSmall)
                Text("1. Open the Claude Console and sign in or create an account.", style = MaterialTheme.typography.bodyMedium)
                Text("2. Add a little credit under Billing. Writing up an hour-long meeting costs roughly 10 to 25 cents with the default model, and less with the faster ones.", style = MaterialTheme.typography.bodyMedium)
                Text("3. Create a key under API keys, copy it, and paste it below.", style = MaterialTheme.typography.bodyMedium)
                OutlinedButton(onClick = actions.onGetKey) { Text("Open the Claude Console") }
                Text(
                    "This is billed separately from a Claude subscription (Pro or Max): the app can only use an API key.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
        OutlinedTextField(
            value = key,
            onValueChange = { key = it.trim() },
            label = { Text("API key (starts with sk-ant-)") },
            singleLine = true,
            isError = state.keyError != null,
            supportingText = state.keyError?.let { message -> { Text(message) } },
            visualTransformation = PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password, autoCorrectEnabled = false),
            modifier = Modifier.fillMaxWidth(),
        )
        if (state.checkingKey) Working("Checking with Claude…")
        if (state.hasKey) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Icon(Icons.Filled.Check, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                Text("A key is already saved on this phone.", style = MaterialTheme.typography.bodyMedium)
            }
        }
        Text(
            "Without a key Aide still transcribes and keeps your tasks; it just can't write notes or answer questions until you add one in Settings.",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

@Composable
private fun BasicsStep(state: OnboardingState, actions: OnboardingActions) {
    val profile = state.profile
    var name by rememberSaveable { mutableStateOf(profile.name) }
    var role by rememberSaveable { mutableStateOf(profile.role) }
    var company by rememberSaveable { mutableStateOf(profile.company) }
    var industry by rememberSaveable { mutableStateOf(profile.industry) }
    var department by rememberSaveable { mutableStateOf(profile.department) }
    StepPage(
        title = "About your work",
        body = "The basics, so Aide knows whose meetings it is sitting in on. Leave anything blank.",
        footer = {
            Button(onClick = { actions.onSaveBasics(name, role, company, industry, department) }, modifier = Modifier.fillMaxWidth().height(52.dp)) {
                Text("Continue")
            }
        },
    ) {
        BasicField("Your name", name) { name = it }
        BasicField("Role or job title", role) { role = it }
        BasicField("Company", company) { company = it }
        BasicField("Industry", industry) { industry = it }
        BasicField("Department", department) { department = it }
    }
}

@Composable
private fun BasicField(label: String, value: String, onChange: (String) -> Unit) {
    OutlinedTextField(
        value = value,
        onValueChange = onChange,
        label = { Text(label) },
        singleLine = true,
        modifier = Modifier.fillMaxWidth(),
        keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Words),
    )
}

@Composable
private fun InterviewStep(interview: InterviewState, actions: OnboardingActions) {
    var draft by rememberSaveable { mutableStateOf("") }
    Column(Modifier.fillMaxSize()) {
        Column(Modifier.padding(horizontal = 24.dp, vertical = 8.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text("A few questions", style = MaterialTheme.typography.headlineSmall)
            Text(
                "Aide interviews you about your job. Answer as much or as little as you like; say \"skip\" to move on.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        InterviewPane(interview, actions.onRetryInterview, Modifier.weight(1f), PaddingValues(horizontal = 24.dp, vertical = 12.dp))
        Row(Modifier.fillMaxWidth().padding(horizontal = 16.dp), horizontalArrangement = Arrangement.End) {
            TextButton(onClick = { actions.onGo(OnboardingStep.READY) }) {
                Text(if (interview.done) "Continue" else "That's enough for now")
            }
        }
        ChatInput(
            value = draft,
            onValueChange = { draft = it },
            onSend = { actions.onAnswer(draft); draft = "" },
            enabled = !interview.working,
            placeholder = "Your answer",
        )
    }
}

@Composable
private fun ReadyStep(state: OnboardingState, microphoneAllowed: Boolean, actions: OnboardingActions) {
    StepPage(
        title = "Almost there",
        body = "Three things that make Aide more useful. All of them can be changed later in Settings.",
        footer = {
            Button(onClick = actions.onFinish, modifier = Modifier.fillMaxWidth().height(52.dp)) { Text("Start using Aide") }
        },
    ) {
        AideCard {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                Icon(AideIcons.Mic, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                Column(Modifier.weight(1f)) {
                    Text("Microphone", style = MaterialTheme.typography.titleMedium)
                    Text(
                        "Needed to transcribe. Aide only listens while a recording you started is running, and shows a notification the whole time.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                if (microphoneAllowed) {
                    Icon(Icons.Filled.Check, contentDescription = "Allowed", tint = MaterialTheme.colorScheme.primary)
                } else {
                    OutlinedButton(onClick = actions.onAllowMicrophone) { Text("Allow") }
                }
            }
        }
        AideCard {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                Icon(AideIcons.Today, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                Column(Modifier.weight(1f)) {
                    Text("Your calendar", style = MaterialTheme.typography.titleMedium)
                    Text(
                        "Read-only. Aide names each recording after the meeting you're in, shows your day, and briefs you ten minutes before each meeting.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                Switch(checked = state.calendarEnabled, onCheckedChange = actions.onCalendar)
            }
        }
        AideCard {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                Icon(AideIcons.Clock, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                Column(Modifier.weight(1f)) {
                    Text("Morning brief", style = MaterialTheme.typography.titleMedium)
                    Text(
                        "A notification at 8:00 with what's due and what's on.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                Switch(checked = state.briefEnabled, onCheckedChange = actions.onBrief)
            }
        }
        Text(
            "For your first few meetings Aide will ask you about the names and terms it couldn't place. Answering is how it learns your world.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}
